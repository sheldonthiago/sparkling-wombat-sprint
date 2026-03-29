import { useState, useEffect } from 'react';
import { InventoryItem, InventoryMovement, InventoryStats } from '@/types/inventory';

const STORAGE_KEY = 'inventory-data';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0
  });

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY + '-items');
      const savedMovements = localStorage.getItem(STORAGE_KEY + '-movements');
      
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }
      if (savedMovements) {
        setMovements(JSON.parse(savedMovements));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '-items', JSON.stringify(items));
      localStorage.setItem(STORAGE_KEY + '-movements', JSON.stringify(movements));
      calculateStats();
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [items, movements]);

  const calculateStats = () => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockItems = items.filter(item => item.status === 'low-stock').length;
    const outOfStockItems = items.filter(item => item.status === 'out-of-stock').length;

    setStats({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems
    });
  };

  const addItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated' | 'status'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date(),
      status: item.quantity <= item.minQuantity ? 'out-of-stock' : 
              item.quantity <= item.minQuantity * 1.5 ? 'low-stock' : 'in-stock'
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Registrar movimento de entrada
    addMovement({
      itemId: newItem.id,
      type: 'entry',
      quantity: item.quantity,
      reason: 'Cadastro inicial',
      date: new Date(),
      user: 'Sistema'
    });
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, lastUpdated: new Date() }
        : item
    ));
  };

  const addMovement = (movement: Omit<InventoryMovement, 'id'>) => {
    const newMovement: InventoryMovement = {
      ...movement,
      id: Date.now().toString()
    };
    
    setMovements(prev => [...prev, newMovement]);
    
    // Atualizar quantidade do item
    const item = items.find(i => i.id === movement.itemId);
    if (item) {
      const newQuantity = movement.type === 'entry' 
        ? item.quantity + movement.quantity 
        : item.quantity - movement.quantity;
      
      updateItem(item.id, { 
        quantity: newQuantity,
        status: newQuantity <= item.minQuantity ? 'out-of-stock' : 
                newQuantity <= item.minQuantity * 1.5 ? 'low-stock' : 'in-stock'
      });
    }
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return {
    items,
    movements,
    stats,
    addItem,
    updateItem,
    addMovement,
    deleteItem
  };
}