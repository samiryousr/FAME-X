export default function Loading() {
  return (
    <main className="loading" aria-label="جارٍ التحميل">
      <div className="loading__pixels" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="loading__content">
        <p className="loading__wordmark" dir="ltr">FAME X</p>
        <div className="loading__progress" aria-hidden="true"><span /></div>
        <p className="loading__status" dir="ltr"><span>▌</span> LOADING...</p>
      </div>
    </main>
  );
}
