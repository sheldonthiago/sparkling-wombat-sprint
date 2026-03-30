"use client";

import { useState } from 'react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Wrench, ArrowRightLeft, BookOpen, Printer, LogOut, Plus, QrCode } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Import the actual components we need
import { InventoryList } from '@/components/inventory/InventoryList';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { QRCodeGenerator } from '@/components/inventory/QRCodeGenerator';
import { UserManager } from '@/components/users/UserManager';
import { MaintenanceManager } from '@/components/inventory/MaintenanceManager';
import { MovementManager } from '@/components/inventory/MovementManager';
import { SoftwareLicenseManager } from '@/components/inventory/SoftwareLicenseManager';
import { PrinterSupplyManager } from '@/components/inventory/PrinterSupplyManager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function InventoryPage() {
  const {
    items,
    movements,
    printerSupplies,
    maintenances,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    allocateItem,
    returnItem,
    addMaintenance,
    updateMaintenance,
    addSoftwareLicense,
    updateSoftwareLicense,
    addPrinterSupply,
    updatePrinterSupply,
    removePrinterSupply
  } = useSupabaseInventory();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('assets');
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showAddMaintenanceForm, setShowAddMaintenanceForm] = useState(false);
  const [showAddMovementForm, setShowAddMovementForm] = useState(false);
  const [showAddLicenseForm, setShowAddLicenseForm] = useState(false);
  const [showAddSupplyForm, setShowAddSupplyForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [editingLicense, setEditingLicense] = useState(null);
  const [editingSupply, setEditingSupply] = useState(null);
  const [selectedItemForQR, setSelectedItemForQR] = useState(null);

  // Handle item form submission
  const handleItemSubmit = (data) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
    } else {
      addItem(data);
    }
    setShowAddItemForm(false);
    setEditingItem(null);
  };

  // Handle user form submission (simplified - would use useUsers hook in reality)
  const handleUserSubmit = (data) => {
    setShowAddUserForm(false);
    setEditingUser(null);
  };

  // Handle maintenance form submission
  const handleMaintenanceSubmit = (data) => {
    if (editingMaintenance) {
      updateMaintenance(editingMaintenance.id, data);
    } else {
      addMaintenance(data);
    }
    setShowAddMaintenanceForm(false);
    setEditingMaintenance(null);
  };

  // Handle license form submission
  const handleLicenseSubmit = (data) => {
    if (editingLicense) {
      updateSoftwareLicense(editingLicense.id, data);
    } else {
      addSoftwareLicense(data);
    }
    setShowAddLicenseForm(false);
    setEditingLicense(null);
  };

  // Handle supply form submission
  const handleSupplySubmit = (data) => {
    if (editingSupply) {
      updatePrinterSupply(editingSupply.id, data);
    } else {
      addPrinterSupply(data);
    }
    setShowAddSupplyForm(false);
    setEditingSupply(null);
  };

  // Handle movement form submission
  const handleMovementSubmit = (data) => {
    addMovement(data);
    setShowAddMovementForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300">Carregando inventário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-600/30">
        <div className="p-4">
          <h2 className="font-bold mb-4 text-cyan-400">Navegação</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('assets')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'assets' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Users className="h-4 w-4 mr-3" />
              Ativos
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'users' ? 'bg-blue-900/50 text-blue-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Users className="h-4 w-4 mr-3" />
              Usuários
            </button>
            <button
              onClick={() => setActiveSection('maintenance')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'maintenance' ? 'bg-yellow-900/50 text-yellow-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Wrench className="h-4 w-4 mr-3" />
              Manutenção
            </button>
            <button
              onClick={() => setActiveSection('movements')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'movements' ? 'bg-blue-900/50 text-blue-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <ArrowRightLeft className="h-4 w-4 mr-3" />
              Movimentações
            </button>
            <button
              onClick={() => setActiveSection('licenses')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'licenses' ? 'bg-purple-900/50 text-purple-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Licenças
            </button>
            <button
              onClick={() => setActiveSection('supplies')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'supplies' ? 'bg-green-900/50 text-green-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Printer className="h-4 w-4 mr-3" />
              Suprimentos
            </button>
          </nav>
        </div>

        {/* User info and logout */}
        {user && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 border-t border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.role}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Inventário de TI</h1>
          <p className="text-slate-400">Sistema completo de gestão de ativos</p>
        </header>

        {/* Render active section */}
        {activeSection === 'assets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Ativos de TI</h3>
              <div className="flex gap-2">
                <Button onClick={() => { setEditingItem(null); setShowAddItemForm(true); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
                
                <Button
                  onClick={() => {}}
                  variant="outline"
                  disabled={!selectedItemForQR}
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  QR Code
                </Button>
                
                <Dialog 
                  open={selectedItemForQR !== null} 
                  onOpenChange={() => setSelectedItemForQR(null)}
                >
                  <DialogTrigger asChild>
                    <div className="hidden" />
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Gerar QR Code</DialogTitle>
                    </DialogHeader>
                    {selectedItemForQR && (
                      <QRCodeGenerator 
                        itemId={selectedItemForQR.id}
                        itemName={selectedItemForQR.name}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {showAddItemForm && (
              <Dialog open={showAddItemForm} onOpenChange={() => setShowAddItemForm(false)}>
                <DialogTrigger asChild>
                  <div className="hidden" />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
                    </DialogTitle>
                  </DialogHeader>
                  <InventoryForm 
                    onSubmit={handleItemSubmit}
                    onCancel={() => setShowAddItemForm(false)}
                    initialData={editingItem}
                  />
                </DialogContent>
              </Dialog>
            )}

            <InventoryList 
              items={items}
              onEdit={(item) => { setEditingItem(item); setShowAddItemForm(true); }}
              onDelete={deleteItem}
              onAllocate={allocateItem}
              onReturn={returnItem}
              onMaintenance={(itemId) => {
                setActiveSection('maintenance');
              }}
            />
          </div>
        )}

        {activeSection === 'users' && (
          <UserManager 
            users={[]} 
            onAddUser={handleUserSubmit}
            onUpdateUser={handleUserSubmit}
            onDeleteUser={(id) => {
            }}
          />
        )}

        {activeSection === 'maintenance' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Manutenções</h3>
              <Button onClick={() => { setEditingMaintenance(null); setShowAddMaintenanceForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Manutenção
              </Button>
            </div>

            {showAddMaintenanceForm && (
              <Dialog open={showAddMaintenanceForm} onOpenChange={() => setShowAddMaintenanceForm(false)}>
                <DialogTrigger asChild>
                  <div className="hidden" />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMaintenance ? 'Editar Manutenção' : 'Adicionar Nova Manutenção'}
                    </DialogTitle>
                  </DialogHeader>
                  <MaintenanceManager 
                    maintenances={maintenances}
                    items={items}
                    onAddMaintenance={addMaintenance}
                    onUpdateMaintenance={updateMaintenance}
                  />
                </DialogContent>
              </Dialog>
            )}

            <MaintenanceManager 
              maintenances={maintenances}
              items={items}
              onAddMaintenance={addMaintenance}
              onUpdateMaintenance={updateMaintenance}
            />
          </div>
        )}

        {activeSection === 'movements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Movimentações</h3>
              <Button onClick={() => { setShowAddMovementForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Movimentação
              </Button>
            </div>

            {showAddMovementForm && (
              <Dialog open={showAddMovementForm} onOpenChange={() => setShowAddMovementForm(false)}>
                <DialogTrigger asChild>
                  <div className="hidden" />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Registrar Nova Movimentação</DialogTitle>
                  </DialogHeader>
                  <MovementManager 
                    movements={movements}
                    items={items}
                    onAddMovement={addMovement}
                  />
                </DialogContent>
              </Dialog>
            )}

            <MovementManager 
              movements={movements}
              items={items}
              onAddMovement={addMovement}
            />
          </div>
        )}

        {activeSection === 'licenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Licenças de Software</h3>
              <Button onClick={() => { setEditingLicense(null); setShowAddLicenseForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Licença
              </Button>
            </div>

            {showAddLicenseForm && (
              <Dialog open={showAddLicenseForm} onOpenChange={() => setShowAddLicenseForm(false)}>
                <DialogTrigger asChild>
                  <div className="hidden" />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLicense ? 'Editar Licença' : 'Adicionar Nova Licença'}
                    </DialogTitle>
                  </DialogHeader>
                  <SoftwareLicenseManager 
                    licenses={softwareLicenses}
                    onAddLicense={addSoftwareLicense}
                    onUpdateLicense={updateSoftwareLicense}
                  />
                </DialogContent>
              </Dialog>
            )}

            <SoftwareLicenseManager 
              licenses={softwareLicenses}
              onAddLicense={addSoftwareLicense}
              onUpdateLicense={updateSoftwareLicense}
            />
          </div>
        )}

        {activeSection === 'supplies' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Suprimentos de Impressora</h3>
              <Button onClick={() => { setEditingSupply(null); setShowAddSupplyForm(true); }}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Suprimento
              </Button>
            </div>

            {showAddSupplyForm && (
              <Dialog open={showAddSupplyForm} onOpenChange={() => setShowAddSupplyForm(false)}>
                <DialogTrigger asChild>
                  <div className="hidden" />
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingSupply ? 'Editar Suprimento' : 'Adicionar Novo Suprimento'}
                    </DialogTitle>
                  </DialogHeader>
                  <PrinterSupplyManager 
                    supplies={printerSupplies}
                    onAddSupply={addPrinterSupply}
                    onUpdateSupply={updatePrinterSupply}
                    onRemoveSupply={removePrinterSupply}
                  />
                </DialogContent>
              </Dialog>
            )}

            <PrinterSupplyManager 
              supplies={printerSupplies}
              onAddSupply={addPrinterSupply}
              onUpdateSupply={updatePrinterSupply}
              onRemoveSupply={removePrinterSupply}
            />
          </div>
        })}
      </div>
    </div>
  );
}