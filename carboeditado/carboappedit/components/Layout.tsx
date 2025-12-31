import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Menu, Search, Bell, User, HelpCircle, 
  Home, ShoppingBag, Truck, CreditCard, 
  Settings, LogOut, Package, Users, BarChart2,
  X, ExternalLink, ChevronRight, ChevronLeft, FileText, LayoutDashboard, ShieldCheck,
  Megaphone, Star, MapPin, Box, Bike, MessageSquare, Briefcase, Grid,
  SlidersHorizontal, Moon, Sun, RefreshCw, Smartphone, Shield, Info, LayoutGrid, Check, Trash, Inbox, BellOff, Zap, Palette, Lock, Activity, DollarSign, Globe, QrCode, FileBarChart,
  History, Command, ArrowRight as ArrowIcon, TrendingUp, ChevronDown, UserCog, KeyRound, Camera, AlertTriangle, CheckCircle2, XCircle, LayoutTemplate,
  CloudRain, UserCheck, Hammer, Ruler
} from 'lucide-react';
import { UserRole, Notification } from '../types';
import { Button, Badge, Avatar, Card, Input, Modal } from './UIComponents';
import { Logo } from './Logo';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { carboSystem } from '../services/carboSystem';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  // Fix: Added userId prop to match usage in App.tsx
  userId?: string;
}

interface NotificationItemProps {
  notif: Notification;
  isDarkMode: boolean;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notif, isDarkMode, onMarkAsRead, onRemove }) => (
  <div className={`p-4 rounded-3xl border flex gap-3 relative group transition-all duration-500 hover:scale-[1.02] ${
    notif.read 
      ? isDarkMode ? 'bg-zinc-800/30 border-zinc-800 opacity-60' : 'bg-white/40 border-white/40 opacity-70' 
      : isDarkMode ? 'bg-zinc-800 border-zinc-700 shadow-md' : 'bg-white/80 border-white/60 shadow-sm backdrop-blur-md'
  }`}>
    <div className={`mt-1 p-2.5 rounded-full shrink-0 ${
      notif.type === 'WARNING' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 
      notif.type === 'SUCCESS' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 
      notif.type === 'ERROR' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    }`}>
      {notif.type === 'WARNING' ? <AlertTriangle size={18} /> : 
       notif.type === 'SUCCESS' ? <CheckCircle2 size={18} /> : 
       notif.type === 'ERROR' ? <XCircle size={18} /> : 
       <Info size={18} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start mb-1">
        <h4 className={`font-bold text-sm truncate pr-6 ${isDarkMode ? 'text-zinc-200' : 'text-gray-900'}`}>{notif.title}</h4>
        <span className="text-[10px] text-gray-500 dark:text-zinc-500 whitespace-nowrap font-medium">{notif.time}</span>
      </div>
      <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-gray-600'}`}>{notif.message}</p>
      
      {!notif.read && (
        <button 
          onClick={() => onMarkAsRead(notif.id)}
          className="mt-3 text-[10px] font-black uppercase tracking-widest text-carbo-primary hover:underline flex items-center gap-1"
        >
          Marcar como lida
        </button>
      )}
    </div>
    
    <button 
      onClick={() => onRemove(notif.id)}
      className="absolute top-2 right-2 p-1.5 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
    >
      <X size={14} />
    </button>
  </div>
);

// Fix: Destructured userId from props
export const Layout: React.FC<LayoutProps> = ({ children, role, onNavigate, currentPage, onLogout, userId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [popupsEnabled, setPopupsEnabled] = useState(true);
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuDragControls = useDragControls();

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
      // Fix: Use the userId from props if available
      let currentUserId = userId || 'u2'; 
      const update = () => {
          const all = carboSystem.getNotifications(currentUserId, role);
          setNotifications(all);
      };
      update();
      return carboSystem.subscribe(update);
  }, [role, userId]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) setIsMenuOpen(false);
  };

  const menuItems = useMemo(() => {
    const common = [
      { id: 'wallet', label: 'Carteira', icon: <CreditCard size={20} /> },
      { id: 'settings', label: 'Ajustes', icon: <Settings size={20} /> },
    ];
    switch (role) {
      case UserRole.CLIENT: return [{ id: 'client_home', label: 'Início', icon: <Home size={20} /> }, { id: 'client_p2p', label: 'Entregas', icon: <Truck size={20} /> }, { id: 'client_orders', label: 'Pedidos', icon: <ShoppingBag size={20} /> }, ...common];
      
      case UserRole.VENDOR: 
        // Specialized Vendor Check
        const creativeItems = [
            { id: 'creative_panel', label: 'Creative Marcenaria', icon: <Hammer size={20} /> },
            { id: 'vendor_chat', label: 'Mensagens', icon: <MessageSquare size={20} /> },
            { id: 'vendor_settings', label: 'Ajustes Loja', icon: <Settings size={20} /> },
            ...common
        ];
        return creativeItems;
      
      case UserRole.DELIVERY: return [
        { id: 'delivery_home', label: 'Radar', icon: <Smartphone size={20} /> }, 
        { id: 'delivery_vehicles', label: 'Garagem', icon: <Truck size={20} /> }, 
        { id: 'delivery_history', label: 'Ganhos', icon: <FileText size={20} /> }, 
        ...common
      ];
      
      case UserRole.ADMIN: return [
          { id: 'admin_dash', label: 'Dashboard', icon: <BarChart2 size={20} /> }, 
          { id: 'admin_orders', label: 'Monitor', icon: <Activity size={20} /> },
          ...common
      ];
      default: return [];
    }
  }, [role]);

  const taskbarItems = useMemo(() => {
      return menuItems.slice(0, 4);
  }, [menuItems]);

  const handleMarkAsRead = useCallback((id: string) => {
    // Simulated read update
  }, []);

  const handleRemoveNotification = useCallback((id: string) => {
    // Simulated remove
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden transition-colors duration-700 bg-transparent ${isDarkMode ? 'text-zinc-100' : 'text-gray-900'}`}>
      
      {/* --- TOP BAR (HUD) --- */}
      <div className={`
        fixed top-0 left-0 w-full h-20 z-40 px-6 flex items-center justify-between transition-all duration-300
        ${isDarkMode ? 'bg-zinc-900/80' : 'bg-white/40'} 
        backdrop-blur-xl border-b border-white/20 dark:border-white/5
      `}>
          <div className="flex items-center gap-3"><Logo size="md" variant="full" /></div>
          <div className="flex items-center gap-3">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className={`h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all duration-300 ${isDarkMode ? 'bg-zinc-800/60 border-zinc-700/50 text-yellow-400' : 'bg-white/40 border-white/40 text-gray-500 shadow-sm'}`}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={`h-10 w-10 flex items-center justify-center rounded-full backdrop-blur-xl border transition-all duration-300 relative ${isNotificationsOpen ? 'bg-carbo-primary text-white border-carbo-primary' : 'bg-white/40 border-white/40 text-gray-500 shadow-sm'}`}><Bell size={18} />{notifications.filter(n => !n.read).length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}</button>
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className={`h-10 w-10 p-0.5 rounded-full backdrop-blur-xl border transition-all duration-300 ${isProfileMenuOpen ? 'bg-white border-carbo-primary shadow-xl' : 'bg-white/40 border-white/40 shadow-sm'}`}><Avatar fallback={<User className="text-gray-400" size={18} />} size="full" /></button>
          </div>
      </div>

      {/* --- FLOATING TASKBAR (THE DOCK) --- */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`flex items-center gap-2 p-2.5 rounded-[2rem] border shadow-float backdrop-blur-2xl transition-all duration-300 ${isDarkMode ? 'bg-zinc-900/80 border-zinc-700 shadow-black/50' : 'bg-white/60 border-white/40 shadow-[0_20px_40px_rgba(0,0,0,0.1)]'}`}>
              {taskbarItems.map(item => (
                  <button key={item.id} onClick={() => onNavigate(item.id)} className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 group ${currentPage === item.id ? 'bg-carbo-primary text-white shadow-lg -translate-y-2 scale-110' : isDarkMode ? 'text-gray-400 hover:bg-zinc-800' : 'text-gray-500 hover:bg-white/80 hover:text-carbo-primary'}`}>
                      {item.icon}
                      <div className={`absolute -top-10 px-2 py-1 rounded-lg bg-gray-900 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap`}>{item.label}</div>
                  </button>
              ))}
              <div className={`w-px h-8 mx-1 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300/50'}`} />
              <button onClick={() => setIsSearchOpen(true)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${isSearchOpen ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:bg-white/80'}`}><Search size={22} /></button>
              <button onClick={() => setIsMenuOpen(true)} className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${isMenuOpen ? 'bg-zinc-800 text-white shadow-lg' : 'text-gray-500 hover:bg-white/80'}`}><LayoutGrid size={22} /></button>
          </motion.div>
      </div>

      {/* --- NOTIFICATIONS --- */}
      <AnimatePresence>
        {isNotificationsOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsNotificationsOpen(false)}/>
            <motion.div initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} className={`fixed top-24 bottom-28 right-0 w-full md:w-[400px] md:mr-6 rounded-[2.5rem] shadow-2xl z-50 overflow-hidden flex flex-col border ${isDarkMode ? 'bg-zinc-900/95 border-zinc-700 backdrop-blur-2xl' : 'glass-panel bg-white/80'}`}>
              <div className="p-8 border-b border-white/20 dark:border-white/5 flex flex-col gap-6"><h3 className="font-black text-2xl text-gray-900 dark:text-zinc-100">Notificações</h3></div>
              <div className="overflow-y-auto custom-scrollbar p-4 space-y-3 flex-1">
                  {notifications.map(notif => <NotificationItem key={notif.id} notif={notif} isDarkMode={isDarkMode} onMarkAsRead={handleMarkAsRead} onRemove={handleRemoveNotification}/>)}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- CONTENT --- */}
      <main className={`flex-1 overflow-y-auto overflow-x-hidden relative h-screen pt-24 pb-32`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
              {children}
          </div>
      </main>

    </div>
  );
};