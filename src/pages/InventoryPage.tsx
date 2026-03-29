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
import { Plus, Package, Key, FileText, QrCode, AlertTriangle, Printer, Wrench, History, ArrowRightLeft, Activity, Cpu, HardDrive, Network, Server, Shield, Zap } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-cyan-400 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-2 border-b-blue-400 animate-spin" style={{animationDuration: '1.5s'}}></div>
          </div>
          <p className="text-cyan-300 text-lg font-mono tracking-wider">CARREGANDO DADOS</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative">
      {/* Padrão de fundo tecnológico */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <NotificationSystem
        items={items}
        supplies={printerSupplies}
        movements={movements}
        maintenances={maintenances}
      />

      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">TechAsset Pro</h1>
          </div>
          <p className="text-blue-200/70 ml-12">Sistema Inteligente de Gestão de Ativos de TI</p>
        </div>

        {/* Alertas */}
        {(itemsNearWarrantyExpiry.length > 0 || itemsExpiringSoon.length > 0 || contractsExpiringSoon.length > 0 || lowStockSupplies.length > 0 || outOfStockSupplies.length > 0 || maintenances.filter(m => m.status === 'in_progress').length > 0 || delayedLoans.length > 0) && (
          <Card className="mb-8 bg-gradient-to-r from-red-900/30 via-orange-900/30 to-yellow-900/30 border border-red-500/30 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-300">
                <AlertTriangle className="h-5 w-5" />
                Alertas do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {itemsNearWarrantyExpiry.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                    <div className="p-1 bg-red-500/20 rounded">
                      <Shield className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="text-red-200">{itemsNearWarrantyExpiry.length} ativo(s) com garantia próxima do vencimento</span>
                  </div>
                )}
                {itemsExpiringSoon.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-orange-900/20 rounded-lg border border-orange-500/20">
                    <div className="p-1 bg-orange-500/20 rounded">
                      <Calendar className="h-4 w-4 text-orange-400" />
                    </div>
                    <span className="text-orange-200">{itemsExpiringSoon.length} licença(s) expirando em breve</span>
                  </div>
                )}
                {contractsExpiringSoon.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                    <div className="p-1 bg-yellow-500/20 rounded">
                      <FileText className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="text-yellow-200">{contractsExpiringSoon.length} contrato(s) expirando</span>
                  </div>
                )}
                {outOfStockSupplies.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                    <div className="p-1 bg-red-500/20 rounded">
                      <Printer className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="text-red-200">{outOfStockSupplies.length} suprimento(s) esgotado(s)</span>
                  </div>
                )}
                {lowStockSupplies.length > 0 && outOfStockSupplies.length === 0 && (
                  <div className="flex items-center gap-2 p-2 bg-yellow-900/20 rounded-lg border border-yellow-500/20">
                    <div className="p-1 bg-yellow-500/20 rounded">
                      <Printer className="h-4 w-4 text-yellow-400" />
                    </div>
                    <span className="text-yellow-200">{lowStockSupplies.length} suprimento(s) com estoque baixo</span>
                  </div>
                )}
                {maintenances.filter(m => m.status === 'in_progress').length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-blue-900/20 rounded-lg border border-blue-500/20">
                    <div className="p-1 bg-blue-500/20 rounded">
                      <Wrench className="h-4 w-4 text-blue-400" />
                    </div>
                    <span className="text-blue-200">{maintenances.filter(m => m.status === 'in_progress').length} manutenção(ões) em andamento</span>
                  </div>
                )}
                {delayedLoans.length > 0 && (
                  <div className="flex items-center gap-2 p-2 bg-red-900/20 rounded-lg border border-red-500/20">
                    <div className="p-1 bg-red-500/20 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </div>
                    <span className="text-red-200">{delayedLoans.length} empréstimo(s) atrasado(s)</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Dashboard de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-400" />
                Total de Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">{stats.totalItems}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-cyan-400" />
                Valor Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white group-hover:text-cyan-300 transition-colors">R$ {stats.totalValue.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-yellow-500/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Network className="h-4 w-4 text-yellow-400" />
                Ativos Alocados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white group-hover:text-yellow-300 transition-colors">{stats.allocatedItems}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Wrench className="h-4 w-4 text-orange-400" />
                Em Manutenção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white group-hover:text-orange-300 transition-colors">{stats.maintenanceItems}</p>
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas de suprimentos */}
        {printerSupplies.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Suprimentos Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-cyan-300">{printerSupplies.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Estoque Baixo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-yellow-300">{lowStockSupplies.length}</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-400">Esgotados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-300">{outOfStockSupplies.length}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Seção de Ativos */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg">
                <Server className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">Gerenciamento de Ativos</h2>
            </div>
            <Button 
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ativo
            </Button>
          </div>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm overflow-hidden">
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
        </section>

        {/* Seção de Manutenções */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-400 rounded-lg">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Ordens de Serviço</h2>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6">
            <MaintenanceManager
              maintenances={maintenances}
              items={items}
              onAddMaintenance={addMaintenance}
              onUpdateMaintenance={updateMaintenance}
            />
          </div>
        </section>

        {/* Seção de Movimentações */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg">
              <ArrowRightLeft className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Movimentações de Ativos</h2>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6">
            <MovementManager
              movements={movements}
              items={items}
              onAddMovement={addMovement}
            />
          </div>
        </section>

        {/* Seção de Licenças */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-400 rounded-lg">
              <Key className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Licenças de Software</h2>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6">
            <SoftwareLicenseManager
              licenses={softwareLicenses}
              onAddLicense={addSoftwareLicense}
              onUpdateLicense={updateSoftwareLicense}
            />
          </div>
        </section>

        {/* Seção de Contratos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-400 rounded-lg">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Contratos de Manutenção</h2>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6">
            <MaintenanceContractManager
              contracts={maintenanceContracts}
              onAddContract={addMaintenanceContract}
              onUpdateContract={updateMaintenanceContract}
            />
          </div>
        </section>

        {/* Seção de Suprimentos */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-teal-500 to-green-400 rounded-lg">
              <Printer className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Suprimentos de Impressora</h2>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6">
            <PrinterSupplyManager
              supplies={printerSupplies}
              onAddSupply={addPrinterSupply}
              onUpdateSupply={updatePrinterSupply}
              onRemoveSupply={removePrinterSupply}
            />
          </div>
        </section>

        {/* Seção de Ferramentas */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-400 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Ferramentas</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl backdrop-blur-sm p-6">
              <QRCodeGenerator
                itemId="SAMPLE-001"
                itemName="Exemplo de Ativo"
              />
            </div>
            <Card className="bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-cyan-400" />
                  Ferramentas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-cyan-300">Próximas Funcionalidades</h4>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Importação/exportação de dados CSV</li>
                    <li>• Relatórios personalizados em PDF</li>
                    <li>• Integração com sistema de helpdesk</li>
                    <li>• Controle de múltiplas localizações</li>
                    <li>• Auditoria completa de alterações</li>
                    <li>• API REST para integrações</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-slate-700/50">
                  <h4 className="font-medium mb-2 text-cyan-300">Status do Sistema</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Banco de Dados:</span>
                      <Badge variant="outline" className="border-green-500/50 text-green-300 bg-green-900/20">
                        {stats.totalItems > 0 ? 'Conectado' : 'Desconectado'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Última Atualização:</span>
                      <span className="text-sm font-mono text-cyan-300">{new Date().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Versão:</span>
                      <span className="text-sm font-mono text-cyan-300">v2.0.1</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Dialog para adicionar/editar ativo */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl bg-slate-900 border border-slate-700/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              {editingItem ? (
                <>
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar Ativo
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5 text-cyan-400" />
                  Adicionar Novo Ativo
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
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
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para histórico de manutenções */}
      <Dialog open={!!selectedItemForMaintenance} onOpenChange={() => setSelectedItemForMaintenance(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border border-slate-700/50 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <History className="h-5 w-5 text-cyan-400" />
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