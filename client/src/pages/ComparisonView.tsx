import React, { useState, useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import ComparisonViewer from '../components/radiograph/ComparisonViewer';
import { ComparisonImageType } from '@/components/radiograph/types';

const ComparisonViewPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [, params] = useRoute('/comparison/:patientId');
  
  // Extract patient ID from route params or use default
  const [patientId, setPatientId] = useState<string>("demo-patient-1");
  const patientName = "John Doe";
  
  useEffect(() => {
    // Update patientId when route params change
    if (params && params.patientId) {
      setPatientId(params.patientId);
    }
  }, [params]);
  
  // In a real app, we would fetch image data based on the patientId
  const initialImages: ComparisonImageType[] = [
    {
      id: 'ceph-before',
      patientId,
      imageType: 'ceph',
      timestamp: '2025-01-15',
      description: 'Before Treatment',
      url: '/images/cephalometric.png',
      visible: true,
      opacity: 100
    },
    {
      id: 'ceph-after',
      patientId,
      imageType: 'ceph',
      timestamp: '2025-03-15',
      description: 'After Treatment',
      url: '/images/cephalometric.png',  // Would be different in real app
      visible: true,
      opacity: 100,
      colorFilter: 'hue-rotate(180deg)'
    }
  ];

  const handleBackToAnalysis = () => {
    setLocation(`/cephalometric/${patientId}`);
  };

  const toggleHighContrastMode = () => {
    setHighContrastMode(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900">
      <ComparisonViewer 
        patientId={patientId}
        highContrastMode={highContrastMode}
        initialImages={initialImages}
        onClose={handleBackToAnalysis}
      />
    </div>
  );
};

export default ComparisonViewPage;