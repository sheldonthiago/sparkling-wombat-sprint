import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se o usuário está logado ao carregar a página
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulação de autenticação - em um sistema real, isso seria uma chamada API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuários válidos (em um sistema real, isso viria do backend)
      const validUsers = [
        { id: '1', name: 'Administrador', email: 'admin@empresa.com', password: 'admin123', role: 'admin' as const },
        { id: '2', name: 'Usuário', email: 'usuario@empresa.com', password: 'usuario123', role: 'user' as const },
      ];
      
      const foundUser = validUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    login,
    logout,
    isLoading
  };
}