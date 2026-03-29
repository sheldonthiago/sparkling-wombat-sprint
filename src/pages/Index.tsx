export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Sistema de Ativos</h1>
        <p className="text-xl text-gray-600 mb-4">Faça login para acessar o sistema</p>
        <a href="/login" className="text-blue-500 hover:text-blue-700 underline">
          Ir para Login
        </a>
      </div>
    </div>
  );
}