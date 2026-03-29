import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useSupabaseInventory } from "@/hooks/use-supabase-inventory";
import { NotificationSystem } from "@/components/NotificationSystem";

const Index = () => {
  const navigate = useNavigate();
  const { stats, loading } = useSupabaseInventory();

  // Simular carregamento inicial
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <Header title="Sistema de Ativos" />
      
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m0 0l-8-4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Sistema de Ativos</h1>
          <p className="text-xl text-gray-600 mb-8">
            Gestão de materiais de informática
          </p>
        </div>

        {!loading && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Sistema</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total de Ativos</p>
                <p className="font-bold text-lg">{stats.totalItems}</p>
              </div>
              <div>
                <p className="text-gray-500">Valor Total</p>
                <p className="font-bold text-lg">R$ {stats.totalValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-gray-500">Ativos Alocados</p>
                <p className="font-bold text-lg">{stats.allocatedItems}</p>
              </div>
              <div>
                <p className="text-gray-500">Em Manutenção</p>
                <p className="font-bold text-lg">{stats.maintenanceItems}</p>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={() => navigate("/inventory")}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full"
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Acessar Sistema'}
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;