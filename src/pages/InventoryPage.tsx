"use client";

import { useState } from 'react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { InventoryItem } from '@/types/inventory';
import { InventoryForm } from '@/components/inventory/InventoryForm';
import { InventoryList } from '@/components/inventory/InventoryList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

export default function InventoryPage() {
  const {
    items,
    stats,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    allocateItem,
    returnItem,
    loading
  } = useSupabaseInventory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

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