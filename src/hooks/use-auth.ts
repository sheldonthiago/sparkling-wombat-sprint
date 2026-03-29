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
  register: (name: string, email: string, password: string) => Promise<boolean>;
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
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulação de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuários salvos
      const savedUsers = localStorage.getItem('registered-users');
      const users = savedUsers ? JSON.parse(savedUsers) : [
        { id: '1', name: 'Administrador', email: 'admin@empresa.com', password: 'admin123', role: 'admin' }
      ];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
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

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar usuários salvos
      const savedUsers = localStorage.getItem('registered-users');
      const users = savedUsers ? JSON.parse(savedUsers) : [
        { id: '1', name: 'Administrador', email: 'admin@empresa.com', password: 'admin123', role: 'admin' }
      ];
      
      // Verificar se email já existe
      if (users.find(u => u.email === email)) {
        return false;
      }
      
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: 'user' as const
      };
      
      users.push(newUser);
      localStorage.setItem('registered-users', JSON.stringify(users));
      
      // Fazer login automático após registro
      const { password, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
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
    register,
    logout,
    isLoading
  };
}