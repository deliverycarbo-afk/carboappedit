
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Badge, Button, Input, Tabs, Avatar, Modal } from '../components/UIComponents';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend
} from 'recharts';
import { 
  Clock, Package, Users, Plus, Star, 
  TrendingUp, QrCode, ChevronDown, MapPin, 
  Bike, MessageCircle, Info, Settings, Zap, Briefcase, Power, Check, X,
  AlertTriangle, CheckCircle2, XCircle, Send, Palette, Image as ImageIcon, UploadCloud,
  Loader2, Utensils, Bell, GripHorizontal, Eye, CreditCard, Heart, LayoutGrid, Hammer, Box,
  ChevronRight, Truck, Ruler, PencilRuler, ClipboardList, Wrench, Layers, Compass, Crown
} from 'lucide-react';
import { Order, Store, Product, Courier, Vehicle, StockMovement, Notification, MarketingCampaign, UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { carboSystem } from '../services/carboSystem';

const chartData = [
  { name: 'Seg', producao: 12 },
  { name: 'Ter', producao: 18 },
  { name: 'Qua', producao: 15 },
  { name: 'Qui', producao: 22 },
  { name: 'Sex', producao: 30 },
  { name: 'Sáb', producao: 25 },
  { name: 'Dom', producao: 10 },
];

export const VendorDashboard: React.FC = () => {
  const [isStoreOpen, setIsStoreOpen] = useState(true);

  // --- RENDERERS (PALETA PREMIUM) ---
  const renderDedication = () => (
      <div className="col-span-full">
        <div className="bg-[#3E2723] text-[#D7CCC8] border-2 border-[#C5A059]/30 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-[0_32px_64px_-16px_rgba(32,18,12,0.4)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C5A059] blur-[200px] opacity-[0.08] pointer-events-none" />
            <div className="absolute top-4 right-8 opacity-20"><Crown size={40} className="text-[#C5A059]" /></div>
            
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center shrink-0 border border-[#C5A059]/30 shadow-2xl backdrop-blur-md transition-all duration-700 group-hover:scale-105 group-hover:border-[#C5A059]/60">
                <PencilRuler size={48} className="text-[#C5A059]" />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-black mb-3 uppercase tracking-[0.5em] leading-none text-[#C5A059]">Special Edition</h3>
                <p className="text-[#D7CCC8]/90 text-lg font-medium italic leading-relaxed max-w-4xl">
                  “Este ambiente é projetado para quem constrói com precisão. A Creative transforma matéria bruta em luxo funcional através da tua responsabilidade e visão técnica.”
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-8 mt-8">
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] opacity-70">
                    <Compass size={18}/> Alta Engenharia
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#C5A059] opacity-70">
                    <Layers size={18}/> Acabamento Master
                  </div>
                </div>
            </div>
        </div>
      </div>
  );

  const renderMonitorWidget = () => (
      <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
               { label: 'Aguardando Corte', count: 4, icon: <ClipboardList size={28}/> },
               { label: 'Em Montagem Técnica', count: 7, icon: <Hammer size={28}/> },
               { label: 'Prontos para Expedição', count: 12, icon: <CheckCircle2 size={28}/> },
           ].map((stat, i) => (
               <div key={i} className="flex flex-col justify-between p-8 rounded-[2.5rem] bg-white border border-[#8D6E63]/10 transition-all hover:translate-y-[-8px] hover:shadow-[0_32px_64px_-16px_rgba(62,39,35,0.12)] h-[280px] group relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-bl-full pointer-events-none transition-transform duration-700 group-hover:scale-110" />
                   <div className="flex justify-between items-start relative z-10">
                       <div className="p-4 bg-[#3E2723]/5 rounded-[1.5rem] text-[#3E2723] shadow-inner group-hover:bg-[#3E2723] group-hover:text-[#C5A059] transition-all duration-700">{stat.icon}</div>
                       <div className="w-3 h-3 rounded-full bg-[#C5A059] opacity-20 group-hover:opacity-100 group-hover:shadow-[0_0_15px_#C5A059] transition-all" />
                   </div>
                   <div className="relative z-10">
                       <span className="text-7xl font-black tracking-tighter bg-gradient-to-br from-[#3E2723] to-[#8D6E63] bg-clip-text text-transparent leading-none">{stat.count}</span>
                       <p className="text-[11px] font-black uppercase tracking-[0.4em] mt-4 opacity-40 text-[#3E2723]">{stat.label}</p>
                   </div>
               </div>
           ))}
      </div>
  );

  const renderStatsWidget = (type: 'active' | 'prod' | 'done') => {
      const config = {
          active: { icon: <Ruler size={24}/>, label: 'Contratos Ativos', val: '11', border: 'border-l-[#C5A059]' },
          prod: { icon: <Hammer size={24}/>, label: 'Bancada Ativa', val: '7', border: 'border-l-[#3E2723]' },
          done: { icon: <CheckCircle2 size={24}/>, label: 'Projetos Entregues', val: '142', border: 'border-l-green-700' },
      }[type];

      return (
        <Card className={`flex items-center gap-6 border-l-[10px] h-full bg-white ${config.border} hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.06)] transition-all p-8 rounded-[2rem] group`}>
          <div className="p-4 rounded-[1.25rem] bg-[#3E2723]/5 text-[#3E2723] group-hover:scale-110 group-hover:text-[#C5A059] transition-all shadow-inner">{config.icon}</div>
          <div>
            <p className="text-[11px] text-[#3E2723] opacity-60 uppercase font-black tracking-[0.3em] mb-1">{config.label}</p>
            <h3 className="text-4xl font-black text-[#3E2723] tracking-tighter leading-none group-hover:text-[#8D6E63] transition-colors">{config.val}</h3>
          </div>
        </Card>
      );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-[#3E2723]/10 pb-8 mb-12">
          <div>
            <SectionTitle title="Gui da Creative" subtitle="Workshop Executivo — Gestão de Alta Performance." className="mb-0 !text-[#3E2723] !text-3xl" />
            <div className="flex items-center gap-5 mt-4">
              <div className="flex -space-x-3">
                <div className="w-9 h-9 rounded-full bg-[#C5A059] border-2 border-white shadow-lg" />
                <div className="w-9 h-9 rounded-full bg-[#3E2723] border-2 border-white shadow-lg" />
              </div>
              <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 text-[#3E2723]">Módulo Premium Ativado</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-[#3E2723] border border-[#C5A059]/20 px-8 py-4 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(62,39,35,0.2)]">
             <div className={`w-3.5 h-3.5 rounded-full ${isStoreOpen ? 'bg-[#C5A059] animate-pulse shadow-[0_0_15px_#C5A059]' : 'bg-gray-500'}`} />
             <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Status: {isStoreOpen ? 'Produção Ativa' : 'Pausa Técnica'}</span>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderDedication()}
          {renderMonitorWidget()}
          <div className="col-span-1">{renderStatsWidget('active')}</div>
          <div className="col-span-1">{renderStatsWidget('prod')}</div>
          <div className="col-span-1">{renderStatsWidget('done')}</div>
          
          <div className="col-span-full">
            <Card className="h-[450px] flex flex-col bg-white border-[#3E2723]/5 shadow-[0_32px_64px_-16px_rgba(62,39,35,0.05)] p-12 rounded-[3.5rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-[#C5A059]"><Compass size={300}/></div>
                <div className="flex justify-between items-center mb-12 relative z-10">
                    <div>
                      <h3 className="font-black text-[#3E2723] text-2xl uppercase tracking-[0.4em]">Curva de Excelência</h3>
                      <p className="text-[12px] text-[#C5A059] font-black uppercase mt-3 tracking-[0.3em]">Nível Técnico Creative: 98.8%</p>
                    </div>
                    <Badge variant="neutral" className="bg-[#3E2723] text-[#C5A059] border-none px-8 py-4 font-black uppercase tracking-[0.3em] text-[11px] rounded-full shadow-2xl">Bancada Premium</Badge>
                </div>
                <div className="flex-1 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C5A059" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="4 4" stroke="#3E2723" className="opacity-[0.05]" vertical={false} />
                            <XAxis dataKey="name" stroke="#3E2723" className="opacity-30" tick={{fontSize: 11, fontWeight: 900}} axisLine={false} tickLine={false} dy={15} />
                            <YAxis stroke="#3E2723" className="opacity-30" tick={{fontSize: 11, fontWeight: 900}} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#3E2723', borderRadius: '32px', border: '1px solid #C5A05930', color: '#FDFBF9', padding: '20px', fontWeight: 900, boxShadow: '0 24px 48px -12px rgba(0,0,0,0.3)' }} />
                            <Area type="monotone" dataKey="producao" name="Projetos" stroke="#C5A059" strokeWidth={6} fillOpacity={1} fill="url(#colorPremium)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>
          </div>
      </div>
    </div>
  );
};

export const VendorKanban: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const columns = ['A_FAZER', 'EM_PRODUCAO', 'FINALIZADO'];
    const labels: Record<string, string> = { 'A_FAZER': 'Corte & Usinagem', 'EM_PRODUCAO': 'Montagem & Acabamento', 'FINALIZADO': 'Expedição Final' };

    useEffect(() => {
        const update = () => {
            const all = carboSystem.getOrders(UserRole.VENDOR);
            setProjects(all.map(o => ({
                id: o.id,
                client: o.customerName,
                status: o.status === 'PREPARANDO' ? 'EM_PRODUCAO' : o.status === 'FINALIZADO' ? 'FINALIZADO' : 'A_FAZER',
                items: o.items.map(i => i.productName)
            })));
        };
        update();
        return carboSystem.subscribe(update);
    }, []);

    const handleMove = (id: string, next: string) => {
        const statusMap: any = { 'A_FAZER': 'NOVO', 'EM_PRODUCAO': 'PREPARANDO', 'FINALIZADO': 'FINALIZADO' };
        carboSystem.updateOrderStatus(id, statusMap[next], 'Gui da Creative', UserRole.VENDOR);
    };

    return (
        <div className="space-y-8 animate-in fade-in pb-16">
            <SectionTitle title="Módulo de Bancada" subtitle="Fluxo de produção sob medida — Creative." className="!text-[#3E2723] !text-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {columns.map(col => (
                    <div key={col} className="bg-[#3E2723]/5 rounded-[3rem] p-8 flex flex-col gap-6 border border-[#C5A059]/15 min-h-[600px] shadow-inner backdrop-blur-md">
                        <div className="flex justify-between items-center px-4 mb-1">
                            <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#3E2723] opacity-60">{labels[col]}</h4>
                            <Badge variant="neutral" className="bg-[#3E2723] text-[#C5A059] border-none font-black px-4 py-1.5 rounded-lg text-[10px]">{projects.filter(p => p.status === col).length}</Badge>
                        </div>
                        {projects.filter(p => p.status === col).map(p => (
                            <Card key={p.id} className="bg-white p-6 space-y-4 border-[#C5A059]/10 hover:scale-[1.03] hover:border-[#C5A059]/40 transition-all cursor-pointer shadow-xl group">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-[#C5A059] tracking-[0.2em] uppercase">CONTRATO #{p.id}</span>
                                    <ChevronRight size={16} className="text-[#3E2723] opacity-30 group-hover:translate-x-1.5 transition-transform" />
                                </div>
                                <p className="font-black text-[#3E2723] text-lg tracking-tighter leading-tight">{p.client}</p>
                                <div className="flex flex-wrap gap-2">
                                  {p.items.map((item: string, idx: number) => (
                                    <span key={idx} className="text-[9px] font-black uppercase tracking-widest bg-[#3E2723]/5 text-[#3E2723] px-3 py-1.5 rounded-lg border border-[#3E2723]/5">{item}</span>
                                  ))}
                                </div>
                                <div className="pt-6 border-t border-[#3E2723]/5">
                                    {col !== 'FINALIZADO' && (
                                        <Button size="sm" className="w-full h-11 text-[11px] font-black uppercase tracking-[0.2em] bg-[#3E2723] text-[#C5A059] hover:brightness-125 rounded-xl shadow-md border border-[#C5A059]/20" onClick={() => handleMove(p.id, columns[columns.indexOf(col) + 1])}>Avançar Bancada</Button>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const VendorInventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', category: 'MDF', stock: '' });

  useEffect(() => {
      const update = () => setProducts(carboSystem.getProducts('1'));
      update();
      return carboSystem.subscribe(update);
  }, []);

  const handleCreate = () => {
      if(!newItem.name) return;
      carboSystem.addProduct({ storeId: '1', name: newItem.name, price: 0, category: newItem.category, stock: parseInt(newItem.stock) || 0, minStock: 5, active: true });
      setIsModalOpen(false);
      setNewItem({ name: '', category: 'MDF', stock: '' });
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-16">
      <div className="flex justify-between items-center">
        <SectionTitle title="Gestão de Matéria-Prima" subtitle="Estoque técnico e insumos — Creative." className="!text-[#3E2723] !text-2xl" />
        <Button icon={<Plus size={20}/>} onClick={() => setIsModalOpen(true)} className="bg-[#3E2723] text-[#C5A059] border-[#C5A059]/30 h-13 rounded-[1.5rem] font-black uppercase tracking-widest px-8 shadow-2xl text-xs hover:brightness-125">Adicionar Material</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(p => (
              <Card key={p.id} className="bg-white border border-[#C5A059]/10 flex justify-between items-center group hover:scale-[1.02] transition-all p-6 shadow-xl rounded-[2.5rem] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex gap-6 items-center">
                     <div className="w-16 h-16 bg-[#3E2723]/5 rounded-[1.5rem] flex items-center justify-center text-[#3E2723] opacity-30 group-hover:opacity-100 group-hover:text-[#C5A059] transition-all shadow-inner">
                         <Wrench size={32}/>
                     </div>
                     <div>
                        <h4 className="font-black text-[#3E2723] text-xl tracking-tighter">{p.name}</h4>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge variant="neutral" className="bg-[#3E2723]/5 text-[#3E2723] border-none text-[9px] font-black px-3 py-1.5 uppercase tracking-widest rounded-lg">{p.category}</Badge>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                      <p className={`text-3xl font-black tracking-tighter ${p.stock <= p.minStock ? 'text-red-700' : 'text-[#3E2723]'}`}>{p.stock} <span className="text-[12px] opacity-40 font-bold uppercase ml-0.5">UN</span></p>
                      <Badge variant="neutral" className="bg-[#3E2723] text-[#C5A059] border-none text-[8px] mt-3 font-black tracking-[0.2em] px-3 py-1.5 rounded-md">ESTOQUE ATIVO</Badge>
                  </div>
              </Card>
          ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Insumo Premium" footer={<Button className="w-full h-15 bg-[#3E2723] text-[#C5A059] font-black uppercase tracking-[0.3em] rounded-[1.5rem] text-xs shadow-2xl border border-[#C5A059]/20 hover:brightness-125" onClick={handleCreate}>Cadastrar Material</Button>}>
          <div className="space-y-8 py-2">
              <Input label="Descrição do Material" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="bg-black/5 border-[#3E2723]/20 text-[#3E2723] h-14 rounded-[1.25rem] text-base font-bold" />
              <div className="grid grid-cols-2 gap-8">
                  <div>
                      <label className="text-[11px] font-black text-[#3E2723] uppercase tracking-[0.2em] mb-3 block opacity-60">Categoria</label>
                      <select className="w-full h-14 px-5 bg-black/5 border border-[#3E2723]/20 rounded-[1.25rem] text-[#3E2723] text-sm font-black outline-none focus:ring-4 focus:ring-[#C5A059]/20" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>
                          <option>MDF Premium</option><option>Ferragens Luxo</option><option>Acabamento Fino</option><option>Vidraria</option>
                      </select>
                  </div>
                  <Input label="Qtd em Bancada" type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} className="bg-black/5 border-[#3E2723]/20 text-[#3E2723] h-14 rounded-[1.25rem] text-base font-bold" />
              </div>
          </div>
      </Modal>
    </div>
  );
};

export const VendorDelivery: React.FC = () => <div className="space-y-8 animate-in fade-in"><SectionTitle title="Cronograma de Montagem" subtitle="Logística técnica e instalação premium." className="!text-[#3E2723] !text-2xl" /><Card className="bg-[#3E2723] border-[#C5A059]/20 p-20 text-center rounded-[4rem] shadow-2xl relative overflow-hidden"><div className="absolute top-0 right-0 w-64 h-64 bg-[#C5A059] blur-[100px] opacity-[0.05]" /><div className="w-32 h-32 bg-white/5 rounded-[3rem] flex items-center justify-center mx-auto mb-8 text-[#C5A059] shadow-inner border border-[#C5A059]/20"><Truck size={72}/></div><h3 className="font-black text-3xl text-white tracking-[0.2em] uppercase">Rotas de Instalação</h3><p className="text-lg text-[#D7CCC8] mt-4 opacity-80 max-w-xl mx-auto leading-relaxed">Agenda técnica exclusiva para montagem e entrega de mobiliário sob medida.</p><Button className="mt-10 bg-[#C5A059] text-[#3E2723] h-15 rounded-[1.5rem] font-black uppercase tracking-[0.4em] px-12 shadow-2xl text-xs hover:brightness-110">Ver Calendário</Button></Card></div>;
export const VendorCouriers: React.FC = () => <div className="space-y-8 animate-in fade-in"><SectionTitle title="Equipes Master" subtitle="Técnicos e instaladores Creative." className="!text-[#3E2723] !text-2xl" /><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><Card className="bg-white border border-[#C5A059]/20 flex justify-between items-center p-8 rounded-[3rem] shadow-xl group"><div className="flex items-center gap-8"><Avatar fallback={<Wrench size={32}/>} className="bg-[#3E2723]/5 text-[#C5A059] w-20 h-20 rounded-[2rem] border-2 border-[#C5A059]/20" /><div><h4 className="font-black text-[#3E2723] text-2xl tracking-tighter">João Marceneiro</h4><div className="flex items-center gap-3 mt-2"><Badge variant="success" className="bg-[#C5A059] text-[#3E2723] border-none font-black text-[9px] px-3 py-1.5 uppercase tracking-widest rounded-md">Ativo</Badge><span className="text-[11px] font-black text-[#3E2723] opacity-40 uppercase tracking-[0.2em]">Especialista Gold</span></div></div></div><Button variant="ghost" className="text-[#C5A059] hover:brightness-125 transition-all"><Settings size={28}/></Button></Card></div></div>;
export const VendorVehicles: React.FC = () => <div className="space-y-8 animate-in fade-in"><SectionTitle title="Frota Técnica" className="!text-[#3E2723] !text-2xl" /><Card className="bg-white border-l-[12px] border-l-[#C5A059] border-[#C5A059]/15 flex justify-between p-8 items-center rounded-[3rem] shadow-xl"><div className="flex items-center gap-8"><div className="p-6 bg-[#3E2723] rounded-[1.75rem] text-[#C5A059] shadow-2xl border border-[#C5A059]/20"><Truck size={40} /></div><div><span className="font-black text-[#3E2723] text-2xl tracking-tighter leading-none">Caminhão Creative 2024</span><p className="text-[11px] font-black text-[#3E2723] opacity-40 uppercase tracking-[0.4em] mt-3">Transporte de Carga Sensível</p></div></div><div className="text-right"><span className="text-[#C5A059] text-lg font-black bg-[#3E2723] px-6 py-3 rounded-[1.25rem] tracking-[0.3em] shadow-xl">ABC-1234</span></div></Card></div>;
export const VendorFinance: React.FC = () => <div className="space-y-8 animate-in fade-in"><SectionTitle title="Gestão de Valor" className="!text-[#3E2723] !text-2xl" /><div className="grid grid-cols-1 md:grid-cols-3 gap-8"><Card className="bg-[#3E2723] text-white border-2 border-[#C5A059]/30 shadow-2xl p-12 rounded-[4rem] transition-all hover:scale-[1.02] relative overflow-hidden"><div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059] opacity-50" /><p className="text-[11px] font-black uppercase opacity-50 mb-4 tracking-[0.5em] text-[#C5A059]">Contratos Entregues</p><h3 className="text-7xl font-black tracking-tighter leading-none text-white">142</h3><div className="mt-10 flex items-center gap-3 text-xs font-black text-[#C5A059] uppercase tracking-[0.3em]"><TrendingUp size={20}/> Eficiência Creative +12%</div></Card><Card className="bg-white border border-[#C5A059]/20 p-12 rounded-[4rem] shadow-xl"><p className="text-[11px] font-black uppercase opacity-40 mb-4 tracking-[0.5em] text-[#3E2723]">Investimento Materiais</p><h3 className="text-6xl font-black text-[#3E2723] tracking-tighter leading-none">R$ 4.2k</h3></Card><Card className="bg-white border border-[#C5A059]/20 p-12 rounded-[4rem] shadow-xl"><p className="text-[11px] font-black uppercase opacity-40 mb-4 tracking-[0.5em] text-[#3E2723]">Prazo Médio</p><h3 className="text-6xl font-black text-[#3E2723] tracking-tighter leading-none">12 <span className="text-2xl text-[#C5A059] font-black uppercase">dias</span></h3></Card></div></div>;
export const VendorChat: React.FC = () => <div className="space-y-6"><SectionTitle title="Contatos Exclusivos" className="!text-[#3E2723]" /><Card className="bg-white border border-[#C5A059]/20 p-32 text-center text-[#C5A059] rounded-[4rem] opacity-40 italic font-black text-xl uppercase tracking-[0.6em]">Nenhuma nova conexão técnica.</Card></div>;
export const VendorReviews: React.FC = () => <div className="space-y-6"><SectionTitle title="Satisfação Cliente" className="!text-[#3E2723]" /><Card className="bg-white border border-[#C5A059]/20 p-32 text-center text-[#C5A059] rounded-[4rem] opacity-40 italic font-black text-xl uppercase tracking-[0.6em]">Qualidade 5 Estrelas.</Card></div>;
export const VendorNotifications: React.FC = () => <div className="space-y-6"><SectionTitle title="Alertas de Produção" className="!text-[#3E2723]" /><Card className="bg-white border border-[#C5A059]/20 p-32 text-center text-[#C5A059] rounded-[4rem] opacity-40 italic font-black text-xl uppercase tracking-[0.6em]">Monitoramento Seguro.</Card></div>;
export const VendorCompetitors: React.FC = () => <div className="space-y-6"><SectionTitle title="Tendências de Design" className="!text-[#3E2723]" /><Card className="bg-white border border-[#C5A059]/20 p-32 text-center text-[#C5A059] rounded-[4rem] opacity-40 italic font-black text-xl uppercase tracking-[0.6em]">Creative Market Intel.</Card></div>;
export const VendorMarketing: React.FC = () => <div className="space-y-6"><SectionTitle title="Vitrine de Acabamentos" className="!text-[#3E2723]" /><Card className="bg-white border border-[#C5A059]/20 p-32 text-center text-[#C5A059] rounded-[4rem] opacity-40 italic font-black text-xl uppercase tracking-[0.6em]">Catálogo Especial.</Card></div>;
export const VendorSettings: React.FC = () => <div className="space-y-10 animate-in fade-in"><SectionTitle title="Identidade Premium" className="!text-[#3E2723] !text-2xl" /><Card className="bg-white border border-[#C5A059]/20 max-w-3xl rounded-[4rem] p-12 shadow-2xl"><h4 className="font-black mb-10 text-[#3E2723] flex items-center gap-5 uppercase text-xs tracking-[0.4em]"><Palette size={28} className="text-[#C5A059]"/> Estilização do Workshop</h4><div className="space-y-10"><div className="flex items-center justify-between p-8 bg-[#3E2723]/5 rounded-[2.5rem] border border-[#C5A059]/10"><div className="flex items-center gap-8"><div className="w-20 h-20 rounded-[1.75rem] bg-[#3E2723] shadow-2xl ring-4 ring-[#C5A059]/40 flex items-center justify-center"><Crown size={40} className="text-[#C5A059]"/></div><div><span className="text-2xl font-black text-[#3E2723] tracking-tighter">Creative Luxury Skin</span><p className="text-[11px] font-black text-[#C5A059] uppercase tracking-[0.4em] mt-3">Edição: Gui da Creative</p></div></div><Badge variant="success" className="bg-[#C5A059] text-[#3E2723] border-none font-black px-8 py-2.5 tracking-[0.3em] rounded-lg text-[10px]">PREMIUM</Badge></div><div className="grid grid-cols-2 gap-6"><Button className="h-16 bg-[#3E2723] text-[#C5A059] font-black border-[#C5A059]/30 rounded-[1.75rem] uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:brightness-125">Atualizar Perfil</Button><Button variant="ghost" className="h-16 bg-white text-[#3E2723] border border-[#3E2723]/20 rounded-[1.75rem] font-black uppercase tracking-[0.4em] text-[10px] hover:bg-[#3E2723] hover:text-white transition-all">Sincronizar Bancada</Button></div></div></Card></div>;
