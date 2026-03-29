"use client";

import { useState } from 'react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { InventoryItem } from '@/types/inventory';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { InventoryList } from '@/components/inventory/InventoryList';
import { QRCodeGenerator } from '@/components/inventory/QRCodeGenerator';
import { SoftwareLicenseManager } from '@/components/inventory/SoftwareLicenseManager';
import { MaintenanceContractManager } from '@/components/inventory/MaintenanceContractManager';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Key, FileText, QrCode, AlertTriangle } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export default function InventoryPage() {
  const {
    items,
    stats,
    softwareLicenses,
    maintenanceContracts,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    allocateItem,
    returnItem,
    addSoftwareLicense,
    updateSoftwareLicense,
    addMaintenanceContract,
    updateMaintenanceContract,
    loading
  } = useSupabaseInventory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedTab, setSelectedTab] = useState('inventory');

  const handleAddItem = async (data: any) => {
    try {
      await addItem(data);
      showSuccess('Item adicionado com sucesso!');
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao adicionar item');
    }
  };

  const handleUpdateItem = async (data: any) => {
    if (!editingItem) return;
    
    try {
      await updateItem(editingItem.id, data);
      showSuccess('Item atualizado com sucesso!');
      setEditingItem(null);
    } catch (error) {
      showError('Erro ao atualizar item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await deleteItem(id);
        showSuccess('Item excluído com sucesso!');
      } catch (error) {
        showError('Erro ao excluir item');
      }
    }
  };

  const handleAllocateItem = async (id: string) => {
    const recipient = prompt('Para quem deseja alocar este item?');
    if (recipient) {
      try {
        await allocateItem(id, recipient);
        showSuccess('Item alocado com sucesso!');
      } catch (error) {
        showError('Erro ao alocar item');
      }
    }
  };

  const handleReturnItem = async (id: string) => {
    try {
      await returnItem(id);
      showSuccess('Item devolvido com sucesso!');
    } catch (error) {
      showError('Erro ao devolver item');
    }
  };

  const handleMaintenance = async (id: string) => {
    try {
      await addMovement({
        itemId: id,
        type: 'maintenance',
        quantity: 1,
        reason: 'Início de manutenção',
        date: new Date(),
        user: 'Sistema'
      });
      showSuccess('Item enviado para manutenção!');
    } catch (error) {
      showError('Erro ao enviar para manutenção');
    }
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
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sistema de Estoque de TI</h1>
        <p className="text-gray-600">Gerencie seu inventário de materiais de informática</p>
      </div>

      {/* Alertas de expiração */}
      {(itemsNearWarrantyExpiry.length > 0 || itemsExpiringSoon.length > 0 || contractsExpiringSoon.length > 0) && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-800">Alertas de Expiração</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {itemsNearWarrantyExpiry.length > 0 && (
              <div>
                <p className="text-yellow-700">
                  {itemsNearWarrantyExpiry.length} item(s) com garantia próxima do vencimento
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
          </div>
        </div>
      )}

      {/* Dashboard de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total de Itens</h3>
          <p className="text-2xl font-bold">{stats.totalItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
          <p className="text-2xl font-bold">R$ {stats.totalValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Itens Alocados</h3>
          <p className="text-2xl font-bold">{stats.allocatedItems}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Em Manutenção</h3>
          <p className="text-2xl font-bold">{stats.maintenanceItems}</p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Estoque
          </TabsTrigger>
          <TabsTrigger value="licenses" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Licenças
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="tools" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            Ferramentas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gerenciamento de Estoque</h2>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
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

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QRCodeGenerator
              itemId="SAMPLE-001"
              itemName="Exemplo de Item"
            />
            <Card>
              <CardHeader>
                <CardTitle>Ferramentas de Inventário</CardTitle>
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
      </Tabs>

      {/* Dialog para adicionar/editar item */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
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
              notes: editingItem.notes,
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}