
import { assets } from "../assets/assets";
import { Quote } from "lucide-react"; 

const Testimonial = () => {
  const dummyTestimonialData = [
    {
      image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
      name: 'John Doe',
      title: 'Marketing Director, TechCorp',
      content: 'Genify AI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
      rating: 4,
    },
    {
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
      name: 'Jane Smith',
      title: 'Content Creator, Pixels',
      content: 'Effortless process! The AI tools have helped us produce high-quality content faster than ever before. Highly recommended for teams.',
      rating: 5,
    },
    {
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
      name: 'David Lee',
      title: 'Freelance Writer',
      content: 'The image generation and text enhancement are top-notch. It’s like having a creative partner available 24/7.',
      rating: 5,
    },
  ];

  return (
    <div className="relative px-4 py-24 sm:px-20 xl:px-32 bg-[#0a0a0c] overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center mb-16">
        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Loved by <span className="text-primary">Creators</span>
        </h2>
        <p className="mt-4 text-slate-400 max-w-lg mx-auto text-lg">
          Don't just take our word for it. Here's what our users are saying about Genify.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap mt-10 justify-center gap-8">
        {dummyTestimonialData.map((testimonial, index) => (
          <div 
            key={index} 
            className="group p-8 w-full max-w-sm rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl shadow-black"
          >
            {/* Quote Icon & Rating */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <img 
                    key={i}
                    src={i < testimonial.rating ? assets.star_icon : assets.star_dull_icon} 
                    className={`w-3.5 h-3.5 ${i < testimonial.rating ? 'brightness-125' : 'opacity-30'}`} 
                    alt="star"
                  />
                ))}
              </div>
              <Quote className="text-primary/20 group-hover:text-primary/40 transition-colors" size={24} />
            </div>

            <p className="text-slate-300 italic leading-relaxed mb-8">
              "{testimonial.content}"
            </p>

            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
              <div className="relative">
                <img 
                  src={testimonial.image} 
                  className="w-12 h-12 object-cover rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors" 
                  alt={testimonial.name} 
                />
                <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                  {testimonial.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">
                  {testimonial.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;