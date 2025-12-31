import { Order, Product, StockMovement, Notification, AuditLog, UserRole, OrderItem, KanbanColumn, Store, Courier, Ticket, Vehicle, MarketingCampaign, Partner, PageContent, ChatSession, ChatMessage, CourierDocument, AuctionBid, Address, GamificationProfile, Badge, NotificationFilter, Occurrence, FraudAlert, City, ProductModifierGroup, ProductCategory, DeliveryZone, CarboTask, Transaction } from '../types';

class CarboSystem {
  private listeners: (() => void)[] = [];

  private maintenanceMode: boolean = false;
  private weatherCondition: 'SUNNY' | 'RAINY' | 'STORM' = 'SUNNY';
  
  private cities: City[] = [
      { id: '1', name: 'São Paulo', uf: 'SP', active: true, neighborhoods: ['Centro', 'Paulista', 'Vila Mariana', 'Pinheiros', 'Itaim Bibi', 'Moema', 'Jardins'] },
      { id: '2', name: 'Rio de Janeiro', uf: 'RJ', active: true, neighborhoods: ['Copacabana', 'Ipanema', 'Centro', 'Barra da Tijuca', 'Botafogo'] },
      { id: '3', name: 'Curitiba', uf: 'PR', active: true, neighborhoods: ['Centro', 'Batel', 'Água Verde', 'Bigorrilho'] }
  ];

  // Mock Data
  private users: any[] = [
      { id: 'u_gui', cpf: '123', password: 'meriva1515', role: UserRole.VENDOR, status: 'APPROVED', name: 'Guilherme', email: 'guilherme@creative.com', riskScore: 0, lastActive: 'Agora', storeId: '1' },
      { id: 'u1', cpf: '111', password: '123', role: UserRole.ADMIN, status: 'APPROVED', name: 'Admin Master', email: 'admin@carbo.app', riskScore: 0, lastActive: 'Agora' },
      { id: 'u2', cpf: '222', password: '123', role: UserRole.VENDOR, status: 'APPROVED', name: 'Loja Demo', storeId: '1', email: 'loja@demo.com', riskScore: 10, lastActive: '5 min' },
      { id: 'u3', cpf: '333', password: '123', role: UserRole.DELIVERY, status: 'APPROVED', name: 'Entregador Demo', email: 'moto@carbo.app', riskScore: 5, lastActive: '1 min' },
      { id: 'C1', cpf: '444', password: '123', role: UserRole.CLIENT, status: 'APPROVED', name: 'Gabriel Silva', email: 'gabriel@carbo.app', riskScore: 0, lastActive: 'Agora' },
  ];

  private orders: Order[] = [
      { id: '1001', storeId: '1', customerId: 'C1', customerName: 'Gabriel Silva', total: 45.90, status: 'NOVO', createdAt: Date.now(), updatedAt: Date.now(), timeElapsed: '1min', type: 'DELIVERY', paymentMethod: 'PIX', items: [{ productId: '1', productName: 'X-Burger', quantity: 2, price: 20 }] },
      { id: '1002', storeId: '1', customerId: 'C2', customerName: 'Ana Paula', total: 78.50, status: 'PREPARANDO', createdAt: Date.now(), updatedAt: Date.now(), timeElapsed: '12min', type: 'MESA', paymentMethod: 'CARTAO', items: [{ productId: '2', productName: 'Pizza G', quantity: 1, price: 78.50 }] },
      { id: '1003', storeId: '1', customerId: 'C1', customerName: 'Gabriel Silva', total: 120.00, status: 'EM_ENTREGA', createdAt: Date.now(), updatedAt: Date.now(), timeElapsed: '45min', type: 'DELIVERY', paymentMethod: 'PIX', courierId: 'u3', items: [{ productId: '1', productName: 'Combo Família', quantity: 1, price: 120 }] },
  ];

  private products: Product[] = [
      { id: '1', storeId: '1', name: 'X-Burger Premium', price: 25.90, category: 'Lanches', stock: 50, minStock: 10, active: true },
      { id: '2', storeId: '1', name: 'Coca-Cola 350ml', price: 6.00, category: 'Bebidas', stock: 120, minStock: 24, active: true },
  ];

  private couriers: Courier[] = [
    { id: 'u3', name: 'Entregador Demo', rating: 4.9, vehicle: 'MOTO', status: 'ONLINE', isFixed: true, phone: '(11) 99999-1111', deliveriesCount: 1540 },
  ];

  private notifications: Notification[] = [];
  private auditLogs: AuditLog[] = [];
  private stores: Store[] = [
      { id: '1', name: 'Burger King - Centro', category: 'Fast Food', isOpen: true, rating: 4.8, image: '', deliveryFee: 5.90, minTime: 30, maxTime: 45, rankingPosition: { daily: 1, weekly: 1, monthly: 1 } },
  ];

  private addresses: Record<string, Address[]> = {
      'C1': [{ id: 'a1', street: 'Rua das Flores', number: '123', neighborhood: 'Centro', city: 'São Paulo', zip: '01000-000', label: 'Casa', isDefault: true }]
  };

  private tasks: CarboTask[] = [
      { id: 't1', userId: 'C1', title: 'Avaliar último pedido', status: 'PENDING', createdAt: Date.now() }
  ];

  private transactions: Transaction[] = [
      { id: 'tx1', date: 'Hoje', type: 'ENTRADA', category: 'Venda', details: 'Pedido #1001', amount: 45.90, status: 'CONCLUIDO' },
      { id: 'tx2', date: 'Ontem', type: 'SAIDA', category: 'Saque', details: 'Transferência PIX', amount: 100.00, status: 'CONCLUIDO' },
  ];

  private tickets: Ticket[] = [
      { id: 'TK-001', subject: 'Problema no App', priority: 'ALTA', status: 'ABERTO', lastUpdate: 'Há 1h' }
  ];

  private chats: any[] = [
      { id: 'chat1', orderId: '1001', status: 'ACTIVE', time: '5m', participants: ['Cliente', 'Loja'], lastMessage: 'Onde está meu pedido?' }
  ];

  private reviews: any[] = [
      { id: 'r1', author: 'Cliente Demo', target: 'Loja Demo', type: 'STORE', rating: 5, comment: 'Muito bom!', date: 'Hoje' }
  ];

  private occurrences: Occurrence[] = [];
  private fraudAlerts: FraudAlert[] = [];
  private marketingCampaigns: MarketingCampaign[] = [
      { id: 'c1', name: 'Promoção de Verão', type: 'CUPOM', status: 'ATIVA', reach: 5000, conversion: 15, code: 'VERAO10', discountValue: '10%' }
  ];
  private partners: Partner[] = [
      { id: 'p1', name: 'Sócio Investidor', role: 'Investidor', share: 15, status: 'ATIVO', joinedDate: '2023-01' }
  ];
  private pages: PageContent[] = [
      { id: 'pg1', title: 'Termos de Uso', slug: 'termos', lastEdited: '2023-10-10', status: 'PUBLICADO', views: 1200 }
  ];

  // Subscribe Pattern
  subscribe(callback: () => void) {
      this.listeners.push(callback);
      return () => {
          this.listeners = this.listeners.filter(l => l !== callback);
      };
  }

  private notify() {
      this.listeners.forEach(l => l());
  }

  // Auth
  login(id: string, pass: string) {
      const user = this.users.find(u => (u.email === id || u.cpf === id) && u.password === pass);
      if (user) {
          if (user.status === 'SUSPENDED') return { success: false, error: 'Conta suspensa.' };
          return { success: true, role: user.role, user };
      }
      return { success: false, error: 'Credenciais inválidas.' };
  }

  register(data: any) {
      const newUser = { 
          id: `u${this.users.length + 1}`, 
          ...data, 
          status: 'PENDING', 
          riskScore: 0, 
          lastActive: 'Agora' 
      };
      this.users.push(newUser);
      this.notify();
      return { success: true };
  }

  getAllUsers() { return this.users; }
  updateUserStatus(id: string, status: string) {
      const u = this.users.find(x => x.id === id);
      if (u) { u.status = status; this.notify(); }
  }
  deleteUser(id: string) {
      this.users = this.users.filter(u => u.id !== id);
      this.notify();
  }

  // Orders
  getOrders(role: UserRole, userId?: string) {
      if (role === UserRole.ADMIN) return this.orders;
      if (role === UserRole.VENDOR) return this.orders; // Mock: returns all for demo store
      if (role === UserRole.CLIENT) return this.orders.filter(o => o.customerId === userId);
      if (role === UserRole.DELIVERY) return this.orders; // Returns all available or assigned
      return [];
  }

  updateOrderStatus(id: string, status: string, actor: string, role: UserRole) {
      const o = this.orders.find(x => x.id === id);
      if (o) {
          o.status = status;
          this.logAction(actor, `Atualizou pedido #${id} para ${status}`, role, 'INFO');
          this.notify();
      }
  }

  // Products
  getProducts(storeId: string) { return this.products; }
  addProduct(p: any) { 
      this.products.push({ id: Date.now().toString(), ...p }); 
      this.notify(); 
  }

  // Couriers
  getStoreCouriers(filter: string) { return this.couriers; }
  getCourierStatus(id: string) { return 'OFFLINE'; }
  setCourierStatus(id: string, status: string) { 
     const c = this.couriers.find(x => x.id === id);
     if(c) c.status = status as any;
     this.notify();
  }
  assignCourier(orderId: string, courierId: string, courierName: string) {
      const o = this.orders.find(x => x.id === orderId);
      if(o) {
          o.courierId = courierId;
          o.status = 'A_CAMINHO_LOJA';
          this.notify();
          return true;
      }
      return false;
  }
  rejectOrder(orderId: string, courierId: string) {
      const o = this.orders.find(x => x.id === orderId);
      if(o) {
          if(!o.rejectedCouriers) o.rejectedCouriers = [];
          o.rejectedCouriers.push(courierId);
          this.notify();
      }
  }

  // Notifications
  getNotifications(userId: string, role: UserRole) { return this.notifications; }
  getAllNotificationsForAdmin() { return this.notifications; }
  createNotification(n: any) { 
      this.notifications.push({ id: Date.now().toString(), time: 'Agora', read: false, ...n }); 
      this.notify(); 
  }
  cancelNotification(id: string) {
      const n = this.notifications.find(x => x.id === id);
      if(n) { n.status = 'CANCELLED'; this.notify(); }
  }

  // Addresses
  getAddresses(userId: string) { return this.addresses[userId] || []; }
  addAddress(userId: string, addr: any) {
      if(!this.addresses[userId]) this.addresses[userId] = [];
      this.addresses[userId].push({ id: Date.now().toString(), ...addr });
      this.notify();
  }
  removeAddress(userId: string, id: string) {
      if(this.addresses[userId]) {
          this.addresses[userId] = this.addresses[userId].filter(a => a.id !== id);
          this.notify();
      }
  }

  // Stores
  getStores() { return this.stores; }
  getStoreStats(storeId: string) {
      return { totalSales: 1250.00, orderCount: 45, products: this.products };
  }

  // System
  getMaintenanceMode() { return this.maintenanceMode; }
  setMaintenanceMode(val: boolean, actor: string) { 
      this.maintenanceMode = val; 
      this.logAction(actor, `Alterou modo manutenção para ${val}`, UserRole.ADMIN, 'CRITICAL');
      this.notify(); 
  }
  getWeather() { return this.weatherCondition; }
  setWeather(val: any, actor: string) {
      this.weatherCondition = val;
      this.logAction(actor, `Alterou clima para ${val}`, UserRole.ADMIN, 'WARNING');
      this.notify();
  }
  getCities() { return this.cities; }
  addCity(city: any) { 
      this.cities.push({ id: Date.now().toString(), ...city }); 
      this.notify(); 
  }
  removeCity(id: string) {
      this.cities = this.cities.filter(c => c.id !== id);
      this.notify();
  }
  getPlatformStats() {
      return { totalUsers: this.users.length, totalVolume: 125000.00, totalOrders: this.orders.length, platformFees: 18750.00 };
  }

  // Audit
  getAuditLogs() { return this.auditLogs; }
  private logAction(actor: string, action: string, role: UserRole, severity: 'INFO' | 'WARNING' | 'CRITICAL') {
      this.auditLogs.unshift({
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          actor,
          role,
          action,
          target: 'System',
          details: action,
          severity
      });
  }

  // Other Getters (Mock)
  getOccurrences() { return this.occurrences; }
  getFraudAlerts() { return this.fraudAlerts; }
  resolveOccurrence(id: string, action: string, resolver: string, resolution: string) {
      const occ = this.occurrences.find(o => o.id === id);
      if(occ) {
          occ.status = 'RESOLVED';
          occ.resolution = resolution;
          this.notify();
      }
  }

  // Dummy Methods to satisfy interfaces
  getCourierVehicles(id: string) { return []; }
  addVehicle(id: string, v: any) { this.notify(); }
  getCourierFinancials(id: string) { return { balance: 1450.50, pending: 200, blocked: 0, transactions: [] }; }
  getCourierReviews(id: string) { return []; }
  getCourierGamification(id: string) { return { level: 5, xp: 2450, nextLevelXp: 3000, badges: ['Pontual', 'Veloz'] }; }
  getCourierProfile(id: string) { return this.users.find(u => u.id === id); }
  requestWithdrawal(id: string, amount: number) { return { success: true }; }
  getOrCreateChatSession(orderId: string, role: string, userId: string) {}
  getMessagesForOrder(orderId: string) { return []; }
  sendMessage(orderId: string, sender: string, role: string, text: string, isMe: boolean) {}
  validateCollectionToken(orderId: string, token: string) { return { success: true, message: 'Validado' }; }
  validateDeliveryToken(orderId: string, token: string) { return { success: true, message: 'Validado' }; }
  reportOrderIssue(orderId: string, text: string) {}
  
  getCourierDetails(id: string) { return { deliveries: 154, vehicles: [] }; }
  getTransactions() { return this.transactions; }
  getChats() { return this.chats; }
  getTickets() { return this.tickets; }
  getReviews() { return this.reviews; }
  getMarketingCampaigns() { return this.marketingCampaigns; }
  getPartners() { return this.partners; }
  getPages() { return this.pages; }
  simulateWalletTransaction(userId: string, amount: number, type: string) {
      this.transactions.unshift({ 
          id: Date.now().toString(), 
          date: 'Agora', 
          type: type as any, 
          category: 'Carteira', 
          details: type === 'DEPOSIT' ? 'Depósito' : 'Transferência', 
          amount, 
          status: 'CONCLUIDO' 
      });
      this.notify();
  }
  getPromotionalItems() { return { stores: this.stores, couriers: this.couriers }; }
  getTasks(userId: string) { return this.tasks; }
  addTask(userId: string, title: string, desc: string) { 
      this.tasks.push({ id: Date.now().toString(), userId, title, status: 'PENDING', createdAt: Date.now() }); 
      this.notify();
  }
  completeTask(id: string) {
      const t = this.tasks.find(x => x.id === id);
      if(t) { t.status = 'DONE'; this.notify(); }
  }
  deleteTask(id: string) {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.notify();
  }
  submitReview(author: string, target: string, rating: number, comment: string, type: string) {
      this.reviews.push({ id: Date.now().toString(), author, target, rating, comment, type, date: 'Agora' });
      this.notify();
  }
}

export const carboSystem = new CarboSystem();