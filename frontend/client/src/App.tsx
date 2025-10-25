import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AuthMiddleware } from "@/components/AuthMiddleware";
import Header from "@/components/Header";
import Home from "@/pages/Home";
import LiveSession from "@/pages/LiveSession";
import Insights from "@/pages/Insights";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route 
        path="/" 
        component={() => (
          <AuthMiddleware>
            <Home />
          </AuthMiddleware>
        )} 
      />
      <Route 
        path="/session" 
        component={() => (
          <AuthMiddleware>
            <LiveSession />
          </AuthMiddleware>
        )} 
      />
      <Route 
        path="/insights" 
        component={() => (
          <AuthMiddleware>
            <Insights />
          </AuthMiddleware>
        )} 
      />
      <Route 
        path="/profile" 
        component={() => (
          <AuthMiddleware>
            <Profile />
          </AuthMiddleware>
        )} 
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [location, setLocation] = useLocation();
  const { user, profile, logout } = useAuth();
  const isAuthRoute = location === "/login" || location === "/register";

  if (isAuthRoute) {
    return <Router />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userName={profile?.full_name || user?.email?.split('@')[0] || "Guest"}
        userAvatar={profile?.avatar_url}
        onProfileClick={() => setLocation("/profile")}
        onSettingsClick={() => setLocation("/profile")}
        onLogout={logout}
      />
      
      <main>
        <Router />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background/95 backdrop-blur-sm">
        <div className="flex items-center justify-around h-16">
          <button
            onClick={() => setLocation("/")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              location === "/" ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          <button
            onClick={() => setLocation("/session")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              location === "/session" ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-session"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" strokeWidth="2" />
            </svg>
            <span className="text-xs font-medium">Session</span>
          </button>
          
          <button
            onClick={() => setLocation("/insights")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              location === "/insights" ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-insights"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium">Insights</span>
          </button>
          
          <button
            onClick={() => setLocation("/profile")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              location === "/profile" ? "text-primary" : "text-muted-foreground"
            }`}
            data-testid="nav-profile"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <AppContent />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
