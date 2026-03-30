import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory";
import { NotificationSystem } from "@/components/NotificationSystem";
import { useState, useEffect, useRef } from "react";
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
  Zap,
  Rocket,
  Globe,
  Cloud,
  Lock,
  Smartphone,
  Wifi,
  Cables,
  Monitor,
  Headphones,
  Printer,
  Keyboard,
  Mouse,
  HardDriveDownload,
  Power,
  Signal,
  Radar,
  Satellite,
  Orbit,
  Atom,
  Hexagon,
  Triangle,
  Circle,
  Square,
  Pentagon,
  Octagon,
  Wrench,
  LogIn
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { stats, loading } = useSupabaseInventory();

  const [isLoading, setIsLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticles = () => {
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          color: `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 255, ${Math.random() * 0.5 + 0.2})`
        });
      }
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particles.forEach((other, j) => {
          if (i === j) return;
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(100, 150, 255, ${0.1 * (1 - distance / 150)})`;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full"
        />
        
        <div className="relative z-10 text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 animate-pulse blur-xl"></div>
            <div className="absolute inset-2 rounded-full bg-black flex items-center justify-center">
              <div className="relative">
                <Cpu className="h-12 w-12 text-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-cyan-300 text-2xl font-bold tracking-widest uppercase animate-pulse">
              TechAsset Pro
            </p>
            <p className="text-blue-300 text-lg font-medium tracking-wider">
              INICIALIZANDO SISTEMA QUÂNTICO
            </p>
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"
                  style={{ 
                    animationDelay: `${i * 150}ms`,
                    animationDuration: '1.5s'
                  }}
                ></div>
              ))}
            </div>
            <div className="mt-8 space-y-2">
              <div className="w-64 h-2 bg-slate-800/50 rounded-full overflow-hidden mx-auto">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse w-3/4"></div>
              </div>
              <p className="text-slate-400 text-sm">Carregando módulos avançados...</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-500 text-sm">
          v3.0.0 • Quantum Edition
        </div>
      </div>
    );
  }

  const features = [
    { 
      icon: Database, 
      title: "Inventário Quântico", 
      desc: "Gestão de ativos com IA e rastreamento em tempo real via blockchain", 
      color: "from-cyan-500 to-blue-500",
      glow: "from-cyan-500/20 to-blue-500/20"
    },
    { 
      icon: Shield, 
      title: "Cibersegurança Avançada", 
      desc: "Proteção militar com criptografia quântica e zero-trust", 
      color: "from-green-500 to-emerald-500",
      glow: "from-green-500/20 to-emerald-500/20"
    },
    { 
      icon: Activity, 
      title: "Monitoramento Neural", 
      desc: "Sistema de vigilância com detecção de anomalias automática", 
      color: "from-purple-500 to-pink-500",
      glow: "from-purple-500/20 to-pink-500/20"
    },
    { 
      icon: BarChart3, 
      title: "Analytics Predictivo", 
      desc: "Machine learning para previsão de falhas e otimização", 
      color: "from-orange-500 to-amber-500",
      glow: "from-orange-500/20 to-amber-500/20"
    },
    { 
      icon: Network, 
      title: "Rede Neural Integrada", 
      desc: "Conectividade IoT com todos os dispositivos do planeta", 
      color: "from-indigo-500 to-blue-500",
      glow: "from-indigo-500/20 to-blue-500/20"
    },
    { 
      icon: Settings, 
      title: "Automação Total", 
      desc: "Workflows inteligentes com processamento de linguagem natural", 
      color: "from-slate-500 to-gray-500",
      glow: "from-slate-500/20 to-gray-500/20"
    }
  ];

  const statsCards = [
    { 
      label: "Total de Ativos", 
      value: stats.totalItems, 
      icon: HardDrive, 
      color: "from-cyan-400 to-blue-500",
      bg: "from-cyan-500/10 to-blue-500/10",
      border: "from-cyan-500/30 to-blue-500/30",
      trend: "+24.5%"
    },
    { 
      label: "Valor Total", 
      value: `R$ ${stats.totalValue.toFixed(2)}`, 
      icon: Activity, 
      color: "from-green-400 to-emerald-500",
      bg: "from-green-500/10 to-emerald-500/10",
      border: "from-green-500/30 to-emerald-500/30",
      trend: "+18.2%"
    },
    { 
      label: "Em Manutenção", 
      value: stats.maintenanceItems, 
      icon: Wrench, 
      color: "from-yellow-400 to-amber-500",
      bg: "from-yellow-500/10 to-amber-500/10",
      border: "from-yellow-500/30 to-amber-500/30",
      trend: "-5.3%"
    },
    { 
      label: "Alocados", 
      value: stats.allocatedItems, 
      icon: Users, 
      color: "from-purple-400 to-pink-500",
      bg: "from-purple-500/10 to-pink-500/10",
      border: "from-purple-500/30 to-pink-500/30",
      trend: "+12.7%"
    }
  ];

  const techStack = [
    { name: "React 19", icon: Atom },
    { name: "TypeScript", icon: Triangle },
    { name: "Tailwind CSS", icon: Square },
    { name: "Supabase", icon: Database },
    { name: "Shadcn UI", icon: Hexagon },
    { name: "Vite", icon: Zap }
  ];

  const handleDashboardClick = () => {
    if (user) {
      navigate("/inventory");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Canvas para partículas animadas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Grid de fundo tecnológico */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
      
      {/* Efeito de brilho dinâmico */}
      <div 
        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-1000 pointer-events-none"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      ></div>

      <NotificationSystem
        items={[]}
        supplies={[]}
        movements={[]}
        maintenances={[]}
      />

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Header com efeito glassmorphism */}
        <header className="text-center mb-24 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 blur-3xl -z-10"></div>
          
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 text-cyan-300 text-sm mb-8 backdrop-blur-xl shadow-lg shadow-cyan-500/10">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <Zap className="h-4 w-4" />
            <span className="font-semibold tracking-wider">SISTEMA DE GESTÃO QUÂNTICA DE ATIVOS</span>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse tracking-tight">
            TechAsset Pro
          </h1>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Plataforma de <span className="text-cyan-400 font-semibold">última geração</span> para gestão de ativos de TI com 
            <span className="text-blue-400 font-semibold"> inteligência artificial</span>, 
            <span className="text-purple-400 font-semibold"> blockchain</span> e 
            <span className="text-green-400 font-semibold"> automação total</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={handleDashboardClick}
              className="group bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 text-white px-10 py-7 text-xl shadow-2xl shadow-cyan-500/30 border border-cyan-400/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50 relative overflow-hidden"
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine"></div>
              <Rocket className="h-6 w-6 mr-3" />
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Inicializando...
                </span>
              ) : (
                <>Acessar Dashboard <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" /></>
              )}
            </Button>
            
            <Button 
              variant="outline"
              className="px-10 py-7 text-xl border-2 border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 backdrop-blur-sm bg-slate-900/50 transition-all duration-300 group"
            >
              <Globe className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
              Ver Demonstração 3D
            </Button>
          </div>
        </header>

        {/* Stats Cards com efeito holográfico */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className={`relative group p-8 rounded-3xl bg-gradient-to-br ${stat.bg} border-t border-r ${stat.border} backdrop-blur-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 hover:border-cyan-400/50 ${hoveredCard === `stat-${index}` ? 'ring-2 ring-cyan-400/50' : ''}`}
                onMouseEnter={() => setHoveredCard(`stat-${index}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bg} border ${stat.border} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <stat.icon className={`h-8 w-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                        <ChevronRight className="h-3 w-3 rotate-45" />
                        {stat.trend}
                      </span>
                      <span className="text-xs text-slate-500">vs mês anterior</span>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-3 tracking-tight">{stat.value}</p>
                  <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Grid com efeito 3D */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Tecnologia de Ponta
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Recursos revolucionários com <span className="text-cyan-400">inteligência artificial</span> e 
              <span className="text-blue-400"> processamento quântico</span>
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 perspective-1000 transform-style-3d"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.glow} opacity-0 group-hover:opacity-30 rounded-3xl transition-opacity duration-500 blur-xl`}></div>
                
                <div className="relative z-10 transform group-hover:rotate-x-12 transition-transform duration-500">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{feature.desc}</p>
                  
                  <div className="flex items-center gap-2 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <span className="text-sm font-semibold">Explorar recurso</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack com animação */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Stack Tecnológica Avançada</h2>
            <p className="text-slate-400">As tecnologias mais modernas do mercado</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:bg-slate-800/50 backdrop-blur-sm"
              >
                <tech.icon className="h-6 w-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span className="text-slate-300 font-medium">{tech.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section com efeito futurista */}
        <section className="relative rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="relative z-10 px-16 py-20 text-center">
            <div className="mb-6">
              <Rocket className="h-16 w-16 text-cyan-400 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl font-bold text-white mb-4">Pronto para o Futuro?</h2>
            </div>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto text-lg">
              Experimente a <span className="text-cyan-400 font-bold">revolução tecnológica</span> na gestão de ativos. 
              <span className="text-blue-400 font-bold"> 500+ empresas</span> já transformaram suas operações.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={handleDashboardClick}
                className="group bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 text-white px-12 py-8 text-xl shadow-2xl shadow-cyan-500/30 border border-cyan-400/30 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/50"
              >
                <Rocket className="h-6 w-6 mr-3 group-hover:animate-pulse" />
                Iniciar Teste Gratuito
                <ChevronRight className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
              
              <Button 
                variant="outline"
                className="px-12 py-8 text-xl border-2 border-slate-600 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/20 backdrop-blur-sm transition-all duration-300"
              >
                <Globe className="h-6 w-6 mr-3" />
                Ver Vídeo Demo
              </Button>
            </div>
            
            <div className="mt-12 flex justify-center items-center gap-8 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span>Criptografia Quântica</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-blue-400" />
                <span>Cloud Native</span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-purple-400" />
                <span>IoT Integrado</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <MadeWithDyad />
    </div>
  );
};

export default Index;