import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/utils/crypto';

const USERS_STORAGE_KEY = 'system-users';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(false);

  // Verificar se o Supabase está configurado
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANon_KEY;
    setUseSupabase(!!(supabaseUrl && supabaseAnonKey));
  }, []);

  // Carregar usuários
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        
        if (useSupabase && supabase) {
          // Carregar do Supabase
          const { data: usersData, error: usersError } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (usersError) throw usersError;
          
          const convertUser = (user: any) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department,
            matricula: user.matricula,
            phone: user.phone,
            status: user.status,
            passwordHash: user.password_hash,
            lastLogin: user.last_login ? new Date(user.last_login) : undefined,
            createdAt: new Date(user.created_at),
            updatedAt: new Date(user.updated_at),
          });
          
          setUsers(usersData.map(convertUser));
        } else {
          // Carregar do localStorage
          const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
          if (savedUsers) {
            const parsedUsers = JSON.parse(savedUsers);
            // Converter strings de data de volta para Date objects
            const usersWithDates = parsedUsers.map((user: any) => ({
              ...user,
              lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
              createdAt: new Date(user.createdAt),
              updatedAt: new Date(user.updatedAt),
            }));
            setUsers(usersWithDates);
          } else {
            // Criar usuário admin padrão se não houver dados
            const defaultAdmin: User = {
              id: '1',
              email: 'admin@techasset.com',
              name: 'Administrador',
              role: 'admin',
              department: 'TI',
              status: 'active',
              passwordHash: await hashPassword('admin123'),
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            setUsers([defaultAdmin]);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([defaultAdmin]));
          }
        }
      } catch (error) {
        console.error('Error loading users:', error);
        // Fallback para localStorage
        const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          const usersWithDates = parsedUsers.map((user: any) => ({
            ...user,
            lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
          }));
          setUsers(usersWithDates);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [useSupabase]);

  // Salvar usuários
  useEffect(() => {
    const saveUsers = async () => {
      try {
        if (useSupabase && supabase) {
          // Salvar no Supabase (implementar lógica de upsert)
          console.log('Saving users to Supabase...');
        } else {
          // Salvar no localStorage
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        }
      } catch (error) {
        console.error('Error saving users:', error);
      }
    };

    if (!loading) {
      saveUsers();
    }
  }, [users, loading, useSupabase]);

  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, ...updates, updatedAt: new Date() }
        : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getUserByEmail = (email: string) => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  };

  const getUsersByRole = (role: string) => {
    return users.filter(user => user.role === role);
  };

  const getUsersByDepartment = (department: string) => {
    return users.filter(user => user.department === department);
  };

  const getActiveUsers = () => {
    return users.filter(user => user.status === 'active');
  };

  return {
    users,
    loading,
    useSupabase,
    addUser,
    updateUser,
    deleteUser,
    getUserByEmail,
    getUsersByRole,
    getUsersByDepartment,
    getActiveUsers,
  };
}