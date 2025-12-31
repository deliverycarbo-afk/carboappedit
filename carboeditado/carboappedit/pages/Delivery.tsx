

import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Badge, Button, Input, Modal, Tabs, Avatar } from '../components/UIComponents';
import { MapPin, Navigation, DollarSign, Shield, Clock, Calendar, ChevronRight, Truck, Car, Bike, Plus, CheckCircle2, Zap, Power, CloudRain, Box, ShieldCheck, PlayCircle, Map, Target, Trophy, AlertTriangle, MessageSquare, Briefcase, Star, ArrowUpRight, ArrowDownLeft, Smile, QrCode, Store, Lock, History, MessageCircle, Mail, Phone, Ticket, Settings, Send, Users, X } from 'lucide-react';
import { Vehicle, Order, UserRole, ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { carboSystem } from '../services/carboSystem';

// ID mockado do usuário logado (Entregador Demo)
const COURIER_ID = 'u3'; 
const COURIER_NAME = 'Entregador Demo';

export const DeliveryVehicles: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newVehicle, setNewVehicle] = useState({ type: 'MOTO', model: '', plate: '' });

    useEffect(() => {
        const update = () => setVehicles(carboSystem.getCourierVehicles(COURIER_ID));
        update();
        return carboSystem.subscribe(update);
    }, []);

    const handleAddVehicle = () => {
        if (!newVehicle.model || !newVehicle.plate) return alert('Preencha todos os campos.');
        carboSystem.addVehicle(COURIER_ID, newVehicle);
        setIsAddModalOpen(false);
        setNewVehicle({ type: 'MOTO', model: '', plate: '' });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <SectionTitle title="Meus Veículos" subtitle="Gerencie os veículos cadastrados para entrega" />
                <Button icon={<Plus size={18}/>} onClick={() => setIsAddModalOpen(true)}>Novo Veículo</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.length === 0 && <p className="col-span-full text-center text-gray-500 py-10">Nenhum veículo cadastrado.</p>}
                {vehicles.map(v => (
                    <Card key={v.id} className="flex justify-between items-center border-l-4 border-l-gray-900">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">
                                {v.type === 'MOTO' ? <Bike size={24}/> : v.type === 'CARRO' ? <Car size={24}/> : <Truck size={24}/>}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900">{v.model}</h4>
                                <p className="text-xs text-gray-500 font-mono">{v.plate !== '-' ? v.plate : 'Sem placa'}</p>
                            </div>
                        </div>
                        <Badge variant={v.status === 'ATIVO' ? 'success' : v.status === 'PENDENTE' ? 'warning' : 'neutral'}>{v.status}</Badge>
                    </Card>
                ))}
            </div>

            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Cadastrar Novo Veículo"
                footer={<Button className="w-full" onClick={handleAddVehicle}>Enviar para Aprovação</Button>}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Seu veículo passará por uma análise de segurança antes de ser liberado.</p>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                        <select 
                            className="w-full p-3 bg-white border border-gray-200 rounded-xl"
                            value={newVehicle.type}
                            onChange={e => setNewVehicle({...newVehicle, type: e.target.value})}
                        >
                            <option value="MOTO">Moto</option>
                            <option value="CARRO">Carro</option>
                            <option value="BIKE">Bicicleta</option>
                            <option value="CAMINHAO">Caminhão / Utilitário</option>
                        </select>
                    </div>
                    <Input label="Modelo" placeholder="Ex: Honda CG 160" value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
                    <Input label="Placa" placeholder="ABC-1234" value={newVehicle.plate} onChange={e => setNewVehicle({...newVehicle, plate: e.target.value})} />
                </div>
            </Modal>
        </div>
    );
};

export const DeliveryHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Financeiro');
  const [financials, setFinancials] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [gamification, setGamification] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  
  const [withdrawalModal, setWithdrawalModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  useEffect(() => {
      const update = () => {
          setFinancials(carboSystem.getCourierFinancials(COURIER_ID));
          setReviews(carboSystem.getCourierReviews(COURIER_ID));
          setGamification(carboSystem.getCourierGamification(COURIER_ID));
          setProfile(carboSystem.getCourierProfile(COURIER_ID));
      };
      update();
      return carboSystem.subscribe(update);
  }, []);

  const handleWithdraw = () => {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) return alert('Valor inválido');
      
      const res = carboSystem.requestWithdrawal(COURIER_ID, amount);
      if (res.success) {
          alert('Saque solicitado com sucesso! Um ticket foi criado para o financeiro.');
          setWithdrawalModal(false);
          setWithdrawAmount('');
      } else {
          alert(res.message);
      }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
         <SectionTitle title="Gestão do Entregador" subtitle="Financeiro, Reputação e Perfil" />
      </div>

      <Tabs tabs={['Financeiro', 'Avaliações', 'Perfil']} activeTab={activeTab} onChange={setActiveTab} />

      {/* --- TAB FINANCEIRO --- */}
      {activeTab === 'Financeiro' && (
          <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none shadow-lg shadow-green-500/30">
                  <p className="text-xs uppercase font-bold opacity-80 mb-2">Saldo Disponível</p>
                  <h3 className="text-4xl font-black mb-6">R$ {financials?.balance.toFixed(2) || '0.00'}</h3>
                  <Button onClick={() => setWithdrawalModal(true)} variant="ghost" className="bg-white/20 hover:bg-white/30 text-white border border-white/10 w-full">
                    <DollarSign size={16} className="mr-2"/> Solicitar Saque
                  </Button>
                </Card>
                <Card className="bg-white">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2">Pendente / Em Análise</p>
                  <h3 className="text-4xl font-black text-gray-900">R$ {financials?.pending.toFixed(2) || '0.00'}</h3>
                  <p className="text-xs text-orange-500 font-bold mt-2 flex items-center gap-1"><Clock size={12}/> Aguardando finalização de ciclos</p>
                </Card>
                <Card className="bg-white">
                  <p className="text-xs font-bold uppercase text-gray-500 mb-2">Bloqueado</p>
                  <h3 className="text-4xl font-black text-gray-400">R$ {financials?.blocked?.toFixed(2) || '0.00'}</h3>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Lock size={12}/> Retenção por ocorrências</p>
                </Card>
              </div>

              <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><History size={20}/> Extrato Detalhado</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                 {financials?.transactions.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">Nenhuma movimentação registrada.</div>
                 ) : (
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Descrição</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {financials?.transactions.map((t: any) => (
                                <tr key={t.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-gray-500">{t.date}</td>
                                    <td className="px-6 py-4 font-bold text-gray-700">{t.desc}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={t.status === 'AVAILABLE' || t.status === 'CONCLUIDO' ? 'success' : 'warning'}>{t.status}</Badge>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${t.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'IN' ? '+' : '-'} R$ {Math.abs(t.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 )}
              </div>
          </div>
      )}

      {/* --- TAB AVALIAÇÕES --- */}
      {activeTab === 'Avaliações' && (
          <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                  {reviews.length === 0 && <p className="text-center text-gray-500 py-10">Você ainda não possui avaliações.</p>}
                  {reviews.map(r => (
                      <Card key={r.id}>
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                  <div className="flex text-yellow-400">
                                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= r.rating ? "currentColor" : "none"} className={s <= r.rating ? "" : "text-gray-300"}/>)}
                                  </div>
                                  <span className="font-bold text-gray-900 text-sm">{r.rating >= 4 ? 'Excelente!' : r.rating >= 3 ? 'Bom' : 'Atenção'}</span>
                              </div>
                              <span className="text-xs text-gray-400">{r.date}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">"{r.comment}"</p>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="font-bold">{r.author}</span> • {r.type === 'STORE' ? 'Loja' : r.type === 'PLATFORM' ? 'Sistema' : 'Cliente'}
                              </div>
                              <Button variant="ghost" size="sm" className="text-xs h-8" icon={<MessageCircle size={14}/>}>Responder</Button>
                          </div>
                      </Card>
                  ))}
              </div>
          </div>
      )}

      {/* --- TAB PERFIL (GAMIFICATION) --- */}
      {activeTab === 'Perfil' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-6">
                  <Card className="text-center p-8">
                      <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full mb-4 overflow-hidden relative group cursor-pointer">
                          <Avatar fallback={profile?.name[0]} size="full" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-xs font-bold">Alterar</span>
                          </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{profile?.name}</h3>
                      <p className="text-sm text-gray-500">{profile?.email}</p>
                      <div className="flex justify-center gap-2 mt-4">
                          <Badge variant="neutral">{profile?.city || 'São Paulo'}</Badge>
                          <Badge variant="success">Online</Badge>
                      </div>
                  </Card>
                  
                  <Card>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><ShieldCheck size={18}/> Confiabilidade</h4>
                      <div className="space-y-4">
                          <div>
                             <div className="flex justify-between text-xs font-bold mb-1">
                                 <span>Score de Risco</span>
                                 <span className={profile?.riskScore > 20 ? 'text-red-500' : 'text-green-600'}>{profile?.riskScore}%</span>
                             </div>
                             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                 <div className={`h-full ${profile?.riskScore > 20 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${profile?.riskScore}%` }}></div>
                             </div>
                          </div>
                          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-lg border border-blue-100">
                              <p className="font-bold mb-1">Status da Conta: {profile?.status}</p>
                              <p>Sua conta está saudável. Continue assim!</p>
                          </div>
                      </div>
                  </Card>
              </div>

              <div className="md:col-span-2 space-y-6">
                  {/* XP Banner */}
                  <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                          <div>
                              <div className="flex items-center gap-3 mb-2">
                                  <Trophy className="text-yellow-400" />
                                  <span className="font-bold text-yellow-400 uppercase tracking-widest text-xs">Nível {gamification?.level}</span>
                              </div>
                              <h2 className="text-3xl font-black">{gamification?.xp.toLocaleString()} XP</h2>
                              <p className="text-gray-400 text-sm mt-1">Faltam {gamification?.nextLevelXp - gamification?.xp} XP para o próximo nível.</p>
                          </div>
                          <div className="w-full md:w-64">
                              <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
                                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${(gamification?.xp / gamification?.nextLevelXp) * 100}%` }}></div>
                              </div>
                              <p className="text-right text-xs text-gray-500 font-mono">Próximo: Diamante</p>
                          </div>
                      </div>
                  </div>

                  {/* Badges */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {gamification?.badges.map((b: string, i: number) => (
                          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center text-center gap-2 hover:shadow-md transition-all">
                              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                  <Trophy size={18} />
                              </div>
                              <span className="text-xs font-bold text-gray-700">{b}</span>
                          </div>
                      ))}
                  </div>

                  {/* Settings */}
                  <Card>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Settings size={18}/> Preferências de Trabalho</h4>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                  <Clock size={18} className="text-gray-400"/>
                                  <div>
                                      <p className="font-bold text-sm text-gray-900">Turno Preferencial</p>
                                      <p className="text-xs text-gray-500">{profile?.shifts?.join(', ') || 'Não definido'}</p>
                                  </div>
                              </div>
                              <Button variant="ghost" size="sm">Alterar</Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                  <MapPin size={18} className="text-gray-400"/>
                                  <div>
                                      <p className="font-bold text-sm text-gray-900">Região de Atuação</p>
                                      <p className="text-xs text-gray-500">{profile?.neighborhoods?.join(', ') || 'Toda cidade'}</p>
                                  </div>
                              </div>
                              <Button variant="ghost" size="sm">Alterar</Button>
                          </div>
                      </div>
                  </Card>
              </div>
          </div>
      )}

      {/* Modal Saque */}
      <Modal 
         isOpen={withdrawalModal} 
         onClose={() => setWithdrawalModal(false)} 
         title="Solicitar Saque"
         footer={
             <Button className="w-full" onClick={handleWithdraw}>Confirmar Saque</Button>
         }
      >
          <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm flex gap-3">
                  <Ticket className="shrink-0" />
                  <div>
                      <p className="font-bold mb-1">Processo via Ticket</p>
                      <p>Sua solicitação gerará um ticket para o departamento financeiro. O prazo de análise é de até 24h úteis.</p>
                  </div>
              </div>
              <Input 
                  label="Valor do Saque (R$)" 
                  placeholder="0,00" 
                  type="number"
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500 text-right">Saldo disponível: R$ {financials?.balance.toFixed(2)}</p>
          </div>
      </Modal>
    </div>
  );
};

export const DeliveryDashboard: React.FC = () => {
    const [status, setStatus] = useState<'ONLINE' | 'OFFLINE'>('OFFLINE');
    const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
    const [activeMission, setActiveMission] = useState<Order | null>(null);
    const [validationModal, setValidationModal] = useState<'COLLECTION' | 'DELIVERY' | null>(null);
    const [tokenInput, setTokenInput] = useState('');
    const [issueText, setIssueText] = useState('');
    const [issueModal, setIssueModal] = useState(false);
    
    // Chat Integration
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');

    // Sync with system
    useEffect(() => {
        const update = () => {
            const currentStatus = carboSystem.getCourierStatus(COURIER_ID) as 'ONLINE' | 'OFFLINE';
            setStatus(currentStatus);

            const allOrders = carboSystem.getOrders(UserRole.DELIVERY, COURIER_ID);
            
            // Check for active mission
            const myMission = allOrders.find(o => o.courierId === COURIER_ID && o.status !== 'FINALIZADO' && o.status !== 'CANCELADO');
            setActiveMission(myMission || null);

            // Available orders
            const available = allOrders.filter(o => 
                (o.status === 'AGUARDANDO_COLETA' || o.status === 'PREPARANDO') && 
                !o.courierId && 
                (!o.rejectedCouriers || !o.rejectedCouriers.includes(COURIER_ID))
            );
            setAvailableOrders(available);
        };
        
        update();
        const unsubscribe = carboSystem.subscribe(update);
        return () => unsubscribe();
    }, []);

    // Sync Chat Messages
    useEffect(() => {
        if (!activeMission || !chatOpen) return;
        
        carboSystem.getOrCreateChatSession(activeMission.id, UserRole.DELIVERY, COURIER_ID);
        
        const updateMessages = () => {
            const msgs = carboSystem.getMessagesForOrder(activeMission.id);
            setMessages([...msgs]);
        };
        
        updateMessages();
        const unsubscribe = carboSystem.subscribe(updateMessages);
        return () => unsubscribe();
    }, [activeMission, chatOpen]);

    const toggleStatus = () => {
        const newStatus = status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';
        try {
            carboSystem.setCourierStatus(COURIER_ID, newStatus);
        } catch (e: any) {
            alert(`Ação bloqueada: ${e.message}`);
        }
    };

    const acceptOrder = (orderId: string) => {
        const success = carboSystem.assignCourier(orderId, COURIER_ID, COURIER_NAME);
        if (!success) {
            alert('Não foi possível aceitar este pedido. Verifique sua elegibilidade ou se o pedido ainda está disponível.');
        }
    };

    const handleReject = (orderId: string) => {
        if(confirm('Recusar esta missão? Isso pode afetar levemente sua reputação.')) {
            carboSystem.rejectOrder(orderId, COURIER_ID);
        }
    };

    const handleValidate = () => {
        if (!activeMission) return;
        let result = { success: false, message: '' };
        
        if (validationModal === 'COLLECTION') {
            result = carboSystem.validateCollectionToken(activeMission.id, tokenInput);
        } else {
            result = carboSystem.validateDeliveryToken(activeMission.id, tokenInput);
        }

        if (result.success) {
            alert(result.message);
            setValidationModal(null);
            setTokenInput('');
        } else {
            alert(`Erro: ${result.message}`);
        }
    };

    const handleReportIssue = () => {
        if (!activeMission || !issueText) return;
        carboSystem.reportOrderIssue(activeMission.id, issueText);
        alert('Ocorrência registrada com sucesso. O pedido foi congelado para análise de segurança.');
        setIssueModal(false);
        setIssueText('');
    };

    const handleSendMessage = () => {
        if (!activeMission || !messageInput.trim()) return;
        carboSystem.sendMessage(activeMission.id, COURIER_NAME, UserRole.DELIVERY, messageInput, true);
        setMessageInput('');
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header / Radar Control */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-900 rounded-3xl p-8 text-white shadow-float relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-carbo-primary blur-[100px] opacity-20 pointer-events-none" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${status === 'ONLINE' ? 'bg-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]' : 'bg-gray-700'}`}>
                        <Power size={32} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black">{status === 'ONLINE' ? 'Radar Ativo' : 'Você está Offline'}</h2>
                        <p className="text-gray-400 text-sm font-medium">{status === 'ONLINE' ? 'Procurando novas missões na região...' : 'Fique online para receber entregas.'}</p>
                    </div>
                </div>

                <button 
                    onClick={toggleStatus}
                    className={`relative z-10 px-8 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 ${
                        status === 'ONLINE' 
                        ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30' 
                        : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
                    }`}
                >
                    {status === 'ONLINE' ? 'PARAR RADAR' : 'INICIAR RADAR'}
                </button>
            </div>

            {/* ACTIVE MISSION CARD */}
            <AnimatePresence>
                {activeMission && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className={`bg-white border-2 ${activeMission.status === 'EM_ANALISE' ? 'border-red-500' : 'border-carbo-primary'} rounded-3xl p-6 shadow-xl relative overflow-hidden`}
                    >
                        <div className={`absolute top-0 left-0 w-full h-2 ${activeMission.status === 'EM_ANALISE' ? 'bg-red-500' : 'bg-carbo-primary'}`} />
                        
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <Badge variant={activeMission.status === 'EM_ANALISE' ? 'danger' : 'primary'} className="mb-2">
                                    {activeMission.status === 'EM_ANALISE' ? 'PEDIDO SOB ANÁLISE' : 'MISSÃO EM ANDAMENTO'}
                                </Badge>
                                <h3 className="text-2xl font-black text-gray-900">Pedido #{activeMission.id}</h3>
                                <p className="text-sm text-gray-500">Aceito há {activeMission.timeElapsed}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold uppercase text-gray-400">Ganhos Estimados</p>
                                <p className="text-3xl font-black text-green-600">R$ {(activeMission.total * 0.2).toFixed(2)}</p>
                            </div>
                        </div>

                        {activeMission.status === 'EM_ANALISE' ? (
                            <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center mb-6">
                                <ShieldCheck size={48} className="mx-auto text-red-500 mb-3"/>
                                <h4 className="font-bold text-red-800 text-lg">Bloqueio de Segurança</h4>
                                <p className="text-sm text-red-600">Este pedido foi congelado devido a uma ocorrência reportada. O Admin Master está analisando. Aguarde instruções.</p>
                            </div>
                        ) : (
                            /* Progress Stepper */
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`flex-1 p-4 rounded-xl border-2 transition-colors ${['AGUARDANDO_COLETA', 'A_CAMINHO_LOJA', 'PREPARANDO'].includes(activeMission.status) ? 'border-carbo-primary bg-orange-50' : 'border-green-500 bg-green-50'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${['AGUARDANDO_COLETA', 'A_CAMINHO_LOJA', 'PREPARANDO'].includes(activeMission.status) ? 'bg-carbo-primary' : 'bg-green-500'}`}>1</div>
                                        <span className="font-bold text-gray-900">Coleta</span>
                                    </div>
                                    <p className="text-xs text-gray-600">Loja Demo • Rua das Flores, 123</p>
                                    {['AGUARDANDO_COLETA', 'A_CAMINHO_LOJA', 'PREPARANDO'].includes(activeMission.status) && (
                                        <Button onClick={() => setValidationModal('COLLECTION')} className="w-full mt-3 text-xs h-10" icon={<QrCode size={14}/>}>Validar Coleta</Button>
                                    )}
                                </div>
                                <ChevronRight className="text-gray-300" />
                                <div className={`flex-1 p-4 rounded-xl border-2 transition-colors ${activeMission.status === 'EM_ENTREGA' ? 'border-carbo-primary bg-orange-50' : 'border-gray-100 bg-gray-50'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${activeMission.status === 'EM_ENTREGA' ? 'bg-carbo-primary text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                        <span className={`font-bold ${activeMission.status === 'EM_ENTREGA' ? 'text-gray-900' : 'text-gray-400'}`}>Entrega</span>
                                    </div>
                                    <p className="text-xs text-gray-600">{activeMission.customerName} • Av. Paulista, 1000</p>
                                    {activeMission.status === 'EM_ENTREGA' && (
                                        <Button onClick={() => setValidationModal('DELIVERY')} className="w-full mt-3 text-xs h-10" icon={<QrCode size={14}/>}>Validar Entrega</Button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                            <div className="flex gap-4">
                                <Button variant="secondary" icon={<Navigation size={18}/>}>Abrir GPS</Button>
                                <Button 
                                    variant="secondary" 
                                    icon={<MessageSquare size={18}/>}
                                    onClick={() => setChatOpen(true)}
                                >
                                    Chat Seguro
                                </Button>
                            </div>
                            {activeMission.status !== 'EM_ANALISE' && (
                                <button onClick={() => setIssueModal(true)} className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
                                    <AlertTriangle size={14} /> Relatar Problema
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AVAILABLE MISSIONS LIST */}
            {!activeMission && status === 'ONLINE' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Target size={20}/> Missões Disponíveis</h3>
                        <Badge variant="neutral">{availableOrders.length} encontradas</Badge>
                    </div>

                    {availableOrders.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-3xl">
                            <CloudRain size={48} className="mx-auto mb-4 opacity-50"/>
                            <p className="font-bold">Nenhuma missão por perto.</p>
                            <p className="text-sm">Aguarde, o radar está buscando...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableOrders.map(order => (
                                <Card key={order.id} className="hover:border-carbo-primary transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-600">
                                                <Store size={20}/>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">Loja Demo</h4>
                                                <p className="text-xs text-gray-500">2.4 km • Lanches</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="success" className="mb-1">R$ {(order.total * 0.2).toFixed(2)}</Badge>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg">
                                        <MapPin size={16}/> Entrega: <span className="font-bold">{order.customerName}</span> (3.1 km)
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="danger" className="w-12 px-0" onClick={() => handleReject(order.id)}>
                                            <X size={18}/>
                                        </Button>
                                        <Button onClick={() => acceptOrder(order.id)} className="flex-1 shadow-lg shadow-orange-500/20 group-hover:bg-carbo-primaryHover">
                                            Aceitar Missão
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* MODALS */}
            
            {/* Chat Modal - Entregador */}
            <Modal
                isOpen={chatOpen}
                onClose={() => setChatOpen(false)}
                title={activeMission ? `Chat da Entrega #${activeMission.id}` : 'Chat'}
            >
                <div className="flex flex-col gap-4">
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                        <Users size={18} className="text-blue-600"/>
                        <div>
                            <p className="text-xs text-blue-800 font-bold">Canal Seguro</p>
                            <p className="text-[10px] text-blue-600">Comunicação monitorada para sua segurança. Evite compartilhar dados pessoais.</p>
                        </div>
                    </div>

                    <div className="space-y-3 h-64 overflow-y-auto custom-scrollbar p-1 bg-white border border-gray-100 rounded-xl">
                        {messages.length === 0 && <div className="text-center text-gray-400 text-xs py-10">Nenhuma mensagem.</div>}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.isMe 
                                    ? 'bg-gray-800 text-white rounded-br-none' 
                                    : msg.systemGenerated 
                                        ? 'bg-gray-100 text-gray-500 text-xs text-center w-full rounded-2xl italic' 
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                }`}>
                                    {!msg.isMe && !msg.systemGenerated && (
                                        <p className="text-[10px] font-bold text-gray-500 mb-1 flex items-center gap-1">
                                            {msg.role === UserRole.VENDOR ? <Store size={10}/> : msg.role === UserRole.CLIENT ? <Users size={10}/> : null}
                                            {msg.sender}
                                        </p>
                                    )}
                                    {msg.text}
                                    <p className={`text-[9px] mt-1 text-right opacity-70`}>{msg.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <Input 
                            placeholder="Mensagem..." 
                            className="flex-1"
                            value={messageInput}
                            onChange={e => setMessageInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                            icon={<Send size={16}/>} 
                            className="w-12 px-0 bg-gray-900" 
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                        ></Button>
                    </div>
                </div>
            </Modal>

            {/* Validation Modal */}
            <Modal
                isOpen={!!validationModal}
                onClose={() => setValidationModal(null)}
                title={validationModal === 'COLLECTION' ? "Validar Coleta" : "Validar Entrega"}
                footer={<Button className="w-full" onClick={handleValidate}>Confirmar</Button>}
            >
                <div className="space-y-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-600 mb-2">
                        <QrCode size={32}/>
                    </div>
                    <p className="text-sm text-gray-600">
                        {validationModal === 'COLLECTION' 
                        ? 'Solicite o código de 4 dígitos para a loja.' 
                        : 'Solicite o código de 4 dígitos para o cliente.'}
                    </p>
                    <div className="flex justify-center">
                        <input 
                            className="text-4xl font-black text-center tracking-[1rem] w-48 border-b-4 border-gray-300 focus:border-carbo-primary outline-none bg-transparent"
                            maxLength={4}
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            placeholder="0000"
                        />
                    </div>
                    {/* Dev Hint */}
                    <p className="text-[10px] text-gray-300 mt-4">
                        (Dev Hint: {validationModal === 'COLLECTION' ? activeMission?.collectionToken : activeMission?.deliveryToken})
                    </p>
                </div>
            </Modal>

            {/* Issue Modal */}
            <Modal
                isOpen={issueModal}
                onClose={() => setIssueModal(false)}
                title="Relatar Problema"
                footer={<Button variant="danger" className="w-full" onClick={handleReportIssue}>Enviar Relatório</Button>}
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Descreva o que aconteceu. O suporte receberá este alerta imediatamente.</p>
                    <textarea 
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none"
                        rows={4}
                        placeholder="Ex: Pneu furou, cliente não atende, loja fechada..."
                        value={issueText}
                        onChange={e => setIssueText(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
};