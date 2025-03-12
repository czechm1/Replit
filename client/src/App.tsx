import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnalysisProvider } from "./context/AnalysisContext";
import NotFound from "@/pages/not-found";
import CephalometricAnalysis from "@/pages/CephalometricAnalysis";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CephalometricAnalysis} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AnalysisProvider>
        <Router />
        <Toaster />
      </AnalysisProvider>
    </QueryClientProvider>
  );
}

export default App;
