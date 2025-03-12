import React, { createContext, useContext, ReactNode, useState } from "react";

interface AnalysisContextType {
  // Patient data
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  
  // Analysis data
  analysisType: string;
  setAnalysisType: (type: string) => void;
  
  // Measurement results
  measurements: Record<string, number>;
  updateMeasurement: (key: string, value: number) => void;
  
  // Status
  analysisCompleted: boolean;
  setAnalysisCompleted: (completed: boolean) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }
  return context;
};

interface AnalysisProviderProps {
  children: ReactNode;
}

export const AnalysisProvider: React.FC<AnalysisProviderProps> = ({ children }) => {
  // Patient data
  const [patientId] = useState("11IRVSH5T");
  const [patientName] = useState("");
  const [patientAge] = useState(25);
  const [patientGender] = useState("Male");
  
  // Analysis data
  const [analysisType, setAnalysisType] = useState("Tweed");
  
  // Measurement results
  const [measurements, setMeasurements] = useState<Record<string, number>>({
    SNA: 83.5,
    SNB: 79.8,
    ANB: 3.7,
    FMA: 26.62,
    FMIA: 68.86,
    IMPA: 84.51,
    CONVEXITY: 4.2,
    LOWER_FACE_HEIGHT: 56.2
  });
  
  const updateMeasurement = (key: string, value: number) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Status
  const [analysisCompleted, setAnalysisCompleted] = useState(true);

  const value = {
    patientId,
    patientName,
    patientAge,
    patientGender,
    analysisType,
    setAnalysisType,
    measurements,
    updateMeasurement,
    analysisCompleted,
    setAnalysisCompleted
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};
