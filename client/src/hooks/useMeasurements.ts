import { useState, useEffect } from 'react';

export interface MeasurementPoint {
  id: string;
  name: string;
  value: number;
  normalRange: {
    min: number;
    max: number;
  };
  unit: string;
  severity: string; // empty, *, **, etc.
  isNormal: boolean;
  group: 'skeletal' | 'dental' | 'soft-tissue';
  coordinates: {
    x: number;
    y: number;
  };
}

interface MeasurementResponse {
  status: string;
  data: {
    measurements: MeasurementPoint[];
    box: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  };
  message?: string;
}

interface UseMeasurementsResult {
  measurementData: {
    measurements: MeasurementPoint[];
    box: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    };
  } | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage cephalometric measurements data
 */
export function useMeasurements(): UseMeasurementsResult {
  const [measurementData, setMeasurementData] = useState<UseMeasurementsResult['measurementData']>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real application, this would be an API call
      // For now, we'll use mock data based on the image
      const mockData: MeasurementResponse = {
        status: 'success',
        data: {
          measurements: [
            // Skeletal measurements
            { id: '1', name: 'SNA', value: 84.53, normalRange: { min: 80, max: 84 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 945, y: 215 } },
            { id: '2', name: 'SNB', value: 82.05, normalRange: { min: 78, max: 82 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 945, y: 245 } },
            { id: '3', name: 'ANB', value: 2.48, normalRange: { min: 0, max: 4 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 945, y: 273 } },
            { id: '4', name: 'Bjork sum', value: 387.82, normalRange: { min: 380, max: 390 }, unit: '°', severity: '*', isNormal: false, group: 'skeletal', coordinates: { x: 485, y: 378 } },
            { id: '5', name: 'FMA', value: 24.09, normalRange: { min: 20, max: 30 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 635, y: 715 } },
            { id: '6', name: 'Gonial angle', value: 120.60, normalRange: { min: 115, max: 125 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 485, y: 715 } },
            { id: '7', name: 'APDI', value: 84.72, normalRange: { min: 80, max: 88 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 825, y: 515 } },
            { id: '8', name: 'ODI', value: 78.09, normalRange: { min: 74, max: 82 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 805, y: 765 } },
            { id: '9', name: 'Combination factor', value: 164.81, normalRange: { min: 155, max: 165 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 615, y: 595 } },
            { id: '10', name: 'A to N-Perp(FH)', value: 0.91, normalRange: { min: -2, max: 2 }, unit: 'mm', severity: '*', isNormal: false, group: 'skeletal', coordinates: { x: 825, y: 595 } },
            { id: '11', name: 'B to N-Perp(FH)', value: -7.73, normalRange: { min: -4, max: 0 }, unit: 'mm', severity: '**', isNormal: false, group: 'skeletal', coordinates: { x: 935, y: 773 } },
            { id: '12', name: 'Pog to N-Perp(FH)', value: -7.37, normalRange: { min: -4, max: 2 }, unit: 'mm', severity: '**', isNormal: false, group: 'skeletal', coordinates: { x: 935, y: 835 } },
            { id: '13', name: 'FH to AB', value: 82.27, normalRange: { min: 78, max: 86 }, unit: '°', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 955, y: 400 } },
            { id: '14', name: 'A-B to mandibular plane', value: 73.64, normalRange: { min: 70, max: 76 }, unit: '°', severity: '*', isNormal: false, group: 'skeletal', coordinates: { x: 805, y: 820 } },
            { id: '15', name: 'Wits appraisal', value: 1.39, normalRange: { min: -1, max: 3 }, unit: 'mm', severity: '', isNormal: true, group: 'skeletal', coordinates: { x: 925, y: 635 } },
            
            // Dental measurements
            { id: '16', name: 'Overjet', value: 2.68, normalRange: { min: 1, max: 4 }, unit: 'mm', severity: '', isNormal: true, group: 'dental', coordinates: { x: 945, y: 650 } },
            { id: '17', name: 'Overbite', value: 1.26, normalRange: { min: 1, max: 3 }, unit: 'mm', severity: '', isNormal: true, group: 'dental', coordinates: { x: 965, y: 670 } },
            { id: '18', name: 'U1 to FH', value: 110.44, normalRange: { min: 105, max: 115 }, unit: '°', severity: '*', isNormal: false, group: 'dental', coordinates: { x: 835, y: 380 } },
            { id: '19', name: 'U1 to SN', value: -1.87, normalRange: { min: -3, max: 3 }, unit: '°', severity: '*', isNormal: false, group: 'dental', coordinates: { x: 955, y: 515 } },
            { id: '20', name: 'U1 to UOP', value: 60.91, normalRange: { min: 57, max: 63 }, unit: '°', severity: '*', isNormal: false, group: 'dental', coordinates: { x: 860, y: 595 } },
            { id: '21', name: 'IMPA', value: 91.96, normalRange: { min: 87, max: 93 }, unit: '°', severity: '', isNormal: true, group: 'dental', coordinates: { x: 805, y: 795 } },
            { id: '22', name: 'L1 to LOP', value: 70.23, normalRange: { min: 65, max: 75 }, unit: '°', severity: '', isNormal: true, group: 'dental', coordinates: { x: 825, y: 670 } },
            { id: '23', name: 'Interincisal angle', value: 162.52, normalRange: { min: 125, max: 135 }, unit: '°', severity: '*', isNormal: false, group: 'dental', coordinates: { x: 625, y: 625 } },
            { id: '24', name: 'Cant of occlusal plane', value: 7.31, normalRange: { min: 5, max: 10 }, unit: '°', severity: '', isNormal: true, group: 'dental', coordinates: { x: 725, y: 645 } },
            { id: '25', name: 'U1 to NA(mm)', value: 5.58, normalRange: { min: 3, max: 7 }, unit: 'mm', severity: '', isNormal: true, group: 'dental', coordinates: { x: 965, y: 542 } },
            { id: '26', name: 'U1 to NA(deg)', value: 22.12, normalRange: { min: 18, max: 25 }, unit: '°', severity: '', isNormal: true, group: 'dental', coordinates: { x: 965, y: 570 } },
            { id: '27', name: 'L1 to NB(mm)', value: 6.58, normalRange: { min: 3, max: 7 }, unit: 'mm', severity: '*', isNormal: false, group: 'dental', coordinates: { x: 965, y: 705 } },
            { id: '28', name: 'L1 to NB(deg)', value: 21.02, normalRange: { min: 18, max: 25 }, unit: '°', severity: '', isNormal: true, group: 'dental', coordinates: { x: 965, y: 735 } },
            { id: '29', name: 'Upper incisal display', value: -0.92, normalRange: { min: -1, max: 2 }, unit: 'mm', severity: '**', isNormal: false, group: 'dental', coordinates: { x: 1035, y: 650 } },
            
            // Soft tissue measurements
            { id: '30', name: 'Upper lip to E-plane', value: 1.43, normalRange: { min: -1, max: 3 }, unit: 'mm', severity: '', isNormal: true, group: 'soft-tissue', coordinates: { x: 1045, y: 620 } },
            { id: '31', name: 'Lower lip to E-plane', value: 1.72, normalRange: { min: -1, max: 3 }, unit: 'mm', severity: '', isNormal: true, group: 'soft-tissue', coordinates: { x: 1045, y: 685 } },
            { id: '32', name: 'Nasolabial angle', value: 93.59, normalRange: { min: 90, max: 110 }, unit: '°', severity: '', isNormal: true, group: 'soft-tissue', coordinates: { x: 1045, y: 570 } },
            { id: '33', name: 'Extraction Index', value: 134.32, normalRange: { min: 125, max: 135 }, unit: '', severity: '*', isNormal: false, group: 'soft-tissue', coordinates: { x: 985, y: 600 } },
          ],
          box: {
            left: 0,
            right: 1007,
            top: 0,
            bottom: 741.288
          }
        }
      };
      
      setMeasurementData(mockData.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  return {
    measurementData,
    loading,
    error,
    refetch: fetchMeasurements
  };
} 