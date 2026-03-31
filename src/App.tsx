import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import { ToastProvider } from "@/components/shared/Toast";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Transports from "@/pages/Transports";
import LiveMap from "@/pages/LiveMap";
import Actors from "@/pages/Actors";
import Equipment from "@/pages/Equipment";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import AuditLogs from "@/pages/AuditLogs";
import Settings from "@/pages/Settings";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/transports" element={<Transports />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/actors" element={<Actors />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<AuditLogs />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
