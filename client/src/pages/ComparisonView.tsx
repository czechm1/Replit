import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import ComparisonViewer from '../components/radiograph/ComparisonViewer';
import { ComparisonImageType } from '@/components/radiograph/types';
import { api } from '@/services/clientStorage';
import { useQuery } from '@tanstack/react-query';

const ComparisonViewPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [, params] = useRoute('/comparison/:patientId');
  
  // Extract patient ID from route params or use default
  const [patientId, setPatientId] = useState<string>("p1");
  
  useEffect(() => {
    // Update patientId when route params change
    if (params && params.patientId) {
      setPatientId(params.patientId);
    }
  }, [params]);

  // Fetch patient data from client storage
  const { data: patientData } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => api.getPatient(patientId),
    refetchOnWindowFocus: false,
  });

  // Fetch available images for this patient
  const { data: imagesData } = useQuery({
    queryKey: ['images'],
    queryFn: () => api.getImages(),
    refetchOnWindowFocus: false,
  });

  // Filter images for the current patient
  const patientImages = useMemo(() => {
    return imagesData?.filter(img => img.patientId === patientId) || [];
  }, [imagesData, patientId]);

  // Convert to ComparisonImageType format
  const initialImages: ComparisonImageType[] = useMemo(() => {
    // If we have at least one image, use it
    if (patientImages.length > 0) {
      // Create comparison images from available patient images
      return patientImages.map((img, index) => ({
        id: img.imageId,
        patientId: img.patientId,
        imageType: 'ceph',
        timestamp: new Date().toISOString(),
        description: index === 0 ? 'Before Treatment' : 'After Treatment',
        url: img.url,
        visible: true,
        opacity: 100,
        // Add color filter to distinguish the second image
        ...(index === 1 ? { colorFilter: 'hue-rotate(180deg)' } : {})
      }));
    }
    
    // Fallback to default images (should not happen with our setup)
    return [
      {
        id: 'img1',
        patientId,
        imageType: 'ceph',
        timestamp: '2025-01-15',
        description: 'Before Treatment',
        url: '/images/ceph1.jpg',
        visible: true,
        opacity: 100
      },
      {
        id: 'img2',
        patientId,
        imageType: 'ceph',
        timestamp: '2025-03-15',
        description: 'After Treatment',
        url: '/images/ceph2.jpg',
        visible: true,
        opacity: 100,
        colorFilter: 'hue-rotate(180deg)'
      }
    ];
  }, [patientImages, patientId]);

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