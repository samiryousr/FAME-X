export default function ProjectsLoading() {
  return (
    <main className="all-projects" id="home">
      <div className="all-projects__inner">
        <header className="all-projects__top">
          <div className="all-projects__brand" dir="ltr">
            FAME<span>X</span>
          </div>
        </header>

        <section className="all-projects__intro" aria-hidden="true">
          <p className="all-projects__eyebrow">FAMEX // PORTFOLIO</p>
          <h1>
            مشاريعنا <span>على حقيقتها.</span>
          </h1>
          <p>
            كل مشروع له فكرته وتجربته. اختار مشروعًا لمعاينة تصميمه، أو افتح
            الموقع مباشرةً بضغطة زر.
          </p>

          <div className="flex items-center justify-center gap-2.5 py-4 text-xs font-mono text-[#a6f45d] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#a6f45d] animate-ping" />
            <span>[FAME_X // INITIALIZING] جاري تحميل المشاريع...</span>
          </div>
        </section>

        {/* Filter Bar Skeleton */}
        <div className="w-full max-w-4xl mx-auto mb-8 sm:mb-12 px-2 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3 justify-center py-2">
            <div className="h-10 w-24 rounded-full bg-[#0b140d] border border-[#a6f45d]/20 animate-pulse" />
            <div className="h-10 w-28 rounded-full bg-[#0b140d] border border-[#a6f45d]/10 animate-pulse" />
            <div className="h-10 w-24 rounded-full bg-[#0b140d] border border-[#a6f45d]/10 animate-pulse" />
            <div className="h-10 w-32 rounded-full bg-[#0b140d] border border-[#a6f45d]/10 animate-pulse" />
          </div>
        </div>

        {/* Grid Skeletons */}
        <div className="services__path all-projects__path">
          <div className="services__cards">
            {Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="all-projects__card animate-pulse select-none pointer-events-none"
              >
                <div className="all-projects__preview relative aspect-[16/10] !h-auto w-full bg-[#0d1610] overflow-hidden border-b border-[#1b3420]">
                  <div className="absolute top-3 right-3 w-16 h-5 rounded-full bg-[#16271c] border border-white/5" />
                </div>
                <div className="all-projects__details">
                  <div className="space-y-3">
                    <div className="w-24 h-5 rounded-full bg-[#16271c] border border-white/5" />
                    <div className="w-3/4 h-6 rounded-lg bg-[#1a2e22]" />
                    <div className="space-y-1.5 pt-1">
                      <div className="w-full h-3 rounded bg-[#132218]" />
                      <div className="w-5/6 h-3 rounded bg-[#132218]" />
                    </div>
                  </div>
                  <footer className="all-projects__card-footer pt-3.5 border-t border-[#1b3420] flex items-center justify-between">
                    <div className="w-28 h-8 rounded-xl bg-[#16271c] border border-white/5" />
                    <div className="w-14 h-5 rounded-full bg-[#132218]" />
                  </footer>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
