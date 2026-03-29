import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { InventoryItem, InventoryMovement, InventoryStats, SoftwareLicense, MaintenanceContract } from '@/types/inventory';

type SupabaseInventoryItem = Database['public']['Tables']['inventory_items']['Row'];
type SupabaseMovement = Database['public']['Tables']['inventory_movements']['Row'];
type SupabaseSoftwareLicense = Database['public']['Tables']['software_licenses']['Row'];
type SupabaseMaintenanceContract = Database['public']['Tables']['maintenance_contracts']['Row'];

export function useSupabaseInventory() {
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
  const [loading, setLoading] = useState(true);

  // Converter tipos do Supabase para tipos locais
  const convertItem = (item: SupabaseInventoryItem): InventoryItem => ({
    id: item.id,
    name: item.name,
    category: item.category,
    type: item.type,
    manufacturer: item.manufacturer,
    model: item.model,
    specifications: item.specifications,
    serialNumber: item.serial_number,
    acquisitionDate: new Date(item.acquisition_date),
    warrantyExpiry: item.warranty_expiry ? new Date(item.warranty_expiry) : null,
    location: item.location,
    status: item.status,
    supplier: item.supplier,
    invoiceNumber: item.invoice_number,
    value: item.value,
    assignedTo: item.assigned_to,
    assignedDate: item.assigned_date ? new Date(item.assigned_date) : undefined,
    notes: item.notes,
    lastUpdated: new Date(item.updated_at),
  });

  const convertMovement = (movement: SupabaseMovement): InventoryMovement => ({
    id: movement.id,
    itemId: movement.item_id,
    type: movement.type,
    quantity: movement.quantity,
    reason: movement.reason,
    date: new Date(movement.date),
    user: movement.user,
    recipient: movement.recipient,
    returnDate: movement.return_date ? new Date(movement.return_date) : undefined,
  });

  const convertSoftwareLicense = (license: SupabaseSoftwareLicense): SoftwareLicense => ({
    id: license.id,
    name: license.name,
    version: license.version,
    key: license.key,
    quantity: license.quantity,
    usedQuantity: license.used_quantity,
    expiryDate: license.expiry_date ? new Date(license.expiry_date) : null,
    assignedTo: license.assigned_to,
    supplier: license.supplier,
    value: license.value,
    notes: license.notes,
  });

  const convertMaintenanceContract = (contract: SupabaseMaintenanceContract): MaintenanceContract => ({
    id: contract.id,
    equipmentId: contract.equipment_id,
    provider: contract.provider,
    startDate: new Date(contract.start_date),
    endDate: new Date(contract.end_date),
    serviceLevel: contract.service_level,
    cost: contract.cost,
    status: contract.status,
    notes: contract.notes,
  });

  // Carregar dados do Supabase
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Carregar itens
      const { data: itemsData, error: itemsError } = await supabase
        .from('inventory_items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (itemsError) throw itemsError;
      
      // Carregar movimentações
      const { data: movementsData, error: movementsError } = await supabase
        .from('inventory_movements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (movementsError) throw movementsError;
      
      // Carregar licenças de software
      const { data: softwareData, error: softwareError } = await supabase
        .from('software_licenses')
        .select('*');
      
      if (softwareError) throw softwareError;
      
      // Carregar contratos de manutenção
      const { data: contractsData, error: contractsError } = await supabase
        .from('maintenance_contracts')
        .select('*');
      
      if (contractsError) throw contractsError;
      
      setItems(itemsData.map(convertItem));
      setMovements(movementsData.map(convertMovement));
      setSoftwareLicenses(softwareData.map(convertSoftwareLicense));
      setMaintenanceContracts(contractsData.map(convertMaintenanceContract));
      
    } catch (error) {
      console.error('Error loading data from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Ouvir mudanças em tempo real
    const itemsSubscription = supabase
      .channel('inventory-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items'
        },
        () => loadData()
      )
      .subscribe();
    
    const movementsSubscription = supabase
      .channel('inventory-movements-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_movements'
        },
        () => loadData()
      )
      .subscribe();
    
    return () => {
      itemsSubscription.unsubscribe();
      movementsSubscription.unsubscribe();
    };
  }, []);

  // Calcular estatísticas
  useEffect(() => {
    const totalItems = items.length;
    const totalValue = items.reduce((sum, item) => sum + (item.value || 0), 0);
    const lowStockItems = items.filter(item => item.status === 'maintenance').length;
    const outOfStockItems = items.filter(item => item.status === 'discarded').length;
    const itemsNearWarrantyExpiry = items.filter(item => 
      item.warrantyExpiry && 
      new Date(item.warrantyExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000
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
  }, [items]);

  const addItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([{
          name: item.name,
          category: item.category,
          type: item.type,
          manufacturer: item.manufacturer,
          model: item.model,
          specifications: item.specifications,
          serial_number: item.serialNumber,
          acquisition_date: item.acquisitionDate.toISOString(),
          warranty_expiry: item.warrantyExpiry?.toISOString() || null,
          location: item.location,
          status: item.status,
          supplier: item.supplier,
          invoice_number: item.invoiceNumber,
          value: item.value,
          assigned_to: item.assignedTo,
          assigned_date: item.assignedDate?.toISOString() || null,
          notes: item.notes,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Registrar movimento de entrada
      await addMovement({
        itemId: data.id,
        type: 'entry',
        quantity: 1,
        reason: 'Cadastro inicial',
        date: new Date(),
        user: 'Sistema'
      });
      
      return data;
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<InventoryItem>) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          category: updates.category,
          type: updates.type,
          manufacturer: updates.manufacturer,
          model: updates.model,
          specifications: updates.specifications,
          serial_number: updates.serialNumber,
          acquisition_date: updates.acquisitionDate?.toISOString(),
          warranty_expiry: updates.warrantyExpiry?.toISOString() || null,
          location: updates.location,
          status: updates.status,
          supplier: updates.supplier,
          invoice_number: updates.invoiceNumber,
          value: updates.value,
          assigned_to: updates.assignedTo,
          assigned_date: updates.assignedDate?.toISOString() || null,
          notes: updates.notes,
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating item:', error);
      throw error;
    }
  };

  const addMovement = async (movement: Omit<InventoryMovement, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('inventory_movements')
        .insert([{
          item_id: movement.itemId,
          type: movement.type,
          quantity: movement.quantity,
          reason: movement.reason,
          date: movement.date.toISOString(),
          user: movement.user,
          recipient: movement.recipient,
          return_date: movement.returnDate?.toISOString() || null,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar status do item conforme o tipo de movimento
      const item = items.find(i => i.id === movement.itemId);
      if (item) {
        switch (movement.type) {
          case 'loan':
            await updateItem(item.id, { 
              status: 'allocated',
              assignedTo: movement.recipient,
              assignedDate: new Date()
            });
            break;
          case 'return':
            await updateItem(item.id, { 
              status: 'available',
              assignedTo: undefined,
              assignedDate: undefined
            });
            break;
          case 'maintenance':
            await updateItem(item.id, { status: 'maintenance' });
            break;
          case 'discard':
            await updateItem(item.id, { status: 'discarded' });
            break;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error adding movement:', error);
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting item:', error);
      throw error;
    }
  };

  const allocateItem = async (itemId: string, recipient: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      await updateItem(itemId, { 
        status: 'allocated',
        assignedTo: recipient,
        assignedDate: new Date()
      });
      
      await addMovement({
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

  const returnItem = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      await updateItem(itemId, { 
        status: 'available',
        assignedTo: undefined,
        assignedDate: undefined
      });
      
      await addMovement({
        itemId,
        type: 'return',
        quantity: 1,
        reason: 'Devolução',
        date: new Date(),
        user: 'Sistema'
      });
    }
  };

  const addSoftwareLicense = async (license: Omit<SoftwareLicense, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('software_licenses')
        .insert([{
          name: license.name,
          version: license.version,
          key: license.key,
          quantity: license.quantity,
          used_quantity: license.usedQuantity,
          expiry_date: license.expiryDate?.toISOString() || null,
          assigned_to: license.assignedTo,
          supplier: license.supplier,
          value: license.value,
          notes: license.notes,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding software license:', error);
      throw error;
    }
  };

  const updateSoftwareLicense = async (id: string, updates: Partial<SoftwareLicense>) => {
    try {
      const { error } = await supabase
        .from('software_licenses')
        .update({
          name: updates.name,
          version: updates.version,
          key: updates.key,
          quantity: updates.quantity,
          used_quantity: updates.usedQuantity,
          expiry_date: updates.expiryDate?.toISOString() || null,
          assigned_to: updates.assignedTo,
          supplier: updates.supplier,
          value: updates.value,
          notes: updates.notes,
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error updating software license:', error);
      throw error;
    }
  };

  const addMaintenanceContract = async (contract: Omit<MaintenanceContract, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_contracts')
        .insert([{
          equipment_id: contract.equipmentId,
          provider: contract.provider,
          start_date: contract.startDate.toISOString(),
          end_date: contract.endDate.toISOString(),
          service_level: contract.serviceLevel,
          cost: contract.cost,
          status: contract.status,
          notes: contract.notes,
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding maintenance contract:', error);
      throw error;
    }
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
    loading,
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
    getItemsNearWarrantyExpiry,
    loadData,
  };
}