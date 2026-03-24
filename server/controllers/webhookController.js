import { clerkClient } from "@clerk/clerk-sdk-node";

export const handleClerkWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (!event?.data?.payer?.user_id) {
      return res.sendStatus(200);
    }

    const userId = event.data.payer.user_id;
    const items = event.data.items;

    let isPremium = false;

    for (let item of items) {
      if (item.plan?.name === "Premium" && item.status === "active") {
        isPremium = true;
        break;
      }
    }

    if (isPremium) {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { plan: "premium" },
      });

      console.log("✅ Premium set");
    } else {
      await clerkClient.users.updateUser(userId, {
        publicMetadata: { plan: "free" },
      });

      console.log("❌ Free set");
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log("❌ ERROR:", err.message);
    res.status(500).json({ error: "Webhook error" });
  }
};