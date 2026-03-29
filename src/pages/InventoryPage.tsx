"use client";

import { useState } from 'react';
import { useInventory } from '@/hooks/use-inventory';
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
    addMovement
  } = useInventory();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleAddItem = (data: any) => {
    try {
      addItem(data);
      showSuccess('Item adicionado com sucesso!');
      setShowAddForm(false);
    } catch (error) {
      showError('Erro ao adicionar item');
    }
  };

  const handleUpdateItem = (data: any) => {
    if (!editingItem) return;
    
    try {
      updateItem(editingItem.id, data);
      showSuccess('Item atualizado com sucesso!');
      setEditingItem(null);
    } catch (error) {
      showError('Erro ao atualizar item');
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        deleteItem(id);
        showSuccess('Item excluído com sucesso!');
      } catch (error) {
        showError('Erro ao excluir item');
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sistema de Estoque</h1>
        <p className="text-gray-600">Gerencie seu inventário de materiais de informática</p>
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
        onAddMovement={(id) => {
          // Implementar movimentação depois
          console.log('Movimentar item:', id);
        }}
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
              quantity: editingItem.quantity,
              minQuantity: editingItem.minQuantity,
              unit: editingItem.unit,
              price: editingItem.price,
              supplier: editingItem.supplier,
              location: editingItem.location,
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}