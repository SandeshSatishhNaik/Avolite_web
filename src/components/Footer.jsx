export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p className="brand-foot">Iron Dome <b>of India</b></p>
        <p className="disclaimer">
          An independent educational project put together from publicly reported information.
          Ranges and figures are approximate. It is not affiliated with or endorsed by the
          Government of India, the Ministry of Defence, DRDO or the Indian Armed Forces.
        </p>
        <p className="copy">&copy; {new Date().getFullYear()} Avolite Web</p>
      </div>
    </footer>
  );
}
