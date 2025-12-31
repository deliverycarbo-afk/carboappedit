
import React, { useState, useEffect } from 'react';
import { SectionTitle, Card, Badge, Button, Input, Modal } from '../components/UIComponents';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Shield, Bell, User as UserIcon, LogOut, ChevronRight, MapPin, Plus, Trash2 } from 'lucide-react';
import { carboSystem } from '../services/carboSystem';
import { Address } from '../types';

export const WalletPage: React.FC = () => {
  const [modalType, setModalType] = useState<'DEPOSIT' | 'TRANSFER' | null>(null);
  const [amount, setAmount] = useState('');

  const handleTransaction = () => {
      if(!amount || isNaN(Number(amount))) return alert('Valor inválido');
      carboSystem.simulateWalletTransaction('C1', parseFloat(amount), modalType!);
      alert('Transação realizada com sucesso!');
      setModalType(null);
      setAmount('');
  };

  return (
  <div className="space-y-8 animate-in slide-in-from-right-4">
    <SectionTitle title="Minha Carteira" subtitle="Saldo, movimentações e cartões" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card className="lg:col-span-1 bg-gradient-to-br from-carbo-primary to-orange-500 text-white border-none p-8 shadow-lg shadow-orange-500/30">
         <p className="text-xs uppercase font-bold opacity-80 mb-2 tracking-wider">Saldo Total</p>
         <h2 className="text-4xl font-black mb-8 leading-none tracking-tight">R$ 1.450,80</h2>
         <div className="flex gap-4">
           <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white flex-1 border border-white/10" onClick={() => setModalType('TRANSFER')}>Transferir</Button>
           <Button variant="ghost" className="bg-white/20 hover:bg-white/30 text-white flex-1 border border-white/10" onClick={() => setModalType('DEPOSIT')}>Depositar</Button>
         </div>
      </Card>
      <Card className="lg:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Últimas Atividades</h3>
          <Button variant="ghost" className="text-xs">Ver Tudo</Button>
        </div>
        <div className="space-y-4">
          {carboSystem.getTransactions().slice(0, 3).map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-lg ${t.type === 'ENTRADA' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {t.type === 'ENTRADA' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div><p className="text-sm font-bold text-gray-900">{t.details}</p><p className="text-xs text-gray-500 mt-0.5">{t.date}</p></div>
              </div>
              <span className={`font-bold text-sm ${t.type === 'ENTRADA' ? 'text-green-600' : 'text-gray-900'}`}>{t.type === 'ENTRADA' ? '+' : '-'} R$ {t.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={modalType === 'DEPOSIT' ? 'Depositar' : 'Transferir'} footer={<Button className="w-full" onClick={handleTransaction}>Confirmar</Button>}>
        <div className="space-y-4">
            <Input label="Valor (R$)" type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <p className="text-xs text-gray-500">A transação será processada instantaneamente pelo sistema de mock bancário.</p>
        </div>
    </Modal>
  </div>
  );
};

export const SettingsPage: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', number: '', neighborhood: '', city: '', zip: '' });

  useEffect(() => {
      setAddresses(carboSystem.getAddresses('C1'));
  }, []);

  const handleAddAddress = () => {
      if(!newAddress.street || !newAddress.number) return alert('Preencha os dados.');
      carboSystem.addAddress('C1', newAddress);
      setAddresses(carboSystem.getAddresses('C1'));
      setIsAddressModalOpen(false);
      setNewAddress({ label: '', street: '', number: '', neighborhood: '', city: '', zip: '' });
  };

  const handleDeleteAddress = (id: string) => {
      if(confirm('Remover este endereço?')) {
          carboSystem.removeAddress('C1', id);
          setAddresses(carboSystem.getAddresses('C1'));
      }
  };

  return (
  <div className="space-y-8 animate-in slide-in-from-bottom-4">
    <SectionTitle title="Configurações" subtitle="Personalize sua experiência e segurança" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="space-y-3">
         {[
           { id: 'profile', label: 'Meu Perfil', icon: <UserIcon size={18} /> },
           { id: 'security', label: 'Segurança', icon: <Shield size={18} /> },
           { id: 'notifications', label: 'Notificações', icon: <Bell size={18} /> },
         ].map(item => (
           <button key={item.id} className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl text-left hover:border-carbo-primary/50 hover:shadow-sm transition-all group">
             <div className="flex items-center gap-3">
                <div className="text-gray-400 group-hover:text-carbo-primary transition-colors">{item.icon}</div>
                <span className="font-bold text-sm text-gray-700 group-hover:text-gray-900">{item.label}</span>
             </div>
             <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500" />
           </button>
         ))}
         <button className="w-full flex items-center gap-3 p-4 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl transition-colors mt-8 font-bold text-sm">
           <LogOut size={18} /> Encerrar Sessão
         </button>
      </div>
      <Card className="md:col-span-2 space-y-8">
        <div>
           <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-4 mb-6">Informações do Perfil</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input label="Nome" defaultValue="Gabriel Silva" className="bg-gray-50 border-gray-200" />
             <Input label="E-mail" defaultValue="gabriel@carbo.app" className="bg-gray-50 border-gray-200" />
             <Input label="Celular" defaultValue="(11) 98888-8888" className="bg-gray-50 border-gray-200" />
             <Input label="CPF" defaultValue="***.***.***-00" disabled className="bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" />
           </div>
        </div>

        <div>
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Meus Endereços</h3>
                <Button size="sm" variant="ghost" icon={<Plus size={16}/>} onClick={() => setIsAddressModalOpen(true)}>Adicionar</Button>
            </div>
            <div className="space-y-3">
                {addresses.length === 0 && <p className="text-sm text-gray-500">Nenhum endereço cadastrado.</p>}
                {addresses.map(addr => (
                    <div key={addr.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${addr.isDefault ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                <MapPin size={18}/>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-gray-900 text-sm">{addr.label || 'Endereço'}</p>
                                    {addr.isDefault && <Badge variant="success" className="text-[10px] px-1.5 py-0.5">Padrão</Badge>}
                                </div>
                                <p className="text-xs text-gray-500">{addr.street}, {addr.number} - {addr.neighborhood}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={16}/>
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <Button variant="secondary">Cancelar</Button>
          <Button>Salvar Alterações</Button>
        </div>
      </Card>

      <Modal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        title="Novo Endereço"
        footer={<Button className="w-full" onClick={handleAddAddress}>Salvar Endereço</Button>}
      >
          <div className="space-y-4">
              <Input label="Rótulo (ex: Casa, Trabalho)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                  <Input label="CEP" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                  <Input label="Cidade" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
              </div>
              <Input label="Bairro" value={newAddress.neighborhood} onChange={e => setNewAddress({...newAddress, neighborhood: e.target.value})} />
              <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                      <Input label="Logradouro" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                  </div>
                  <Input label="Número" value={newAddress.number} onChange={e => setNewAddress({...newAddress, number: e.target.value})} />
              </div>
          </div>
      </Modal>
    </div>
  );
};
