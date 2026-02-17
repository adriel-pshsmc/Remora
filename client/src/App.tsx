import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Tracking from "@/pages/Tracking";
import Shipments from "@/pages/Shipments";
import Risks from "@/pages/Risks";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import Auth from "@/pages/Auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/" component={Dashboard} />
      <Route path="/tracking" component={Tracking} />
      <Route path="/shipments" component={Shipments} />
      <Route path="/risks" component={Risks} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;