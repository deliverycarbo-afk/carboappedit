import React, { useState, useEffect } from 'react';
import { UserRole, City } from '../types';
import { Button, Input, Card, Badge, Modal, Stepper, SectionTitle } from '../components/UIComponents';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, Truck, Store, User, ArrowRight, UploadCloud, 
  CheckCircle2, Lock, MapPin, CreditCard,
  ChevronLeft, LayoutGrid, Zap, BarChart2, MessageSquare, Package, 
  ShoppingBag, Award, Shield, AlertCircle, FileText, Briefcase, Menu, X, ArrowUpRight, Smartphone, Key, Users, Check, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { carboSystem } from '../services/carboSystem';

interface LandingProps {
  onLogin: (role: UserRole) => void;
}

// --- STANDARD CARBOAPP CONSTANTS ---
const FEATURES = [
    { icon: <Zap size={24}/>, title: 'Alta Performance', desc: 'Sistema otimizado para operações de alto volume.' },
    { icon: <Truck size={24}/>, title: 'Logística Inteligente', desc: 'Roteirização automática e gestão de frotas.' },
    { icon: <CreditCard size={24} />, title: 'Gestão Financeira', desc: 'Controle de repasses, taxas e fluxo de caixa.' },
    { icon: <ShieldCheck size={24}/>, title: 'Segurança Total', desc: 'Validação de entrega via token e monitoramento.' },
    { icon: <MessageSquare size={24}/>, title: 'Chat Integrado', desc: 'Comunicação direta entre loja, entregador e cliente.' },
    { icon: <BarChart2 size={24}/>, title: 'Analytics', desc: 'Relatórios detalhados para tomada de decisão.' },
];

const ROLES_INFO = {
    VENDOR: { 
        title: 'Para Lojas', 
        desc: 'Gerencie pedidos, cardápio, estoque e financeiro em um só lugar.', 
        benefits: ['Gestão de Pedidos', 'Cardápio Digital', 'Relatórios Financeiros'],
        cta: 'Sou Parceiro',
        role: UserRole.VENDOR,
        icon: <Store size={32}/>,
        color: 'bg-orange-50 text-orange-600 border-orange-100'
    },
    DELIVERY: { 
        title: 'Para Entregadores', 
        desc: 'Receba mais entregas, otimize rotas e garanta seus ganhos.', 
        benefits: ['Rotas Otimizadas', 'Ganhos em Tempo Real', 'Segurança'],
        cta: 'Sou Entregador',
        role: UserRole.DELIVERY,
        icon: <Truck size={32}/>,
        color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    CLIENT: { 
        title: 'Para Clientes', 
        desc: 'Acompanhe seus pedidos em tempo real com total transparência.', 
        benefits: ['Rastreamento Real', 'Chat Direto', 'Pagamento Seguro'],
        cta: 'Fazer Pedido',
        role: UserRole.CLIENT,
        icon: <ShoppingBag size={32}/>,
        color: 'bg-purple-50 text-purple-600 border-purple-100'
    }
};

export const LandingPage: React.FC<LandingProps> = ({ onLogin }) => {
  // Navigation State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Modal States
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // Login Form State
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form State
  const [regStep, setRegStep] = useState(0);
  const [regError, setRegError] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([]);
  
  const [regData, setRegData] = useState({
    role: null as UserRole | null,
    subType: null as 'INTERNAL' | null, 
    name: '',
    surname: '',
    cpf: '',
    cnpj: '', 
    phone: '',
    email: '',
    password: '',
    confirmPassword: '', 
    storeName: '',
    docImage: null as string | null, 
    selfieImage: null as string | null, 
    address: {
        zip: '',
        street: '',
        number: '',
        neighborhood: '',
        city: ''
    },
    selectedModules: [] as string[]
  });

  // Scroll Effect
  useEffect(() => {
      const handleScroll = () => setScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Cities
  useEffect(() => {
      setCities(carboSystem.getCities());
  }, []);

  // Update Neighborhoods when City changes
  useEffect(() => {
      const cityObj = cities.find(c => c.name === regData.address.city);
      setAvailableNeighborhoods(cityObj ? cityObj.neighborhoods : []);
  }, [regData.address.city, cities]);

  // --- HANDLERS ---

  const handleLoginSubmit = () => {
      setLoginError('');
      if (!loginId || !loginPass) {
          setLoginError('Preencha todos os campos.');
          return;
      }

      const res = carboSystem.login(loginId, loginPass);
      
      if (res.success && res.role) {
          onLogin(res.role);
      } else {
          setLoginError(res.error || 'Credenciais inválidas.');
      }
  };

  const handleRegisterSubmit = () => {
      setRegError('');
      if (regData.password !== regData.confirmPassword) {
          setRegError('As senhas não coincidem.');
          return;
      }
      if (!regData.name || !regData.email || !regData.cpf) {
          setRegError('Preencha os campos obrigatórios.');
          return;
      }

      const res = carboSystem.register({
          role: regData.role,
          name: `${regData.name} ${regData.surname}`,
          email: regData.email,
          cpf: regData.cpf,
          password: regData.password,
          city: regData.address.city,
          neighborhoods: [regData.address.neighborhood]
      });

      if (res.success) {
          alert('Cadastro realizado com sucesso! Faça login para continuar.');
          setRegisterOpen(false);
          setLoginOpen(true);
      } else {
          setRegError(res.error || 'Erro ao cadastrar.');
      }
  };

  const openRegister = (role: UserRole) => {
      setRegData({ ...regData, role });
      setRegStep(0);
      setRegisterOpen(true);
  };

  const renderRegisterContent = () => {
      switch(regStep) {
          case 0: // Dados Pessoais
              return (
                  <div className="space-y-4 animate-in slide-in-from-right">
                      <div className="grid grid-cols-2 gap-4">
                          <Input label="Nome" value={regData.name} onChange={e => setRegData({...regData, name: e.target.value})} />
                          <Input label="Sobrenome" value={regData.surname} onChange={e => setRegData({...regData, surname: e.target.value})} />
                      </div>
                      <Input label="CPF" placeholder="000.000.000-00" value={regData.cpf} onChange={e => setRegData({...regData, cpf: e.target.value})} />
                      <Input label="Celular" placeholder="(00) 00000-0000" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} />
                      <Input label="E-mail" type="email" value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
                      <div className="grid grid-cols-2 gap-4">
                          <Input label="Senha" type="password" value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
                          <Input label="Confirmar Senha" type="password" value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})} />
                      </div>
                  </div>
              );
          case 1: // Endereço & Operação
              return (
                  <div className="space-y-4 animate-in slide-in-from-right">
                      {regData.role === UserRole.VENDOR && (
                          <Input label="Nome da Loja" value={regData.storeName} onChange={e => setRegData({...regData, storeName: e.target.value})} />
                      )}
                      
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade de Atuação</label>
                          <select 
                              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-carbo-primary/20"
                              value={regData.address.city}
                              onChange={e => setRegData({...regData, address: { ...regData.address, city: e.target.value, neighborhood: '' }})}
                          >
                              <option value="">Selecione...</option>
                              {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                          </select>
                      </div>

                      {regData.address.city && (
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bairro Principal</label>
                              <select 
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-carbo-primary/20"
                                  value={regData.address.neighborhood}
                                  onChange={e => setRegData({...regData, address: { ...regData.address, neighborhood: e.target.value }})}
                              >
                                  <option value="">Selecione...</option>
                                  {availableNeighborhoods.map(n => <option key={n} value={n}>{n}</option>)}
                              </select>
                          </div>
                      )}

                      <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-2"><Input label="Rua" value={regData.address.street} onChange={e => setRegData({...regData, address: {...regData.address, street: e.target.value}})} /></div>
                          <Input label="Número" value={regData.address.number} onChange={e => setRegData({...regData, address: {...regData.address, number: e.target.value}})} />
                      </div>
                  </div>
              );
          case 2: // Documentos (Simulado)
              return (
                  <div className="space-y-6 animate-in slide-in-from-right text-center">
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-colors cursor-pointer group">
                          <UploadCloud size={48} className="mx-auto text-gray-300 group-hover:text-carbo-primary mb-2 transition-colors"/>
                          <p className="font-bold text-gray-600">Foto do Documento (RG/CNH)</p>
                          <p className="text-xs text-gray-400">Clique para enviar</p>
                      </div>
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 hover:bg-white transition-colors cursor-pointer group">
                          <User size={48} className="mx-auto text-gray-300 group-hover:text-carbo-primary mb-2 transition-colors"/>
                          <p className="font-bold text-gray-600">Selfie com Documento</p>
                          <p className="text-xs text-gray-400">Para sua segurança</p>
                      </div>
                      <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">Seus documentos serão analisados automaticamente pela nossa IA em até 2 minutos.</p>
                  </div>
              );
          default: return null;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 overflow-x-hidden selection:bg-carbo-primary/20">
        
        {/* --- NAVBAR --- */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <Logo size="md" className="text-gray-900" />
                
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-bold text-gray-600 hover:text-carbo-primary transition-colors">Funcionalidades</a>
                    <a href="#solutions" className="text-sm font-bold text-gray-600 hover:text-carbo-primary transition-colors">Soluções</a>
                    <a href="#enterprise" className="text-sm font-bold text-gray-600 hover:text-carbo-primary transition-colors">Enterprise</a>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <button onClick={() => setLoginOpen(true)} className="text-sm font-bold text-gray-900 hover:text-carbo-primary transition-colors">Entrar</button>
                    <Button onClick={() => openRegister(UserRole.CLIENT)} className="shadow-lg shadow-orange-500/20">Começar Agora</Button>
                </div>

                <button className="md:hidden text-gray-900" onClick={() => setMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
            </div>
        </nav>

        {/* --- MOBILE MENU --- */}
        <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 z-[60] bg-white">
                    <div className="p-6 flex justify-between items-center border-b border-gray-100">
                        <Logo size="sm" />
                        <button onClick={() => setMobileMenuOpen(false)}><X size={24}/></button>
                    </div>
                    <div className="p-8 flex flex-col gap-6 text-xl font-bold text-gray-900">
                        <a href="#features" onClick={() => setMobileMenuOpen(false)}>Funcionalidades</a>
                        <a href="#solutions" onClick={() => setMobileMenuOpen(false)}>Soluções</a>
                        <a href="#enterprise" onClick={() => setMobileMenuOpen(false)}>Enterprise</a>
                        <hr className="border-gray-100"/>
                        <button onClick={() => { setMobileMenuOpen(false); setLoginOpen(true); }} className="text-left text-carbo-primary">Acessar Conta</button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-orange-100/50 to-transparent rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/4" />
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8 animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <Badge variant="primary" className="bg-orange-50 text-carbo-primary border-orange-100 px-4 py-2 text-xs uppercase tracking-widest shadow-sm">
                        O Sistema Operacional do Delivery
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1]">
                        Logística que <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-carbo-primary to-orange-600">Move o Mundo.</span>
                    </h1>
                    <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                        A plataforma completa para conectar lojas, entregadores e clientes. 
                        Gestão de frota em tempo real, pagamentos automatizados e experiência de compra superior.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-orange-500/20" icon={<ArrowRight size={20}/>} onClick={() => openRegister(UserRole.VENDOR)}>
                            Cadastrar Restaurante
                        </Button>
                        <Button size="lg" variant="secondary" className="h-14 px-8 text-base bg-white border-gray-200 text-gray-700 hover:bg-gray-50" icon={<Smartphone size={20}/>}>
                            Baixar App
                        </Button>
                    </div>
                    <div className="flex items-center gap-6 pt-4 text-sm font-bold text-gray-500">
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Setup Gratuito</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Sem Mensalidade</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Suporte 24/7</span>
                    </div>
                </div>

                <div className="relative animate-in slide-in-from-right-10 fade-in duration-1000 delay-200 hidden lg:block">
                    <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-6 border border-gray-100 rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                         {/* Mock UI Card */}
                         <div className="flex justify-between items-center mb-6">
                             <div>
                                 <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ganhos Hoje</p>
                                 <p className="text-3xl font-black text-gray-900">R$ 1.240,50</p>
                             </div>
                             <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                 <TrendingUp size={24}/>
                             </div>
                         </div>
                         <div className="space-y-3">
                             {[1,2,3].map(i => (
                                 <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                     <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-carbo-primary font-bold">🍔</div>
                                     <div className="flex-1">
                                         <p className="font-bold text-sm text-gray-900">Pedido #{1000+i}</p>
                                         <p className="text-xs text-gray-500">Em rota de entrega • 5 min</p>
                                     </div>
                                     <span className="font-bold text-sm text-gray-900">R$ 45,00</span>
                                 </div>
                             ))}
                         </div>
                         <Button className="w-full mt-6 rounded-xl">Ver Painel Completo</Button>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-10 -right-10 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce duration-[3000ms]">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><ShieldCheck size={20}/></div>
                        <div>
                            <p className="text-xs font-bold text-gray-400">Status</p>
                            <p className="text-sm font-black text-gray-900">100% Seguro</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* --- ROLES SECTION --- */}
        <section id="solutions" className="py-20 bg-white border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <SectionTitle title="Uma plataforma, múltiplos perfis." subtitle="Soluções dedicadas para cada parte do ecossistema de delivery." className="text-center mb-16 mx-auto" />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.values(ROLES_INFO).map((role) => (
                        <Card key={role.title} className={`border-2 hover:border-transparent hover:shadow-2xl transition-all duration-300 group ${role.role === 'VENDOR' ? 'hover:shadow-orange-500/10' : role.role === 'DELIVERY' ? 'hover:shadow-blue-500/10' : 'hover:shadow-purple-500/10'}`}>
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${role.color}`}>
                                {role.icon}
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-3">{role.title}</h3>
                            <p className="text-gray-500 mb-8 leading-relaxed">{role.desc}</p>
                            <ul className="space-y-3 mb-8">
                                {role.benefits.map((benefit, i) => (
                                    <li key={i} className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                        <Check className="text-carbo-primary" size={16}/> {benefit}
                                    </li>
                                ))}
                            </ul>
                            <Button 
                                className="w-full h-12" 
                                variant={role.role === 'VENDOR' ? 'primary' : 'outline'}
                                onClick={() => role.role === 'CLIENT' ? setLoginOpen(true) : openRegister(role.role)}
                            >
                                {role.cta}
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section id="features" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feat, i) => (
                        <div key={i} className="flex gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="w-12 h-12 rounded-xl bg-orange-50 text-carbo-primary flex items-center justify-center shrink-0">
                                {feat.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{feat.title}</h4>
                                <p className="text-sm text-gray-500 leading-relaxed">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="bg-gray-900 text-white py-20 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <Logo size="lg" className="text-white mb-6" />
                    <p className="text-gray-400 leading-relaxed max-w-sm">
                        Transformando a logística urbana com tecnologia de ponta. 
                        Conectamos negócios, entregadores e pessoas de forma rápida e segura.
                    </p>
                    <div className="flex gap-4 mt-8">
                        {/* Social Icons Placeholder */}
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-carbo-primary transition-colors cursor-pointer"><ArrowUpRight size={20}/></div>
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-carbo-primary transition-colors cursor-pointer"><MessageSquare size={20}/></div>
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-6">Plataforma</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Para Lojas</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Para Entregadores</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-6">Legal</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                <p>&copy; 2024 CarboApp Logística Ltda. Todos os direitos reservados.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <span>Feito com ❤️ em São Paulo</span>
                </div>
            </div>
        </footer>

        {/* --- MODALS --- */}
        
        {/* LOGIN MODAL */}
        <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)} title="Acessar Painel">
            <div className="space-y-6">
                <Input label="E-mail ou CPF" placeholder="exemplo@carbo.app" value={loginId} onChange={e => setLoginId(e.target.value)} />
                <Input label="Senha" type="password" placeholder="••••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                {loginError && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg flex items-center gap-2"><AlertCircle size={14}/> {loginError}</p>}
                <Button className="w-full h-12 text-base" onClick={handleLoginSubmit}>Entrar</Button>
                <div className="text-center">
                    <button className="text-xs text-gray-500 font-bold hover:text-carbo-primary" onClick={() => { setLoginOpen(false); openRegister(UserRole.CLIENT); }}>Não tem conta? Cadastre-se</button>
                </div>
            </div>
        </Modal>

        {/* REGISTER MODAL */}
        <Modal 
            isOpen={registerOpen} 
            onClose={() => setRegisterOpen(false)} 
            title={`Cadastro: ${regData.role === UserRole.VENDOR ? 'Parceiro' : regData.role === UserRole.DELIVERY ? 'Entregador' : 'Cliente'}`}
            footer={
                <div className="flex justify-between w-full">
                    {regStep > 0 ? (
                        <Button variant="ghost" onClick={() => setRegStep(regStep - 1)}>Voltar</Button>
                    ) : (
                        <div></div>
                    )}
                    {regStep < 2 ? (
                        <Button onClick={() => setRegStep(regStep + 1)}>Próximo <ChevronLeft className="rotate-180 ml-1" size={16}/></Button>
                    ) : (
                        <Button onClick={handleRegisterSubmit}>Finalizar Cadastro</Button>
                    )}
                </div>
            }
        >
            <div className="mb-8">
                <Stepper steps={['Dados Pessoais', 'Endereço', 'Documentos']} currentStep={regStep} />
            </div>
            {renderRegisterContent()}
            {regError && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg mt-4 flex items-center gap-2"><AlertCircle size={14}/> {regError}</p>}
        </Modal>

    </div>
  );
};
