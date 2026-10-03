import React, { useState } from "react";
import { StorageProvider } from "./contexts/StorageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import LoginSignup from "./components/auth/Login";
import PasswordReset from "./components/auth/PasswordReset";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import PublicMarketplace from "./components/public/PublicMarketplace";

const AppRouter = () => {
  const { isAuthenticated, isLoading, recoveryMode } = useAuth();
  const [browsePublic, setBrowsePublic] = useState(false);
  if (isLoading) return <LoadingSpinner />;
  if (recoveryMode) return <PasswordReset />;
  if (isAuthenticated) return <Layout />;
  if (browsePublic) return <PublicMarketplace onLogin={() => setBrowsePublic(false)} />;
  return <LoginSignup onBrowse={() => setBrowsePublic(true)} />;
};

export default function AppRoot() {
  return (
    <AuthProvider>
      <StorageProvider>
        <AppRouter />
      </StorageProvider>
    </AuthProvider>
  );
}
