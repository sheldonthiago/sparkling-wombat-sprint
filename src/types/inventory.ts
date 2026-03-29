export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  price: number;
  supplier: string;
  location: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: Date;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'entry' | 'exit';
  quantity: number;
  reason: string;
  date: Date;
  user: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
}

export const CATEGORIES = [
  'Processadores',
  'Placas Mãe',
  'Memória RAM',
  'Placas de Vídeo',
  'Armazenamento',
  'Fontes',
  'Coolers',
  'Periféricos',
  'Acessórios',
  'Software',
  'Outros'
];

export const UNITS = [
  'unidade',
  'par',
  'kit',
  'caixa',
  'pacote',
  'metro',
  'litro',
  'kg'
];