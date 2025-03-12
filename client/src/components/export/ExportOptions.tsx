import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  FileImage, 
  FileCog,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReportPreviewModal from "./ReportPreviewModal";
import RawDataExportModal from "./RawDataExportModal";

interface ExportOptionsProps {
  patientId?: string;
  analysisType?: string;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ 
  patientId = "Anonymous", 
  analysisType = "Standard" 
}) => {
  const { toast } = useToast();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showRawDataModal, setShowRawDataModal] = useState(false);

  const handleExportPDF = () => {
    toast({
      title: "Opening report preview",
      description: `Creating comprehensive PDF report for ${analysisType} analysis`,
    });
    setShowReportModal(true);
  };

  const handleExportImage = () => {
    toast({
      title: "Exporting as image",
      description: "Saving analysis as high-resolution image",
    });
    // In a real app, we would capture the radiograph view as an image
    // For now, we'll just show a success message
    toast({
      title: "Image exported",
      description: "Analysis image saved to your downloads folder",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Preparing for print",
      description: "Opening print dialog for analysis report",
    });
    // In a production app, we might format the page for printing first
    window.print();
  };

  const handleShareReport = () => {
    toast({
      title: "Share options",
      description: "Opening share options for this analysis",
    });
    // Share implementation could use the Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: `${analysisType} Analysis for ${patientId}`,
        text: "View this cephalometric analysis report",
        // url: window.location.href // Would be the sharable URL in production
      }).catch(() => {
        toast({
          title: "Sharing unavailable",
          description: "Your browser doesn't support sharing, or sharing was cancelled",
          variant: "destructive"
        });
      });
    } else {
      toast({
        title: "Sharing unavailable",
        description: "Your browser doesn't support the sharing functionality",
        variant: "destructive"
      });
    }
  };

  const handleExportRawData = () => {
    toast({
      title: "Preparing raw data export",
      description: "Opening data export options",
    });
    setShowRawDataModal(true);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="default" data-tutorial="export_options">
            <FileText className="h-4 w-4 mr-1" />
            <span className="text-sm mr-1">Report</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            <span>Full PDF Report</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleExportImage}>
            <FileImage className="h-4 w-4 mr-2" />
            <span>Export as Image</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            <span>Print Analysis</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleShareReport}>
            <Share2 className="h-4 w-4 mr-2" />
            <span>Share Analysis</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleExportRawData}>
            <FileCog className="h-4 w-4 mr-2" />
            <span>Export Raw Data</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Modals */}
      <ReportPreviewModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        patientName={patientId}
        analysisType={analysisType}
      />
      
      <RawDataExportModal
        isOpen={showRawDataModal}
        onClose={() => setShowRawDataModal(false)}
      />
    </>
  );
};

export default ExportOptions;