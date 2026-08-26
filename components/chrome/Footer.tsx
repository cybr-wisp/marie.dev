import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell site-footer__inner">
        <p className="site-footer__brand">
          MARIE.DEV · 2026
        </p>

        <p className="site-footer__middle">
          <span className="copy-en">
            SOFTWARE · SYSTEMS · MACHINE LEARNING
          </span>

          <span className="copy-fr">
            LOGICIEL · SYSTÈMES · APPRENTISSAGE MACHINE
          </span>
        </p>

        <div className="site-footer__links">
          <a
            className="footer-link"
            href={siteConfig.github}
            target="_blank"
            rel="noreferrer"
          >
            GITHUB ↗
          </a>

          <a className="footer-link" href="#top">
            TOP ↑
          </a>
        </div>
      </div>
    </footer>
  );
}