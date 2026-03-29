import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { InventoryItem, InventoryMovement, InventoryStats, SoftwareLicense, MaintenanceContract, PrinterSupply } from '@/types/inventory';

export function useSupabaseInventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [softwareLicenses, setSoftwareLicenses] = useState<SoftwareLicense[]>([]);
  const [maintenanceContracts, setMaintenanceContracts] = useState<MaintenanceContract[]>([]);
  const [printerSupplies, setPrinterSupplies] = useState<PrinterSupply[]>([]);
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
  const [useSupabase, setUseSupabase] = useState(false);

  // Verificar se o Supabase está configurado
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    setUseSupabase(!!(supabaseUrl && supabaseAnonKey));
  }, []);

  // Carregar dados
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        if (useSupabase && supabase) {
          // Carregar do Supabase
          const { data: itemsData, error: itemsError } = await supabase
            .from('inventory_items')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (itemsError) throw itemsError;
          
          const { data: movementsData, error: movementsError } = await supabase
            .from('inventory_movements')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (movementsError) throw movementsError;
          
          const { data: softwareData, error: softwareError } = await supabase
            .from('software_licenses')
            .select('*');
          
          if (softwareError) throw softwareError;
          
          const { data: contractsData, error: contractsError } = await supabase
            .from('maintenance_contracts')
            .select('*');
          
          if (contractsError) throw contractsError;
          
          // Converter dados
          const convertItem = (item: any) => ({
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
          
          const convertMovement = (movement: any) => ({
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
          
          const convertSoftwareLicense = (license: any) => ({
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
          
          const convertMaintenanceContract = (contract: any) => ({
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

          const convertPrinterSupply = (supply: any) => ({
            id: supply.id,
            name: supply.name,
            type: supply.type,
            printerModel: supply.printer_model,
            printerBrand: supply.printer_brand,
            quantity: supply.quantity,
            minStock: supply.min_stock,
            unit: supply.unit,
            costPerUnit: supply.cost_per_unit,
            location: supply.location,
            supplier: supply.supplier,
            lastPurchaseDate: supply.last_purchase_date ? new Date(supply.last_purchase_date) : null,
            nextPurchaseDate: supply.next_purchase_date ? new Date(supply.next_purchase_date) : null,
            notes: supply.notes,
          });
          
          setItems(itemsData.map(convertItem));
          setMovements(movementsData.map(convertMovement));
          setSoftwareLicenses(softwareData.map(convertSoftwareLicense));
          setMaintenanceContracts(contractsData.map(convertMaintenanceContract));
          setPrinterSupplies([]); // Implementar quando tiver tabela no Supabase
        } else {
          // Carregar do localStorage
          const savedItems = localStorage.getItem('inventory-data-items');
          const savedMovements = localStorage.getItem('inventory-data-movements');
          const savedSoftware = localStorage.getItem('software-licenses');
          const savedContracts = localStorage.getItem('maintenance-contracts');
          const savedSupplies = localStorage.getItem('printer-supplies');
          
          if (savedItems) setItems(JSON.parse(savedItems));
          if (savedMovements) setMovements(JSON.parse(savedMovements));
          if (savedSoftware) setSoftwareLicenses(JSON.parse(savedSoftware));
          if (savedContracts) setMaintenanceContracts(JSON.parse(savedContracts));
          if (savedSupplies) setPrinterSupplies(JSON.parse(savedSupplies));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback para localStorage
        const savedItems = localStorage.getItem('inventory-data-items');
        const savedMovements = localStorage.getItem('inventory-data-movements');
        const savedSoftware = localStorage.getItem('software-licenses');
        const savedContracts = localStorage.getItem('maintenance-contracts');
        const savedSupplies = localStorage.getItem('printer-supplies');
        
        if (savedItems) setItems(JSON.parse(savedItems));
        if (savedMovements) setMovements(JSON.parse(savedMovements));
        if (savedSoftware) setSoftwareLicenses(JSON.parse(savedSoftware));
        if (savedContracts) setMaintenanceContracts(JSON.parse(savedContracts));
        if (savedSupplies) setPrinterSupplies(JSON.parse(savedSupplies));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [useSupabase]);

  // Salvar dados
  useEffect(() => {
    const saveData = async () => {
      try {
        if (useSupabase && supabase) {
          // Salvar no Supabase (implementar lógica de salvamento)
          console.log('Saving to Supabase...');
        } else {
          // Salvar no localStorage
          localStorage.setItem('inventory-data-items', JSON.stringify(items));
          localStorage.setItem('inventory-data-movements', JSON.stringify(movements));
          localStorage.setItem('software-licenses', JSON.stringify(softwareLicenses));
          localStorage.setItem('maintenance-contracts', JSON.stringify(maintenanceContracts));
          localStorage.setItem('printer-supplies', JSON.stringify(printerSupplies));
        }
        calculateStats();
      } catch (error) {
        console.error('Error saving data:', error);
      }
    };

    saveData();
  }, [items, movements, softwareLicenses, maintenanceContracts, printerSupplies, useSupabase]);

  const calculateStats = () => {
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

  const addPrinterSupply = (supply: Omit<PrinterSupply, 'id'>) => {
    const newSupply: PrinterSupply = {
      ...supply,
      id: Date.now().toString()
    };
    setPrinterSupplies(prev => [...prev, newSupply]);
  };

  const updatePrinterSupply = (id: string, updates: Partial<PrinterSupply>) => {
    setPrinterSupplies(prev => prev.map(supply => 
      supply.id === id ? { ...supply, ...updates } : supply
    ));
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

  const getLowStockSupplies = () => {
    return printerSupplies.filter(supply => 
      supply.quantity <= supply.minStock && supply.quantity > 0
    );
  };

  const getOutOfStockSupplies = () => {
    return printerSupplies.filter(supply => supply.quantity === 0);
  };

  return {
    items,
    movements,
    softwareLicenses,
    maintenanceContracts,
    printerSupplies,
    stats,
    loading,
    useSupabase,
    addItem,
    updateItem,
    deleteItem,
    addMovement,
    allocateItem,
    returnItem,
    addSoftwareLicense,
    updateSoftwareLicense,
    addMaintenanceContract,
    addPrinterSupply,
    updatePrinterSupply,
    getItemsByStatus,
    getItemsNearWarrantyExpiry,
    getLowStockSupplies,
    getOutOfStockSupplies
  };
}