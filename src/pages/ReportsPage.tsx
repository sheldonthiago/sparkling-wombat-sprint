"use client";

import { ExportManager } from '@/components/inventory/ExportManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Shield, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-600/30">
        <div className="p-4">
          <h2 className="font-bold mb-4 text-cyan-400">Relatórios</h2>
          <nav className="space-y-2">
            <button
              onClick={() => window.history.back()}
              className="w-full text-left p-3 rounded-lg transition-all hover:bg-slate-800/50"
            >
              <Users className="h-4 w-4 mr-3" />
              Voltar
            </button>
          </nav>
        </div>

        {/* User info and logout */}
        {user && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="p-4 border-t border-slate-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.role}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Relatórios de Exportação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-400">
                Gerencie e exporte seus dados de inventário, movimentações, licenças e suprimentos.
                Utilize os botões abaixo para gerar arquivos CSV com as informações desejadas.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Export Buttons */}
        <Card>
          <CardContent className="p-0">
            <ExportManager              items={[]}      // These props would be filled by the parent page if needed
              movements={[]}
              supplies={[]}
              maintenances={[]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}