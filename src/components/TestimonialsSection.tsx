interface TestimonialsSectionProps {
  currentLang: 'uz' | 'en';
}

export default function TestimonialsSection({ currentLang }: TestimonialsSectionProps) {
  const t = currentLang === 'uz' ? {
    kicker: "// HAMKORLAR VA MIJOZLAR",
    title: "Mijozlar Fikrlari & E'tiroflar",
    rating: "5.0 / 5.0 (Global Rating) • 100% On-Time Delivery",
    reviews: [
      {
        quote: "“Saytimizga 3D WebGL elementlari integratsiya qilinganidan so'ng xalqaro foydalanuvchilar sessiya davomiyligi 340% ga oshdi. Mutlaqo kutilganidan a'lo natija.”",
        author: "Aziz Karimov",
        role: "Boshqaruvchi Direktor, Nexus Labs",
        initials: "AK",
        color: "text-[#38bdf8]",
      },
      {
        quote: "“Murakkab moliyaviy ma'lumotlarni 3D visual shaklga keltirish biz uchun orzu edi. AURA jamoasi uni har bir millisekundiga qadar sinchkovlik bilan amalga oshirdi.”",
        author: "Sarah Lindqvist",
        role: "VP of Product, FinStream Zurich",
        initials: "SL",
        color: "text-[#ddb7ff]",
      },
      {
        quote: "“Awwwards Site of the Day sovrinini olishimizda ularning beqiyos WebGL mahorati hal qiluvchi rol o'ynadi. O'zbekistonda shunday darajadagi mutaxassis borligidan faxrlanamiz.”",
        author: "Temur Mansurov",
        role: "Kreativ Direktor, HyperStudio",
        initials: "TM",
        color: "text-[#c5c9ff]",
      },
    ],
  } : {
    kicker: "// CLIENTS & COLLABORATORS",
    title: "Client Testimonials & Recognition",
    rating: "5.0 / 5.0 (Global Rating) • 100% On-Time Delivery",
    reviews: [
      {
        quote: "“Integrating 3D WebGL assets increased our international user session dwell times by 340%. Exceeded our highest benchmark expectations.”",
        author: "Aziz Karimov",
        role: "Managing Director, Nexus Labs",
        initials: "AK",
        color: "text-[#38bdf8]",
      },
      {
        quote: "“Projecting complex financial clusters into a responsive 3D space was a dream for us. AURA executed it down to the millisecond with relentless precision.”",
        author: "Sarah Lindqvist",
        role: "VP of Product, FinStream Zurich",
        initials: "SL",
        color: "text-[#ddb7ff]",
      },
      {
        quote: "“Their unmatched WebGL craftsmanship was the defining factor in clinching Awwwards Site of the Day. World-class talent in every sense.”",
        author: "Temur Mansurov",
        role: "Creative Director, HyperStudio",
        initials: "TM",
        color: "text-[#c5c9ff]",
      },
    ],
  };

  return (
    <section className="w-full py-20 bg-[#0c0e13] relative z-10" id="fikrlar">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase tracking-widest block mb-1.5">
              {t.kicker}
            </span>
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#e2e2ea]">
              {t.title}
            </h2>
          </div>
          <div className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1]">
            {t.rating}
          </div>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.reviews.map((rev, index) => (
            <div
              key={index}
              className="p-6 sm:p-8 rounded-xl bg-[#191c21] border border-white/5 flex flex-col justify-between gap-6 shadow-xl hover:border-white/15 transition-all duration-300"
            >
              <div className="flex flex-col gap-3">
                <div className={`flex items-center gap-1 ${rev.color} text-[18px]`}>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="font-['Geist'] text-sm sm:text-base text-[#e2e2ea] italic leading-relaxed">
                  {rev.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className={`w-10 h-10 rounded-full bg-[#282a30] flex items-center justify-center font-bold ${rev.color} font-['Space_Grotesk'] text-sm border border-white/5`}>
                  {rev.initials}
                </div>
                <div>
                  <div className="font-['Space_Grotesk'] font-bold text-[#e2e2ea] text-sm">
                    {rev.author}
                  </div>
                  <div className="font-['JetBrains_Mono'] text-xs text-[#bdc8d1]">
                    {rev.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
