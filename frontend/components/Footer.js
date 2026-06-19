export default function Footer() {
  return (
    <footer className="footer">
      <div className="container row between wrap">
        <div>
          <div className="brand" style={{ fontSize: 19 }}><span className="brand-mark">◆</span> Verand<span className="brand-mark">Store</span></div>
          <p>Top-up game & jasa joki profesional. Cepat, aman, terpercaya.</p>
        </div>
        <div className="muted">
          © {new Date().getFullYear()} Verand Store. Mobile Legends · Genshin Impact · Honkai: Star Rail.
        </div>
      </div>
    </footer>
  );
}
