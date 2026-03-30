export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'viewer' | 'technician';
  department: string;
  matricula?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  passwordHash?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const USER_ROLES = [
  { value: 'admin', label: 'Administrador', color: 'bg-red-100 text-red-800', description: 'Acesso total ao sistema' },
  { value: 'manager', label: 'Gerente', color: 'bg-blue-100 text-blue-800', description: 'Gestão de ativos e relatórios' },
  { value: 'technician', label: 'Técnico', color: 'bg-green-100 text-green-800', description: 'Acesso a manutenções e movimentações' },
  { value: 'viewer', label: 'Visualizador', color: 'bg-gray-100 text-gray-800', description: 'Apenas visualização' }
];

export const USER_STATUSES = [
  { value: 'active', label: 'Ativo', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inativo', color: 'bg-gray-100 text-gray-800' },
  { value: 'suspended', label: 'Suspenso', color: 'bg-red-100 text-red-800' }
];

export const DEPARTMENTS = [
  'TI',
  'Financeiro',
  'RH',
  'Compras',
  'Operações',
  'Diretoria',
  'Suporte',
  'Infraestrutura',
  'Desenvolvimento',
  'Segurança da Informação'
];