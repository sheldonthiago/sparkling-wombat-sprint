"use client";

import { useState, useEffect } from 'react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { InventoryItem } from '@/types/inventory';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { InventoryList } from '@/components/inventory/InventoryList';
import { QRCodeGenerator } from '@/components/inventory/QRCodeGenerator';
import { SoftwareLicenseManager } from '@/components/inventory/SoftwareLicenseManager';
import { MaintenanceContractManager } from '@/components/inventory/MaintenanceContractManager';
import { PrinterSupplyManager } from '@/components/inventory/PrinterSupplyManager';
import { MaintenanceManager } from '@/components/inventory/MaintenanceManager';
import { MaintenanceHistory } from '@/components/inventory/MaintenanceHistory';
import { MovementManager } from '@/components/inventory/MovementManager';
import { NotificationSystem } from '@/components/NotificationSystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Package, 
  Key, 
  FileText, 
  QrCode, 
  AlertTriangle, 
  Printer, 
  Wrench, 
  History, 
  ArrowRightLeft,
  Search,
  Filter,
  Download,
  Upload,
  BarChart3,
  Activity,
  Cpu,
  HardDrive,
  Network,
  Zap,
  ChevronRight,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  LayoutDashboard,
  Shield,
  Cloud,
  Database,
  Radar,
  Satellite,
  Orbit,
  Atom,
  Flux,
  Hexagon,
  Triangle,
  Circle,
  Square,
  Pentagon,
  Octagon,
  Video,
  Headphones,
  Monitor,
  Keyboard,
  Mouse,
  Cables,
  Power,
  Signal,
  Wifi,
  Globe,
  Rocket,
  Smartphone,
  Tablet,
  Watch,
  Camera,
  Scanners,
  Server,
  HardDriveDownload,
  HardDriveUpload,
  Router,
  Switch,
  WifiOff,
  Bluetooth,
  Usb,
  Hdmi,
  Vga,
  Display,
  Speaker,
  Mic,
  Gamepad,
  Joystick,
  Tv,
  Radio,
  Battery,
  BatteryCharging,
  BatteryLow,
  BatteryFull,
  BatteryMedium,
  BatteryWarning,
  Lightning,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  CloudMoon,
  Wind,
  Droplets,
  Thermometer,
  Compass,
  Map,
  Navigation,
  Users
} from "lucide-react";

export default function InventoryPage() {
  const {
    items,
    stats,
    softwareLicenses,
    maintenanceContracts,
    printerSupplies,
    maintenances,
    movements,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    allocateItem,
    returnItem,
    addSoftwareLicense,
    updateSoftwareLicense,
    addMaintenanceContract,
    addMaintenance,
    updateMaintenance,
    addPrinterSupply,
    updatePrinterSupply,
    removePrinterSupply,
    getLowStockSupplies,
    getOutOfStockSupplies,
    getMaintenancesByItem,
    loading,
    updateMaintenanceContract
  } = useSupabaseInventory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedItemForMaintenance, setSelectedItemForMaintenance] = useState<InventoryItem | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleAddItem = async (data: any) => {
    try {
      await addItem(data);
      showSuccess('Ativo adicionado com sucesso!');
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao adicionar ativo');
    }
  };

  const handleUpdateItem = async (data: any) => {
    if (!editingItem) return;
    
    try {
      await updateItem(editingItem.id, data);
      showSuccess('Ativo atualizado com sucesso!');
      setEditingItem(null);
    } catch (error) {
      showError('Erro ao atualizar ativo');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este ativo?')) {
      try {
        await deleteItem(id);
        showSuccess('Ativo excluído com sucesso!');
      } catch (error) {
        showError('Erro ao excluir ativo');
      }
    }
  };

  const handleAllocateItem = async (id: string) => {
    const recipient = prompt('Para quem deseja alocar este ativo?');
    if (recipient) {
      try {
        await allocateItem(id, recipient);
        showSuccess('Ativo alocado com sucesso!');
      } catch (error) {
        showError('Erro ao alocar ativo');
      }
    }
  };

  const handleReturnItem = async (id: string) => {
    try {
      await returnItem(id);
      showSuccess('Ativo devolvido com sucesso!');
    } catch (error) {
      showError('Erro ao devolver ativo');
    }
  };

  const handleMaintenance = async (id: string) => {
    setSelectedItemForMaintenance(items.find(item => item.id === id) || null);
  };

  const itemsNearWarrantyExpiry = items.filter(item => 
    item.warrantyExpiry && 
    new Date(item.warrantyExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000
  );

  const itemsExpiringSoon = softwareLicenses.filter(license => 
    license.expiryDate && 
    new Date(license.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
  );

  const contractsExpiringSoon = maintenanceContracts.filter(contract => 
    new Date(contract.endDate).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000
  );

  const lowStockSupplies = getLowStockSupplies();
  const outOfStockSupplies = getOutOfStockSupplies();

  const delayedLoans = movements.filter(movement => 
    movement.type === 'loan' && 
    movement.returnDate && 
    new Date(movement.returnDate) < new Date()
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="text-center z-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          <p className="text-blue-300 text-lg font-medium tracking-wider">CARREGANDO DADOS</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'assets', label: 'Ativos', icon: Package },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'maintenance', label: 'Manutenções', icon: Wrench },
    { id: 'movements', label: 'Movimentações', icon: ArrowRightLeft },
    { id: 'licenses', label: 'Licenças', icon: Key },
    { id: 'contracts', label: 'Contratos', icon: FileText },
    { id: 'supplies', label: 'Suprimentos', icon: Printer },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900/50 backdrop-blur-xl border-r border-slate-700/50 transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Cpu className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="text-xl font-bold text-white">TechAsset</h1>
                <p className="text-xs text-slate-400">Gestão de Ativos</p>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400 border border-blue-500/30' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all">
            <Settings className="h-5 w-5" />
            {sidebarOpen && <span className="font-medium">Configurações</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900/30 backdrop-blur-xl border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-400 hover:text-white"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar ativos, licenças, suprimentos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">Admin</p>
                  <p className="text-xs text-slate-400">TI</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-8 overflow-auto">
          <NotificationSystem
            items={items}
            supplies={printerSupplies}
            movements={movements}
            maintenances={maintenances}
          />

          {/* Dashboard Section */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-slate-400">Visão geral do sistema de ativos</p>
              </div>

              {/* Alertas */}
              {(itemsNearWarrantyExpiry.length > 0 || itemsExpiringSoon.length > 0 || contractsExpiringSoon.length > 0 || lowStockSupplies.length > 0 || outOfStockSupplies.length > 0 || maintenances.filter(m => m.status === 'in_progress').length > 0 || delayedLoans.length > 0) && (
                <div className="p-6 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-amber-400" />
                    </div>
                    <h3 className="font-semibold text-amber-400">Alertas e Notificações</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {itemsNearWarrantyExpiry.length > 0 && (
                      <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <p className="text-amber-300 font-medium">
                          {itemsNearWarrantyExpiry.length} ativo(s) com garantia próxima do vencimento
                        </p>
                      </div>
                    )}
                    {itemsExpiringSoon.length > 0 && (
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-red-300 font-medium">
                          {itemsExpiringSoon.length} licença(s) de software expirando em breve
                        </p>
                      </div>
                    )}
                    {outOfStockSupplies.length > 0 && (
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-red-300 font-medium">
                          {outOfStockSupplies.length} suprimento(s) de impressora esgotado(s)
                        </p>
                      </div>
                    )}
                    {lowStockSupplies.length > 0 && outOfStockSupplies.length === 0 && (
                      <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <p className="text-yellow-300 font-medium">
                          {lowStockSupplies.length} suprimento(s) com estoque baixo
                        </p>
                      </div>
                    )}
                    {delayedLoans.length > 0 && (
                      <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                        <p className="text-red-300 font-medium">
                          {delayedLoans.length} empréstimo(s) atrasado(s)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Total de Ativos", value: stats.totalItems, icon: HardDrive, color: "from-blue-500 to-cyan-500", bg: "from-blue-500/10 to-cyan-500/10" },
                  { label: "Valor Total", value: `R$ ${stats.totalValue.toFixed(2)}`, icon: Activity, color: "from-green-500 to-emerald-500", bg: "from-green-500/10 to-emerald-500/10" },
                  { label: "Em Manutenção", value: stats.maintenanceItems, icon: Wrench, color: "from-yellow-500 to-amber-500", bg: "from-yellow-500/10 to-amber-500/10" },
                  { label: "Alocados", value: stats.allocatedItems, icon: User, color: "from-purple-500 to-pink-500", bg: "from-purple-500/10 to-pink-500/10" }
                ].map((stat, index) => (
                  <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} border border-slate-700/50 group-hover:scale-110 transition-transform`}>
                          <stat.icon className={`h-6 w-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                      <p className="text-sm text-slate-400">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Plus className="h-5 w-5 text-blue-400" />
                      Ações Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => { setActiveSection('assets'); setShowAddForm(true); }}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Adicionar Novo Ativo
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveSection('maintenance')}
                      className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Nova Ordem de Serviço
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setActiveSection('movements')}
                      className="w-full border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Registrar Movimentação
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" />
                      Status do Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Banco de Dados</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                        Conectado
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Sincronização</span>
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
                        Ativo
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Última Atualização</span>
                      <span className="text-sm text-slate-300">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-500/30 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Zap className="h-5 w-5 text-green-400" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">CPU</span>
                        <span className="text-green-400">23%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Memória</span>
                        <span className="text-blue-400">45%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Armazenamento</span>
                        <span className="text-yellow-400">67%</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Assets Section */}
          {activeSection === 'assets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Ativos</h1>
                  <p className="text-slate-400">Controle completo do seu inventário de TI</p>
                </div>
                <Button 
                  onClick={() => setShowAddForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/25"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Ativo
                </Button>
              </div>

              <InventoryList
                items={items}
                onEdit={(item) => {
                  setEditingItem(item);
                  setShowAddForm(true);
                }}
                onDelete={handleDeleteItem}
                onAllocate={handleAllocateItem}
                onReturn={handleReturnItem}
                onMaintenance={handleMaintenance}
              />
            </div>
          )}

          {/* Users Section */}
          {activeSection === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Usuários</h1>
                  <p className="text-slate-400">Controle de acesso e permissões</p>
                </div>
              </div>

              <UserManager
                users={users}
                onAddUser={addUser}
                onUpdateUser={updateUser}
                onDeleteUser={deleteUser}
              />
            </div>
          )}

          {/* Maintenance Section */}
          {activeSection === 'maintenance' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Ordens de Serviço</h1>
                  <p className="text-slate-400">Gestão de manutenções e reparos</p>
                </div>
              </div>

              <MaintenanceManager
                maintenances={maintenances}
                items={items}
                onAddMaintenance={addMaintenance}
                onUpdateMaintenance={updateMaintenance}
              />
            </div>
          )}

          {/* Movements Section */}
          {activeSection === 'movements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Movimentações</h1>
                  <p className="text-slate-400">Histórico de movimentações de ativos</p>
                </div>
              </div>

              <MovementManager
                movements={movements}
                items={items}
                onAddMovement={addMovement}
              />
            </div>
          )}

          {/* Licenses Section */}
          {activeSection === 'licenses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Licenças de Software</h1>
                  <p className="text-slate-400">Gestão de licenças e compliance</p>
                </div>
              </div>

              <SoftwareLicenseManager
                licenses={softwareLicenses}
                onAddLicense={addSoftwareLicense}
                onUpdateLicense={updateSoftwareLicense}
              />
            </div>
          )}

          {/* Contracts Section */}
          {activeSection === 'contracts' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Contratos de Manutenção</h1>
                  <p className="text-slate-400">Gestão de contratos e garantias</p>
                </div>
              </div>

              <MaintenanceContractManager
                contracts={maintenanceContracts}
                onAddContract={addMaintenanceContract}
                onUpdateContract={updateMaintenanceContract}
              />
            </div>
          )}

          {/* Supplies Section */}
          {activeSection === 'supplies' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Suprimentos de Impressora</h1>
                  <p className="text-slate-400">Controle de estoque de suprimentos</p>
                </div>
              </div>

              <PrinterSupplyManager
                supplies={printerSupplies}
                onAddSupply={addPrinterSupply}
                onUpdateSupply={updatePrinterSupply}
                onRemoveSupply={removePrinterSupply}
              />
            </div>
          )}
        </main>
      </div>

      {/* Dialogs */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl bg-slate-900 border-slate-700/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingItem ? 'Editar Ativo' : 'Adicionar Novo Ativo'}
            </DialogTitle>
          </DialogHeader>
          <InventoryForm
            onSubmit={editingItem ? handleUpdateItem : handleAddItem}
            onCancel={() => {
              setShowAddForm(false);
              setEditingItem(null);
            }}
            initialData={editingItem ? {
              name: editingItem.name,
              category: editingItem.category,
              type: editingItem.type,
              manufacturer: editingItem.manufacturer,
              model: editingItem.model,
              specifications: editingItem.specifications,
              serialNumber: editingItem.serialNumber,
              acquisitionDate: editingItem.acquisitionDate.toISOString().split('T')[0],
              warrantyExpiry: editingItem.warrantyExpiry?.toISOString().split('T')[0],
              location: editingItem.location,
              status: editingItem.status,
              supplier: editingItem.supplier,
              invoiceNumber: editingItem.invoiceNumber,
              value: editingItem.value,
              assignedTo: editingItem.assignedTo,
              assignedEmail: editingItem.assignedEmail,
              assignedPhone: editingItem.assignedPhone,
              assignedMatricula: editingItem.assignedMatricula,
              notes: editingItem.notes,
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedItemForMaintenance} onOpenChange={() => setSelectedItemForMaintenance(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-slate-700/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <History className="h-5 w-5 text-blue-400" />
              Histórico de Manutenções
            </DialogTitle>
          </DialogHeader>
          {selectedItemForMaintenance && (
            <MaintenanceHistory
              maintenances={getMaintenancesByItem(selectedItemForMaintenance.id)}
              itemName={selectedItemForMaintenance.name}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}