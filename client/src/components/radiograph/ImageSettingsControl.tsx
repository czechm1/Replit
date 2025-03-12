import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { ImageControlsType } from "./types";

interface ImageSettingsProps {
  imageControls: ImageControlsType;
  onImageControlChange: (control: keyof ImageControlsType, value: number) => void;
  onClose: () => void;
  onReset: () => void;
}

const ImageSettingsControl: React.FC<ImageSettingsProps> = ({
  imageControls,
  onImageControlChange,
  onClose,
  onReset
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-slate-200 p-3 w-64">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-slate-800">Image Settings</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-slate-400 hover:text-slate-600 h-7 w-7 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Brightness</label>
            <div className="flex items-center">
              <span className="text-xs text-slate-500 mr-1">{imageControls.brightness}</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs text-primary-600 hover:text-primary-700 p-0 h-auto"
                onClick={() => onImageControlChange('brightness', 0)}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">-50</span>
            <Slider
              value={[imageControls.brightness]}
              min={-50}
              max={50}
              step={1}
              onValueChange={(value) => onImageControlChange('brightness', value[0])}
              className="flex-grow"
            />
            <span className="text-xs text-slate-400">+50</span>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm text-slate-600 font-medium">Contrast</label>
            <div className="flex items-center">
              <span className="text-xs text-slate-500 mr-1">{imageControls.contrast}</span>
              <Button 
                variant="link" 
                size="sm" 
                className="text-xs text-primary-600 hover:text-primary-700 p-0 h-auto"
                onClick={() => onImageControlChange('contrast', 0)}
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">-50</span>
            <Slider
              value={[imageControls.contrast]}
              min={-50}
              max={50}
              step={1}
              onValueChange={(value) => onImageControlChange('contrast', value[0])}
              className="flex-grow"
            />
            <span className="text-xs text-slate-400">+50</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded transition-colors"
          onClick={onReset}
        >
          Reset All
        </Button>
      </div>
    </div>
  );
};

export default ImageSettingsControl;