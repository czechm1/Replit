import { useState, useCallback, useEffect } from "react";

export function useAnalysisView() {
  const [analysisView, setAnalysisView] = useState<string>("profilogram");
  
  // Keyboard shortcut effect to change views
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if target is an input, textarea, etc.
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // View switching shortcuts
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch (e.key) {
          case "1":
            setAnalysisView("line");
            break;
          case "2":
            setAnalysisView("profilogram");
            break;
          case "3":
            setAnalysisView("chart");
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    analysisView,
    setAnalysisView
  };
}
