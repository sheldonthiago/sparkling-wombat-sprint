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
import { ReportsTab } from '@/components/ReportsTab';
import { NotificationSystem } from '@/components/NotificationSystem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Key, FileText, QrCode, AlertTriangle, Printer, Wrench, History, ArrowRightLeft, BarChart3 } from 'lucide-react';
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
  const [selectedTab, setSelectedTab] = useState('inventory');
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
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 relative">
      <NotificationSystem
        items={items}
        supplies={printerSupplies}
        movements={movements}
        maintenances={maintenances}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sistema de Ativos de TI</h1>
        <p className="text-gray-600">Gerencie seu inventário de materiais de informática</p>
      </div>

      {/* Alertas de expiração e estoque */}
      {(itemsNearWarrantyExpiry.length > 0 || itemsExpiringSoon.length > 0 || contractsExpiringSoon.length > 0 || lowStockSupplies.length > 0 || outOfStockSupplies.length > 0 || maintenances.filter(m => m.status === 'in_progress').length > 0 || delayedLoans.length > 0) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Alertas e Notificações</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {itemsNearWarrantyExpiry.length > 0 && (
              <div>
                <p className="text-yellow-700">
                  {itemsNearWarrantyExpiry.length} ativo(s) com garantia próxima do vencimento
                </p>
              </div>
            )}
            {itemsExpiringSoon.length > 0 && (
              <div>
                <p className="text-yellow-700">
                  {itemsExpiringSoon.length} licença(s) de software expirando em breve
                </p>
              </div>
            )}
            {contractsExpiringSoon.length > 0 && (
              <div>
                <p className="text-yellow-700">
                  {contractsExpiringSoon.length} contrato(s) de manutenção expirando em breve
                </p>
              </div>
            )}
            {outOfStockSupplies.length > 0 && (
              <div>
                <p className="text-red-700">
                  {outOfStockSupplies.length} suprimento(s) de impressora esgotado(s)
                </p>
              </div>
            )}
            {lowStockSupplies.length > 0 && outOfStockSupplies.length === 0 && (
              <div>
                <p className="text-yellow-700">
                  {lowStockSupplies.length} suprimento(s) de impressora com estoque baixo
                </p>
              </div>
            )}
            {maintenances.filter(m => m.status === 'in_progress').length > 0 && (
              <div>
                <p className="text-blue-700">
                  {maintenances.filter(m => m.status === 'in_progress').length} manutenção(ões) em andamento
                </p>
              </div>
            )}
            {delayedLoans.length > 0 && (
              <div>
                <p className="text-red-700">
                  {delayedLoans.length} empréstimo(s) atrasado(s)
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dashboard de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total de Ativos</h3>
          <p className="text-2xl font-bold">{stats.totalItems}</p>
        </Card>
        <Card className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
          <p className="text-2xl font-bold">R$ {stats.totalValue.toFixed(2)}</p>
        </Card>
        <Card className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Ativos Alocados</h3>
          <p className="text-2xl font-bold">{stats.allocatedItems}</p>
        </Card>
        <Card className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Em Manutenção</h3>
          <p className="text-2xl font-bold">{stats.maintenanceItems}</p>
        </Card>
      </div>

      {/* Estatísticas de suprimentos */}
      {printerSupplies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Suprimentos Totais</h3>
            <p className="text-2xl font-bold">{printerSupplies.length}</p>
          </Card>
          <Card className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Estoque Baixo</h3>
            <p className="text-2xl font-bold text-yellow-600">{lowStockSupplies.length}</p>
          </Card>
          <Card className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Esgotados</h3>
            <p className="text-2xl font-bold text-red-600">{outOfStockSupplies.length}</p>
          </Card>
        </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Ativos
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Manutenções
          </TabsTrigger>
          <TabsTrigger value="movements" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Movimentações
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Licenças
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="supplies" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Suprimentos
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Ferramentas
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gerenciamento de Ativos</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ativo
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
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <MaintenanceManager
            maintenances={maintenances}
            items={items}
            onAddMaintenance={addMaintenance}
            onUpdateMaintenance={updateMaintenance}
          />
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <MovementManager
            movements={movements}
            items={items}
            onAddMovement={addMovement}
          />
        </TabsContent>

        <TabsContent value="licenses" className="space-y-4">
          <SoftwareLicenseManager
            licenses={softwareLicenses}
            onAddLicense={addSoftwareLicense}
            onUpdateLicense={updateSoftwareLicense}
          />
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <MaintenanceContractManager
            contracts={maintenanceContracts}
            onAddContract={addMaintenanceContract}
            onUpdateContract={updateMaintenanceContract}
          />
        </TabsContent>

        <TabsContent value="supplies" className="space-y-4">
          <PrinterSupplyManager
            supplies={printerSupplies}
            onAddSupply={addPrinterSupply}
            onUpdateSupply={updatePrinterSupply}
            onRemoveSupply={removePrinterSupply}
          />
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QRCodeGenerator
              itemId="SAMPLE-001"
              itemName="Exemplo de Ativo"
            />
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas de Ativos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Próximas Funcionalidades</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Importação/exportação de dados</li>
                    <li>• Relatórios personalizados</li>
                    <li>• Integração com helpdesk</li>
                    <li>• Controle de multilocation</li>
                    <li>• Auditoria de alterações</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status do Sistema</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Banco de Dados:</span>
                      <Badge variant="outline">{stats.totalItems > 0 ? 'Conectado' : 'Desconectado'}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Última Atualização:</span>
                      <span className="text-sm">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportsTab
            items={items}
            supplies={printerSupplies}
            movements={movements}
          />
        </TabsContent>
      </Tabs>

      {/* Dialog para adicionar/editar ativo */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
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

      {/* Dialog para histórico de manutenções */}
      <Dialog open={!!selectedItemForMaintenance} onOpenChange={() => setSelectedItemForMaintenance(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
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