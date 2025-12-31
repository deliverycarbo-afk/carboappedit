
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/Landing';
import { ClientDashboard, ClientP2P, ClientOrders, ClientMarketplace } from './pages/Client';
import { 
  VendorDashboard, VendorKanban, VendorInventory, VendorDelivery,
  VendorCouriers, VendorVehicles, VendorFinance, VendorChat, VendorReviews, 
  VendorCompetitors, VendorNotifications, VendorSettings, VendorMarketing
} from './pages/Vendor';
import { DeliveryDashboard, DeliveryHistory, DeliveryVehicles } from './pages/Delivery';
import { 
    AdminDashboard, AdminUsers, AdminFinance, AdminApprovals, AdminSupport, 
    AdminPermissions, AdminOrderMonitor, AdminPlatformSettings, AdminChatMonitor, 
    AdminReviews, AdminTokens, AdminNotifications, AdminReports, AdminMarketing, 
    AdminPartners, AdminContent, AdminSecurity
} from './pages/Admin';
import { WalletPage, SettingsPage } from './pages/Common';
import { UserRole } from './types';

// --- ROUTE CONFIGURATION SYSTEM ---
// Define qual componente renderizar e quais roles têm acesso a ele.
type RouteConfig = {
  component: React.ReactNode;
  allowedRoles: UserRole[];
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.GUEST);
  const [currentPage, setCurrentPage] = useState<string>('home');

  // --- MAPA DE ROTAS E PERMISSÕES (STRICT GUARD) ---
  const routes: Record<string, RouteConfig> = {
    // COMMON (Acessível por todos os logados)
    'wallet': { component: <WalletPage />, allowedRoles: [UserRole.CLIENT, UserRole.VENDOR, UserRole.DELIVERY, UserRole.ADMIN] },
    'settings': { component: <SettingsPage />, allowedRoles: [UserRole.CLIENT, UserRole.VENDOR, UserRole.DELIVERY, UserRole.ADMIN] },

    // CLIENT MODULES
    'client_home': { component: <ClientDashboard />, allowedRoles: [UserRole.CLIENT] },
    'client_p2p': { component: <ClientP2P />, allowedRoles: [UserRole.CLIENT] },
    'client_orders': { component: <ClientOrders />, allowedRoles: [UserRole.CLIENT] },
    'client_stores': { component: <ClientMarketplace onBack={() => setCurrentPage('client_home')} />, allowedRoles: [UserRole.CLIENT] },

    // VENDOR MODULES (Creative Suite - Exclusive)
    'vendor_dashboard': { component: <VendorDashboard />, allowedRoles: [UserRole.VENDOR] },
    'vendor_kanban': { component: <VendorKanban />, allowedRoles: [UserRole.VENDOR] },
    'vendor_inventory': { component: <VendorInventory />, allowedRoles: [UserRole.VENDOR] },
    'vendor_marketing': { component: <VendorMarketing />, allowedRoles: [UserRole.VENDOR] },
    'vendor_delivery': { component: <VendorDelivery />, allowedRoles: [UserRole.VENDOR] },
    'vendor_couriers': { component: <VendorCouriers />, allowedRoles: [UserRole.VENDOR] },
    'vendor_vehicles': { component: <VendorVehicles />, allowedRoles: [UserRole.VENDOR] },
    'vendor_finance': { component: <VendorFinance />, allowedRoles: [UserRole.VENDOR] },
    'vendor_chat': { component: <VendorChat />, allowedRoles: [UserRole.VENDOR] },
    'vendor_reviews': { component: <VendorReviews />, allowedRoles: [UserRole.VENDOR] },
    'vendor_competitors': { component: <VendorCompetitors />, allowedRoles: [UserRole.VENDOR] },
    'vendor_notifications': { component: <VendorNotifications />, allowedRoles: [UserRole.VENDOR] },
    'vendor_settings': { component: <VendorSettings />, allowedRoles: [UserRole.VENDOR] },

    // DELIVERY MODULES
    'delivery_home': { component: <DeliveryDashboard />, allowedRoles: [UserRole.DELIVERY] },
    'delivery_history': { component: <DeliveryHistory />, allowedRoles: [UserRole.DELIVERY] },
    'delivery_vehicles': { component: <DeliveryVehicles />, allowedRoles: [UserRole.DELIVERY] },

    // ADMIN MODULES (System Core)
    'admin_dash': { component: <AdminDashboard />, allowedRoles: [UserRole.ADMIN] },
    'admin_users': { component: <AdminUsers />, allowedRoles: [UserRole.ADMIN] },
    'admin_finance': { component: <AdminFinance />, allowedRoles: [UserRole.ADMIN] },
    'admin_approvals': { component: <AdminApprovals />, allowedRoles: [UserRole.ADMIN] },
    'admin_security': { component: <AdminSecurity />, allowedRoles: [UserRole.ADMIN] },
    'admin_marketing': { component: <AdminMarketing />, allowedRoles: [UserRole.ADMIN] },
    'admin_partners': { component: <AdminPartners />, allowedRoles: [UserRole.ADMIN] },
    'admin_content': { component: <AdminContent />, allowedRoles: [UserRole.ADMIN] },
    'admin_support': { component: <AdminSupport />, allowedRoles: [UserRole.ADMIN] },
    'admin_permissions': { component: <AdminPermissions />, allowedRoles: [UserRole.ADMIN] },
    'admin_orders': { component: <AdminOrderMonitor />, allowedRoles: [UserRole.ADMIN] },
    'admin_platform': { component: <AdminPlatformSettings />, allowedRoles: [UserRole.ADMIN] },
    'admin_chats': { component: <AdminChatMonitor />, allowedRoles: [UserRole.ADMIN] },
    'admin_reviews': { component: <AdminReviews />, allowedRoles: [UserRole.ADMIN] },
    'admin_tokens': { component: <AdminTokens />, allowedRoles: [UserRole.ADMIN] },
    'admin_notifications': { component: <AdminNotifications />, allowedRoles: [UserRole.ADMIN] },
    'admin_reports': { component: <AdminReports />, allowedRoles: [UserRole.ADMIN] },
  };

  const getHomeForRole = (role: UserRole): string => {
    switch(role) {
      case UserRole.VENDOR: return 'vendor_dashboard';
      case UserRole.DELIVERY: return 'delivery_home';
      case UserRole.CLIENT: return 'client_home';
      case UserRole.ADMIN: return 'admin_dash';
      default: return 'home';
    }
  };

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage(getHomeForRole(role));
  };

  const handleLogout = () => {
    setUserRole(UserRole.GUEST);
    setCurrentPage('home');
  };

  // Safe Navigation Handler
  const handleNavigate = (page: string) => {
    const route = routes[page];
    // Dupla verificação: Rota existe E usuário tem permissão
    if (route && route.allowedRoles.includes(userRole)) {
        setCurrentPage(page);
    } else {
        console.warn(`Access Denied: User ${userRole} tried to access ${page}`);
        // Opcional: Feedback visual de erro
    }
  };

  const renderContent = () => {
    if (userRole === UserRole.GUEST) return <LandingPage onLogin={handleLogin} />;

    // Verifica se a rota existe
    const route = routes[currentPage];
    
    // Se a rota não existe ou o usuário não tem permissão (Rota protegida)
    if (!route || !route.allowedRoles.includes(userRole)) {
        // Fallback de segurança: Retorna o componente Home do usuário sem alterar o estado durante o render
        const correctHome = getHomeForRole(userRole);
        return routes[correctHome].component; 
    }

    return route.component;
  };

  if (userRole === UserRole.GUEST) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <Layout 
      role={userRole} 
      currentPage={currentPage} 
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
