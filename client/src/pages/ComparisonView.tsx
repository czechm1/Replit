import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComparisonImageType } from '@/components/radiograph/types';

// Use a simplified version for testing
const ComparisonViewPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/comparison/:patientId');
  
  // Extract patient ID from route params or use default
  const [patientId, setPatientId] = useState<string>("demo-patient-1");
  
  useEffect(() => {
    // Update patientId when route params change
    if (params && params.patientId) {
      setPatientId(params.patientId);
    }
  }, [params]);

  const handleBackToAnalysis = () => {
    setLocation(`/cephalometric/${patientId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Comparison View Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Patient ID: {patientId}</p>
          <p className="mb-4">This is a simplified test version of the comparison view.</p>
          <Button onClick={handleBackToAnalysis}>
            Back to Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComparisonViewPage;