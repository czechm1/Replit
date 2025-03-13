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
    <QueryClientProvider client={mockQueryClient}>
      <AnalysisProvider>
        <TutorialProvider>
          <Router />
          <TutorialController />
          <Toaster />
        </TutorialProvider>
      </AnalysisProvider>
    </QueryClientProvider>
  );
}

export default App;
