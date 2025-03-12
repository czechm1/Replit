import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnalysisProvider } from "./context/AnalysisContext";
import { TutorialProvider } from "./context/TutorialContext";
import { TutorialController } from "./components/tutorial/TutorialController";
import NotFound from "@/pages/not-found";
import CephalometricAnalysis from "@/pages/CephalometricAnalysis";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cephalometric" component={CephalometricAnalysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
