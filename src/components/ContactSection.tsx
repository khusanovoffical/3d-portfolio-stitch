interface ContactSectionProps {
  currentLang: 'uz' | 'en';
  onOpenConsultation: () => void;
}

export default function ContactSection({ currentLang, onOpenConsultation }: ContactSectionProps) {
  const t = currentLang === 'uz' ? {
    badge: "YANGI HAMKORLIKKA TAYYOR",
    headlinePart1: "Keling, keyingi g'oyangizni birgalikda",
    headlineHighlight: "3D formatda",
    headlinePart2: "jonlantiramiz!",
    desc: "Sizda yangi startap, e-commerce yoki 3D interaktiv brend loyihasi bormi? Texnik imkoniyatlar va dizayn konsepsiyasini bepul muhokama qilamiz.",
    telegramBtn: "Telegram orqali yozish",
    emailBtn: "hello@khusanov.dev",
    quickQuoteBtn: "Loyiha anketasini to'ldirish",
    responseTime: "O'rtacha javob vaqti: 2 soat",
    nda: "NDA Kafolati",
  } : {
    badge: "OPEN FOR NEW COLLABORATIONS",
    headlinePart1: "Let's bring your next visionary idea to life in",
    headlineHighlight: "real-time 3D!",
    headlinePart2: "",
    desc: "Planning a startup launch, immersive e-commerce showroom, or high-tech 3D brand experience? Let's discuss technical capabilities and creative direction free of charge.",
    telegramBtn: "Message on Telegram",
    emailBtn: "hello@khusanov.dev",
    quickQuoteBtn: "Fill Project Brief",
    responseTime: "Average reply: under 2 hours",
    nda: "NDA Guaranteed",
  };

  return (
    <section className="w-full py-20 bg-[#111319] relative z-10" id="kontakt">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 lg:p-16 bg-[#191c21] border border-white/10 shadow-2xl flex flex-col items-center text-center">
          {/* Ambient Decorative Halo */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#38bdf8]/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 right-10 w-96 h-96 bg-[#a855f7]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl gap-6">
            {/* Status tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#282a30] border border-white/10 font-['JetBrains_Mono'] text-xs text-[#8ed5ff] uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
              <span>{t.badge}</span>
            </div>

            {/* Headline */}
            <h2 className="font-['Space_Grotesk'] text-3xl sm:text-4xl lg:text-6xl font-bold text-[#e2e2ea] leading-[1.15]">
              {t.headlinePart1}{' '}
              <span className="text-[#38bdf8]">{t.headlineHighlight}</span>{' '}
              {t.headlinePart2}
            </h2>

            {/* Subtitle */}
            <p className="font-['Geist'] text-base sm:text-lg text-[#bdc8d1] max-w-xl leading-relaxed">
              {t.desc}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap justify-center items-center gap-4 pt-3">
              <a
                href="https://t.me/Khusanov_off"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#7bd0ff] text-[#00354a] font-['Space_Grotesk'] text-sm sm:text-base font-bold shadow-xl hover:shadow-[0_0_32px_rgba(56,189,248,0.5)] hover:scale-105 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>{t.telegramBtn}</span>
              </a>

              <button
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#282a30] hover:bg-[#33353b] text-[#e2e2ea] font-['Space_Grotesk'] text-sm sm:text-base font-medium backdrop-blur-xl border border-white/10 shadow-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-[#38bdf8]">edit_calendar</span>
                <span>{t.quickQuoteBtn}</span>
              </button>

              <a
                href="mailto:hello@aura.dev"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#191c21] hover:bg-[#282a30] text-[#bdc8d1] hover:text-white font-['Space_Grotesk'] text-sm sm:text-base font-medium border border-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">mail</span>
                <span>{t.emailBtn}</span>
              </a>
            </div>

            {/* Footnote Trust Markers */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-6 text-[#bdc8d1] font-['JetBrains_Mono'] text-xs">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#38bdf8]">schedule</span>
                <span>{t.responseTime}</span>
              </span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#c5c9ff]">verified_user</span>
                <span>{t.nda}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
