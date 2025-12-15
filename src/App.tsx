import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Workflows from "./pages/workflow/Workflows";
import AddWorkflow from "./pages/workflow/AddWorkflow";
import WorkManagement from "./pages/workflow/WorkManagement";
import LogDetail from "./pages/LogDetail";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import OAuth2Callback from "./pages/OAuth2Callback";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NoticeListPage from "./pages/notices/NoticeListPage";
import NoticeDetailPage from "./pages/notices/NoticeDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import NoticeCreatePage from "./pages/admin/NoticeCreatePage";
import NoticeEditPage from "./pages/admin/NoticeEditPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <Index />
            } />
            <Route path="/oauth2/callback" element={<OAuth2Callback />} />

            <Route path="/work/:workId/log/:logId" element={
              <ProtectedRoute>
                <LogDetail />
              </ProtectedRoute>
            } />
            <Route path="/workflows" element={
              <ProtectedRoute>
                <Workflows />
              </ProtectedRoute>
            } />
            <Route path="/workflows/add" element={
              <ProtectedRoute>
                <AddWorkflow />
              </ProtectedRoute>
            } />
            <Route path="/workflows/edit/:id" element={
              <ProtectedRoute>
                <AddWorkflow />
              </ProtectedRoute>
            } />
            <Route path="/work/:id" element={
              <ProtectedRoute>
                <WorkManagement />
              </ProtectedRoute>
            } />
            <Route path="/work/:workId/log/:logId" element={
              <ProtectedRoute>
                <LogDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/notices/new" element={<ProtectedRoute><NoticeCreatePage /></ProtectedRoute>} />
            <Route path="/admin/notices/:noticeId/edit" element={<ProtectedRoute><NoticeEditPage /></ProtectedRoute>} />
            <Route path="/notices" element={<NoticeListPage />} />
            <Route path="/notices/:noticeId" element={<NoticeDetailPage />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
