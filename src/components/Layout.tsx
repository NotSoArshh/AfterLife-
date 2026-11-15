import type { ReactNode } from "react";
import Nav from "./Nav";
import Footer from "./Footer";
import Intro from "./Intro";
import ScrollProgress from "./ScrollProgress";
import ScrollFX from "./ScrollFX";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="shell">
    <Intro />
    <ScrollProgress />
    <ScrollFX />
    <a className="skip" href="#main">
      Skip to content
    </a>
    <Nav />
    <div className="grain" aria-hidden="true" />
    <main id="main" className="main">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
