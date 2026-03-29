export interface Maintenance {
  id: string;
  itemId: string;
  title: string;
  description: string;
  type: 'preventive' | 'corrective';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  startDate: Date;
  endDate: Date | null;
  responsible: string;
  responsibleEmail?: string;
  responsiblePhone?: string;
  responsibleMatricula?: string;
  serviceOrder?: string; // Novo campo de ordem de serviço
  cost: number;
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
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

export const MAINTENANCE_TYPES = [
  { value: 'preventive', label: 'Preventiva', color: 'bg-blue-100 text-blue-800' },
  { value: 'corrective', label: 'Corretiva', color: 'bg-red-100 text-red-800' }
];

export const MAINTENANCE_STATUSES = [
  { value: 'scheduled', label: 'Agendada', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'Em Andamento', color: 'bg-blue-100 text-blue-800' },
  { value: 'completed', label: 'Concluída', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelada', color: 'bg-gray-100 text-gray-800' }
];

export const MAINTENANCE_PRIORITIES = [
  { value: 'low', label: 'Baixa', color: 'bg-green-100 text-green-800' },
  { value: 'medium', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Crítica', color: 'bg-red-100 text-red-800' }
];