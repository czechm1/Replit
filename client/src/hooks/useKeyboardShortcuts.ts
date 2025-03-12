import { useEffect, useCallback } from "react";
import { useAnalysisView } from "./useAnalysisView";
import { useLayerControls } from "./useLayerControls";

interface UseKeyboardShortcutsOptions {
  onToggleHighContrast: () => void;
  onToggleSidebar: () => void;
  onShowHelp: () => void;
  onSaveAnalysis?: () => void;
  onPrint?: () => void;
}

export function useKeyboardShortcuts({
  onToggleHighContrast,
  onToggleSidebar,
  onShowHelp,
  onSaveAnalysis,
  onPrint
}: UseKeyboardShortcutsOptions) {
  const { setAnalysisView } = useAnalysisView();
  const { setShowLayerControls, updateLayerOpacity } = useLayerControls();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts if target is an input, textarea, etc.
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    // Prevent default for keyboard shortcuts
    const shouldPreventDefault = () => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Handle shortcuts
    switch (e.key) {
      // Navigation and Save functionality 
      case "s":
      case "S":
        if (e.ctrlKey && !e.altKey && !e.metaKey && onSaveAnalysis) {
          shouldPreventDefault();
          onSaveAnalysis();
        } else if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          shouldPreventDefault();
          onToggleSidebar();
        }
        break;
      case "?":
        shouldPreventDefault();
        onShowHelp();
        break;

      // Analysis Views
      case "1":
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          shouldPreventDefault();
          setAnalysisView("line");
        }
        break;
      case "2":
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          shouldPreventDefault();
          setAnalysisView("profilogram");
        }
        break;
      case "3":
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          shouldPreventDefault();
          setAnalysisView("chart");
        }
        break;

      // Layer controls
      case "l":
      case "L":
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          shouldPreventDefault();
          setShowLayerControls(prev => !prev);
        }
        break;
      case "m":
      case "M":
        if (!e.ctrlKey && !e.altKey && !e.metaKey) {
          shouldPreventDefault();
          updateLayerOpacity("measurements", prev => prev === 0 ? 100 : 0);
        }
        break;

      // Accessibility
      case "c":
      case "C":
        if (e.altKey && !e.ctrlKey && !e.metaKey) {
          shouldPreventDefault();
          onToggleHighContrast();
        }
        break;

      // Save and print
      // Special case for Ctrl+S is handled in the first 's' case with additional conditions
      case "p":
        if (e.ctrlKey && !e.altKey && !e.metaKey && onPrint) {
          shouldPreventDefault();
          onPrint();
        }
        break;
    }
  }, [
    setAnalysisView, 
    setShowLayerControls, 
    updateLayerOpacity,
    onToggleHighContrast,
    onToggleSidebar,
    onShowHelp,
    onSaveAnalysis,
    onPrint
  ]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
