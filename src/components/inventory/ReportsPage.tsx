"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, FileText, Calendar, Users, Package, Wrench, TrendingUp } from 'lucide-react';
import { useSupabaseInventory } from '@/hooks/use-supabase-inventory';
import { ExportManager } from '@/components/inventory/ExportManager';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsPage() {
  const { 
    items, 
    movements, 
    printerSupplies, 
    maintenances, 
    softwareLicenses, 
    stats, 
    loading 
  } = useSupabaseInventory();
  const { user, logout } = useAuth();
  const [selectedReport, setSelectedReport] = useState('dashboard');
  const [dateRange, setDateRange] = useState('last30days');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const generateReportData = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentMovements = movements.filter(m => 
      new Date(m.date) >= thirtyDaysAgo
    );
    
    const recentMaintenances = maintenances.filter(m => 
      new Date(m.startDate) >= thirtyDaysAgo
    );

    return {
      totalAssets: items.length,
      totalValue: stats.totalValue,
      activeAssets: items.filter(i => i.status === 'available').length,
      allocatedAssets: items.filter(i => i.status === 'allocated').length,
      maintenanceAssets: items.filter(i => i.status === 'maintenance').length,
      recentMovements: recentMovements.length,
      recentMaintenances: recentMaintenances.length,
      lowStockSupplies: printerSupplies.filter(s => s.quantity <= s.minStock && s.quantity > 0).length,
      outOfStockSupplies: printerSupplies.filter(s => s.quantity === 0).length,
      expiringWarranties: items.filter(i => 
        i.warrantyExpiry && 
        new Date(i.warrantyExpiry).getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000
      ).length
    };
  };

  const reportData = generateReportData();

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 mb-1">Total de Ativos</p>
                <p className="text-3xl font-bold text-white">{reportData.totalAssets}</p>
              </div>
              <Package className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/10 to-emerald-600/10 border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 mb-1">Valor Total</p>
                <p className="text-3xl font-bold text-white">R$ {reportData.totalValue.toFixed(2)}</p>
              </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-600/10 to-amber-600/10 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400 mb-1">Em Manutenção</p>
                <p className="text-3xl font-bold text-white">{reportData.maintenanceAssets}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/10 to-pink-600/10 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-400 mb-1">Alocados</p>
                <p className="text-3xl font-bold text-white">{reportData.allocatedAssets}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-red-600/10 to-rose-600/10 border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Alertas e Notificações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-300">
                    Garantias Próximas de Expirar
                  </span>
                </div>
                <Badge variant="destructive">{reportData.expiringWarranties}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-300">
                    Suprimentos com Estoque Baixo
                  </span>
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                  {reportData.lowStockSupplies}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-red-400" />
                  <span className="text-sm font-medium text-red-300">
                    Suprimentos Esgotados
                  </span>
                </div>
                <Badge variant="destructive">{reportData.outOfStockSupplies}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-600/10 to-blue-600/10 border-indigo-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-indigo-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-300">
                    Movimentações Últimos 30 dias
                  </span>
                </div>
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                  {reportData.recentMovements}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-purple-400" />
                  <span className="text-sm font-medium text-purple-300">
                    Manutenções Últimos 30 dias
                  </span>
                </div>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {reportData.recentMaintenances}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-green-400" />
                  <span className="text-sm font-medium text-green-300">
                    Licenças de Software
                  </span>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  {softwareLicenses.length}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAssetReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Relatório de Ativos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">{items.length}</p>
              <p className="text-sm text-blue-300">Total de Ativos</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{stats.totalValue.toFixed(2)}</p>
              <p className="text-sm text-green-300">Valor Total (R$)</p>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-400">{stats.allocatedItems}</p>
              <p className="text-sm text-purple-300">Alocados</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Distribuição por Status</h4>
            <div className="space-y-2">
              {[
                { status: 'available', label: 'Disponível', count: items.filter(i => i.status === 'available').length, color: 'bg-green-500' },
                { status: 'allocated', label: 'Alocado', count: items.filter(i => i.status === 'allocated').length, color: 'bg-blue-500' },
                { status: 'maintenance', label: 'Em Manutenção', count: items.filter(i => i.status === 'maintenance').length, color: 'bg-yellow-500' },
                { status: 'discarded', label: 'Descartado', count: items.filter(i => i.status === 'discarded').length, color: 'bg-red-500' },
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.count} ativos</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMaintenanceReport = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-yellow-400" />
            Relatório de Manutenções
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
              <p className="text-2xl font-bold text-yellow-400">{maintenances.length}</p>
              <p className="text-sm text-yellow-300">Total de Manutenções</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <p className="text-2xl font-bold text-green-400">{maintenances.filter(m => m.status === 'completed').length}</p>
              <p className="text-sm text-green-300">Concluídas</p>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-400">{maintenances.filter(m => m.status === 'in_progress').length}</p>
              <p className="text-sm text-blue-300">Em Andamento</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Manutenções por Prioridade</h4>
            <div className="space-y-2">
              {[
                { priority: 'critical', label: 'Crítica', count: maintenances.filter(m => m.priority === 'critical').length, color: 'bg-red-500' },
                { priority: 'high', label: 'Alta', count: maintenances.filter(m => m.priority === 'high').length, color: 'bg-orange-500' },
                { priority: 'medium', label: 'Média', count: maintenances.filter(m => m.priority === 'medium').length, color: 'bg-yellow-500' },
                { priority: 'low', label: 'Baixa', count: maintenances.filter(m => m.priority === 'low').length, color: 'bg-green-500' },
              ].map((item) => (
                <div key={item.priority} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                  <span className="text-sm text-slate-400">{item.count} manutenções</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/30 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Relatórios</h1>
              <p className="text-slate-400">Análise e exportação de dados do sistema</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48 bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last30days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last90days">Últimos 90 dias</SelectItem>
                  <SelectItem value="thisyear">Este ano</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-700/30 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'assets', label: 'Ativos', icon: Package },
              { id: 'maintenance', label: 'Manutenções', icon: Wrench },
              { id: 'movements', label: 'Movimentações', icon: ArrowRightLeft },
              { id: 'supplies', label: 'Suprimentos', icon: FileText },
              { id: 'licenses', label: 'Licenças', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedReport === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-500'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {selectedReport === 'dashboard' && renderDashboard()}
        {selectedReport === 'assets' && renderAssetReport()}
        {selectedReport === 'maintenance' && renderMaintenanceReport()}
        {selectedReport === 'movements' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-blue-400" />
                  Relatório de Movimentações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-blue-400">{movements.length}</p>
                    <p className="text-sm text-blue-300">Total de Movimentações</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{movements.filter(m => m.type === 'entry').length}</p>
                    <p className="text-sm text-green-300">Entradas</p>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{movements.filter(m => m.type === 'exit').length}</p>
                    <p className="text-sm text-red-300">Saídas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {selectedReport === 'supplies' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-400" />
                  Relatório de Suprimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{printerSupplies.length}</p>
                    <p className="text-sm text-green-300">Total de Suprimentos</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-400">{reportData.lowStockSupplies}</p>
                    <p className="text-sm text-yellow-300">Estoque Baixo</p>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{reportData.outOfStockSupplies}</p>
                    <p className="text-sm text-red-300">Esgotados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {selectedReport === 'licenses' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Relatório de Licenças
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-purple-400">{softwareLicenses.length}</p>
                    <p className="text-sm text-purple-300">Total de Licenças</p>
                  </div>
                  <div className="text-center p-4 bg-green-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-400">{softwareLicenses.filter(l => l.quantity > l.usedQuantity).length}</p>
                    <p className="text-sm text-green-300">Disponíveis</p>
                  </div>
                  <div className="text-center p-4 bg-red-500/10 rounded-lg">
                    <p className="text-2xl font-bold text-red-400">{softwareLicenses.filter(l => l.quantity <= l.usedQuantity).length}</p>
                    <p className="text-sm text-red-300">Esgotadas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Export Section */}
        <div className="mt-8">
          <ExportManager
            items={items}
            movements={movements}
            supplies={printerSupplies}
            maintenances={maintenances}
          />
        </div>
      </main>
    </div>
  );
}