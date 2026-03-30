import { useState } from 'react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { ExportManager } from '@/components/inventory/ExportManager';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Wrench, ArrowRightLeft, BookOpen, Printer } from 'lucide-react';

export default function InventoryPage() {
  const {
    items,
    movements,
    printerSupplies,
    maintenances,
    loading
  } = useSupabaseInventory();
  const [activeSection, setActiveSection] = useState('assets');

  // Section components
  const AssetsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Ativos
      </h2>
      <p className="text-slate-400">Gerencie seus ativos de TI</p>
      {/* Placeholder for assets UI - replace with actual implementation */ }
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-slate-400">Seção de Ativos</p>
        <p className="text-slate-500 text-sm">Total de ativos: {items.length}</p>
      </div>
    </div>
  );

  const UsersSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
        <Users className="h-5 w-5" />
        Usuários
      </h2>
      <p className="text-slate-400">Gerencie usuários e permissões</p>
      {/* Placeholder for users UI */ }
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-slate-400">Seção de Usuários</p>
      </div>
    </div>
  );

  const MaintenanceSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
        <Wrench className="h-5 w-5" />
        Manutenção
      </h2>
      <p className="text-slate-400">Gerencie ordens de serviço e manutenções</p>
      {/* Placeholder for maintenance UI */ }
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-slate-400">Seção de Manutenção</p>
        <p className="text-slate-500 text-sm">Total de manutenções: {maintenances.length}</p>
      </div>
    </div>
  );

  const MovementsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
        <ArrowRightLeft className="h-5 w-5" />
        Movimentações
      </h2>
      <p className="text-slate-400">Registre e visualize movimentações de ativos</p>
      {/* Placeholder for movements UI */ }
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-slate-400">Seção de Movimentações</p>
        <p className="text-slate-500 text-sm">Total de movimentações: {movements.length}</p>
      </div>
    </div>
  );

  const LicensesSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        Licenças
      </h2>
      <p className="text-slate-400">Gerencie licenças de software</p>
      {/* Placeholder for licenses UI */ }
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-slate-400">Seção de Licenças</p>
      </div>
    </div>
  );

  const SuppliesSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
        <Printer className="h-5 w-5" />
        Suprimentos
      </h2>
      <p className="text-slate-400">Gerencie suprimentos de impressora</p>
      {/* Placeholder for supplies UI */ }
      <div className="bg-slate-800/50 rounded-lg p-4">
        <p className="text-slate-400">Seção de Suprimentos</p>
        <p className="text-slate-500 text-sm">Total de suprimentos: {printerSupplies.length}</p>
      </div>
    </div>
  );

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
            <button              onClick={() => setActiveSection('assets')}
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
            <button              onClick={() => setActiveSection('maintenance')}
              className={`w-full text-left p-3 rounded-lg transition-all ${activeSection === 'maintenance' ? 'bg-yellow-900/50 text-yellow-400' : 'text-slate-300 hover:bg-slate-800/50'}`}
            >
              <Wrench className="h-4 w-4 mr-3" />
              Manutenção            </button>
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
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Inventário de TI</h1>
          <p className="text-slate-400">Sistema completo de gestão de ativos</p>
        </header>

        {/* Render active section */ }
        {activeSection === 'assets' && <AssetsSection />}
        {activeSection === 'users' && <UsersSection />}
        {activeSection === 'maintenance' && <MaintenanceSection />}
        {activeSection === 'movements' && <MovementsSection />}
        {activeSection === 'licenses' && <LicensesSection />}
        {activeSection === 'supplies' && <SuppliesSection />}

        {/* Export Manager - Always visible at the bottom */ }
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <ExportManager
            items={items}
            movements={movements}
            supplies={printerSupplies}
            maintenances={maintenances}
          />
        </div>
      </div>

      {/* Dialogs would go here - left as placeholder */ }
      {/* {/* Dialogs remain unchanged */} */}
    </div>
  );
}