"use client";

import { useUsers } from '@/hooks/use-users';
import { UserManager } from '@/components/users/UserManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, AlertTriangle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function UsersPage() {
  const {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getActiveUsers,
  } = useUsers();
  const { user, logout } = useAuth();

  const activeUsers = getActiveUsers();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-300">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciamento de Usuários</h1>
          <p className="text-slate-400">Controle de acesso e permissões do sistema</p>
        </div>

        {/* Alertas */}
        {users.filter(u => u.status === 'suspended').length > 0 && (
          <Card className="mb-6 bg-red-500/10 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-medium text-red-300">
                    {users.filter(u => u.status === 'suspended').length} usuário(s) suspenso(s)
                  </p>
                  <p className="text-sm text-red-200">
                    Verifique as contas suspensas na lista abaixo
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{users.length}</p>
              <p className="text-sm text-slate-400">Total de Usuários</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-500/30">
            <CardContent className="p-6 text-center">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{activeUsers.length}</p>
              <p className="text-sm text-slate-400">Usuários Ativos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600/10 to-rose-600/10 border-red-500/30">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{users.filter(u => u.status === 'suspended').length}</p>
              <p className="text-sm text-slate-400">Suspensos</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-sm text-slate-400">Administradores</p>
            </CardContent>
          </Card>
        </div>

        {/* User Manager */}
        <UserManager
          users={users}
          onAddUser={addUser}
          onUpdateUser={updateUser}
          onDeleteUser={deleteUser}
        />

        {/* Logout button at bottom */}
        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={logout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}