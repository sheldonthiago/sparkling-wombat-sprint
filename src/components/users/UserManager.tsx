"use client";

import * as React from 'react';
import { User } from '@/types/user';
import { USER_ROLES, USER_STATUSES } from '@/types/user'; // Added both imports
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserForm } from '@/components/users/UserForm';
import { UserList } from '@/components/users/UserList';
import { Plus, Users, Search, Filter } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface UserManagerProps {
  users: User[];
  onAddUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  onDeleteUser: (id: string) => void;
}

export function UserManager({ users, onAddUser, onUpdateUser, onDeleteUser }: UserManagerProps) {
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<User | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.matricula && user.matricula.includes(searchQuery));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSubmit = (data: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>) => {
    try {
      if (editingUser) {
        onUpdateUser(editingUser.id, data);
        showSuccess('Usuário atualizado com sucesso!');
      } else {
        onAddUser(data);
        showSuccess('Usuário adicionado com sucesso!');
      }
      
      setShowAddForm(false);
      setEditingUser(null);
    } catch (error) {
      showError('Erro ao salvar usuário');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowAddForm(true);
  };

  const handleCloseDialog = () => {
    setShowAddForm(false);
    setEditingUser(null);
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    admins: users.filter(u => u.role === 'admin').length,
    byRole: {
      admin: users.filter(u => u.role === 'admin').length,
      manager: users.filter(u => u.role === 'manager').length,
      technician: users.filter(u => u.role === 'technician').length,
      viewer: users.filter(u => u.role === 'viewer').length,
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gerenciamento de Usuários</h3>
          <p className="text-sm text-gray-500">
            {stats.total} usuários • {stats.active} ativos • {stats.admins} administradores
          </p>
        </div>
        <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setShowAddForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Editar Usuário' : 'Adicionar Novo Usuário'}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              onSubmit={handleSubmit}
              onCancel={() => { setShowAddForm(false); resetForm(); }}
              initialData={editingUser ? {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                department: editingUser.department,
                matricula: editingUser.matricula,
                phone: editingUser.phone,
                status: editingUser.status,
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-blue-100 text-blue-800' },
          { label: 'Ativos', value: stats.active, color: 'bg-green-100 text-green-800' },
          { label: 'Admins', value: stats.byRole.admin, color: 'bg-red-100 text-red-800' },
          { label: 'Técnicos', value: stats.byRole.technician, color: 'bg-purple-100 text-purple-800' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input                type="text"
                placeholder="Buscar por nome, email ou matrícula..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os perfis</option>
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                {USER_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User List */}
      <UserList        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={onDeleteUser}
      />
    </div>
  );
}