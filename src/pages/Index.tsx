import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sistema de Estoque</h1>
        <p className="text-xl text-gray-600 mb-8">
          Gestão de materiais de informática
        </p>
        <Button 
          onClick={() => navigate("/inventory")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Acessar Sistema
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;