export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  type: 'hardware' | 'software' | 'peripheral' | 'component' | 'supply' | 'printer-supply';
  manufacturer: string;
  model: string;
  specifications: string;
  serialNumber: string;
  acquisitionDate: Date;
  warrantyExpiry: Date | null;
  location: string;
  status: 'available' | 'allocated' | 'maintenance' | 'discarded';
  supplier: string;
  invoiceNumber: string;
  value: number;
  assignedTo?: string; // Colaborador/Departamento/Projeto
  assignedDate?: Date;
  notes: string;
  lastUpdated: Date;
}

export interface PrinterSupply {
  id: string;
  name: string;
  type: 'toner' | 'ink' | 'drum' | 'ribbon' | 'paper' | 'maintenance-kit';
  printerModel: string; // Modelo da impressora que usa este suprimento
  printerBrand: string; // Marca da impressora
  quantity: number;
  minStock: number; // Estoque mínimo
  unit: string; // unidade, caixa, etc.
  costPerUnit: number;
  location: string;
  supplier: string;
  lastPurchaseDate: Date | null;
  nextPurchaseDate: Date | null;
  notes: string;
}

export interface PrinterSupplyUsage {
  id: string;
  supplyId: string;
  printerId: string;
  quantityUsed: number;
  date: Date;
  user: string;
  reason: string;
  pagesPrinted?: number; // Para impressoras
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'entry' | 'exit' | 'loan' | 'return' | 'maintenance' | 'discard';
  quantity: number;
  reason: string;
  date: Date;
  user: string;
  recipient?: string; // Para empréstimos
  returnDate?: Date; // Para empréstimos
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  itemsNearWarrantyExpiry: number;
  allocatedItems: number;
  maintenanceItems: number;
}

export interface SoftwareLicense {
  id: string;
  name: string;
  version: string;
  key: string;
  quantity: number;
  usedQuantity: number;
  expiryDate: Date | null;
  assignedTo: string[]; // IDs dos itens onde está instalado
  supplier: string;
  value: number;
  notes: string;
}

export interface MaintenanceContract {
  id: string;
  equipmentId: string;
  provider: string;
  startDate: Date;
  endDate: Date;
  serviceLevel: string;
  cost: number;
  status: 'active' | 'expired' | 'cancelled';
  notes: string;
}

export const CATEGORIES = [
  // Hardware
  'Notebooks',
  'Desktops',
  'Servidores',
  'Switches',
  'Roteadores',
  'Firewalls',
  'Access Points',
  'Monitores',
  'Impressoras',
  
  // Software
  'Sistemas Operacionais',
  'Aplicativos de Escritório',
  'Ferramentas de Desenvolvimento',
  'Bancos de Dados',
  'Antivírus',
  'Backup',
  'Monitoramento',
  
  // Periféricos
  'Mouses',
  'Teclados',
  'Webcams',
  'Headsets',
  'Docks',
  'Tablets',
  'Smartphones',
  
  // Componentes
  'Memória RAM',
  'Discos SSD',
  'Placas de Vídeo',
  'Processadores',
  'Placas Mãe',
  'Fontes',
  'Coolers',
  
  // Suprimentos
  'Cabos Ethernet',
  'Fontes',
  'Adaptadores',
  'Conectores',
  'Suportes',
  'Organizadores',
  'Outros'
];

export const PRINTER_SUPPLY_TYPES = [
  { value: 'toner', label: 'Toner', color: 'bg-blue-100 text-blue-800' },
  { value: 'ink', label: 'Cartucho de Tinta', color: 'bg-green-100 text-green-800' },
  { value: 'drum', label: 'Unidade de Impressão', color: 'bg-purple-100 text-purple-800' },
  { value: 'ribbon', label: 'Fita', color: 'bg-gray-100 text-gray-800' },
  { value: 'paper', label: 'Papel', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'maintenance-kit', label: 'Kit de Manutenção', color: 'bg-red-100 text-red-800' }
];

export const UNITS = [
  'unidade',
  'par',
  'kit',
  'caixa',
  'pacote',
  'metro',
  'litro',
  'kg',
  'requisição'
];

export const STATUSES = [
  { value: 'available', label: 'Disponível', color: 'green' },
  { value: 'allocated', label: 'Alocado', color: 'blue' },
  { value: 'maintenance', label: 'Em Manutenção', color: 'yellow' },
  { value: 'discarded', label: 'Descartado', color: 'red' }
];

export const MOVEMENT_TYPES = [
  { value: 'entry', label: 'Entrada', color: 'green' },
  { value: 'exit', label: 'Saída', color: 'red' },
  { value: 'loan', label: 'Empréstimo', color: 'blue' },
  { value: 'return', label: 'Devolução', color: 'green' },
  { value: 'maintenance', label: 'Manutenção', color: 'yellow' },
  { value: 'discard', label: 'Descarte', color: 'red' }
];