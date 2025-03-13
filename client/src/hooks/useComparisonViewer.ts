import { useState, useCallback } from 'react';
import { ComparisonImageType, ComparisonModeType } from '@/components/radiograph/types';

export function useComparisonViewer() {
  const [comparisonImages, setComparisonImages] = useState<ComparisonImageType[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonModeType>('overlay');
  const [isComparisonActive, setIsComparisonActive] = useState(false);

  const addComparisonImage = useCallback((image: ComparisonImageType) => {
    setComparisonImages(prev => {
      // Check if image already exists to avoid duplicates
      if (prev.some(img => img.id === image.id)) {
        return prev;
      }
      
      const newImages = [...prev, image];
      
      // If this is the first image, set it as active
      if (prev.length === 0) {
        setActiveImageId(image.id);
      }
      
      return newImages;
    });
  }, []);

  const removeComparisonImage = useCallback((imageId: string) => {
    setComparisonImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      
      // If we removed the active image, update the active image
      if (activeImageId === imageId && filtered.length > 0) {
        setActiveImageId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveImageId(null);
      }
      
      return filtered;
    });
  }, [activeImageId]);

  const toggleImageVisibility = useCallback((imageId: string) => {
    setComparisonImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, visible: !img.visible } 
          : img
      )
    );
  }, []);

  const updateImageOpacity = useCallback((imageId: string, opacity: number) => {
    setComparisonImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, opacity } 
          : img
      )
    );
  }, []);

  const updateImageColorFilter = useCallback((imageId: string, colorFilter: string) => {
    setComparisonImages(prev => 
      prev.map(img => 
        img.id === imageId 
          ? { ...img, colorFilter: colorFilter === "" ? undefined : colorFilter } 
          : img
      )
    );
  }, []);

  const toggleComparisonMode = useCallback(() => {
    setComparisonMode(prev => prev === 'overlay' ? 'sideBySide' : 'overlay');
  }, []);

  const toggleComparisonActive = useCallback(() => {
    setIsComparisonActive(prev => !prev);
  }, []);

  return {
    comparisonImages,
    activeImageId,
    comparisonMode,
    isComparisonActive,
    addComparisonImage,
    removeComparisonImage,
    toggleImageVisibility,
    updateImageOpacity,
    updateImageColorFilter,
    setActiveImageId,
    toggleComparisonMode,
    toggleComparisonActive
  };
}