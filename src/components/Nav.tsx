import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const LINKS = [
  { to: "/archive", label: "Archive" },
  { to: "/timeline", label: "Timeline" },
  { to: "/moon", label: "Moon" },
  { to: "/mars", label: "Mars" },
  { to: "/hardware", label: "Hardware" },
  { to: "/legacy", label: "Legacy" },
];

const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className={`nav${scrolled ? " nav--solid" : ""}`}>
        <NavLink to="/" className="nav__brand" aria-label="AFTERLIFE — home">
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__brandText">
            <span className="nav__brandMain">AFTERLIFE</span>
            <span className="nav__brandSub">The Forgotten Space Museum</span>
          </span>
        </NavLink>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `nav__link${isActive ? " is-active" : ""}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__actions">
          <NavLink to="/sources" className="nav__source">
            Sources
          </NavLink>
          <button
            type="button"
            className={`nav__toggle${open ? " is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <nav className="menu__inner" aria-label="Mobile">
              {LINKS.concat({ to: "/sources", label: "Sources" }).map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.4 }}
                >
                  <NavLink to={link.to} className="menu__link">
                    <span className="menu__index">{String(i + 1).padStart(2, "0")}</span>
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <p className="menu__note">
                Thirteen missions. Six destinations. Everything left behind, mapped.
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
