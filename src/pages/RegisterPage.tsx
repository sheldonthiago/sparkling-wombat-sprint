"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, AlertCircle, Mail, Lock, User, Phone, Hash, Building, CheckCircle } from 'lucide-react';
import { useUsers } from '@/hooks/use-users';
import { hashPassword } from '@/utils/crypto';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    matricula: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addUser, getUserByEmail } = useUsers();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return;
    }
    if (!formData.password) {
      setError('Senha é obrigatória');
      return;
    }
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (!formData.department) {
      setError('Departamento é obrigatório');
      return;
    }

    // Verificar se email já existe
    const existingUser = getUserByEmail(formData.email);
    if (existingUser) {
      setError('Este email já está cadastrado');
      return;
    }

    setLoading(true);

    try {
      // Criar hash da senha
      const passwordHash = await hashPassword(formData.password);

      // Adicionar novo usuário
      addUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        role: 'viewer', // Usuários registrados automaticamente têm perfil de visualizador
        department: formData.department,
        matricula: formData.matricula || undefined,
        phone: formData.phone || undefined,
        status: 'active',
        passwordHash,
      });

      // Mostrar sucesso e redirecionar para login
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const departments = [
    'TI',
    'Financeiro',
    'RH',
    'Compras',
    'Operações',
    'Diretoria',
    'Suporte',
    'Infraestrutura',
    'Desenvolvimento',
    'Segurança da Informação'
  ];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Cadastro Realizado!</CardTitle>
            <p className="text-slate-400 text-sm">
              Sua conta foi criada com sucesso. Você será redirecionado para a página de login.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-white">Criar Conta</CardTitle>
          <p className="text-slate-400 text-sm">Preencha os dados para se cadastrar</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <Label htmlFor="name" className="text-slate-300">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  placeholder="João Silva"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  placeholder="joao@empresa.com"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="department" className="text-slate-300">Departamento</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione o departamento</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-800">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="matricula" className="text-slate-300">Matrícula (opcional)</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="matricula"
                    name="matricula"
                    type="text"
                    value={formData.matricula}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                    placeholder="123456"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-300">Telefone (opcional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  placeholder="Confirme sua senha"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Criando conta...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Criar Conta
                </span>
              )}
            </Button>

            <div className="text-center pt-4 border-t border-slate-700/50">
              <p className="text-sm text-slate-400">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Fazer login
                </button>
              </p>
            </div>

            <div className="text-xs text-slate-500 text-center pt-2">
              <p>Ao criar uma conta, você concorda com os termos de uso.</p>
              <p>Usuários registrados têm perfil de "Visualizador" por padrão.</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}