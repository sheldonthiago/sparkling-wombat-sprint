import { useState } from 'react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { ExportManager } from '@/components/inventory/ExportManager';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Wrench, ArrowRightLeft, BookOpen, Printer, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function InventoryPage() {
  const {
    items,
    movements,
    printerSupplies,
    maintenances,
    loading
  } = useSupabaseInventory();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('assets');

  // Section components remain unchanged...

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300">Carregando inventário...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-600/30">
        <div className="p-4">
          <h2 className="font-bold mb-4 text-cyan-400">Navegação</h2>
          <nav className="space-y-2">
            <button
              onClick={() => setActiveSection('assets')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'assets' ? 'bg-cyan-900/50 text-cyan-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Users className="h-4 w-4 mr-3" />
              Ativos
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'users' ? 'bg-blue-900/50 text-blue-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Users className="h-4 w-4 mr-3" />
              Usuários
            </button>
            <button
              onClick={() => setActiveSection('maintenance')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'maintenance' ? 'bg-yellow-900/50 text-yellow-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Wrench className="h-4 w-4 mr-3" />
              Manutenção
            </button>
            <button
              onClick={() => setActiveSection('movements')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'movements' ? 'bg-blue-900/50 text-blue-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <ArrowRightLeft className="h-4 w-4 mr-3" />
              Movimentações
            </button>
            <button
              onClick={() => setActiveSection('licenses')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'licenses' ? 'bg-purple-900/50 text-purple-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <BookOpen className="h-4 w-4 mr-3" />
              Licenças
            </button>
            <button
              onClick={() => setActiveSection('supplies')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'supplies' ? 'bg-green-900/50 text-green-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Printer className="h-4 w-4 mr-3" />
              Suprimentos
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
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Inventário de TI</h1>
          <p className="text-slate-400">Sistema completo de gestão de ativos</p>
        </header>

        {/* Render active section */}
        {activeSection === 'assets' && <AssetsSection />}
        {activeSection === 'users' && <UsersSection />}
        {activeSection === 'maintenance' && <MaintenanceSection />}
        {activeSection === 'movements' && <MovementsSection />}
        {activeSection === 'licenses' && <LicensesSection />}
        {activeSection === 'supplies' && <SuppliesSection />}

        {/* Export Manager */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <ExportManager
            items={items}
            movements={movements}
            supplies={printerSupplies}
            maintenances={maintenances}
          />
        </div>
      </div>
    </div>
  );
}