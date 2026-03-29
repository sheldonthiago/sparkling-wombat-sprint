"use client";

import { User, USER_ROLES, USER_STATUSES } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, User as UserIcon, Mail, Phone, Hash, Calendar, Shield } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

export function UserList({ users, onEdit, onDelete }: UserListProps) {
  const getRoleConfig = (role: string) => {
    return USER_ROLES.find(r => r.value === role) || USER_ROLES[3];
  };

  const getStatusConfig = (status: string) => {
    return USER_STATUSES.find(s => s.value === status) || USER_STATUSES[1];
  };

  const getLastLoginText = (lastLogin?: Date) => {
    if (!lastLogin) return 'Nunca';
    const now = new Date();
    const diff = now.getTime() - new Date(lastLogin).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days} dias atrás`;
    if (days < 30) return `${Math.floor(days / 7)} semanas atrás`;
    return `${Math.floor(days / 30)} meses atrás`;
  };

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
          <p className="text-gray-500">Adicione o primeiro usuário ao sistema.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => {
        const roleConfig = getRoleConfig(user.role);
        const statusConfig = getStatusConfig(user.status);
        
        return (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={roleConfig.color}>
                        {roleConfig.label}
                      </Badge>
                      <Badge className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(user)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
                        onDelete(user.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{user.phone}</span>
                  </div>
                )}
                {user.matricula && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Matrícula: {user.matricula}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user.department}</span>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Criado em: {new Date(user.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>Último login: {getLastLoginText(user.lastLogin)}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}