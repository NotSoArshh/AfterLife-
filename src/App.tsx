import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import CommandPalette from "./components/CommandPalette";

const Home = lazy(() => import("./pages/Home"));
const Archive = lazy(() => import("./pages/Archive"));
const MissionDetail = lazy(() => import("./pages/MissionDetail"));
const TimelinePage = lazy(() => import("./pages/TimelinePage"));
const MoonPage = lazy(() => import("./pages/MoonPage"));
const MarsPage = lazy(() => import("./pages/MarsPage"));
const HardwarePage = lazy(() => import("./pages/HardwarePage"));
const HangarPage = lazy(() => import("./pages/HangarPage"));
const LegacyPage = lazy(() => import("./pages/LegacyPage"));
const SourcesPage = lazy(() => import("./pages/SourcesPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

const RouteFallback = () => (
  <div className="route-fallback" role="status" aria-live="polite">
    <span className="route-fallback__pulse" aria-hidden="true" />
    <span>Entering the gallery…</span>
  </div>
);

const App = () => {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <Layout>
      <CommandPalette />
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition reduce={!!reduce}>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/archive"
              element={
                <PageTransition reduce={!!reduce}>
                  <Archive />
                </PageTransition>
              }
            />
            <Route
              path="/missions/:missionId"
              element={
                <PageTransition reduce={!!reduce}>
                  <MissionDetail />
                </PageTransition>
              }
            />
            <Route
              path="/timeline"
              element={
                <PageTransition reduce={!!reduce}>
                  <TimelinePage />
                </PageTransition>
              }
            />
            <Route
              path="/moon"
              element={
                <PageTransition reduce={!!reduce}>
                  <MoonPage />
                </PageTransition>
              }
            />
            <Route
              path="/mars"
              element={
                <PageTransition reduce={!!reduce}>
                  <MarsPage />
                </PageTransition>
              }
            />
            <Route
              path="/hardware"
              element={
                <PageTransition reduce={!!reduce}>
                  <HardwarePage />
                </PageTransition>
              }
            />
            <Route
              path="/hangar"
              element={
                <PageTransition reduce={!!reduce}>
                  <HangarPage />
                </PageTransition>
              }
            />
            <Route
              path="/legacy"
              element={
                <PageTransition reduce={!!reduce}>
                  <LegacyPage />
                </PageTransition>
              }
            />
            <Route
              path="/sources"
              element={
                <PageTransition reduce={!!reduce}>
                  <SourcesPage />
                </PageTransition>
              }
            />
            <Route
              path="*"
              element={
                <PageTransition reduce={!!reduce}>
                  <NotFound />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout>
  );
};

export default App;
