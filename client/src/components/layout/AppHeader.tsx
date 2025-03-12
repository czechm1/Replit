import React from "react";
import { useLocation, Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Info, Keyboard, Moon, ChevronDown 
} from "lucide-react";

interface AppHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onShowKeyboardShortcuts: () => void;
  onToggleHighContrast: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  onShowKeyboardShortcuts,
  onToggleHighContrast
}) => {
  const tabs = ["list", "patient", "analysis"];
  
  const analysisOptions = [
    "Digitization", "Analysis", "Soft-Tissue", "Occlusogram", 
    "Assessment", "Treatment", "Superimposition", "Viewer", 
    "Case", "Timelapse"
  ];

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo and primary navigation */}
        <div className="flex items-center space-x-6">
          <div className="font-semibold text-primary-600 text-xl">WebCeph</div>
          
          {/* Primary Navigation */}
          <nav className="hidden md:flex space-x-1">
            {tabs.slice(0, 2).map(tab => (
              <Button
                key={tab}
                variant="ghost"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab 
                    ? "bg-primary-50 text-primary-600" 
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="capitalize">{tab}</span>
              </Button>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                    activeTab === "analysis" 
                      ? "bg-primary-50 text-primary-600" 
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Analysis</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {analysisOptions.map((option, index) => (
                  <DropdownMenuItem 
                    key={index}
                    className={option === "Analysis" ? "bg-primary-50 text-primary-600" : ""}
                    onClick={() => option === "Analysis" && setActiveTab("analysis")}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        
        {/* User and actions */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-slate-600 hover:text-primary-600 rounded-full hover:bg-slate-100"
          >
            <Info className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-slate-600 hover:text-primary-600 rounded-full hover:bg-slate-100"
            onClick={onShowKeyboardShortcuts}
          >
            <Keyboard className="h-5 w-5" />
            <span className="sr-only">Keyboard shortcuts</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            className="text-slate-600 hover:text-primary-600 rounded-full hover:bg-slate-100"
            onClick={onToggleHighContrast}
          >
            <Moon className="h-5 w-5" />
            <span className="sr-only">Toggle high contrast</span>
          </Button>
          
          <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
            <span className="font-medium text-sm">DR</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
