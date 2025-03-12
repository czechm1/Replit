import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Copy,
  X,
  Check,
  FileJson,
  FileText,
  FileSpreadsheet
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RawDataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData?: Record<string, any>;
}

const RawDataExportModal: React.FC<RawDataExportModalProps> = ({
  isOpen,
  onClose,
  analysisData = {
    // Sample data that would be populated from the actual analysis
    patientId: "P-123456",
    analysisType: "Ricketts",
    date: "2025-03-12",
    measurements: {
      "SNA": 82.4,
      "SNB": 78.2,
      "ANB": 4.2,
      "Wits": 3.5,
      "FMA": 25.6,
      "IMPA": 92.3,
      "Interincisal_Angle": 125.8
    }
  }
}) => {
  const { toast } = useToast();
  const [format, setFormat] = useState<"json" | "csv" | "excel">("json");
  const [includeMeta, setIncludeMeta] = useState(true);
  const [includeNorms, setIncludeNorms] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const handleCopyToClipboard = () => {
    const dataStr = JSON.stringify(analysisData, null, 2);
    navigator.clipboard.writeText(dataStr)
      .then(() => {
        setCopied(true);
        toast({
          title: "Copied to clipboard",
          description: "Raw data has been copied to your clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        toast({
          title: "Copy failed",
          description: "Could not copy data to clipboard",
          variant: "destructive"
        });
      });
  };
  
  const handleDownload = () => {
    let dataStr = "";
    let filename = `cephalometric_data_${analysisData.patientId}_${new Date().toISOString().split('T')[0]}`;
    let mime = "";
    
    if (format === "json") {
      dataStr = JSON.stringify(
        includeMeta 
          ? analysisData 
          : analysisData.measurements, 
        null, 2
      );
      filename += ".json";
      mime = "application/json";
    } else if (format === "csv") {
      // Simple CSV conversion for measurements
      const headers = Object.keys(analysisData.measurements);
      const values = Object.values(analysisData.measurements);
      
      if (includeMeta) {
        dataStr = `Patient ID,Analysis Type,Date\n${analysisData.patientId},${analysisData.analysisType},${analysisData.date}\n\n`;
      }
      
      dataStr += `Measurement,Value\n`;
      headers.forEach((header, index) => {
        dataStr += `${header},${values[index]}\n`;
      });
      
      filename += ".csv";
      mime = "text/csv";
    } else {
      // For Excel format, in a real app we would use a library like xlsx
      // Here we'll just use CSV as a placeholder
      dataStr = `Patient ID,Analysis Type,Date\n${analysisData.patientId},${analysisData.analysisType},${analysisData.date}\n\n`;
      dataStr += `Measurement,Value\n`;
      
      Object.entries(analysisData.measurements).forEach(([key, value]) => {
        dataStr += `${key},${value}\n`;
      });
      
      filename += ".xlsx";
      mime = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }
    
    const blob = new Blob([dataStr], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: `Raw data exported as ${format.toUpperCase()}`,
    });
  };

  // Format-specific icons
  // Not using this formatIcon object directly
// but keeping it as reference for the icons we need
const formatIcons = {
    json: FileJson,
    csv: FileText,
    excel: FileSpreadsheet
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-1">
          <DialogTitle>Export Raw Data</DialogTitle>
          <DialogDescription>
            Export analysis measurements in your preferred format
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Select Format</p>
            <RadioGroup 
              value={format} 
              onValueChange={(v) => setFormat(v as "json" | "csv" | "excel")}
              className="flex space-x-2"
            >
              <div className="flex flex-col items-center space-y-1">
                <div className={`p-3 border rounded-md ${format === 'json' ? 'border-primary bg-primary-50' : 'border-slate-200'}`}>
                  <FileJson className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="json" id="json" />
                  <Label htmlFor="json" className="text-xs">JSON</Label>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <div className={`p-3 border rounded-md ${format === 'csv' ? 'border-primary bg-primary-50' : 'border-slate-200'}`}>
                  <FileText className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="text-xs">CSV</Label>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-1">
                <div className={`p-3 border rounded-md ${format === 'excel' ? 'border-primary bg-primary-50' : 'border-slate-200'}`}>
                  <FileSpreadsheet className="h-6 w-6 text-slate-600" />
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="text-xs">Excel</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium mb-1">Data Options</p>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeMeta" 
                checked={includeMeta} 
                onCheckedChange={(checked) => setIncludeMeta(!!checked)} 
              />
              <label 
                htmlFor="includeMeta" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Include metadata (patient ID, analysis type)
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="includeNorms" 
                checked={includeNorms} 
                onCheckedChange={(checked) => setIncludeNorms(!!checked)} 
              />
              <label 
                htmlFor="includeNorms" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                Include normative values
              </label>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-md p-3 border">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium">Data Preview</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={handleCopyToClipboard}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
            <pre className="text-xs mt-2 bg-slate-100 p-2 rounded max-h-32 overflow-y-auto">
              {JSON.stringify(analysisData.measurements, null, 2)}
            </pre>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RawDataExportModal;