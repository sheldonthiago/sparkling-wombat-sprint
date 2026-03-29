import { useState, useEffect } from 'react';
import { InventoryItem, InventoryMovement, InventoryStats, SoftwareLicense, MaintenanceContract } from '@/types/inventory';

const STORAGE_KEY = 'inventory-data';
const SOFTWARE_KEY = 'software-licenses';
const CONTRACTS_KEY = 'maintenance-contracts';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [softwareLicenses, setSoftwareLicenses] = useState<SoftwareLicense[]>([]);
  const [maintenanceContracts, setMaintenanceContracts] = useState<MaintenanceContract[]>([]);
  const [stats, setStats] = useState<InventoryStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    itemsNearWarrantyExpiry: 0,
    allocatedItems: 0,
    maintenanceItems: 0
  });

  // Carregar dados do localStorage
  useEffect(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY + '-items');
      const savedMovements = localStorage.getItem(STORAGE_KEY + '-movements');
      const savedSoftware = localStorage.getItem(SOFTWARE_KEY);
      const savedContracts = localStorage.getItem(CONTRACTS_KEY);
      
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedMovements) setMovements(JSON.parse(savedMovements));
      if (savedSoftware) setSoftwareLicenses(JSON.parse(savedSoftware));
      if (savedContracts) setMaintenanceContracts(JSON.parse(savedContracts));
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '-items', JSON.stringify(items));
      localStorage.setItem(STORAGE_KEY + '-movements', JSON.stringify(movements));
      localStorage.setItem(SOFTWARE_KEY, JSON.stringify(softwareLicenses));
      localStorage.setItem(CONTRACTS_KEY, JSON.stringify(maintenanceContracts));
      calculateStats();
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [items, movements, softwareLicenses, maintenanceContracts]);

  const calculateStats = () => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
    const lowStockItems = items.filter(item => item.status === 'maintenance').length;
    const outOfStockItems = items.filter(item => item.status === 'discarded').length;
    const itemsNearWarrantyExpiry = items.filter(item => 
      item.warrantyExpiry && 
      new Date(item.warrantyExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000 // 90 dias
    ).length;
    const allocatedItems = items.filter(item => item.status === 'allocated').length;
    const maintenanceItems = items.filter(item => item.status === 'maintenance').length;

    setStats({
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      itemsNearWarrantyExpiry,
      allocatedItems,
      maintenanceItems
    });
  };

  const addItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };
    
    setItems(prev => [...prev, newItem]);
    
    // Registrar movimento de entrada
    addMovement({
      itemId: newItem.id,
      type: 'entry',
      quantity: 1,
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
    
    // Atualizar status do item conforme o tipo de movimento
    const item = items.find(i => i.id === movement.itemId);
    if (item) {
      switch (movement.type) {
        case 'loan':
          updateItem(item.id, { 
            status: 'allocated',
            assignedTo: movement.recipient,
            assignedDate: new Date()
          });
          break;
        case 'return':
          updateItem(item.id, { 
            status: 'available',
            assignedTo: undefined,
            assignedDate: undefined
          });
          break;
        case 'maintenance':
          updateItem(item.id, { status: 'maintenance' });
          break;
        case 'discard':
          updateItem(item.id, { status: 'discarded' });
          break;
      }
    }
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const allocateItem = (itemId: string, recipient: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, { 
        status: 'allocated',
        assignedTo: recipient,
        assignedDate: new Date()
      });
      
      addMovement({
        itemId,
        type: 'loan',
        quantity: 1,
        reason: `Alocado para ${recipient}`,
        date: new Date(),
        user: 'Sistema',
        recipient
      });
    }
  };

  const returnItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      updateItem(itemId, { 
        status: 'available',
        assignedTo: undefined,
        assignedDate: undefined
      });
      
      addMovement({
        itemId,
        type: 'return',
        quantity: 1,
        reason: 'Devolução',
        date: new Date(),
        user: 'Sistema'
      });
    }
  };

  const addSoftwareLicense = (license: Omit<SoftwareLicense, 'id'>) => {
    const newLicense: SoftwareLicense = {
      ...license,
      id: Date.now().toString()
    };
    setSoftwareLicenses(prev => [...prev, newLicense]);
  };

  const updateSoftwareLicense = (id: string, updates: Partial<SoftwareLicense>) => {
    setSoftwareLicenses(prev => prev.map(license => 
      license.id === id ? { ...license, ...updates } : license
    ));
  };

  const addMaintenanceContract = (contract: Omit<MaintenanceContract, 'id'>) => {
    const newContract: MaintenanceContract = {
      ...contract,
      id: Date.now().toString()
    };
    setMaintenanceContracts(prev => [...prev, newContract]);
  };

  const getItemsByStatus = (status: string) => {
    return items.filter(item => item.status === status);
  };

  const getItemsNearWarrantyExpiry = (days: number = 90) => {
    const now = new Date();
    return items.filter(item => 
      item.warrantyExpiry && 
      new Date(item.warrantyExpiry).getTime() - now.getTime() < days * 24 * 60 * 60 * 1000
    );
  };

  return {
    items,
    movements,
    softwareLicenses,
    maintenanceContracts,
    stats,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    allocateItem,
    returnItem,
    addSoftwareLicense,
    updateSoftwareLicense,
    addMaintenanceContract,
    getItemsByStatus,
    getItemsNearWarrantyExpiry
  };
}