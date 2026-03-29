import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useState, useEffect } from "react";
import { 
  Server, 
  Database, 
  Shield, 
  Cpu, 
  HardDrive, 
  Network,
  ChevronRight,
  BarChart3,
  Settings,
  Users,
  Activity,
  Zap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { stats, loading } = useSupabaseInventory();

  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="text-center z-10">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse"></div>
            <div className="absolute inset-1 rounded-full bg-slate-900 flex items-center justify-center">
              <Cpu className="h-8 w-8 text-blue-400 animate-pulse" />
            </div>
          </div>
          <p className="text-blue-300 text-lg font-medium tracking-wider">INICIALIZANDO SISTEMA</p>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  const features = [
    { icon: Database, title: "Inventário Inteligente", desc: "Gestão completa de ativos com rastreamento em tempo real", color: "from-blue-500 to-cyan-500" },
    { icon: Shield, title: "Controle de Acesso", desc: "Gestão de usuários e permissões com segurança avançada", color: "from-green-500 to-emerald-500" },
    { icon: Activity, title: "Monitoramento 24/7", desc: "Acompanhamento contínuo de todos os recursos", color: "from-purple-500 to-pink-500" },
    { icon: BarChart3, title: "Analytics Avançado", desc: "Relatórios detalhados e métricas em tempo real", color: "from-orange-500 to-amber-500" },
    { icon: Network, title: "Rede Integrada", desc: "Conectividade total com todos os dispositivos", color: "from-indigo-500 to-blue-500" },
    { icon: Settings, title: "Configuração Flexível", desc: "Personalize o sistema conforme suas necessidades", color: "from-slate-500 to-gray-500" }
  ];

  const statsCards = [
    { label: "Total de Ativos", value: stats.totalItems, icon: HardDrive, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Valor Total", value: `R$ ${stats.totalValue.toFixed(2)}`, icon: Database, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
    { label: "Em Manutenção", value: stats.maintenanceItems, icon: Settings, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
    { label: "Alocados", value: stats.allocatedItems, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background com padrão tecnológico */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      {/* Efeito de brilho no topo */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/2 h-32 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 blur-3xl"></div>

      <NotificationSystem
        items={[]}
        supplies={[]}
        movements={[]}
        maintenances={[]}
      />

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header */}
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-6 backdrop-blur-sm">
            <Zap className="h-4 w-4" />
            <span>SISTEMA DE GESTÃO DE ATIVOS TECNOLÓGICOS</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            TechAsset Pro
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Plataforma avançada para gestão completa de ativos de TI com monitoramento em tempo real, 
            controle de manutenção e rastreamento de inventário.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate("/inventory")}
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-6 text-lg shadow-lg shadow-blue-500/25 border border-blue-500/30 transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              <Server className="h-5 w-5 mr-3" />
              {loading ? 'Carregando...' : 'Acessar Dashboard'}
              <ChevronRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline"
              className="px-8 py-6 text-lg border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 backdrop-blur-sm bg-slate-900/50"
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              Ver Demonstração
            </Button>
          </div>
        </header>

        {/* Stats Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className={`relative group p-6 rounded-2xl border ${stat.border} ${stat.bg} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl ${hoveredCard === `stat-${index}` ? 'ring-2 ring-blue-500/50' : ''}`}
                onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <stat.icon className="h-16 w-16" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bg} border ${stat.border}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <span className="text-sm text-slate-400 font-medium">+12%</span>
                  </div>
                  <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Recursos Avançados</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tecnologia de ponta para gerenciamento eficiente de ativos de TI
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 backdrop-blur-sm"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                  
                  <div className="mt-6 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Saiba mais</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative z-10 px-12 py-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Pronto para otimizar sua gestão de TI?</h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Junte-se a centenas de empresas que já transformaram sua gestão de ativos com nossa plataforma.
            </p>
            <Button 
              onClick={() => navigate("/inventory")}
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-semibold shadow-xl"
            >
              Começar Agora
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </section>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;