# TechAsset Pro - Sistema de Gestão de Ativos de TI

Sistema completo de gestão de inventário de ativos de TI com autenticação, controle de manutenções, movimentações, licenças de software e suprimentos de impressora.

![React](https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.11-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-2.100.1-3ECF8E?logo=supabase)
![Vite](https://img.shields.io/badge/Vite-6.3.4-646CFF?logo=vite)

## 🚀 Funcionalidades

### 📦 Gestão de Ativos
- Cadastro completo de ativos de TI (hardware, software, periféricos)
- Controle de status (disponível, alocado, manutenção, descartado)
- Rastreamento por número de série e nota fiscal
- Gestão de garantias com alertas
- Histórico de movimentações
- Geração de QR Codes para etiquetas

### 👥 Gestão de Usuários
- Sistema de autenticação seguro
- Perfis de acesso: Admin, Gerente, Técnico, Visualizador
- Controle por departamento
- Histórico de login

### 🔧 Manutenção
- Ordens de serviço (OS)
- Controle de manutenções preventivas e corretivas
- Priorização (baixa, média, alta, crítica)
- Gestão de responsáveis e custos
- Alertas de atrasos

### 📊 Licenças de Software
- Controle de quantidades disponíveis e utilizadas
- Alertas de expiração
- Gestão de chaves e fornecedores
- Atribuição a usuários

### 🖨️ Suprimentos de Impressora
- Controle de toner, cartuchos, papel, etc.
- Alertas de estoque mínimo
- Registro de saídas por setor
- Gestão de fornecedores e custos

### 📈 Relatórios
- Dashboard com indicadores
- Exportação para CSV
- Análise de tendências
- Alertas e notificações

## 🛠️ Tecnologias

- **Frontend**: React 19 + TypeScript
- **Estilização**: Tailwind CSS + shadcn/ui
- **Roteamento**: React Router v6
- **Estado**: React Query
- **Backend Opcional**: Supabase (PostgreSQL)
- **Autenticação**: Context API + hash de senhas
- **Ícones**: Lucide React
- **Build**: Vite

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/sheldonthiago/sparkling-wombat-sprint.git
cd sparkling-wombat-sprint
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente (opcional - para usar Supabase):**

Crie um arquivo `.env` na raiz:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Execute o projeto:**
```bash
npm run dev
```

5. **Acesse:**
- Desenvolvimento: http://localhost:8080
- Produção: `npm run build` e `npm run preview`

## 📊 Estrutura do Projeto

```
src/
├── components/
│   ├── inventory/          # Componentes de inventário
│   │   ├── InventoryList.tsx
│   │   ├── InventoryForm.tsx
│   │   ├── QRCodeGenerator.tsx
│   │   ├── MovementManager.tsx
│   │   ├── MaintenanceManager.tsx
│   │   ├── SoftwareLicenseManager.tsx
│   │   ├── PrinterSupplyManager.tsx
│   │   └── ExportManager.tsx
│   ├── users/              # Componentes de usuários
│   │   ├── UserManager.tsx
│   │   ├── UserList.tsx
│   │   └── UserForm.tsx
│   └── ui/                 # Componentes shadcn/ui
├── pages/
│   ├── Index.tsx          # Landing page
│   ├── LoginPage.tsx      # Login
│   ├── RegisterPage.tsx   # Registro
│   ├── InventoryPage.tsx  # Dashboard principal
│   ├── UsersPage.tsx      # Gestão de usuários
│   └── ReportsPage.tsx    # Relatórios
├── hooks/
│   ├── use-supabase-inventory.ts  # Hook principal de dados
│   ├── use-inventory.ts           # Hook legacy
│   └── use-users.ts               # Hook de usuários
├── lib/
│   └── supabase.ts        # Cliente Supabase
├── types/
│   ├── inventory.ts       # Tipos TypeScript
│   └── user.ts            # Tipos de usuário
├── contexts/
│   └── AuthContext.tsx    # Contexto de autenticação
└── utils/
    ├── toast.ts          # Notificações
    └── crypto.ts         # Hash de senhas
```

## 🔐 Acesso Padrão

Se executar sem Supabase configurado, use:

- **Email:** admin@techasset.com
- **Senha:** admin123

## 📱 Responsivo

O sistema é totalmente responsivo e funciona em:
- 💻 Desktop
- 📱 Tablets
- 📱 Smartphones

## 🎨 Design

- Tema escuro moderno
- Gradientes futuristas
- Animações suaves
- Interface intuitiva
- Acessibilidade WCAG 2.1

## 🔄 Funcionamento

### Sem Supabase (modo padrão)
- Dados salvos no `localStorage` do navegador
- Funciona offline
- Dados por navegador

### Com Supabase
- Dados persistidos na nuvem
- Multi-usuário
- Backup automático
- Escalável

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint

# Build para desenvolvimento
npm run build:dev
```

## 🚀 Deploy

### Vercel (recomendado)
1. Faça push para o GitHub
2. Importe o repositório no Vercel
3. Configure variáveis de ambiente
4. Deploy automático em cada push

### Netlify
1. Faça push para o GitHub
2. Importe no Netlify
3. Configure `npm run build` como comando de build
4. Deploy automático

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📧 Contato

Sheldon Thiago - sheldonthiago@email.com

Link do Projeto: https://github.com/sheldonthiago/sparkling-wombat-sprint

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vite](https://vitejs.dev/) - Build tool
- [React](https://reactjs.org/) - Biblioteca JavaScript

---

**Feito com ❤️ e ☕ usando React + TypeScript + Tailwind CSS**