// server/controllers/aiController.js
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import Groq from "groq-sdk";

import { cloudinary } from "../configs/cloudinary.js";

import FormData from "form-data";



import fs from "fs";
import pdf from "pdf-parse-fixed";

const AI = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

//  MODEL TO USE
const MODEL = "llama-3.3-70b-versatile";

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt?.trim())
      return res.json({ success: false, message: "Prompt required" });

    if (plan !== "premium" && free_usage >= 10)
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });

    const response = await AI.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: "Write complete, detailed articles only." },
        {
          role: "user",
          content: `Write a complete article on: "${prompt}"
- Add a title
- Add intro
- 5+ paragraphs
- Use headings
- Finish properly`,
        },
      ],
      max_tokens: 1200,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id,prompt,content,type)
              VALUES(${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium")
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });

    res.json({ success: true, content });
  } catch (error) {
    console.log("Article Error:", error);
    res.json({ success: false, message: "Groq Error: " + error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const prompt = req.body.prompt?.trim();
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (!prompt)
      return res.json({ success: false, message: "Keyword required" });

    if (plan !== "premium" && free_usage >= 10)
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });

    const response = await AI.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "Generate only complete blog titles, no explanation.",
        },
        {
          role: "user",
          content: `Generate 5 full blog titles for: ${prompt}
                    - Number them 1 to 5
                    - Each title on new line`,
        },
      ],
      max_tokens: 200,
      temperature: 0.4,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) 
   VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: { free_usage: free_usage + 1 },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log("Blog Error:", error);
    res.json({ success: false, message: "Groq Error: " + error.message });
  }
};

export const generateImage = async (req, res) => {
  console.log("API KEY:", process.env.CLIPDROP_API_KEY);

  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(), 
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql`INSERT INTO creations (user_id,prompt,content,type, publish) 
              VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log("Image Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });

    await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId}, ${`Removed ${object} from image`} , ${imageUrl}, 'image')`;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    // 🔐 Premium check
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    // ❗ File check
    if (!resume) {
      return res.json({
        success: false,
        message: "Upload PDF Resume",
      });
    }

    // ❗ Size check
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume File size exceeds allowed size (5 MB)",
      });
    }

    // 📄 ✅ PDF PARSE (FIXED)
    const pdfData = await pdf(fs.readFileSync(resume.path));
    const resumeText = pdfData.text.slice(0, 1500);

    // 🤖 AI Prompt
    const prompt = `
Review this resume like an HR:
${resumeText}

FORMAT:
Summary:
- 3 sentences

Strengths:
- bullet points

Weaknesses:
- bullet points

Suggestions:
- bullet points

ATS Issues:
- bullet points
`;

    const response = await AI.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;

    // 💾 Save to DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume-review')
    `;

    // 🧹 DELETE FILE (IMPORTANT 🔥)
    fs.unlinkSync(resume.path);

    res.json({ success: true, content });
  } catch (error) {
    console.log("Resume Error:", error);
    res.json({
      success: false,
      message: "Error: " + error.message,
    });
  }
};