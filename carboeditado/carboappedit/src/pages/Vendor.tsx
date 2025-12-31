import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Badge, Button, Input, Tabs, Avatar, Modal } from '../components/UIComponents';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area
} from 'recharts';
import { 
  MoreHorizontal, Clock, DollarSign, Package, Users, Plus, Edit, Trash2, Filter, Star, 
  TrendingUp, ShoppingCart, QrCode, Printer, ChevronDown, MapPin, 
  Bike, MessageCircle, Truck, Info, HelpCircle, FileText, Settings, Search, Zap, Box, Briefcase, Power, Check, X,
  ArrowRight, AlertTriangle, PlayCircle, CheckCircle2, XCircle, Send, Palette, Image as ImageIcon, UploadCloud,
  Loader2, Utensils, Bell, GripVertical, GripHorizontal, Eye, CreditCard, ChevronRight, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { Order, Store, Product, Courier, Vehicle, Competitor, StockMovement, Notification, ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---

const STORES: Store[] = [
    { id: '1', name: 'Burger King - Centro', category: 'Fast Food', isOpen: true, rating: 4.8, image: '' },
    { id: '2', name: 'Burger King - Shopping', category: 'Fast Food', isOpen: false, rating: 4.5, image: '' }
];

const INITIAL_ORDERS: Order[] = [
  { id: '#1234', customerName: 'Carlos Silva', items: ['2x Burger', '1x Cola'], total: 45.90, status: 'NOVO', timeElapsed: '1min', type: 'DELIVERY', paymentMethod: 'PIX' },
  { id: '#1235', customerName: 'Ana Paula', items: ['1x Pizza G'], total: 78.50, status: 'PREPARANDO', timeElapsed: '12min', type: 'MESA', paymentMethod: 'CARTAO' },
  { id: '#1236', customerName: 'Roberto M.', items: ['1x Açaí 500ml'], total: 22.00, status: 'PRONTO', timeElapsed: '20min', type: 'RETIRADA', paymentMethod: 'DINHEIRO' },
  { id: '#1237', customerName: 'Julia K.', items: ['3x Pastel'], total: 30.00, status: 'AGUARDANDO_COLETA', timeElapsed: '35min', type: 'DELIVERY', paymentMethod: 'ONLINE' },
  { id: '#1238', customerName: 'Marcos V.', items: ['1x Combo Família'], total: 120.00, status: 'EM_ENTREGA', timeElapsed: '45min', type: 'DELIVERY', paymentMethod: 'PIX' },
  { id: '#1239', customerName: 'Fernanda L.', items: ['2x Refri'], total: 12.00, status: 'FINALIZADO', timeElapsed: '60min', type: 'RETIRADA', paymentMethod: 'DINHEIRO' },
  { id: '#1240', customerName: 'Pedro H.', items: ['1x Milkshake'], total: 18.00, status: 'NOVO', timeElapsed: '2min', type: 'DELIVERY', paymentMethod: 'PIX' },
];

const PRODUCTS: Product[] = [
    { id: '1', name: 'X-Burger Premium', price: 25.90, category: 'Lanches', stock: 50, minStock: 10, active: true },
    { id: '2', name: 'Coca-Cola 350ml', price: 6.00, category: 'Bebidas', stock: 120, minStock: 24, active: true },
    { id: '3', name: 'Batata Frita G', price: 15.00, category: 'Porções', stock: 5, minStock: 20, active: true },
    { id: '4', name: 'Suco de Laranja', price: 8.00, category: 'Bebidas', stock: 0, minStock: 10, active: false },
    { id: '5', name: 'Combo Kids', price: 32.00, category: 'Lanches', stock: 15, minStock: 15, active: true },
];

const STOCK_MOVEMENTS: StockMovement[] = [
    { id: '1', productId: '1', productName: 'X-Burger Premium', type: 'EXIT', quantity: 2, date: '10:30', reason: 'Venda #1234' },
    { id: '2', productId: '2', productName: 'Coca-Cola 350ml', type: 'ENTRY', quantity: 48, date: '09:00', reason: 'Reposição' },
    { id: '3', productId: '3', productName: 'Batata Frita G', type: 'ADJUST', quantity: -2, date: 'Ontem', reason: 'Perda/Avaria' },
];

const COURIERS: Courier[] = [
    { id: '1', name: 'João da Silva', rating: 4.9, vehicle: 'MOTO', status: 'ONLINE', isFixed: true, phone: '(11) 99999-1111', deliveriesCount: 1540 },
    { id: '2', name: 'Marcos Paulo', rating: 4.7, vehicle: 'BIKE', status: 'BUSY', isFixed: false, phone: '(11) 99999-2222', deliveriesCount: 320 },
    { id: '3', name: 'Ana Souza', rating: 4.8, vehicle: 'MOTO', status: 'OFFLINE', isFixed: true, phone: '(11) 99999-3333', deliveriesCount: 890 },
];

const VEHICLES: Vehicle[] = [
    { id: '1', type: 'MOTO', model: 'Honda CG 160', plate: 'ABC-1234', status: 'ATIVO', driverId: '1' },
    { id: '2', type: 'BIKE', model: 'Bicicleta Elétrica', plate: '-', status: 'MANUTENCAO' },
    { id: '3', type: 'CARRO', model: 'Fiat Fiorino', plate: 'XYZ-9876', status: 'ATIVO' },
];

const COMPETITORS: Competitor[] = [
    { id: '1', name: 'McDonalds', distance: '500m', rating: 4.5, deliveryFee: 5.90, avgTime: '25min', strength: 'Rapidez' },
    { id: '2', name: 'Burger House', distance: '1.2km', rating: 4.2, deliveryFee: 3.50, avgTime: '40min', strength: 'Preço' },
];

const NOTIFICATIONS: Notification[] = [
    { id: '1', title: 'Estoque Baixo', message: 'Atenção: Batata Frita G está abaixo do mínimo.', type: 'WARNING', time: '10 min atrás', read: false },
    { id: '2', title: 'Novo Entregador Fixo', message: 'João aceitou seu convite para equipe fixa.', type: 'SUCCESS', time: '1h atrás', read: true },
    { id: '3', title: 'Meta Batida!', message: 'Parabéns! Você atingiu a meta de vendas diária.', type: 'INFO', time: '2h atrás', read: true },
];

const chartData = [
    { name: 'Seg', vendas: 1240 },
    { name: 'Ter', vendas: 1800 },
    { name: 'Qua', vendas: 2400 },
    { name: 'Qui', vendas: 1600 },
    { name: 'Sex', vendas: 3200 },
    { name: 'Sáb', vendas: 3800 },
    { name: 'Dom', vendas: 2900 },
];

// --- HELPER: STORE THEME HOOK ---
// Simulates persistent store configuration using localStorage for the demo
const useStoreTheme = () => {
    const [themeColor, setThemeColor] = useState('#FF7A00'); // Default Carbo Orange
    const [logo, setLogo] = useState<string | null>(null);

    useEffect(() => {
        const savedColor = localStorage.getItem('vendor_theme_color');
        const savedLogo = localStorage.getItem('vendor_logo');
        if (savedColor) setThemeColor(savedColor);
        if (savedLogo) setLogo(savedLogo);
    }, []);

    const saveTheme = (color: string, newLogo: string | null) => {
        setThemeColor(color);
        localStorage.setItem('vendor_theme_color', color);
        if (newLogo) {
            setLogo(newLogo);
            localStorage.setItem('vendor_logo', newLogo);
        }
    };

    return { themeColor, logo, saveTheme };
};

// --- HELPER COMPONENT: STORE SELECTOR ---
const StoreSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(STORES[0]);

    return (
        <div className="relative z-30">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:shadow-sm transition-all group">
                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-carbo-primary font-bold transition-colors group-hover:bg-orange-50">{selected.name[0]}</div>
                <div className="text-left">
                    <p className="text-xs font-bold text-gray-900 leading-none">{selected.name}</p>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">Trocar Loja</p>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-100 rounded-xl shadow-float overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {STORES.map(store => (
                        <div key={store.id} onClick={() => { setSelected(store); setIsOpen(false); }} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors">
                             <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center text-gray-600 font-bold">{store.name[0]}</div>
                             <div className="flex-1">
                                <p className="text-sm font-bold text-gray-800">{store.name}</p>
                                <p className="text-xs text-gray-500">{store.category}</p>
                             </div>
                             {store.id === selected.id && <div className="w-2 h-2 rounded-full bg-carbo-primary" />}
                        </div>
                    ))}
                    <div className="p-2 bg-gray-50">
                        <Button variant="ghost" className="w-full text-[10px] h-8 font-black uppercase tracking-widest">Configurar Unidades</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MODULE 1: DASHBOARD ---

interface WidgetProps {
    id: string;
    children: React.ReactNode;
    editMode: boolean;
    onDragStart: (e: React.DragEvent, index: number) => void;
    onDragEnter: (e: React.DragEvent, index: number) => void;
    onDragEnd: (e: React.DragEvent) => void;
    index: number;
    colSpan?: string;
}

const DashboardWidget: React.FC<WidgetProps> = ({ id, children, editMode, onDragStart, onDragEnter, onDragEnd, index, colSpan = "col-span-1" }) => {
    return (
        <motion.div
            layout
            draggable={editMode}
            onDragStart={(e) => editMode && onDragStart(e as any, index)}
            onDragEnter={(e) => editMode && onDragEnter(e as any, index)}
            onDragEnd={(e) => editMode && onDragEnd(e as any)}
            onDragOver={(e) => e.preventDefault()}
            className={`${colSpan} relative ${editMode ? 'cursor-grab active:cursor-grabbing z-20' : ''}`}
            animate={editMode ? { 
                scale: [1, 1.01, 1],
                rotate: [0, 0.5, -0.5, 0],
                transition: { repeat: Infinity, duration: 2.5 }
            } : { scale: 1, rotate: 0 }}
        >
            {editMode && (
                <div className="absolute -top-2 -left-2 z-30 bg-white shadow-md rounded-full p-1 border border-gray-200 text-gray-400">
                    <GripHorizontal size={16} />
                </div>
            )}
            <div className={`h-full ${editMode ? 'ring-2 ring-carbo-primary/30 rounded-3xl bg-white pointer-events-none' : ''}`}>
                {children}
            </div>
        </motion.div>
    );
};

export const VendorDashboard: React.FC = () => {
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const { themeColor } = useStoreTheme();
  
  // Widget System State
  const [editMode, setEditMode] = useState(false);
  const [widgetOrder, setWidgetOrder] = useState<string[]>(['status', 'monitor', 'stat_money', 'stat_orders', 'stat_time', 'stat_rating', 'chart', 'actions']);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Check URL/Nav to enable edit mode automatically
  useEffect(() => {
      // Very basic check, in real app would use routing props
      const isCustomizationPage = document.querySelector('button[title="Personalizar"]')?.classList.contains('bg-carbo-primary'); 
      // Since we don't have router props easily here, we rely on a manual button toggle in the dashboard header
  }, []);

  // Load Layout
  useEffect(() => {
      const savedLayout = localStorage.getItem('vendor_dashboard_layout');
      if (savedLayout) {
          try {
              setWidgetOrder(JSON.parse(savedLayout));
          } catch (e) {}
      }
  }, []);

  // Save Layout
  const saveLayout = () => {
      localStorage.setItem('vendor_dashboard_layout', JSON.stringify(widgetOrder));
      setEditMode(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
      setDraggedItemIndex(index);
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
      if (draggedItemIndex === null || draggedItemIndex === index) return;
      
      const newOrder = [...widgetOrder];
      const draggedItem = newOrder[draggedItemIndex];
      newOrder.splice(draggedItemIndex, 1);
      newOrder.splice(index, 0, draggedItem);
      
      setWidgetOrder(newOrder);
      setDraggedItemIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent) => {
      setDraggedItemIndex(null);
  };

  // --- WIDGET CONTENT RENDERERS ---

  const renderStatusWidget = () => (
      <motion.div 
        animate={{ scale: isStoreOpen ? 1 : [1, 1.01, 1] }}
        transition={{ duration: 2, repeat: isStoreOpen ? 0 : Infinity }}
        className={`h-full p-6 rounded-3xl border shadow-float flex flex-col justify-center gap-6 transition-all duration-500 ${
          isStoreOpen 
          ? 'bg-white border-green-100' 
          : 'bg-gray-900 border-gray-700'
        }`}
      >
          <div className="flex items-center justify-between">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center relative ${
                isStoreOpen ? 'bg-green-100 text-green-600' : 'bg-gray-800 text-gray-500'
              }`}>
                  <Power size={28} />
                  {isStoreOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-ping" />}
              </div>
              <button 
                onClick={() => !editMode && setIsStoreOpen(!isStoreOpen)}
                className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 ${isStoreOpen ? 'bg-carbo-primary' : 'bg-gray-700'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${isStoreOpen ? 'translate-x-[50px]' : 'translate-x-2'}`} />
              </button>
          </div>
          <div>
              <h3 className={`text-2xl font-black mb-1 ${isStoreOpen ? 'text-gray-900' : 'text-white'}`}>
                Loja {isStoreOpen ? 'ABERTA' : 'FECHADA'}
              </h3>
              <p className={`text-sm font-medium leading-relaxed ${isStoreOpen ? 'text-gray-500' : 'text-gray-400'}`}>
                {isStoreOpen ? 'Recebendo pedidos normalmente.' : 'Clientes não conseguem fazer pedidos.'}
              </p>
          </div>
      </motion.div>
  );

  const renderMonitorWidget = () => {
      const statusCounts = {
        NOVO: INITIAL_ORDERS.filter(o => o.status === 'NOVO').length,
        PREPARANDO: INITIAL_ORDERS.filter(o => o.status === 'PREPARANDO').length,
        PRONTO: INITIAL_ORDERS.filter(o => o.status === 'PRONTO').length,
        EM_ENTREGA: INITIAL_ORDERS.filter(o => o.status === 'EM_ENTREGA').length,
      };
      return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-full">
               {[
                   { label: 'Novos', count: statusCounts.NOVO, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', icon: <Bell size={20}/> },
                   { label: 'Na Cozinha', count: statusCounts.PREPARANDO, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', icon: <Utensils size={20}/> },
                   { label: 'Prontos', count: statusCounts.PRONTO, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', icon: <CheckCircle2 size={20}/> },
                   { label: 'Viajando', count: statusCounts.EM_ENTREGA, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200', icon: <Bike size={20}/> },
               ].map((stat, i) => (
                   <div key={i} className={`flex flex-col justify-between p-5 rounded-3xl border transition-all hover:shadow-hover h-full ${stat.bg} ${stat.border}`}>
                       <div className="flex justify-between items-start">
                           <div className={`p-2 bg-white rounded-xl shadow-sm ${stat.color}`}>{stat.icon}</div>
                           {stat.count > 0 && <span className={`flex h-2 w-2 rounded-full ${stat.color.replace('text', 'bg')}`}/>}
                       </div>
                       <div>
                           <span className={`text-4xl font-black ${stat.color}`}>{stat.count}</span>
                           <p className={`text-xs font-bold uppercase tracking-wider mt-1 opacity-70 ${stat.color}`}>{stat.label}</p>
                       </div>
                   </div>
               ))}
          </div>
      );
  };

  const renderStatsWidget = (type: 'money' | 'orders' | 'time' | 'rating') => {
      const config = {
          money: { icon: <DollarSign size={24}/>, label: 'Vendeu Hoje', val: 'R$ 1.250', color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-500' },
          orders: { icon: <Package size={24}/>, label: 'Pedidos Feitos', val: '24', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
          time: { icon: <Clock size={24}/>, label: 'Tempo de Preparo', val: '32 min', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-l-orange-500' },
          rating: { icon: <Star size={24}/>, label: 'Nota da Loja', val: '4.8', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-l-purple-500' },
      }[type];

      return (
        <Card className={`flex items-center gap-4 border-l-4 h-full ${config.border}`}>
          <div className={`p-3 rounded-full ${config.bg} ${config.color}`}>{config.icon}</div>
          <div><p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{config.label}</p><h3 className="text-2xl font-black text-gray-900">{config.val}</h3></div>
        </Card>
      );
  };

  const renderChartWidget = () => (
    <Card className="h-96 flex flex-col">
        <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Suas Vendas na Semana</h3>
        <Badge variant="success" className="flex items-center gap-1"><TrendingUp size={12} /> Subiu 12%</Badge>
        </div>
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
            <defs><linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={themeColor} stopOpacity={0.2}/><stop offset="95%" stopColor={themeColor} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="name" stroke="#9CA3AF" tick={{fill: '#6B7280', fontSize: 11}} axisLine={false} tickLine={false} />
            <YAxis stroke="#9CA3AF" tick={{fill: '#6B7280', fontSize: 11}} axisLine={false} tickLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="vendas" stroke={themeColor} strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
        </AreaChart>
        </ResponsiveContainer>
    </Card>
  );

  const renderActionsWidget = () => (
    <div className="space-y-4 h-full">
        <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100 flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-hover transition-all group h-40">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-carbo-primary mb-3 shadow-sm group-hover:scale-110 transition-transform"><QrCode size={24}/></div>
            <h4 className="font-bold text-gray-900 text-sm">QR Code Mesa</h4>
            <p className="text-xs text-gray-500 mt-1">Gerar código para pedidos</p>
        </div>
        <Card className="flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all h-24">
            <div className="flex items-center gap-3">
                <Printer size={20} className="text-gray-400"/>
                <div><h4 className="font-bold text-sm text-gray-900">Impressora</h4><p className="text-[10px] text-green-600 font-bold uppercase">Funcionando</p></div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
        </Card>
    </div>
  );

  const WIDGET_REGISTRY: any = {
      'status': { component: renderStatusWidget(), col: 'col-span-1 xl:col-span-1' },
      'monitor': { component: renderMonitorWidget(), col: 'col-span-1 xl:col-span-2' },
      'stat_money': { component: renderStatsWidget('money'), col: 'col-span-1 md:col-span-1' },
      'stat_orders': { component: renderStatsWidget('orders'), col: 'col-span-1 md:col-span-1' },
      'stat_time': { component: renderStatsWidget('time'), col: 'col-span-1 md:col-span-1' },
      'stat_rating': { component: renderStatsWidget('rating'), col: 'col-span-1 md:col-span-1' },
      'chart': { component: renderChartWidget(), col: 'col-span-1 lg:col-span-2' },
      'actions': { component: renderActionsWidget(), col: 'col-span-1' },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
          <div className="flex items-center gap-8">
            <SectionTitle title="Olá, Ricardo!" subtitle="Aqui está o resumo do seu negócio hoje." className="mb-0"/>
            <div className="hidden md:block w-px h-10 bg-gray-200" />
            <StoreSelector />
          </div>
          
          <Button 
            onClick={() => editMode ? saveLayout() : setEditMode(true)} 
            variant={editMode ? 'success' : 'outline'}
            className="w-full md:w-auto"
            icon={editMode ? <Check size={18}/> : <Palette size={18}/>}
          >
              {editMode ? 'Salvar Layout' : 'Personalizar Painel'}
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {widgetOrder.map((widgetId, index) => {
              const widgetDef = WIDGET_REGISTRY[widgetId];
              if (!widgetDef) return null;

              return (
                  <DashboardWidget 
                    key={widgetId} 
                    id={widgetId} 
                    index={index}
                    editMode={editMode}
                    colSpan={widgetDef.col}
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDragEnd={handleDragEnd}
                  >
                      {widgetDef.component}
                  </DashboardWidget>
              );
          })}
      </div>
    </div>
  );
};

// --- MODULE 2: KANBAN ---
export const VendorKanban: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
    const [confirmModal, setConfirmModal] = useState<{isOpen: boolean, orderId: string, currentStatus: string, nextStatus: string} | null>(null);
    const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);
    const [cancellationReason, setCancellationReason] = useState('');
    const [inputError, setInputError] = useState(false);
    const [chatOrder, setChatOrder] = useState<Order | null>(null);
    const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
    
    // Theme Hook
    const { themeColor, logo } = useStoreTheme();

    const columns = ['NOVO', 'PREPARANDO', 'PRONTO', 'EM_ENTREGA'];
    
    // Mapeamento visual dos status
    const statusLabels: Record<string, string> = {
        'NOVO': 'Novo Pedido',
        'PREPARANDO': 'Em Preparação',
        'PRONTO': 'Pronto para Entrega',
        'EM_ENTREGA': 'Em Entrega',
        'FINALIZADO': 'Concluído',
        'CANCELADO': 'Cancelado'
    };

    const getNextStatus = (current: string) => {
        const flow = ['NOVO', 'PREPARANDO', 'PRONTO', 'EM_ENTREGA', 'FINALIZADO'];
        const idx = flow.indexOf(current);
        if (idx !== -1 && idx < flow.length - 1) return flow[idx + 1];
        return null;
    };

    const handleRequestMove = (order: Order) => {
        const next = getNextStatus(order.status);
        if (!next) return;

        setConfirmModal({
            isOpen: true,
            orderId: order.id,
            currentStatus: order.status,
            nextStatus: next
        });
        setCancellationReason('');
        setInputError(false);
    };

    const handleRequestCancel = (order: Order, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmModal({
            isOpen: true,
            orderId: order.id,
            currentStatus: order.status,
            nextStatus: 'CANCELADO'
        });
        setCancellationReason('');
        setInputError(false);
    };

    const confirmMove = () => {
        if (!confirmModal) return;
        
        if (confirmModal.nextStatus === 'CANCELADO') {
            if (!cancellationReason.trim()) {
                setInputError(true);
                return;
            }
        }
        
        setOrders(prev => prev.map(o => o.id === confirmModal.orderId ? { ...o, status: confirmModal.nextStatus } : o));
        console.log(`[AUDIT] Order ${confirmModal.orderId} moved from ${confirmModal.currentStatus} to ${confirmModal.nextStatus} by User. Reason: ${cancellationReason || 'N/A'}`);
        
        setConfirmModal(null);
        setCancellationReason('');
        setInputError(false);
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        setDraggedOrderId(orderId);
        e.dataTransfer.effectAllowed = "move";
        // Optionally set a custom drag image here if needed, default is semi-transparent element
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetStatus: string) => {
        e.preventDefault();
        
        if (!draggedOrderId) return;

        const order = orders.find(o => o.id === draggedOrderId);
        if (!order) {
            setDraggedOrderId(null);
            return;
        }

        // Only confirm if the status is actually different
        if (order.status !== targetStatus) {
            setConfirmModal({
                isOpen: true,
                orderId: order.id,
                currentStatus: order.status,
                nextStatus: targetStatus
            });
            setCancellationReason('');
            setInputError(false);
        }
        
        setDraggedOrderId(null);
    };

    return (
        <div className="space-y-6">
            {/* Custom Header for Branded Experience */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    {logo ? (
                        <img src={logo} alt="Store Logo" className="w-12 h-12 rounded-xl object-contain border border-gray-200 bg-white p-1" />
                    ) : (
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                           <ImageIcon size={20} />
                        </div>
                    )}
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Gerenciamento de Pedidos</h2>
                        <p className="text-sm text-gray-500 font-medium">Fluxo de produção em tempo real</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: themeColor }}></span>
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loja Aberta</span>
                </div>
            </div>

            {/* Details Modal */}
            <Modal
                isOpen={!!detailsOrder}
                onClose={() => setDetailsOrder(null)}
                title={`Detalhes do Pedido ${detailsOrder?.id}`}
            >
                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Status Atual</p>
                            <Badge variant="neutral">{detailsOrder ? statusLabels[detailsOrder.status] : ''}</Badge>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Tempo Corrido</p>
                             <div className="flex items-center gap-1 text-gray-900 font-bold">
                                 <Clock size={14} /> {detailsOrder?.timeElapsed}
                             </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-3">Cliente</h4>
                        <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                            <Avatar fallback={detailsOrder?.customerName[0] || 'C'} size="md" />
                            <div>
                                <p className="font-bold text-gray-900">{detailsOrder?.customerName}</p>
                                <p className="text-xs text-gray-500">Cliente Recorrente • 5 pedidos</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-3">Itens do Pedido</h4>
                        <div className="space-y-2">
                            {detailsOrder?.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-orange-50 text-orange-600 rounded flex items-center justify-center text-xs font-bold">1x</div>
                                        <span className="text-sm font-medium text-gray-700">{item.replace(/^\dx\s/, '')}</span>
                                    </div>
                                    <span className="text-xs font-bold text-gray-900">R$ --,--</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment & Totals */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                             <span className="text-xs font-bold text-gray-500">Método de Pagamento</span>
                             <div className="flex items-center gap-1 text-xs font-bold text-gray-800">
                                 <CreditCard size={12}/> {detailsOrder?.paymentMethod}
                             </div>
                        </div>
                        <div className="flex justify-between items-center mt-4 p-4 bg-gray-900 text-white rounded-xl shadow-lg shadow-gray-200">
                            <span className="font-bold text-sm uppercase tracking-wide">Total Geral</span>
                            <span className="font-black text-xl">R$ {detailsOrder?.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </Modal>
            
            {/* Chat Modal - UPDATED FOR TRIPLE CONTEXT */}
            <Modal
                isOpen={!!chatOrder}
                onClose={() => setChatOrder(null)}
                title={chatOrder?.status === 'EM_ENTREGA' ? "Conexão Tripla" : `Chat do Pedido ${chatOrder?.id}`}
            >
                {chatOrder?.status === 'EM_ENTREGA' ? (
                    <div className="flex flex-col gap-4">
                        {/* Header for Triple Chat */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    <Avatar fallback={chatOrder?.customerName[0]} size="sm" />
                                    <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white z-20">
                                        <Bike size={14} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Chat da Entrega</p>
                                    <p className="text-[10px] text-gray-500 font-medium">Você • {chatOrder?.customerName.split(' ')[0]} • Entregador</p>
                                </div>
                            </div>
                            <Badge variant="neutral" className="bg-white">Grupo</Badge>
                        </div>

                        {/* Messages for Triple Chat */}
                        <div className="space-y-3 h-64 overflow-y-auto custom-scrollbar p-1">
                            <div className="flex justify-start">
                                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-none text-sm max-w-[85%]">
                                    <p className="text-[10px] font-bold text-gray-500 mb-1">{chatOrder?.customerName}</p>
                                    Onde vocês estão?
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-blue-100 text-blue-900 p-3 rounded-2xl rounded-bl-none text-sm max-w-[85%]">
                                    <p className="text-[10px] font-bold text-blue-600 mb-1 flex items-center gap-1"><Bike size={10}/> Entregador</p>
                                    Acabei de pegar o pedido. Chego em 10 min!
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <div style={{ backgroundColor: themeColor }} className="text-white p-3 rounded-2xl rounded-br-none text-sm max-w-[85%]">
                                    Perfeito! O lacre está reforçado. Bom trabalho a todos!
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Standard 1-on-1 Chat */}
                        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <Avatar fallback={chatOrder?.customerName[0] || 'C'} size="sm" />
                            <div>
                                <p className="text-sm font-bold text-gray-900">{chatOrder?.customerName}</p>
                                <p className="text-xs text-gray-500">Cliente</p>
                            </div>
                        </div>
                        <div className="space-y-3 mb-4 h-64 overflow-y-auto custom-scrollbar p-1">
                            <div className="flex justify-start"><div className="bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-none text-sm max-w-[85%]">Olá, alguma previsão?</div></div>
                            <div className="flex justify-end"><div style={{ backgroundColor: themeColor }} className="text-white p-3 rounded-2xl rounded-br-none text-sm max-w-[85%]">Olá! Já estamos finalizando a preparação. Sai em 5 min!</div></div>
                        </div>
                    </>
                )}
                
                <div className="flex gap-2 mt-4">
                    <Input placeholder="Digite uma mensagem..." className="flex-1" />
                    <Button icon={<Send size={16}/>} className="w-12 px-0" style={{ backgroundColor: themeColor, borderColor: themeColor }}></Button>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <Modal 
                isOpen={!!confirmModal} 
                onClose={() => setConfirmModal(null)} 
                title={confirmModal?.nextStatus === 'CANCELADO' ? "Cancelar Pedido" : "Confirmar Movimentação"}
                footer={
                    <div className="flex gap-3 justify-end w-full">
                        <Button variant="ghost" onClick={() => setConfirmModal(null)}>Voltar</Button>
                        <Button 
                            variant={confirmModal?.nextStatus === 'CANCELADO' ? 'danger' : 'primary'} 
                            onClick={confirmMove}
                            style={confirmModal?.nextStatus !== 'CANCELADO' ? { backgroundColor: themeColor, borderColor: themeColor } : {}}
                        >
                            {confirmModal?.nextStatus === 'CANCELADO' ? 'Confirmar Cancelamento' : 'Sim, Avançar'}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-4">
                    <div className={`flex items-center gap-3 p-4 border rounded-xl ${confirmModal?.nextStatus === 'CANCELADO' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-gray-50 border-gray-100 text-gray-800'}`}>
                        <AlertTriangle className="shrink-0" />
                        <p className="text-sm font-medium">
                            {confirmModal?.nextStatus === 'CANCELADO' 
                                ? 'Atenção: Esta ação é irreversível e o cliente será notificado imediatamente.' 
                                : 'Atenção: Esta ação notificará o cliente e não poderá ser desfeita automaticamente.'}
                        </p>
                    </div>
                    
                    <div className="py-4 flex items-center justify-between px-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-center">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Status Atual</p>
                             <Badge variant="neutral">{confirmModal ? statusLabels[confirmModal.currentStatus] : ''}</Badge>
                        </div>
                        <ArrowRight className="text-gray-300" />
                        <div className="text-center">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Novo Status</p>
                             <Badge variant={confirmModal?.nextStatus === 'CANCELADO' ? 'danger' : 'success'}>{confirmModal ? statusLabels[confirmModal.nextStatus] : ''}</Badge>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 text-center">
                        Tem certeza que deseja {confirmModal?.nextStatus === 'CANCELADO' ? 'cancelar' : 'mover'} o pedido <span className="font-bold text-gray-900">{confirmModal?.orderId}</span>?
                    </p>

                    {confirmModal?.nextStatus === 'CANCELADO' && (
                        <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-sm font-bold text-gray-700">Motivo do Cancelamento <span className="text-red-500">*</span></label>
                            <textarea 
                                autoFocus
                                value={cancellationReason}
                                onChange={(e) => {
                                    setCancellationReason(e.target.value);
                                    if(e.target.value.trim()) setInputError(false);
                                }}
                                className={`w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none transition-all ${inputError ? 'border-red-500 focus:ring-red-200 bg-red-50' : 'border-gray-300 focus:ring-carbo-primary/20 focus:border-carbo-primary'}`}
                                placeholder="Descreva o motivo para o cliente..."
                                rows={3}
                            />
                            {inputError && (
                                <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                                    <XCircle size={12}/> O motivo é obrigatório para cancelar.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

            {/* KANBAN BOARD CONTAINER - Removed fixed height and overflow hidden to allow page scroll */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                {columns.map(col => {
                    const colOrders = orders.filter(o => o.status === col);
                    return (
                        <div 
                            key={col} 
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, col)}
                            className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-4 border border-gray-100 relative transition-colors hover:bg-gray-100/50"
                            style={{ borderTop: `4px solid ${themeColor}` }} // Applying theme accent
                        >
                            <div className="flex justify-between items-center px-1 sticky top-0 bg-gray-50 z-10 py-2 pointer-events-none">
                                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">{statusLabels[col]}</h4>
                                <Badge variant="neutral" style={{ color: themeColor, borderColor: `${themeColor}40`, backgroundColor: `${themeColor}10` }}>{colOrders.length}</Badge>
                            </div>
                            
                            {colOrders.length === 0 && (
                                <div className="flex-1 flex flex-col items-center justify-center opacity-30 min-h-[100px] pointer-events-none">
                                    <Box size={32} className="mb-2"/>
                                    <p className="text-xs font-bold">Vazio</p>
                                </div>
                            )}

                            {colOrders.map(order => (
                                <div 
                                    key={order.id} 
                                    draggable 
                                    onDragStart={(e) => handleDragStart(e, order.id)}
                                    className="cursor-grab active:cursor-grabbing"
                                >
                                    <Card className="p-4 space-y-3 hover:border-gray-300 transition-all group relative">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-black text-gray-900">{order.id}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">{order.timeElapsed}</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{order.customerName}</p>
                                        <div className="flex flex-wrap gap-1">
                                            {order.items.map((item, i) => <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{item}</span>)}
                                        </div>
                                        <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                                            <span className="text-xs font-black" style={{ color: themeColor }}>R$ {order.total.toFixed(2)}</span>
                                            <div className="flex gap-2">
                                                <div className={`w-2 h-2 rounded-full self-center ${order.type === 'DELIVERY' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                            </div>
                                        </div>
                                        
                                        {/* Action Overlay Button */}
                                        <div className="pt-3 mt-1 flex gap-2">
                                            <button 
                                                onClick={() => handleRequestMove(order)}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 text-white rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                style={{ backgroundColor: themeColor }}
                                            >
                                                {order.status === 'EM_ENTREGA' ? (
                                                    <>Concluir <CheckCircle2 size={14} /></>
                                                ) : (
                                                    <>Avançar <ArrowRight size={14} /></>
                                                )}
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setDetailsOrder(order); }}
                                                className="w-8 flex items-center justify-center py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-purple-50 hover:text-purple-500"
                                                title="Ver Detalhes"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setChatOrder(order); }}
                                                className="w-8 flex items-center justify-center py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:text-blue-500"
                                                title={order.status === 'EM_ENTREGA' ? "Chat em Grupo (Entrega)" : "Chat do Pedido"}
                                            >
                                                {order.status === 'EM_ENTREGA' ? <Users size={14} /> : <MessageCircle size={14} />}
                                            </button>
                                            <button 
                                                onClick={(e) => handleRequestCancel(order, e)}
                                                className="w-8 flex items-center justify-center py-2 bg-gray-100 text-gray-400 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                                                title="Cancelar Pedido"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- MODULE 3: INVENTORY ---
export const VendorInventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Produtos');
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionTitle title="Estoque" subtitle="Gerencie seus produtos e insumos" />
        <Button icon={<Plus size={18}/>}>Novo Produto</Button>
      </div>
      <Tabs tabs={['Produtos', 'Movimentações']} activeTab={activeTab} onChange={setActiveTab} />
      
      {activeTab === 'Produtos' ? (
         <div className="grid grid-cols-1 gap-4">
            {PRODUCTS.map(p => (
               <Card key={p.id} className="flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                     <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400"><Package /></div>
                     <div>
                        <h4 className="font-bold text-gray-900">{p.name}</h4>
                        <p className="text-xs text-gray-500">{p.category} • R$ {p.price.toFixed(2)}</p>
                     </div>
                  </div>
                  <div className="text-right">
                      <p className={`font-bold ${p.stock <= p.minStock ? 'text-red-500' : 'text-green-600'}`}>{p.stock} un</p>
                      <Badge variant={p.active ? 'success' : 'neutral'}>{p.active ? 'Ativo' : 'Inativo'}</Badge>
                  </div>
               </Card>
            ))}
         </div>
      ) : (
         <div className="space-y-2">
            {STOCK_MOVEMENTS.map(m => (
               <div key={m.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg">
                  <div className="flex gap-3 items-center">
                     <div className={`p-2 rounded-full ${m.type === 'ENTRY' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {m.type === 'ENTRY' ? <Plus size={14}/> : <ArrowRight size={14}/>}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-gray-900">{m.productName}</p>
                        <p className="text-xs text-gray-500">{m.reason}</p>
                     </div>
                  </div>
                  <span className="font-mono text-sm font-bold">{m.quantity > 0 ? '+' : ''}{m.quantity}</span>
               </div>
            ))}
         </div>
      )}
    </div>
  );
};

// --- MODULE 4: LOGISTICS / DELIVERY ---
export const VendorDelivery: React.FC = () => {
   return (
       <div className="space-y-6">
           <SectionTitle title="Logística e Entregas" subtitle="Gerencie sua área de cobertura e frotas" />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card>
                   <h4 className="font-bold text-gray-900 mb-2">Entregadores Ativos</h4>
                   <div className="text-4xl font-black text-carbo-primary">3</div>
                   <p className="text-xs text-gray-500 mt-1">2 Motos, 1 Bike</p>
               </Card>
               <Card>
                   <h4 className="font-bold text-gray-900 mb-2">Tempo Médio de Entrega</h4>
                   <div className="text-4xl font-black text-gray-900">35 min</div>
                   <p className="text-xs text-green-600 font-bold mt-1">-5 min vs semana passada</p>
               </Card>
               <Card>
                   <h4 className="font-bold text-gray-900 mb-2">Raio de Entrega</h4>
                   <div className="text-4xl font-black text-gray-900">5.0 km</div>
                   <Button variant="ghost" className="text-xs p-0 h-auto mt-2">Ajustar Raio</Button>
               </Card>
           </div>
       </div>
   )
}

// --- MODULE 5: COURIERS ---
export const VendorCouriers: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <SectionTitle title="Entregadores" subtitle="Gerencie sua equipe de entrega" />
                <Button icon={<Plus size={18}/>}>Adicionar Entregador</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {COURIERS.map(c => (
                    <Card key={c.id} className="relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-4">
                            <Avatar fallback={c.name[0]} size="lg"/>
                            <div>
                                <h4 className="font-bold text-gray-900">{c.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Star size={12} className="text-orange-400 fill-orange-400"/>
                                    {c.rating} • {c.deliveriesCount} entregas
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <Badge variant={c.status === 'ONLINE' ? 'success' : c.status === 'BUSY' ? 'warning' : 'neutral'}>
                                {c.status}
                            </Badge>
                            <div className="flex items-center gap-1 text-gray-600 font-bold">
                                {c.vehicle === 'MOTO' ? <Bike size={16}/> : <Truck size={16}/>}
                                {c.vehicle}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- MODULE 6: VEHICLES ---
export const VendorVehicles: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <SectionTitle title="Veículos da Loja" subtitle="Gerencie a frota própria" />
                <Button icon={<Plus size={18}/>}>Adicionar Veículo</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VEHICLES.map(v => (
                    <Card key={v.id} className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                {v.type === 'MOTO' ? <Bike size={24}/> : v.type === 'CARRO' ? <Truck size={24}/> : <Bike size={24}/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{v.model}</h4>
                                <p className="text-xs text-gray-500">{v.plate === '-' ? 'Sem Placa' : v.plate}</p>
                            </div>
                        </div>
                        <Badge variant={v.status === 'ATIVO' ? 'success' : 'warning'}>{v.status}</Badge>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- MODULE 7: FINANCE ---
export const VendorFinance: React.FC = () => {
    return (
        <div className="space-y-6">
            <SectionTitle title="Financeiro" subtitle="Acompanhe seus ganhos e repasses" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-green-500 text-white border-none">
                    <p className="text-xs font-bold uppercase opacity-80 mb-2">Vendas Hoje</p>
                    <h3 className="text-3xl font-black">R$ 1.250,00</h3>
                </Card>
                <Card>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">Ticket Médio</p>
                    <h3 className="text-3xl font-black text-gray-900">R$ 52,10</h3>
                </Card>
                <Card>
                    <p className="text-xs font-bold uppercase text-gray-500 mb-2">A Receber</p>
                    <h3 className="text-3xl font-black text-gray-900">R$ 4.580,00</h3>
                    <p className="text-xs text-gray-400 mt-1">Próximo repasse: 10/02</p>
                </Card>
            </div>
            
            <Card className="h-80">
                <h4 className="font-bold mb-4 text-sm uppercase text-gray-500">Histórico Semanal</h4>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                        <Bar dataKey="vendas" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
}

// --- MODULE 8: CHAT ---
export const VendorChat: React.FC = () => {
    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <SectionTitle title="Mensagens" subtitle="Converse com clientes e entregadores" />
            <div className="flex-1 flex gap-4 overflow-hidden border border-gray-200 rounded-2xl bg-white shadow-sm">
                <div className="w-80 border-r border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-50">
                        <Input placeholder="Buscar conversa..." className="bg-gray-50" />
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 hover:bg-gray-50 cursor-pointer flex gap-3 items-center border-b border-gray-50 last:border-0">
                                <Avatar fallback={`C${i}`} size="md"/>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between">
                                        <h4 className="font-bold text-gray-900 text-sm truncate">Cliente {i}</h4>
                                        <span className="text-[10px] text-gray-400">10:0{i}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">Olá, sobre o meu pedido...</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={32}/>
                    </div>
                    <p className="text-sm font-bold">Selecione uma conversa para iniciar</p>
                </div>
            </div>
        </div>
    );
}

// --- MODULE 9: REVIEWS ---
export const VendorReviews: React.FC = () => {
    return (
        <div className="space-y-6">
            <SectionTitle title="Avaliações" subtitle="Feedback dos seus clientes" />
            <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3].map(i => (
                    <Card key={i}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor"/>)}
                                </div>
                                <span className="font-bold text-gray-900 text-sm">Excelente!</span>
                            </div>
                            <span className="text-xs text-gray-400">Há 2 dias</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">O lanche estava muito bom e chegou quentinho. Recomendo!</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="font-bold">Cliente Anônimo</span> • Pedido #123{i}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- MODULE 10: COMPETITORS ---
export const VendorCompetitors: React.FC = () => {
    return (
        <div className="space-y-6">
            <SectionTitle title="Concorrência" subtitle="Monitore o mercado na sua região" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COMPETITORS.map(c => (
                    <Card key={c.id} className="relative overflow-hidden">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-gray-900 text-lg">{c.name}</h4>
                                <p className="text-xs text-gray-500">{c.distance} de distância</p>
                            </div>
                            <Badge variant="neutral">{c.rating} <Star size={10} className="inline ml-1 mb-0.5"/></Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Taxa de Entrega</span>
                                <span className="font-bold text-gray-900">R$ {c.deliveryFee.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Tempo Médio</span>
                                <span className="font-bold text-gray-900">{c.avgTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ponto Forte</span>
                                <span className="font-bold text-green-600">{c.strength}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- MODULE 11: NOTIFICATIONS ---
export const VendorNotifications: React.FC = () => {
    return (
        <div className="space-y-6">
            <SectionTitle title="Notificações" subtitle="Histórico de alertas do sistema" />
            <div className="space-y-3">
                {NOTIFICATIONS.map(n => (
                    <Card key={n.id} className={`flex items-start gap-4 ${n.read ? 'opacity-75' : 'border-l-4 border-l-carbo-primary'}`}>
                        <div className={`p-2 rounded-full mt-1 ${n.type === 'WARNING' ? 'bg-yellow-100 text-yellow-600' : n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Bell size={16}/>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h4 className="font-bold text-gray-900 text-sm">{n.title}</h4>
                                <span className="text-xs text-gray-400">{n.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

// --- MODULE 12: SETTINGS ---
export const VendorSettings: React.FC = () => {
    const { themeColor, saveTheme } = useStoreTheme();
    const [color, setColor] = useState(themeColor);
    
    return (
        <div className="space-y-6">
            <SectionTitle title="Configurações da Loja" subtitle="Personalize sua aparência e dados" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h4 className="font-bold mb-4 text-gray-900">Aparência</h4>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-gray-700">Cor do Tema</label>
                            <div className="flex gap-2 mt-2">
                                {['#FF7A00', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => { setColor(c); saveTheme(c, null); }}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-bold text-gray-700">Logo da Loja</label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-carbo-primary hover:text-carbo-primary transition-colors cursor-pointer">
                                <UploadCloud size={24} className="mb-2"/>
                                <span className="text-xs font-bold">Clique para enviar</span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <h4 className="font-bold mb-4 text-gray-900">Dados Gerais</h4>
                    <div className="space-y-4">
                        <Input label="Nome da Loja" defaultValue="Burger King - Centro" />
                        <Input label="Telefone" defaultValue="(11) 99999-9999" />
                        <div className="flex items-center gap-2 mt-4">
                            <input type="checkbox" id="auto_accept" className="rounded text-carbo-primary focus:ring-carbo-primary"/>
                            <label htmlFor="auto_accept" className="text-sm text-gray-700">Aceitar pedidos automaticamente</label>
                        </div>
                    </div>
                    <Button className="w-full mt-6">Salvar Alterações</Button>
                </Card>
            </div>
        </div>
    )
}