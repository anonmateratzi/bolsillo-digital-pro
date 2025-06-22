import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import IngresosPage from "./pages/IngresosPage";
import CambioDivisaPage from "./pages/CambioDivisaPage";
import InversionesPage from "./pages/InversionesPage";
import EgresosPage from "./pages/EgresosPage";
import NotFound from "./pages/NotFound";
import InflacionPage from "./pages/InflacionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/ingresos" element={<IngresosPage />} />
              <Route path="/cambio-divisa" element={<CambioDivisaPage />} />
              <Route path="/inversiones" element={<InversionesPage />} />
              <Route path="/egresos" element={<EgresosPage />} />
              <Route path="/inflacion" element={<InflacionPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
