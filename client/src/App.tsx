import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import Restaurants from "@/pages/restaurants";
import Analytics from "@/pages/analytics";
import Users from "@/pages/users";
import Feedbacks from "@/pages/feedbacks";
import Reporting from "@/pages/reporting";
import Layout from "@/components/layout";
import { useAuth, AuthProvider } from "@/lib/auth";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/restaurants" component={() => <ProtectedRoute component={Restaurants} />} />
      <Route path="/analytics" component={() => <ProtectedRoute component={Analytics} />} />
      <Route path="/users" component={() => <ProtectedRoute component={Users} />} />
      <Route path="/feedbacks" component={() => <ProtectedRoute component={Feedbacks} />} />
      <Route path="/reporting" component={() => <ProtectedRoute component={Reporting} />} />
      {/* Fallback to dashboard for unknown routes */}
      <Route component={() => <ProtectedRoute component={Dashboard} />} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
