"use client";

import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Building, Cpu, Network, HardDrive, Shield, BarChart3 } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/inventory', label: 'Inventário', icon: HardDrive },
    { path: '/inventory?tab=maintenance', label: 'Manutenções', icon: Cpu },
    { path: '/inventory?tab=movements', label: 'Movimentações', icon: Network },
    { path: '/inventory?tab=licenses', label: 'Licenças', icon: Shield },
    { path: '/inventory?tab=reports', label: 'Relatórios', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path.includes('?')) {
      const [basePath] = path.split('?');
      return location.pathname === basePath && location.search.includes('tab=');
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 border-b border-blue-500/30 shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Cpu className="h-8 w-8 text-cyan-400 animate-pulse" />
                <div className="absolute inset-0 bg-cyan-400 blur-sm opacity-50"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-wider">
                  {title || 'SISTEMA DE ATIVOS'}
                </h1>
                <p className="text-xs text-cyan-300 font-mono">IT ASSET MANAGEMENT</p>
              </div>
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-6">
              {/* Menu de navegação */}
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 transition-all ${
                          active 
                            ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/50' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs font-mono">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              {/* Informações do usuário */}
              <div className="flex items-center gap-3 border-l border-cyan-500/30 pl-6">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <div className="flex items-center gap-2 justify-end">
                    <Badge 
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        user.role === 'admin' 
                          ? 'bg-cyan-600 hover:bg-cyan-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {user.role === 'admin' ? 'ADMIN' : 'USER'}
                    </Badge>
                  </div>
                </div>
                <User className="h-8 w-8 text-cyan-400 p-1.5 bg-white/10 rounded-full border border-cyan-500/30" />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center gap-2 border-cyan-500/30 text-cyan-300 hover:bg-cyan-600/20 hover:text-cyan-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Efeito de linha animada */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
    </header>
  );
}