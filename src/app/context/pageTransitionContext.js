"use client";

import { createContext, useState, useContext } from "react";

const PageTransitionContext = createContext();

export function PageTransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  return (
    <PageTransitionContext.Provider
      value={{ isTransitioning, setIsTransitioning }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransition() {
  return useContext(PageTransitionContext);
}
