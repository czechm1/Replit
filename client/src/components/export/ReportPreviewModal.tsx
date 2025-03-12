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
  Printer, 
  Mail, 
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  analysisType?: string;
}

const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  patientName = "John Doe",
  analysisType = "Ricketts"
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(3);
  const [reportLayout, setReportLayout] = useState<"standard" | "detailed" | "compact">("standard");
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle>Report Preview: {patientName} - {analysisType} Analysis</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            Review and customize your report before exporting
          </DialogDescription>
        </DialogHeader>
        
        {/* Tabs for report options */}
        <div className="p-2 border-b">
          <Tabs defaultValue="standard" value={reportLayout} onValueChange={(v) => setReportLayout(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="standard">Standard Report</TabsTrigger>
              <TabsTrigger value="detailed">Detailed Report</TabsTrigger>
              <TabsTrigger value="compact">Compact Report</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Report preview area */}
        <div className="flex-grow overflow-auto p-4 bg-slate-100">
          <div className="bg-white border rounded-md shadow-sm h-full overflow-auto mx-auto max-w-2xl">
            {/* Page 1 - Summary */}
            {currentPage === 1 && (
              <div className="p-10">
                <div className="text-center mb-10">
                  <h1 className="text-xl font-bold text-primary-700 mb-1">Cephalometric Analysis Report</h1>
                  <h2 className="text-lg text-slate-700">{analysisType} Analysis</h2>
                  <p className="text-slate-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-md font-semibold border-b pb-1 mb-3">Patient Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p><span className="font-medium">Name:</span> {patientName}</p>
                      <p><span className="font-medium">ID:</span> P-123456</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Date of Birth:</span> 01/15/1985</p>
                      <p><span className="font-medium">Gender:</span> Male</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-md font-semibold border-b pb-1 mb-3">Analysis Summary</h3>
                  <div className="space-y-3 text-sm">
                    <p><span className="font-medium">Skeletal Classification:</span> Class II</p>
                    <p><span className="font-medium">Growth Pattern:</span> Normal vertical</p>
                    <p><span className="font-medium">Key Findings:</span> Slight mandibular retrusion, overjet 5.2mm</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Page 2 - Measurements */}
            {currentPage === 2 && (
              <div className="p-10">
                <h2 className="text-lg font-bold text-primary-700 mb-4">Cephalometric Measurements</h2>
                
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border p-2 text-left">Measurement</th>
                      <th className="border p-2 text-center">Result</th>
                      <th className="border p-2 text-center">Norm</th>
                      <th className="border p-2 text-center">Deviation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">SNA (°)</td>
                      <td className="border p-2 text-center">82.4</td>
                      <td className="border p-2 text-center">82 ± 2</td>
                      <td className="border p-2 text-center">+0.4</td>
                    </tr>
                    <tr>
                      <td className="border p-2">SNB (°)</td>
                      <td className="border p-2 text-center">78.2</td>
                      <td className="border p-2 text-center">80 ± 2</td>
                      <td className="border p-2 text-center text-amber-600">-1.8</td>
                    </tr>
                    <tr>
                      <td className="border p-2">ANB (°)</td>
                      <td className="border p-2 text-center">4.2</td>
                      <td className="border p-2 text-center">2 ± 2</td>
                      <td className="border p-2 text-center text-amber-600">+2.2</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Wits (mm)</td>
                      <td className="border p-2 text-center">3.5</td>
                      <td className="border p-2 text-center">0 ± 2</td>
                      <td className="border p-2 text-center text-amber-600">+3.5</td>
                    </tr>
                    <tr>
                      <td className="border p-2">FMA (°)</td>
                      <td className="border p-2 text-center">25.6</td>
                      <td className="border p-2 text-center">25 ± 3</td>
                      <td className="border p-2 text-center">+0.6</td>
                    </tr>
                  </tbody>
                </table>
                
                {reportLayout === "detailed" && (
                  <div className="mt-8">
                    <h3 className="text-md font-semibold mb-3">Measurement Interpretations</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">ANB = 4.2°:</span> Indicates a Class II skeletal relationship</p>
                      <p><span className="font-medium">SNB = 78.2°:</span> Retrognathic mandible contributing to Class II relationship</p>
                      <p><span className="font-medium">FMA = 25.6°:</span> Normal vertical growth pattern</p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Page 3 - Visuals */}
            {currentPage === 3 && (
              <div className="p-10">
                <h2 className="text-lg font-bold text-primary-700 mb-4">Visual Analysis</h2>
                
                <div className="flex justify-center mb-6">
                  <div className="border p-2 bg-slate-50 inline-block">
                    <div className="h-60 w-48 bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-500 text-sm">Radiograph with landmarks</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-md font-semibold mb-3">Treatment Considerations</h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Class II correction focused on mandibular advancement</li>
                    <li>Maintain vertical dimension</li>
                    <li>Address increased overjet with dental compensation</li>
                    {reportLayout === "detailed" && (
                      <>
                        <li>Consider functional appliance therapy for growth modification</li>
                        <li>Monitor mandibular growth response to treatment</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-md font-semibold mb-3">Clinical Notes</h3>
                  <p className="text-sm">
                    Patient presents with a Class II skeletal relationship primarily due to mandibular
                    retrusion. Vertical growth pattern is within normal limits. Dental compensation
                    is evident with increased overjet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Page controls */}
        <div className="p-2 border-t flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            <span className="text-sm text-slate-500 ml-2">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <DialogFooter className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-1" />
              Email
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download PDF
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPreviewModal;