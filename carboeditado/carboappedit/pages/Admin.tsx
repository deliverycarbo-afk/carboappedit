

import React, { useState, useEffect, useMemo } from 'react';
import { SectionTitle, Card, Badge, Button, Tabs, Modal, Avatar, Input } from '../components/UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart, CartesianGrid, LineChart, Line } from 'recharts';
import { 
  Users, CreditCard, Activity, TrendingUp, Search, MoreVertical, Trash2, Edit, 
  ShieldCheck, FileText, Check, X, MessageSquare, Lock, Eye, EyeOff, Save, 
  ShoppingBag, Truck, DollarSign, Settings, AlertTriangle, FileSearch, Terminal,
  Ban, CheckCircle2, UserCheck, Smartphone, Clock, AlertCircle, RefreshCw,
  Navigation, Globe, Power, UploadCloud, Megaphone, Image as ImageIcon, Zap, Radio, Bell, Send,
  AlertOctagon, Package, XCircle, ClipboardList, Filter, Briefcase, FileBadge, History, Unlock, Key, FileWarning, Store,
  Banknote, Wallet, ArrowUpRight, ArrowDownLeft, ShieldAlert, Paperclip, MessageCircle, Plus, Star, Flag, ThumbsDown, ThumbsUp, Wrench,
  QrCode, Layers, Download, Calendar, Sliders, Smartphone as MobileIcon, Volume2, HardDrive, MapPin, KeyRound, RadioReceiver, Bike, Car,
  LayoutTemplate, Handshake, Ticket as TicketIcon, CloudRain, Sun, CloudLightning
} from 'lucide-react';
import { Ticket, UserRole, AuditLog, Order, MarketingCampaign, Partner, PageContent, Notification, Occurrence, FraudAlert, City } from '../types';
import { carboSystem } from '../services/carboSystem';

// --- VISUAL CONSTANTS ---
const COLORS = ['#FF7A00', '#1F2937', '#10B981', '#EF4444'];
const PIE_DATA = [ { name: 'Vendedores', value: 400 }, { name: 'Entregadores', value: 300 }, { name: 'Clientes', value: 2000 } ];

const chartData = [
    { name: 'Seg', vendas: 1240 },
    { name: 'Ter', vendas: 1800 },
    { name: 'Qua', vendas: 2400 },
    { name: 'Qui', vendas: 1600 },
    { name: 'Sex', vendas: 3200 },
    { name: 'Sáb', vendas: 3800 },
    { name: 'Dom', vendas: 2900 },
];

// --- 1. DASHBOARD ---
export const AdminDashboard: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<any>({ totalUsers: 0, totalVolume: 0, totalOrders: 0 });

  useEffect(() => {
    const update = () => {
        setLogs(carboSystem.getAuditLogs());
        setStats(carboSystem.getPlatformStats());
    };
    update();
    return carboSystem.subscribe(update);
  }, []);

  return (
  <div className="space-y-8 animate-in fade-in">
    <div className="flex justify-between items-center">
        <SectionTitle title="Painel Administrativo" subtitle="Visão macro da plataforma CarboApp" />
        <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Sistema Operacional</span>
        </div>
    </div>

    {/* Top KPI Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[
        { label: 'Usuários Totais', val: stats.totalUsers.toString(), icon: <Users />, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Volume Transacionado', val: `R$ ${stats.totalVolume.toFixed(2)}`, icon: <CreditCard />, color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Pedidos Hoje', val: stats.totalOrders.toString(), icon: <TrendingUp />, color: 'text-carbo-primary', bg: 'bg-orange-50' },
        { label: 'Alertas Críticos', val: logs.filter(l => l.severity === 'CRITICAL').length.toString(), icon: <Activity />, color: 'text-red-600', bg: 'bg-red-50' },
      ].map((s, i) => (
        <Card key={i} className="flex items-center gap-4 hover:shadow-hover transition-all">
          <div className={`p-4 rounded-xl ${s.bg} ${s.color}`}>{s.icon}</div>
          <div><p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{s.label}</p><h3 className="text-2xl font-black text-gray-900">{s.val}</h3></div>
        </Card>
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Audit Log / Terminal */}
      <Card className="lg:col-span-2 h-96 flex flex-col">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide flex items-center gap-2">
                <Terminal size={16} className="text-gray-400"/> Logs do Sistema
            </h3>
            <Badge variant="neutral">Ao vivo</Badge>
        </div>
        <div className="flex-1 bg-gray-900 rounded-xl p-4 overflow-y-auto custom-scrollbar font-mono text-xs space-y-2">
            {logs.length === 0 && <div className="text-gray-600">Nenhuma atividade registrada ainda.</div>}
            {logs.map(log => (
                <div key={log.id} className="flex gap-3 text-gray-400 border-b border-gray-800 pb-1 mb-1 last:border-0">
                    <span className="text-gray-600">[{log.timestamp}]</span>
                    <span className={`font-bold ${log.severity === 'CRITICAL' ? 'text-red-500' : log.severity === 'WARNING' ? 'text-yellow-500' : 'text-blue-500'}`}>{log.action}</span>
                    <span className="text-gray-300">{log.details}</span>
                    <span className="opacity-50 ml-auto">{log.actor}</span>
                </div>
            ))}
            <div className="animate-pulse text-green-500 font-bold mt-2">_</div>
        </div>
      </Card>
      
      {/* Distribution Chart */}
      <Card className="h-96 flex flex-col items-center justify-center relative">
         <h4 className="absolute top-6 left-6 font-bold text-gray-900 text-sm">Distribuição de Usuários</h4>
         <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie data={PIE_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
         </ResponsiveContainer>
         <div className="flex gap-4 justify-center mt-4">
            {PIE_DATA.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-xs text-gray-500">{entry.name}</span>
                </div>
            ))}
         </div>
      </Card>
    </div>
  </div>
);
}

// --- 2. SECURITY (NEW) ---
export const AdminSecurity: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Ocorrências');
    const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
    const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
    
    useEffect(() => {
        const update = () => {
            setOccurrences(carboSystem.getOccurrences());
            setFraudAlerts(carboSystem.getFraudAlerts());
        };
        update();
        return carboSystem.subscribe(update);
    }, []);

    const handleResolve = (id: string, action: 'CANCEL_ORDER' | 'RESUME_ORDER') => {
        if (confirm(`Confirmar ação: ${action === 'CANCEL_ORDER' ? 'Cancelar Pedido' : 'Liberar Pedido'}?`)) {
            carboSystem.resolveOccurrence(id, action, 'AdminMaster', 'Resolução manual pelo painel.');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Segurança e Controle" subtitle="Gestão de riscos, fraudes e ocorrências operacionais" />
            <Tabs tabs={['Ocorrências', 'Alertas de Fraude']} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === 'Ocorrências' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {occurrences.length === 0 && <div className="col-span-full p-8 text-center text-gray-500 border border-dashed rounded-xl">Nenhuma ocorrência registrada.</div>}
                        {occurrences.map(occ => (
                            <Card key={occ.id} className={`border-l-4 ${occ.status === 'OPEN' ? 'border-l-red-500' : 'border-l-green-500'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge variant={occ.status === 'OPEN' ? 'danger' : 'success'}>{occ.status === 'OPEN' ? 'EM ABERTO' : 'RESOLVIDO'}</Badge>
                                            <span className="text-xs text-gray-400 font-mono">{occ.createdAtStr}</span>
                                        </div>
                                        <h4 className="font-bold text-gray-900">Pedido #{occ.orderId}</h4>
                                    </div>
                                    {occ.status === 'OPEN' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="success" onClick={() => handleResolve(occ.id, 'RESUME_ORDER')}>Liberar</Button>
                                            <Button size="sm" variant="danger" onClick={() => handleResolve(occ.id, 'CANCEL_ORDER')}>Cancelar</Button>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Motivo do Bloqueio</p>
                                    <p className="text-sm text-gray-800">{occ.reason}</p>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                    <span>Reportado por: <strong>{occ.reporterId}</strong> ({occ.reporterRole})</span>
                                    {occ.resolution && <span>Resolução: {occ.resolution}</span>}
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'Alertas de Fraude' && (
                <div className="space-y-4">
                    {fraudAlerts.length === 0 && <div className="p-8 text-center text-gray-500 border border-dashed rounded-xl">Sem alertas de fraude detectados.</div>}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                                <tr>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Tipo</th>
                                    <th className="px-6 py-4">Alvo</th>
                                    <th className="px-6 py-4">Detalhes</th>
                                    <th className="px-6 py-4">Severidade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {fraudAlerts.map(alert => (
                                    <tr key={alert.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-gray-500">{alert.createdAtStr}</td>
                                        <td className="px-6 py-4 font-bold text-gray-700">{alert.type}</td>
                                        <td className="px-6 py-4">{alert.targetId} <span className="text-gray-400 text-xs">({alert.targetRole})</span></td>
                                        <td className="px-6 py-4 text-gray-600">{alert.details}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={alert.severity === 'CRITICAL' ? 'danger' : 'warning'}>{alert.severity}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// ... (Other admin sections remain the same until AdminNotifications) ...

// --- 13. NOTIFICATIONS ---
export const AdminNotifications: React.FC = () => {
    const [title, setTitle] = useState('');
    const [msg, setMsg] = useState('');
    const [priority, setPriority] = useState<Notification['priority']>('MEDIUM');
    const [targetRole, setTargetRole] = useState<UserRole | 'ALL'>('ALL');
    const [scheduleTime, setScheduleTime] = useState('');
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const update = () => {
            // @ts-ignore - Accessing internal method for admin
            setNotifications(carboSystem.getAllNotificationsForAdmin());
        }
        update();
        return carboSystem.subscribe(update);
    }, []);

    const handleSend = () => {
        if(!title || !msg) return;
        
        let scheduledFor: number | undefined = undefined;
        if (scheduleTime) {
            scheduledFor = new Date(scheduleTime).getTime();
        }

        carboSystem.createNotification({
            title, 
            message: msg, 
            type: 'INFO', 
            priority: priority,
            target: { role: targetRole },
            scheduledFor,
            origin: 'MANUAL'
        });

        alert(scheduledFor ? 'Notificação agendada com sucesso!' : 'Notificação enviada!');
        setTitle('');
        setMsg('');
        setScheduleTime('');
    };

    const handleCancel = (id: string) => {
        carboSystem.cancelNotification(id);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Gestão de Notificações" subtitle="Envie alertas push e agende comunicados" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-900">Nova Notificação</h4>
                        <div className="flex gap-2">
                            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => setPriority(p as any)}
                                    className={`w-3 h-3 rounded-full ${priority === p ? 'ring-2 ring-offset-1 ring-gray-400' : 'opacity-30'} ${p === 'CRITICAL' ? 'bg-red-500' : p === 'HIGH' ? 'bg-orange-500' : p === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                    title={`Prioridade: ${p}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Input label="Título" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Manutenção Programada" />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                            <textarea 
                                className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:ring-carbo-primary/20 focus:border-carbo-primary"
                                rows={4}
                                value={msg}
                                onChange={e => setMsg(e.target.value)}
                                placeholder="Digite o conteúdo da notificação..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destinatário</label>
                                <select 
                                    className="w-full p-2.5 bg-white border rounded-lg text-sm"
                                    value={targetRole}
                                    onChange={e => setTargetRole(e.target.value as any)}
                                >
                                    <option value="ALL">Todos os Usuários</option>
                                    <option value="VENDOR">Lojas</option>
                                    <option value="DELIVERY">Entregadores</option>
                                    <option value="CLIENT">Clientes</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Agendar (Opcional)</label>
                                <input 
                                    type="datetime-local" 
                                    className="w-full p-2.5 bg-white border rounded-lg text-sm text-gray-600"
                                    value={scheduleTime}
                                    onChange={e => setScheduleTime(e.target.value)}
                                />
                            </div>
                        </div>
                        <Button className="w-full mt-2" onClick={handleSend} icon={<Send size={16}/>}>
                            {scheduleTime ? 'Agendar Disparo' : 'Enviar Agora'}
                        </Button>
                    </div>
                </Card>
                
                <Card className="flex flex-col h-[500px]">
                    <h4 className="font-bold text-gray-900 mb-4">Histórico e Agendamentos</h4>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                        {notifications.length === 0 && <div className="text-center text-gray-400 py-10">Nenhuma notificação encontrada.</div>}
                        {notifications.map(n => (
                            <div key={n.id} className={`p-3 border rounded-lg flex flex-col gap-2 ${n.status === 'CANCELLED' ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 line-clamp-1">{n.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={n.type === 'ERROR' ? 'danger' : n.type === 'WARNING' ? 'warning' : 'neutral'} className="text-[10px] px-1.5 py-0.5">{n.target?.role || 'ALL'}</Badge>
                                            <span className="text-xs text-gray-500">{n.scheduledFor ? `Agendado: ${new Date(n.scheduledFor).toLocaleString()}` : n.time}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <Badge variant={n.status === 'SENT' ? 'success' : n.status === 'PENDING' ? 'warning' : 'neutral'}>
                                            {n.status === 'SENT' ? 'Enviado' : n.status === 'PENDING' ? 'Agendado' : 'Cancelado'}
                                        </Badge>
                                        {n.priority === 'CRITICAL' && <span className="text-[9px] font-bold text-red-600 uppercase">Crítico</span>}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-600 line-clamp-2">{n.message}</p>
                                {n.status === 'PENDING' && (
                                    <button 
                                        onClick={() => handleCancel(n.id)}
                                        className="text-xs font-bold text-red-500 hover:underline self-end"
                                    >
                                        Cancelar Envio
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

// ... (Rest of Admin file remains unchanged) ...
export const AdminUsers: React.FC = () => {
    const [filter, setFilter] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [riskFilter, setRiskFilter] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    
    // Detail Modal State
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userDetails, setUserDetails] = useState<any>(null);

    useEffect(() => {
        setUsers(carboSystem.getAllUsers());
        return carboSystem.subscribe(() => setUsers(carboSystem.getAllUsers()));
    }, []);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const matchesRole = filter === 'Todos' || 
                                (filter === 'Clientes' && u.role === UserRole.CLIENT) ||
                                (filter === 'Vendedores' && u.role === UserRole.VENDOR) ||
                                (filter === 'Entregadores' && u.role === UserRole.DELIVERY);
            
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = u.name.toLowerCase().includes(searchLower) || 
                                  u.email?.toLowerCase().includes(searchLower) || 
                                  u.cpf.includes(searchLower) ||
                                  u.id.toLowerCase().includes(searchLower);
            
            const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
            const matchesRisk = !riskFilter || (u.riskScore && u.riskScore > 50);

            return matchesRole && matchesSearch && matchesStatus && matchesRisk;
        });
    }, [users, filter, searchTerm, statusFilter, riskFilter]);

    const toggleBlock = (user: any) => {
        const newStatus = user.status === 'SUSPENDED' ? 'APPROVED' : 'SUSPENDED';
        if(confirm(`Tem certeza que deseja ${newStatus === 'SUSPENDED' ? 'bloquear' : 'desbloquear'} este usuário?`)) {
            carboSystem.updateUserStatus(user.id, newStatus);
        }
    };

    const openUserDetails = (user: any) => {
        setSelectedUser(user);
        if (user.role === UserRole.VENDOR) {
            setUserDetails(carboSystem.getStoreStats(user.storeId || '1'));
        } else if (user.role === UserRole.DELIVERY) {
            setUserDetails(carboSystem.getCourierDetails(user.id));
        } else {
            setUserDetails(null); // Simple client
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Gestão de Usuários" subtitle="Base completa de clientes, vendedores e entregadores." />
            
            <Tabs tabs={['Todos', 'Clientes', 'Vendedores', 'Entregadores']} activeTab={filter} onChange={setFilter} />
            
            {/* Advanced Filters Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1">
                    <Input placeholder="Buscar por nome, email, CPF ou ID" icon={<Search size={18}/>} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border-gray-200" />
                </div>
                <div className="flex gap-4">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-carbo-primary/20 focus:border-carbo-primary text-sm font-medium"
                    >
                        <option value="ALL">Todas Status</option>
                        <option value="APPROVED">Ativos</option>
                        <option value="PENDING">Pendentes</option>
                        <option value="SUSPENDED">Bloqueados</option>
                    </select>
                    
                    <button 
                        onClick={() => setRiskFilter(!riskFilter)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-bold transition-all ${riskFilter ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                        <AlertTriangle size={16} /> Risco Alto
                    </button>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase font-bold text-xs">
                        <tr>
                            <th className="px-6 py-4">Usuário</th>
                            <th className="px-6 py-4">Função</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Score Risco</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <Avatar fallback={user.name[0]} />
                                    <div>
                                        <p className="font-bold text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.email || 'Sem email'} • CPF: {user.cpf}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant="neutral">{user.role}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.status === 'APPROVED' ? 'success' : user.status === 'PENDING' ? 'warning' : 'danger'}>
                                        {user.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    {user.riskScore > 0 ? (
                                        <span className={`font-bold ${user.riskScore > 50 ? 'text-red-500' : 'text-yellow-600'}`}>{user.riskScore}%</span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => openUserDetails(user)}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                            title="Ver Detalhes"
                                        >
                                            <Eye size={16}/>
                                        </button>
                                        <button 
                                            onClick={() => toggleBlock(user)}
                                            className={`p-2 rounded-lg transition-colors ${user.status === 'SUSPENDED' ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                                            title={user.status === 'SUSPENDED' ? 'Desbloquear' : 'Bloquear'}
                                        >
                                            {user.status === 'SUSPENDED' ? <Unlock size={16}/> : <Ban size={16}/>}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredUsers.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum usuário encontrado com os filtros atuais.</div>}
            </div>

            {/* Deep Dive User Detail Modal */}
            <Modal
                isOpen={!!selectedUser}
                onClose={() => { setSelectedUser(null); setUserDetails(null); }}
                title={`Detalhes: ${selectedUser?.name}`}
            >
                <div className="space-y-6">
                    {/* Common Info */}
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <Avatar fallback={selectedUser?.name[0]} size="lg"/>
                        <div>
                            <h4 className="font-bold text-gray-900">{selectedUser?.name}</h4>
                            <p className="text-xs text-gray-500">{selectedUser?.email}</p>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="neutral">{selectedUser?.role}</Badge>
                                <Badge variant={selectedUser?.status === 'APPROVED' ? 'success' : 'warning'}>{selectedUser?.status}</Badge>
                            </div>
                        </div>
                    </div>

                    {/* VENDOR SPECIFIC DATA */}
                    {selectedUser?.role === UserRole.VENDOR && userDetails && (
                        <div className="space-y-4 animate-in fade-in">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2"><Store size={18}/> Métricas da Loja</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-white border-gray-200">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Total Vendas</p>
                                    <p className="text-xl font-black text-green-600">R$ {userDetails.totalSales.toFixed(2)}</p>
                                </Card>
                                <Card className="bg-white border-gray-200">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Pedidos</p>
                                    <p className="text-xl font-black text-gray-900">{userDetails.orderCount}</p>
                                </Card>
                            </div>
                            
                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mt-6"><Package size={18}/> Produtos Cadastrados</h4>
                            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2">Produto</th>
                                            <th className="px-4 py-2">Preço</th>
                                            <th className="px-4 py-2">Estoque</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {userDetails.products.map((p: any) => (
                                            <tr key={p.id}>
                                                <td className="px-4 py-2">{p.name}</td>
                                                <td className="px-4 py-2">R$ {p.price.toFixed(2)}</td>
                                                <td className="px-4 py-2 font-bold">{p.stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* COURIER SPECIFIC DATA */}
                    {selectedUser?.role === UserRole.DELIVERY && userDetails && (
                        <div className="space-y-4 animate-in fade-in">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2"><Truck size={18}/> Performance</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-white border-gray-200">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Entregas Totais</p>
                                    <p className="text-xl font-black text-blue-600">{userDetails.deliveries}</p>
                                </Card>
                                <Card className="bg-white border-gray-200">
                                    <p className="text-xs text-gray-500 font-bold uppercase">Avaliação</p>
                                    <p className="text-xl font-black text-yellow-500 flex items-center gap-1">4.9 <Star size={14} fill="currentColor"/></p>
                                </Card>
                            </div>

                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mt-6"><FileText size={18}/> Frota e Documentos</h4>
                            <div className="space-y-2">
                                {userDetails.vehicles.map((v: any) => (
                                    <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {v.type === 'MOTO' ? <Bike size={16}/> : <Car size={16}/>}
                                            <span className="text-sm font-bold">{v.model} ({v.plate})</span>
                                        </div>
                                        <Badge variant={v.status === 'ATIVO' ? 'success' : 'warning'}>{v.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

// --- 3. APPROVALS ---
export const AdminApprovals: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<any[]>([]);

    useEffect(() => {
        const update = () => {
            const all = carboSystem.getAllUsers();
            setPendingUsers(all.filter(u => u.status === 'PENDING'));
        };
        update();
        return carboSystem.subscribe(update);
    }, []);

    const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
        if (action === 'APPROVE') {
            carboSystem.updateUserStatus(id, 'APPROVED');
        } else {
            if(confirm('Rejeitar e remover este cadastro?')) {
                carboSystem.deleteUser(id);
            }
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Triagem de Cadastros" subtitle="Aprovação de documentos e perfis" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {pendingUsers.length === 0 && (
                    <div className="col-span-full p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                        <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4"/>
                        <h3 className="text-lg font-bold text-gray-900">Tudo limpo!</h3>
                        <p className="text-gray-500">Não há cadastros pendentes de análise no momento.</p>
                    </div>
                )}
                {pendingUsers.map(user => (
                    <Card key={user.id} className="border-l-4 border-l-yellow-400">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                                <Avatar fallback={user.name[0]} size="lg"/>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{user.name}</h4>
                                    <p className="text-sm text-gray-500">{user.role === 'VENDOR' ? 'Vendedor' : 'Entregador'} • CPF {user.cpf}</p>
                                </div>
                            </div>
                            <Badge variant="warning">Em Análise</Badge>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                            <h5 className="font-bold text-xs uppercase text-gray-500 mb-3 flex items-center gap-2"><FileText size={14}/> Documentação Enviada</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold cursor-pointer hover:bg-gray-300 transition-colors">Frente RG/CNH</div>
                                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs font-bold cursor-pointer hover:bg-gray-300 transition-colors">Selfie c/ Doc</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="danger" className="flex-1" onClick={() => handleAction(user.id, 'REJECT')}>Rejeitar</Button>
                            <Button variant="success" className="flex-1" onClick={() => handleAction(user.id, 'APPROVE')}>Aprovar Acesso</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- 4. ORDER MONITOR ---
export const AdminOrderMonitor: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [minAmount, setMinAmount] = useState('');

    useEffect(() => {
        setOrders(carboSystem.getOrders(UserRole.ADMIN));
        return carboSystem.subscribe(() => setOrders(carboSystem.getOrders(UserRole.ADMIN)));
    }, []);

    const filteredOrders = useMemo(() => {
        return orders.filter(o => {
            const matchesSearch = o.id.includes(searchTerm) || o.customerName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
            const matchesAmount = !minAmount || o.total >= parseFloat(minAmount);
            return matchesSearch && matchesStatus && matchesAmount;
        });
    }, [orders, searchTerm, statusFilter, minAmount]);

    const handleCancel = (id: string) => {
        if(confirm('ATENÇÃO ADMIN: Cancelar este pedido forçadamente? Isso afetará o estoque.')) {
            carboSystem.updateOrderStatus(id, 'CANCELADO', 'ADMINISTRADOR', UserRole.ADMIN);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Monitor Global de Pedidos" subtitle="Acompanhamento em tempo real de todas as transações" />
            
            {/* Advanced Order Filter */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1">
                    <Input placeholder="Buscar por ID do pedido ou cliente" icon={<Search size={18}/>} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-4">
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-carbo-primary/20 focus:border-carbo-primary text-sm font-medium"
                    >
                        <option value="ALL">Todos Status</option>
                        <option value="NOVO">Novos</option>
                        <option value="PREPARANDO">Preparando</option>
                        <option value="EM_ENTREGA">Em Entrega</option>
                        <option value="FINALIZADO">Finalizados</option>
                        <option value="CANCELADO">Cancelados</option>
                    </select>
                    <Input 
                        placeholder="Min R$" 
                        type="number" 
                        value={minAmount} 
                        onChange={e => setMinAmount(e.target.value)} 
                        className="w-32"
                    />
                </div>
            </div>

            <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-900 text-white font-bold text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Loja / Cliente</th>
                            <th className="px-6 py-4">Valor</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Tempo</th>
                            <th className="px-6 py-4 text-right">Intervenção</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-gray-700">#{order.id}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-900">Loja Demo</span>
                                        <span className="text-xs text-gray-500">{order.customerName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-green-600">R$ {order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={order.status === 'CANCELADO' ? 'danger' : order.status === 'FINALIZADO' ? 'success' : 'neutral'}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-500 font-mono">{order.timeElapsed}</td>
                                <td className="px-6 py-4 text-right">
                                    {order.status !== 'CANCELADO' && order.status !== 'FINALIZADO' && (
                                        <button 
                                            onClick={() => handleCancel(order.id)}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors font-bold text-xs uppercase tracking-wider border border-transparent hover:border-red-200"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 5. FINANCE ---
export const AdminFinance: React.FC = () => {
    const [stats, setStats] = useState<any>({ totalVolume: 0, platformFees: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [filterType, setFilterType] = useState('ALL');
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const update = () => {
            setStats(carboSystem.getPlatformStats());
            setTransactions(carboSystem.getTransactions());
        };
        update();
        return carboSystem.subscribe(update);
    }, []);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => filterType === 'ALL' || t.type === filterType);
    }, [transactions, filterType]);

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title="Financeiro da Plataforma" subtitle="Controle de receitas, taxas e repasses" />
                <button onClick={() => setIsVisible(!isVisible)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    {isVisible ? <Eye size={20}/> : <EyeOff size={20}/>}
                </button>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900 text-white border-none shadow-xl">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/10 rounded-xl"><DollarSign size={24}/></div>
                        <span className="text-xs font-bold bg-green-500 text-white px-2 py-1 rounded">Receita Bruta</span>
                    </div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Volume Total Transacionado</p>
                    <h3 className="text-3xl font-black">{isVisible ? `R$ ${stats.totalVolume.toFixed(2)}` : 'R$ •••••'}</h3>
                </Card>
                <Card className="bg-carbo-primary text-white border-none shadow-lg shadow-orange-500/30">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-white/20 rounded-xl"><Briefcase size={24}/></div>
                        <span className="text-xs font-bold bg-white/20 text-white px-2 py-1 rounded">Net Revenue</span>
                    </div>
                    <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-1">Taxas da Plataforma (15%)</p>
                    <h3 className="text-3xl font-black">{isVisible ? `R$ ${stats.platformFees.toFixed(2)}` : 'R$ •••••'}</h3>
                </Card>
                <Card>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-gray-100 rounded-xl text-gray-600"><Clock size={24}/></div>
                    </div>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Repasses Pendentes</p>
                    <h3 className="text-3xl font-black text-gray-900">{isVisible ? `R$ ${(stats.totalVolume - stats.platformFees).toFixed(2)}` : 'R$ •••••'}</h3>
                </Card>
            </div>

            {/* Transaction List (New Enterprise Feature) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-lg">Transações Recentes</h3>
                    <div className="flex gap-2">
                        <select 
                            value={filterType} 
                            onChange={(e) => setFilterType(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 rounded-lg py-2 px-3 text-sm font-bold"
                        >
                            <option value="ALL">Todas</option>
                            <option value="ENTRADA">Entradas</option>
                            <option value="SAIDA">Saídas</option>
                        </select>
                        <Button variant="outline" className="h-9 text-xs px-3" icon={<Download size={14}/>}>Exportar</Button>
                    </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Categoria</th>
                                <th className="px-6 py-4">Detalhes</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredTransactions.map(t => (
                                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{t.date}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={t.type === 'ENTRADA' ? 'success' : 'danger'}>{t.type}</Badge>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">{t.category}</td>
                                    <td className="px-6 py-4 text-gray-500">{t.details}</td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'ENTRADA' ? 'text-green-600' : 'text-gray-900'}`}>
                                        {isVisible ? `${t.type === 'ENTRADA' ? '+' : '-'} R$ ${t.amount.toFixed(2)}` : '••••'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Card className="h-80 p-6">
                <h4 className="font-bold text-gray-900 mb-6">Fluxo de Receita (Semanal)</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6"/>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="vendas" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

// --- 6. SETTINGS ---
export const AdminPlatformSettings: React.FC = () => {
    const [maintenance, setMaintenance] = useState(carboSystem.getMaintenanceMode());
    const [weather, setWeather] = useState<'SUNNY' | 'RAINY' | 'STORM'>(carboSystem.getWeather());
    const [cities, setCities] = useState<City[]>(carboSystem.getCities());
    
    // City Modal
    const [cityModal, setCityModal] = useState(false);
    const [newCity, setNewCity] = useState({ name: '', uf: '', neighborhoods: '' });

    useEffect(() => {
        return carboSystem.subscribe(() => {
            setMaintenance(carboSystem.getMaintenanceMode());
            setWeather(carboSystem.getWeather());
            setCities(carboSystem.getCities());
        });
    }, []);

    const toggleMaintenance = () => {
        if (!maintenance && !confirm("ATIVAR MODO MANUTENÇÃO? Todos os pedidos serão bloqueados!")) return;
        carboSystem.setMaintenanceMode(!maintenance, 'AdminMaster');
    };

    const handleWeather = (cond: 'SUNNY' | 'RAINY' | 'STORM') => {
        carboSystem.setWeather(cond, 'AdminMaster');
    };

    const handleAddCity = () => {
        if (!newCity.name || !newCity.uf) return;
        carboSystem.addCity({
            name: newCity.name,
            uf: newCity.uf,
            neighborhoods: newCity.neighborhoods.split(',').map(s => s.trim()),
            active: true
        });
        setCityModal(false);
        setNewCity({ name: '', uf: '', neighborhoods: '' });
    };

    return (
    <div className="space-y-6 animate-in fade-in">
        <SectionTitle title="Configurações Globais" subtitle="Parâmetros vitais do sistema" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <h4 className="font-bold text-gray-900 mb-6 flex items-center gap-2"><MapPin size={18}/> Gestão de Cidades</h4>
                <div className="space-y-4">
                    <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-xl">
                        {cities.map(c => (
                            <div key={c.id} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{c.name} - {c.uf}</p>
                                    <p className="text-xs text-gray-500">{c.neighborhoods.length} bairros</p>
                                </div>
                                <Button variant="ghost" size="sm" icon={<Trash2 size={14}/>} onClick={() => carboSystem.removeCity(c.id)}></Button>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" className="w-full" icon={<Plus size={16}/>} onClick={() => setCityModal(true)}>Adicionar Cidade</Button>
                </div>
            </Card>

            <Card className="space-y-6">
                <div>
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><CloudRain size={18}/> Eventos Climáticos</h4>
                    <p className="text-xs text-gray-500 mb-3">Define taxas dinâmicas de entrega baseadas no clima.</p>
                    <div className="flex gap-2">
                        {[
                            { id: 'SUNNY', label: 'Sol', icon: <Sun size={18}/>, color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
                            { id: 'RAINY', label: 'Chuva', icon: <CloudRain size={18}/>, color: 'bg-blue-50 text-blue-600 border-blue-200' },
                            { id: 'STORM', label: 'Tempestade', icon: <CloudLightning size={18}/>, color: 'bg-purple-50 text-purple-600 border-purple-200' },
                        ].map(w => (
                            <button
                                key={w.id}
                                onClick={() => handleWeather(w.id as any)}
                                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${weather === w.id ? w.color + ' ring-2 ring-offset-1' : 'border-gray-100 text-gray-400 hover:bg-gray-50'}`}
                            >
                                {w.icon}
                                <span className="text-xs font-bold">{w.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`p-4 border rounded-xl transition-colors ${maintenance ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <h5 className={`font-bold text-sm flex items-center gap-2 ${maintenance ? 'text-red-800' : 'text-green-800'}`}>
                            {maintenance ? <AlertOctagon size={18}/> : <CheckCircle2 size={18}/>}
                            Status do Sistema
                        </h5>
                        <div 
                            onClick={toggleMaintenance}
                            className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${maintenance ? 'bg-red-500' : 'bg-green-500'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-1 shadow-sm transition-transform ${maintenance ? 'left-7' : 'left-1'}`}/>
                        </div>
                    </div>
                    <p className={`text-xs ${maintenance ? 'text-red-600' : 'text-green-600'}`}>
                        {maintenance ? 'MODO MANUTENÇÃO ATIVO. Pedidos bloqueados.' : 'Sistema operacional e recebendo pedidos.'}
                    </p>
                </div>
            </Card>
        </div>

        <Modal isOpen={cityModal} onClose={() => setCityModal(false)} title="Nova Cidade">
            <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2"><Input label="Nome" value={newCity.name} onChange={e => setNewCity({...newCity, name: e.target.value})}/></div>
                    <Input label="UF" value={newCity.uf} onChange={e => setNewCity({...newCity, uf: e.target.value})}/>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Bairros (separados por vírgula)</label>
                    <textarea 
                        className="w-full p-3 border rounded-lg mt-1 text-sm" 
                        rows={3} 
                        value={newCity.neighborhoods} 
                        onChange={e => setNewCity({...newCity, neighborhoods: e.target.value})}
                        placeholder="Centro, Zona Sul, ..."
                    />
                </div>
                <Button className="w-full" onClick={handleAddCity}>Salvar</Button>
            </div>
        </Modal>
    </div>
    );
};

// --- 7. REPORTS ---
export const AdminReports: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [severityFilter, setSeverityFilter] = useState('ALL');

    useEffect(() => {
        setLogs(carboSystem.getAuditLogs());
    }, []);

    const filteredLogs = useMemo(() => {
        return logs.filter(l => {
            const matchesSearch = l.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  l.actor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSeverity = severityFilter === 'ALL' || l.severity === severityFilter;
            return matchesSearch && matchesSeverity;
        });
    }, [logs, searchTerm, severityFilter]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title="Relatórios e Auditoria" subtitle="Logs imutáveis de todas as ações no sistema" />
                <Button variant="outline" icon={<Download size={18}/>}>Exportar CSV</Button>
            </div>
            
            {/* Reports Filter Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1">
                    <Input placeholder="Buscar por ação, ator ou detalhes" icon={<Search size={18}/>} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div>
                    <select 
                        value={severityFilter} 
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-700 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-carbo-primary/20 focus:border-carbo-primary text-sm font-medium w-full md:w-48"
                    >
                        <option value="ALL">Todas Severidades</option>
                        <option value="INFO">Info</option>
                        <option value="WARNING">Warning</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 font-bold text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">Data/Hora</th>
                                <th className="px-6 py-4">Ator</th>
                                <th className="px-6 py-4">Ação</th>
                                <th className="px-6 py-4">Detalhes</th>
                                <th className="px-6 py-4">Severidade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono text-xs">
                            {filteredLogs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-3 text-gray-500">{log.timestamp}</td>
                                    <td className="px-6 py-3 font-bold text-gray-700">{log.actor} <span className="text-gray-400 font-normal">({log.role})</span></td>
                                    <td className="px-6 py-3 font-bold text-blue-600">{log.action}</td>
                                    <td className="px-6 py-3 text-gray-600 max-w-md truncate" title={log.details}>{log.details}</td>
                                    <td className="px-6 py-3">
                                        <Badge variant={log.severity === 'CRITICAL' ? 'danger' : log.severity === 'WARNING' ? 'warning' : 'neutral'}>
                                            {log.severity}
                                        </Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- 8. CHAT MONITOR ---
export const AdminChatMonitor: React.FC = () => {
    const [chats, setChats] = useState<any[]>([]);
    useEffect(() => {
        setChats(carboSystem.getChats());
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Auditoria de Chat" subtitle="Monitore a comunicação entre usuários" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chats.map(chat => (
                    <Card key={chat.id} className="hover:shadow-hover transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-3">
                            <Badge variant={chat.status === 'ACTIVE' ? 'success' : 'neutral'}>{chat.status === 'ACTIVE' ? 'Ativo' : 'Fechado'}</Badge>
                            <span className="text-xs text-gray-400">{chat.time} atrás</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex -space-x-2">
                                <Avatar fallback="C" size="sm" />
                                <Avatar fallback="L" size="sm" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Pedido #{chat.orderId}</p>
                                <p className="text-xs text-gray-500">{chat.participants.join(' & ')}</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <p className="text-xs text-gray-600 italic">"{chat.lastMessage}"</p>
                        </div>
                        <Button variant="ghost" className="w-full mt-4 text-xs font-bold" icon={<Eye size={14}/>}>Inspecionar Conversa</Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- 9. SUPPORT ---
export const AdminSupport: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [priorityFilter, setPriorityFilter] = useState('ALL');

    useEffect(() => {
        setTickets(carboSystem.getTickets());
    }, []);

    const filteredTickets = useMemo(() => {
        return tickets.filter(t => priorityFilter === 'ALL' || t.priority === priorityFilter);
    }, [tickets, priorityFilter]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Suporte e Ocorrências" subtitle="Gestão de chamados e problemas reportados" />
            
            <div className="flex justify-end mb-4">
                <select 
                    value={priorityFilter} 
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 rounded-lg py-2 px-3 text-sm font-bold"
                >
                    <option value="ALL">Todas Prioridades</option>
                    <option value="ALTA">Alta</option>
                    <option value="MEDIA">Média</option>
                    <option value="BAIXA">Baixa</option>
                </select>
            </div>

            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Assunto</th>
                            <th className="px-6 py-4">Prioridade</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Última Atualização</th>
                            <th className="px-6 py-4 text-right">Ação</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTickets.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-gray-500">#{t.id}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{t.subject}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={t.priority === 'ALTA' ? 'danger' : t.priority === 'MEDIA' ? 'warning' : 'neutral'}>
                                        {t.priority}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={t.status === 'ABERTO' ? 'success' : 'neutral'}>{t.status}</Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-500 text-xs">{t.lastUpdate}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:underline font-bold text-xs">Ver Ticket</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 10. PERMISSIONS ---
export const AdminPermissions: React.FC = () => {
    // Mock admin list, usually fetched from API
    const admins = [
        { id: '1', name: 'Ricardo Oliveira', role: 'Super Admin', access: ['ALL'] },
        { id: '2', name: 'Ana Suporte', role: 'Moderador', access: ['Support', 'Users'] },
    ];

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title="Permissões e Acesso" subtitle="Controle quem pode acessar o painel admin" />
                <Button icon={<Plus size={18}/>}>Novo Administrador</Button>
            </div>
            
            <div className="grid gap-4">
                {admins.map(admin => (
                    <Card key={admin.id} className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Avatar fallback={admin.name[0]} />
                            <div>
                                <h4 className="font-bold text-gray-900">{admin.name}</h4>
                                <p className="text-xs text-gray-500">{admin.role}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                                {admin.access.includes('ALL') ? (
                                    <Badge variant="danger">Acesso Total</Badge>
                                ) : (
                                    admin.access.map(a => <Badge key={a} variant="neutral">{a}</Badge>)
                                )}
                            </div>
                            <Button variant="ghost" icon={<Settings size={16}/>}>Editar</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- 11. REVIEWS ---
export const AdminReviews: React.FC = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [ratingFilter, setRatingFilter] = useState('ALL');

    useEffect(() => {
        setReviews(carboSystem.getReviews());
    }, []);

    const filteredReviews = useMemo(() => {
        return reviews.filter(r => ratingFilter === 'ALL' || r.rating === parseInt(ratingFilter));
    }, [reviews, ratingFilter]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Avaliações e Reputação" subtitle="Monitore o feedback do ecossistema" />
            
            <div className="flex justify-end mb-4">
                <select 
                    value={ratingFilter} 
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-700 rounded-lg py-2 px-3 text-sm font-bold"
                >
                    <option value="ALL">Todas Estrelas</option>
                    <option value="5">5 Estrelas</option>
                    <option value="4">4 Estrelas</option>
                    <option value="3">3 Estrelas</option>
                    <option value="2">2 Estrelas</option>
                    <option value="1">1 Estrela</option>
                </select>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredReviews.map(review => (
                    <Card key={review.id} className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Avatar fallback={review.author[0]} size="sm"/>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{review.author}</p>
                                    <p className="text-xs text-gray-500">Avaliou <span className="font-bold text-gray-700">{review.target}</span> ({review.type})</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                                    ))}
                                </div>
                                <span className="text-[10px] text-gray-400">{review.date}</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600">
                            "{review.comment}"
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" className="text-xs h-8">Ignorar</Button>
                            <Button variant="secondary" className="text-xs h-8 text-red-600 hover:text-red-700 border-red-100 hover:bg-red-50">Ocultar Avaliação</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- 12. TOKENS ---
export const AdminTokens: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        setOrders(carboSystem.getOrders(UserRole.ADMIN));
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <SectionTitle title="Tokens de Segurança" subtitle="Auditoria de códigos de entrega e coleta" />
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Pedido</th>
                            <th className="px-6 py-4">Token Coleta</th>
                            <th className="px-6 py-4">Token Entrega</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {orders.map(o => (
                            <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">#{o.id}</td>
                                <td className="px-6 py-4 font-mono text-blue-600 bg-blue-50 w-fit px-2 rounded">{o.collectionToken || '-'}</td>
                                <td className="px-6 py-4 font-mono text-green-600 bg-green-50 w-fit px-2 rounded">{o.deliveryToken || '-'}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={o.status === 'FINALIZADO' ? 'success' : 'neutral'}>
                                        {o.status === 'FINALIZADO' ? 'Validado' : 'Pendente'}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- 14. MARKETING (NEW) ---
export const AdminMarketing: React.FC = () => {
    const campaigns = carboSystem.getMarketingCampaigns();
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title="Marketing Global" subtitle="Gestão de campanhas e cupons sistêmicos" />
                <Button icon={<Plus size={18}/>}>Nova Campanha</Button>
            </div>
            <div className="grid gap-4">
                {campaigns.map(c => (
                    <Card key={c.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.type === 'CUPOM' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                {c.type === 'CUPOM' ? <TicketIcon size={24}/> : <ImageIcon size={24}/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{c.name}</h4>
                                <div className="flex gap-2 mt-1">
                                    {c.code && <span className="text-xs font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">{c.code}</span>}
                                    <span className="text-xs text-gray-500">{c.discountValue}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-8 items-center text-center">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Alcance</p>
                                <p className="font-bold text-gray-900">{c.reach}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Conversão</p>
                                <p className="font-bold text-green-600">{c.conversion}%</p>
                            </div>
                            <Badge variant={c.status === 'ATIVA' ? 'success' : 'neutral'}>{c.status}</Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- 15. PARTNERS (NEW) ---
export const AdminPartners: React.FC = () => {
    const partners = carboSystem.getPartners();
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title="Gestão de Sócios" subtitle="Quadro societário e investidores" />
                <Button icon={<Plus size={18}/>}>Novo Sócio</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map(p => (
                    <Card key={p.id}>
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar fallback={p.name[0]} size="lg"/>
                            <div>
                                <h4 className="font-bold text-gray-900">{p.name}</h4>
                                <p className="text-xs text-gray-500">{p.role}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                            <span className="text-sm font-bold text-gray-600">Participação</span>
                            <span className="text-xl font-black text-gray-900">{p.share}%</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>Desde {p.joinedDate}</span>
                            <Badge variant={p.status === 'ATIVO' ? 'success' : 'neutral'}>{p.status}</Badge>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- 16. CONTENT (NEW) ---
export const AdminContent: React.FC = () => {
    const pages = carboSystem.getPages();
    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <SectionTitle title="Gestão de Conteúdo (CMS)" subtitle="Páginas institucionais e termos" />
                <Button icon={<Plus size={18}/>}>Nova Página</Button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                        <tr>
                            <th className="px-6 py-4">Título</th>
                            <th className="px-6 py-4">URL Slug</th>
                            <th className="px-6 py-4">Última Edição</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {pages.map(p => (
                            <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">{p.title}</td>
                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{p.slug}</td>
                                <td className="px-6 py-4 text-gray-500">{p.lastEdited}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={p.status === 'PUBLICADO' ? 'success' : 'neutral'}>{p.status}</Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="sm" icon={<Edit size={14}/>}>Editar</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
