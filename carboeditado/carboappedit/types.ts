/**
 * DOMAIN MODELS & TYPES
 * Source of Truth for all entity definitions.
 */

export enum UserRole {
  GUEST = 'GUEST',
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
  DELIVERY = 'DELIVERY',
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface CreativePermission {
  module: 'Dashboard' | 'Orçamentos' | 'Contratos' | 'Projetos' | 'Kanban' | 'Estoque' | 'Finanças' | 'Chat' | 'Tickets' | 'Funcionários';
  access: 'NONE' | 'VIEW' | 'EDIT';
}

export interface CreativeEmployee {
  id: string;
  name: string;
  role: string;
  username: string;
  status: 'ATIVO' | 'INATIVO';
  mustChangePassword?: boolean;
  permissions: CreativePermission[];
  lastActive: string;
}

export interface CreativeBudget {
  id: string;
  clientName: string;
  description: string;
  materials: string;
  laborValue: number;
  totalValue: number;
  deadline: string;
  status: 'RASCUNHO' | 'ENVIADO' | 'APROVADO' | 'REJEITADO';
  createdAt: number;
}

export interface CreativeContract {
  id: string;
  budgetId: string;
  clientName: string;
  projectName: string;
  value: number;
  deadline: string;
  status: 'ATIVO' | 'EM_ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
}

export interface CreativeFinanceEntry {
  id: string;
  description: string;
  type: 'ENTRADA' | 'SAIDA';
  category: 'MATERIAIS' | 'MAO_DE_OBRA' | 'CUSTO_FIXO' | 'CUSTO_VARIAVEL' | 'RECEITA';
  value: number;
  date: string;
  relatedId?: string; // Projeto ou Contrato
}

export interface CreativeMaterial {
  id: string;
  name: string;
  category: 'MADEIRA' | 'FERRAGEM' | 'INSUMO';
  quantity: number;
  unit: string; 
  minStock: number;
}

export interface CreativeProject {
  id: string;
  clientName: string;
  furnitureType: string;
  description: string;
  measurements: string;
  material: string;
  deadline: string;
  value: number;
  status: 'ORCAMENTO' | 'PRODUCAO' | 'ACABAMENTO' | 'ENTREGA' | 'CONCLUIDO';
  createdAt: number;
}

// REST OF CARBO SYSTEM TYPES
export interface City {
  id: string;
  name: string;
  uf: string;
  neighborhoods: string[];
  active: boolean;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  zip: string;
  complement?: string;
  isDefault?: boolean;
  label?: string; 
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface Order {
  id: string;
  storeId: string;
  customerId: string;
  customerName: string;
  items: OrderItem[]; 
  total: number;
  status: string;
  createdAt: number;
  updatedAt: number;
  timeElapsed: string;
  type: string;
  paymentMethod: string;
  deliveryAddress?: Address;
  deliveryToken?: string;
  collectionToken?: string;
  courierId?: string;
  rejectedCouriers?: string[];
}

export interface Store {
  id: string;
  name: string;
  category: string;
  isOpen: boolean;
  rating: number;
  image: string;
  deliveryFee: number;
  minTime: number;
  maxTime: number;
  rankingPosition?: { daily: number; weekly?: number };
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  minStock: number;
  active: boolean;
}

export interface Courier {
  id: string;
  name: string;
  rating: number;
  vehicle: 'MOTO' | 'CARRO' | 'BIKE';
  status: string;
  phone: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    time: string;
    read: boolean;
    target?: { userId?: string; role?: string | 'ALL' };
    scheduledFor?: number;
    status?: string;
    origin?: string;
}

export interface AuditLog {
    id: string;
    action: string;
    actor: string;
    role: UserRole;
    target: string;
    timestamp: string;
    details: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export interface CarboTask {
    id: string;
    userId: string;
    title: string;
    description?: string;
    dueDate?: string;
    status: 'PENDING' | 'DONE';
    createdAt: number;
}

export interface ChatMessage {
  id: string;
  sender: string; 
  role: string; 
  text: string;
  timestamp: string;
  isMe: boolean;
  systemGenerated?: boolean;
}

export interface ChatSession {
    id: string;
    orderId: string;
    participants: string[];
    messages: ChatMessage[];
    status: 'ACTIVE' | 'CLOSED';
    createdAt: number;
}

export interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  creditsAvailable: number;
  totalAvoidedCO2: number;
  lastUpdated: string;
}

export interface MarketingCampaign {
    id: string;
    name: string;
    type: 'CUPOM' | 'BANNER' | 'PUSH';
    status: 'ATIVA' | 'PAUSADA' | 'EXPIRADA';
    reach: number;
    conversion: number;
    code?: string;
    discountValue?: string;
}

export interface Partner {
    id: string;
    name: string;
    role: string;
    share: number; 
    status: 'ATIVO' | 'INATIVO';
    joinedDate: string;
}

export interface PageContent {
    id: string;
    title: string;
    slug: string;
    lastEdited: string;
    status: 'PUBLICADO' | 'RASCUNHO';
    views: number;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'ABERTO' | 'EM_ANDAMENTO' | 'FECHADO';
  priority: 'BAIXA' | 'MEDIA' | 'ALTA';
  lastUpdate: string;
}

export interface Vehicle {
  id: string;
  type: 'MOTO' | 'CARRO' | 'BIKE' | 'CAMINHAO';
  model: string;
  plate: string;
  status: 'ATIVO' | 'MANUTENCAO' | 'PENDENTE';
  driverId?: string;
}

export interface Occurrence {
    id: string;
    orderId: string;
    reporterId: string;
    reporterRole: UserRole;
    reason: string;
    status: 'OPEN' | 'RESOLVED' | 'DISMISSED';
    createdAt: number;
    createdAtStr: string;
    resolution?: string;
    resolvedBy?: string;
}

export interface FraudAlert {
    id: string;
    targetId: string; 
    targetRole: UserRole;
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    details: string;
    createdAt: number;
    createdAtStr: string;
    status: 'ACTIVE' | 'ACKNOWLEDGED';
}

export interface Competitor {
    id: string;
    name: string;
    distance: string;
    rating: number;
    deliveryFee: number;
    avgTime: string;
    strength: string;
}

export interface StockMovement {
    id: string;
    productId: string;
    productName: string;
    type: 'EXIT' | 'ENTRY' | 'ADJUST';
    quantity: number;
    date: string;
    reason: string;
}
