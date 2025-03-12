import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AnalysisProvider } from "./context/AnalysisContext";
import NotFound from "@/pages/not-found";
import CephalometricAnalysis from "@/pages/CephalometricAnalysis";
import Home from "@/pages/Home";

function Router() {
  // Simple debug navigation component to verify routing
  const DebugNav = () => (
    <div className="fixed top-0 right-0 bg-black/70 text-white p-2 z-50 text-xs">
      <div className="font-bold mb-1">Debug Navigation</div>
      <div><a href="/" className="text-blue-300 underline">Home</a></div>
      <div><a href="/cephalometric" className="text-blue-300 underline">Analysis</a></div>
      <div><a href="/test-invalid" className="text-blue-300 underline">Not Found</a></div>
    </div>
  );

  return (
    <>
      <DebugNav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/cephalometric" component={CephalometricAnalysis} />
        <Route component={NotFound} />
      </Switch>
    </>
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
