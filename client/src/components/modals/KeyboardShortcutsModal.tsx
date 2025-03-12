import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface KeyboardShortcut {
  key: string;
  description: string;
}

interface KeyboardShortcutCategory {
  title: string;
  shortcuts: KeyboardShortcut[];
}

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcutCategories: KeyboardShortcutCategory[] = [
    {
      title: "Navigation",
      shortcuts: [
        { key: "Tab", description: "Next Tab" },
        { key: "Shift+Tab", description: "Previous Tab" },
        { key: "S", description: "Toggle Sidebar" },
        { key: "?", description: "Help" }
      ]
    },
    {
      title: "Image Controls",
      shortcuts: [
        { key: "+", description: "Zoom In" },
        { key: "-", description: "Zoom Out" },
        { key: "H", description: "Pan Tool" },
        { key: "R", description: "Rotate Tool" },
        { key: "0", description: "Reset View" },
        { key: "L", description: "Toggle Layers" }
      ]
    },
    {
      title: "Collaborative Editing",
      shortcuts: [
        { key: "Ctrl+E", description: "Toggle Edit Mode" },
        { key: "Esc", description: "Exit Edit Mode" },
        { key: "Click", description: "Select Landmark" },
        { key: "Del", description: "Delete Selected Landmark" },
        { key: "A", description: "Add New Landmark" },
        { key: "Drag", description: "Move Selected Landmark" }
      ]
    },
    {
      title: "Analysis Tools",
      shortcuts: [
        { key: "1", description: "Line Analysis" },
        { key: "2", description: "Profilogram" },
        { key: "3", description: "Chart View" },
        { key: "M", description: "Toggle Measurements" },
        { key: "Ctrl+S", description: "Save Analysis" },
        { key: "Ctrl+P", description: "Print" }
      ]
    },
    {
      title: "Accessibility",
      shortcuts: [
        { key: "Alt+C", description: "High Contrast" },
        { key: "Ctrl+Wheel", description: "Zoom Interface" }
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-800 flex justify-between items-center">
            Keyboard Shortcuts
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-400 hover:text-slate-600"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogTitle>
          <DialogDescription className="text-sm text-blue-600 mt-2">
            New! Real-time collaborative annotation is now available.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {shortcutCategories.map((category, idx) => (
            <div key={idx}>
              <h3 className={`font-medium mb-2 ${
                category.title === "Collaborative Editing" 
                  ? "text-blue-600" 
                  : "text-slate-800"
              }`}>
                {category.title}
                {category.title === "Collaborative Editing" && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">New</span>
                )}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {category.shortcuts.map((shortcut, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-2 rounded ${
                      category.title === "Collaborative Editing" 
                        ? "bg-blue-50" 
                        : "bg-slate-50"
                    }`}
                  >
                    <span className="text-sm text-slate-600">{shortcut.description}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      category.title === "Collaborative Editing" 
                        ? "bg-blue-200 text-blue-700" 
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {shortcut.key}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <DialogFooter className="border-t border-slate-200 pt-4 flex flex-col">
          <p className="text-xs text-slate-500 mb-3 text-center">
            Multiple users can now collaborate on the same image in real-time.
            Try opening this page in multiple browsers to see it in action!
          </p>
          <Button 
            variant="default" 
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded transition-colors"
            onClick={onClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsModal;
