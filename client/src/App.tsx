import { Switch, Route } from "wouter";
import { mockQueryClient } from "./services/mockQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnalysisProvider } from "./context/AnalysisContext";
import { TutorialProvider } from "./context/TutorialContext";
import { TutorialController } from "./components/tutorial/TutorialController";
import NotFound from "@/pages/not-found";
import CephalometricAnalysis from "@/pages/CephalometricAnalysis";
import ComparisonView from "@/pages/ComparisonView";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cephalometric" component={CephalometricAnalysis} />
      <Route path="/cephalometric/:patientId" component={CephalometricAnalysis} />
      <Route path="/comparison" component={ComparisonView} />
      <Route path="/comparison/:patientId" component={ComparisonView} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      background: '#f0f4f8'
    }}>
      <div style={{ 
        background: 'red', 
        padding: '20px',
        color: 'white',
        fontWeight: 'bold',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        WebCeph App is running - Basic Test Display
      </div>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{ marginBottom: '20px', color: '#1a365d' }}>WebCeph</h1>
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#4a5568' }}>
          Cephalometric Analysis Tool for orthodontic assessment
        </p>
        <div style={{ marginTop: '30px' }}>
          <button 
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            onClick={() => alert('Button clicked!')}
          >
            Test Interaction
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
