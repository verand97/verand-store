import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-v2">
      <div className="container">
        {/* Top Feature Highlights */}
        <div className="footer-trust-grid">
          <div className="trust-card">
            <span className="trust-icon">⚡</span>
            <div>
              <div className="trust-title">Proses 1-3 Menit Otomatis</div>
              <div className="trust-desc muted">Sistem instan terhubung API 24/7 tanpa delay</div>
            </div>
          </div>
          <div className="trust-card">
            <span className="trust-icon">🛡️</span>
            <div>
              <div className="trust-title">100% Anti-Ban & Pro Booster</div>
              <div className="trust-desc muted">Manual pengerjaan tanpa cheat atau script berbahaya</div>
            </div>
          </div>
          <div className="trust-card">
            <span className="trust-icon">💳</span>
            <div>
              <div className="trust-title">Pembayaran Resmi Midtrans</div>
              <div className="trust-desc muted">QRIS, Virtual Account, & E-Wallet terverifikasi</div>
            </div>
          </div>
          <div className="trust-card">
            <span className="trust-icon">🔒</span>
            <div>
              <div className="trust-title">Enkripsi Data Kredensial 256-Bit</div>
              <div className="trust-desc muted">Privasi akun terjamin aman dan otomatis terlindungi</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="footer-main-grid">
          <div className="footer-brand-col">
            <div className="brand" style={{ fontSize: 20 }}>
              <div className="brand-badge" style={{ width: 28, height: 28 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--primary)" />
                  <path d="M2 17L12 22L22 17" stroke="var(--primary-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="var(--primary-light)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="brand-title">VERAND<span className="brand-accent">STORE</span></span>
            </div>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.6, marginTop: 12 }}>
              Platform layanan digital gaming terpercaya di Indonesia. Menyediakan top-up instan dan jasa joki profesional untuk Mobile Legends: Bang Bang, Genshin Impact, dan Honkai: Star Rail.
            </p>
            <div className="social-links-row">
              <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="social-chip" title="WhatsApp Customer Support">
                💬 CS WhatsApp 24/7
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="social-chip" title="Discord Community">
                🎮 Discord
              </a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Layanan Top-up</h4>
            <ul className="footer-list">
              <li><Link href="/topup?game=mobile-legends">Diamonds Mobile Legends</Link></li>
              <li><Link href="/topup?game=genshin-impact">Genesis Crystals Genshin</Link></li>
              <li><Link href="/topup?game=honkai-star-rail">Oneiric Shards Star Rail</Link></li>
              <li><Link href="/topup">Weekly Diamond Pass</Link></li>
              <li><Link href="/topup">Blessing Welkin Moon</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Jasa Joki Pro</h4>
            <ul className="footer-list">
              <li><Link href="/joki/mobile-legends">Push Rank MLBB (Mythic/Immortal)</Link></li>
              <li><Link href="/joki/mobile-legends">Classic Winrate & MMR Hero</Link></li>
              <li><Link href="/joki/genshin-impact">Perawatan Akun & Weekly Boss Genshin</Link></li>
              <li><Link href="/joki/genshin-impact">Joki Eksplorasi 100% & Quest</Link></li>
              <li><Link href="/joki/honkai-star-rail">Daily Training & Echo of War HSR</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-col-title">Metode Pembayaran</h4>
            <div className="payment-badges-wrap">
              <span className="pay-badge">QRIS</span>
              <span className="pay-badge">BCA VA</span>
              <span className="pay-badge">Mandiri</span>
              <span className="pay-badge">BRImo</span>
              <span className="pay-badge">BNI</span>
              <span className="pay-badge">GoPay</span>
              <span className="pay-badge">OVO</span>
              <span className="pay-badge">DANA</span>
              <span className="pay-badge">ShopeePay</span>
            </div>
            <div className="muted" style={{ fontSize: 11, marginTop: 10 }}>
              *Didukung oleh Midtrans Payment Gateway resmi Bank Indonesia.
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="footer-bottom-bar row between wrap">
          <div className="muted" style={{ fontSize: 12 }}>
            © {new Date().getFullYear()} <strong>Verand Store</strong>. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
          <div className="muted disclaimer-text">
            Disclaimer: Verand Store adalah platform independen penyedia layanan voucher game dan jasa boosting. Mobile Legends: Bang Bang adalah merek dagang Moonton. Genshin Impact dan Honkai: Star Rail adalah merek dagang miHoYo / COGNOSPHERE PTE. LTD.
          </div>
        </div>
      </div>
    </footer>
  );
}
