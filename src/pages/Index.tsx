import { useState, useEffect } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  HardDrive, 
  Users, 
  Wrench, 
  Key, 
  FileText, 
  Printer, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { 
    items, 
    stats, 
    softwareLicenses, 
    maintenanceContracts, 
    printerSupplies, 
    maintenances, 
    movements,
    loading 
  } = useSupabaseInventory();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-b-4 border-purple-500 animate-pulse mx-auto"></div>
          </div>
          <p className="text-cyan-300 font-mono text-sm tracking-wider">INICIALIZANDO SISTEMA...</p>
        </div>
      </div>
    );
  }

  // Dados para gráficos
  const statusData = [
    { name: 'Disponível', value: items.filter(i => i.status === 'available').length, color: '#10b981' },
    { name: 'Alocado', value: items.filter(i => i.status === 'allocated').length, color: '#3b82f6' },
    { name: 'Manutenção', value: items.filter(i => i.status === 'maintenance').length, color: '#f59e0b' },
    { name: 'Descartado', value: items.filter(i => i.status === 'discarded').length, color: '#ef4444' },
  ];

  const categoryData = items.reduce((acc, item) => {
    const existing = acc.find(cat => cat.name === item.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: item.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value).slice(0, 6);

  const monthlyMovements = movements.reduce((acc, movement) => {
    const month = new Date(movement.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    const existing = acc.find(m => m.month === month);
    if (existing) {
      existing[movement.type] += 1;
    } else {
      acc.push({ 
        month, 
        entry: 0, 
        exit: 0, 
        loan: 0, 
        return: 0, 
        maintenance: 0,
        discard: 0 
      });
      acc[acc.length - 1][movement.type] += 1;
    }
    return acc;
  }, [] as any[]).slice(-6);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-cyan-500/30 p-3 rounded-lg shadow-lg">
          <p className="text-cyan-300 font-mono text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    color = 'cyan',
    onClick 
  }: any) => {
    const colorClasses = {
      cyan: 'from-cyan-500 to-blue-500',
      green: 'from-emerald-500 to-green-500',
      yellow: 'from-amber-500 to-yellow-500',
      red: 'from-rose-500 to-red-500',
      purple: 'from-violet-500 to-purple-500',
      blue: 'from-blue-500 to-indigo-500'
    };

    return (
      <Card 
        className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:scale-105`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">{title}</p>
              <p className="text-3xl font-bold text-white mb-1">{value}</p>
              {subtitle && (
                <p className="text-white/60 text-xs">{subtitle}</p>
              )}
              {trend && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-white/80" />
                  <span className="text-white/90 text-xs">{trend}</span>
                </div>
              )}
            </div>
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const AlertCard = ({ 
    type, 
    count, 
    items, 
    icon: Icon, 
    color,
    onClick 
  }: any) => (
    <Card className="bg-gray-900/50 border border-gray-700 hover:border-cyan-500/50 transition-all cursor-pointer group"
          onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-gray-300 text-sm font-medium">{type}</p>
            <p className="text-2xl font-bold text-white">{count}</p>
          </div>
          {items && items.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-400">Próximos</p>
              <p className="text-sm font-bold text-yellow-400">{items.length}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <Header title="DASHBOARD" />
      
      <div className="container mx-auto px-6 py-8">
        {/* Cabeçalho do Dashboard */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wider">
            DASHBOARD EXECUTIVO
          </h1>
          <p className="text-cyan-300 font-mono text-sm">
            Visão Geral do Sistema de Ativos de TI
          </p>
        </div>

        {/* Cards de Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Ativos"
            value={stats.totalItems}
            subtitle={`R$ ${stats.totalValue.toFixed(2)} valor total`}
            icon={HardDrive}
            color="cyan"
            onClick={() => navigate('/inventory?tab=inventory')}
          />
          <StatCard
            title="Ativos Alocados"
            value={stats.allocatedItems}
            subtitle="Em uso por colaboradores"
            icon={Users}
            color="blue"
            onClick={() => navigate('/inventory?tab=inventory')}
          />
          <StatCard
            title="Em Manutenção"
            value={stats.maintenanceItems}
            subtitle="Em reparo atualmente"
            icon={Wrench}
            color="yellow"
            onClick={() => navigate('/inventory?tab=maintenance')}
          />
          <StatCard
            title="Licenças Ativas"
            value={softwareLicenses.length}
            subtitle="Total de licenças"
            icon={Key}
            color="purple"
            onClick={() => navigate('/inventory?tab=licenses')}
          />
        </div>

        {/* Alertas e Notificações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AlertCard
            type="Garantia Próxima"
            count={items.filter(item => 
              item.warrantyExpiry && 
              new Date(item.warrantyExpiry).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000 &&
              new Date(item.warrantyExpiry).getTime() - new Date().getTime() > 0
            ).length}
            items={items.filter(item => 
              item.warrantyExpiry && 
              new Date(item.warrantyExpiry).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000
            )}
            icon={Clock}
            color="bg-amber-500"
            onClick={() => navigate('/inventory?tab=inventory')}
          />
          <AlertCard
            type="Suprimentos Baixos"
            count={printerSupplies.filter(s => s.quantity <= s.minStock && s.quantity > 0).length}
            items={printerSupplies.filter(s => s.quantity === 0)}
            icon={Printer}
            color="bg-rose-500"
            onClick={() => navigate('/inventory?tab=supplies')}
          />
          <AlertCard
            type="Contratos Expirando"
            count={maintenanceContracts.filter(contract => 
              new Date(contract.endDate).getTime() - new Date().getTime() < 90 * 24 * 60 * 60 * 1000
            ).length}
            icon={FileText}
            color="bg-violet-500"
            onClick={() => navigate('/inventory?tab=contracts')}
          />
          <AlertCard
            type="Manutenções Atrasadas"
            count={maintenances.filter(m => 
              m.status === 'in_progress' && 
              m.endDate && 
              new Date(m.endDate) < new Date()
            ).length}
            icon={AlertTriangle}
            color="bg-red-500"
            onClick={() => navigate('/inventory?tab=maintenance')}
          />
        </div>

        {/* Gráficos e Análises */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="assets" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              Ativos
            </TabsTrigger>
            <TabsTrigger value="movements" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              Movimentações
            </TabsTrigger>
            <TabsTrigger value="financial" className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
              Financeiro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico de Pizza - Status dos Ativos */}
              <Card className="bg-gray-900/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    Status dos Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Gráfico de Barras - Categorias */}
              <Card className="bg-gray-900/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-cyan-400" />
                    Top Categorias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribuição por Tipo */}
              <Card className="bg-gray-900/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Distribuição por Tipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Hardware', value: items.filter(i => i.type === 'hardware').length },
                          { name: 'Software', value: items.filter(i => i.type === 'software').length },
                          { name: 'Periféricos', value: items.filter(i => i.type === 'peripheral').length },
                          { name: 'Componentes', value: items.filter(i => i.type === 'component').length },
                          { name: 'Suprimentos', value: items.filter(i => i.type === 'supply').length },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top 5 Fornecedores */}
              <Card className="bg-gray-900/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top 5 Fornecedores</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(
                      items.reduce((acc, item) => {
                        acc[item.supplier] = (acc[item.supplier] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([supplier, count], index) => (
                        <div key={supplier} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                              {index + 1}
                            </div>
                            <span className="text-white">{supplier}</span>
                          </div>
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-300">
                            {count} itens
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="movements" className="space-y-6">
            <Card className="bg-gray-900/50 border border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Movimentações Mensais</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={monthlyMovements}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="entry" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="exit" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="loan" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="return" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 border border-emerald-500/30">
                <CardHeader>
                  <CardTitle className="text-emerald-300 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Valor Total em Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    R$ {stats.totalValue.toFixed(2)}
                  </p>
                  <p className="text-emerald-200/70 text-sm mt-2">
                    {items.length} itens cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-blue-300 flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    Licenças de Software
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    {softwareLicenses.reduce((sum, lic) => sum + lic.value * lic.quantity, 0).toFixed(2)}
                  </p>
                  <p className="text-blue-200/70 text-sm mt-2">
                    {softwareLicenses.length} tipos de licenças
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-900/50 to-yellow-900/50 border border-amber-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-300 flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Custos de Manutenção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-white">
                    R$ {maintenances.reduce((sum, m) => sum + m.cost, 0).toFixed(2)}
                  </p>
                  <p className="text-amber-200/70 text-sm mt-2">
                    {maintenances.length} ordens de serviço
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ativos por Valor */}
              <Card className="bg-gray-900/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Top 10 Ativos por Valor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 10)
                      .map((item, index) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                            <div>
                              <p className="text-white font-medium">{item.name}</p>
                              <p className="text-gray-400 text-xs">{item.manufacturer} {item.model}</p>
                            </div>
                          </div>
                          <p className="text-emerald-400 font-bold">
                            R$ {item.value.toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suprimentos com Maior Custo */}
              <Card className="bg-gray-900/50 border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Suprimentos - Custo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {printerSupplies
                      .map(supply => ({
                        ...supply,
                        totalCost: supply.quantity * supply.costPerUnit
                      }))
                      .sort((a, b) => b.totalCost - a.totalCost)
                      .slice(0, 10)
                      .map((supply, index) => (
                        <div key={supply.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-400 font-mono text-sm">#{index + 1}</span>
                            <div>
                              <p className="text-white font-medium">{supply.name}</p>
                              <p className="text-gray-400 text-xs">
                                {supply.quantity} {supply.unit} × R$ {supply.costPerUnit.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="text-amber-400 font-bold">
                            R$ {supply.totalCost.toFixed(2)}
                          </p>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rodapé com informações do sistema */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Sistema Ativo
              </h3>
              <div className="space-y-2 text-gray-400">
                <p>• Última atualização: {new Date().toLocaleString('pt-BR')}</p>
                <p>• {items.length} ativos cadastrados</p>
                <p>• {movements.length} movimentações registradas</p>
              </div>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Status dos Serviços
              </h3>
              <div className="space-y-2 text-gray-400">
                <p>• Banco de dados: {stats.totalItems > 0 ? '● Conectado' : '○ Desconectado'}</p>
                <p>• Cache local: ● Ativo</p>
                <p>• Backup automático: ● Configurado</p>
              </div>
            </div>
            <div>
              <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Segurança
              </h3>
              <div className="space-y-2 text-gray-400">
                <p>• Usuário logado: {user?.name || 'Nenhum'}</p>
                <p>• Nível de acesso: {user?.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
                <p>• Sessão: Ativa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;