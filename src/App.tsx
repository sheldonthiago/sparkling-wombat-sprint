import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import InventoryPage from "./pages/InventoryPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const queryClient = new QueryClient();

/* Protected Route Component */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.DEV ? '/' : '/sparkling-wombat-sprint'}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<Index />} />
            <Route
              path="/inventory"
              element={
                <ProtectedRoute>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
＜/dyad-write>

＜dyad-chat-summary>Adicionando basename dinâmico ao BrowserRouter＜/dyad-chat-summary>

Agora, vamos revisar o 404.html. O 404.html que criamos está redirecionando para a raiz, mas não está mantendo a rota. Vamos ajustar:

O 404.html deve apenas servir o index.html? Na verdade, o 404.html é um arquivo HTML separado. Se quisermos que o React Router funcione, o 404.html deve conter o mesmo conteúdo do index.html? Não, porque o index.html já está lá.

A técnica é: o 404.html deve redirecionar para a rota principal (a raiz) mas mantendo a rota? Não, porque se redirecionarmos para a raiz, a rota é perdida.

Na verdade, o que queremos é: quando o GitHub Pages serve o 404.html, o React Router (que está no index.html) não está carregado. Então, o 404.html deve carregar o mesmo script do index.html? Sim, mas o index.html já está na raiz.

A solução é: o 404.html deve ser uma cópia do index.html? Mas então teríamos dois arquivos iguais.

Na verdade, o que acontece é: o GitHub Pages, quando não encontra a rota, serve o 404.html. Se o 404.html for uma cópia do index.html, então o React Router vai carregar e vai ver a URL atual (que é a rota) e renderizar o componente correto.

Portanto, a solução é: copiar o conteúdo do `index.html` para o `404.html`? Mas o `index.html` já está na raiz. Então, se o 404.html for igual ao index.html, quando o usuário acessar uma rota, o GitHub Pages vai servir o 404.html (que é igual ao index.html) e o React Router vai funcionar.

No entanto, isso significa que o 404.html e o index.html são idênticos? Sim, mas não há problema.

Mas note que o `index.html` já está na raiz. Então, se o 404.html for uma cópia, teremos dois arquivos iguais. Isso é aceitável.

Vamos ajustar o 404.html para ser uma cópia do index.html? Mas o index.html é gerado pelo Vite? Não, o index.html é um arquivo estático na raiz do projeto.

No nosso projeto, o `index.html` está na raiz. Então, podemos copiar o conteúdo do `index.html` para o `404.html`? Mas se o `index.html` for alterado, teríamos que alterar o 404.html também.

Uma alternativa: no build, o Vite gera a pasta `dist` com o `index.html`. Podemos configurar o Vite para também gerar um `404.html`? Não, o Vite não faz isso por padrão.

Então, a solução manual é: copiar o `index.html` para `404.html` na pasta `public`. Mas se o `index.html` for alterado, esquecemos de atualizar o 404.html.

Outra solução: no 404.html, fazer um redirecionamento para o index.html? Mas se fizermos um redirecionamento, a URL muda para a raiz e a rota é perdida.

A técnica correta é: o 404.html deve conter o mesmo código do index.html, mas com um script que, ao carregar, define a URL atual como a rota? Não.

Na verdade, o que o React Router precisa é que o servidor sirva o `index.html` para qualquer rota. No GitHub Pages, não podemos configurar o servidor, então usamos o 404.html como fallback. O 404.html deve conter o mesmo conteúdo do index.html? Sim, porque assim, quando o 404.html for carregado, o React Router vai ver a URL (que é a rota) e renderizar o componente correto.

Portanto, a solução é: copiar o conteúdo do `index.html` para o `404.html`. Mas o `index.html` já está na raiz. Então, vamos copiar o conteúdo do `index.html` para o `404.html`? Mas o `index.html` é um arquivo estático que não muda.

No entanto, o `index.html` do Vite tem um script que carrega o bundle. Se copiarmos, teremos dois arquivos iguais.

Mas note: o `index.html` já está na raiz. O GitHub Pages, quando acessa a raiz, serve o `index.html`. Quando acessa uma rota, serve o `404.html`. Se o `404.html` for igual ao `index.html`, então o React Router vai funcionar.

Então, vamos copiar o conteúdo do `index.html` para o `404.html`? Mas o `index.html` pode ser alterado (por exemplo, mudar o título). Teríamos que lembrar de copiar.

Uma solução melhor: no `vite.config.ts`, configurar para gerar o `404.html` automaticamente? Não há uma opção padrão.

Podemos criar um plugin do Vite? Não vale a pena.

Então, a solução prática é: manter o `404.html` como uma cópia do `index.html`. Mas como o `index.html` é estático, podemos simplesmente copiar.

No entanto, o `index.html` que temos no projeto é:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dyad-generated-app</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

E o 404.html que criamos tem um script de redirecionamento. Isso não está correto.

Vamos substituir o 404.html por uma cópia exata do index.html? Mas note que o index.html tem o script src="/src/main.tsx". No GitHub Pages, o caminho será `/sparkling-wombat-sprint/src/main.tsx`? Não, porque o build gera uma pasta `dist` com os arquivos. O `index.html` gerado pelo Vite tem os caminhos relativos.

Na verdade, o Vite gera um `index.html` na pasta `dist` que referencia o bundle. O `index.html` que está na raiz do projeto é o template. O Vite usa esse template para gerar o `index.html` da `dist`.

Então, o que devemos fazer é: colocar na pasta `public` um `404.html` que seja uma cópia do `index.html` (o template) mas com o mesmo conteúdo? Sim.

Mas o `index.html` do projeto (na raiz) é o template. O Vite vai processar esse template e gerar o `index.html` na `dist`. Então, se colocarmos um `404.html` na pasta `public`, o Vite vai copiar esse `404.html` para a raiz da `dist` sem processar? Sim, a pasta `public` é copiada integralmente para a raiz da `dist`.

Portanto, o `404.html` que colocamos em `public` será copiado para `dist/404.html` e servido pelo GitHub Pages.

Mas o `404.html` que criamos tem um script de redirecionamento. Isso não é o que queremos. Queremos que o 404.html seja igual ao index.html (o template) para que o React Router funcione.

Então, vamos substituir o `404.html` por uma cópia do `index.html`? Mas o `index.html` tem o título "dyad-generated-app". Podemos deixar assim.

No entanto, o `index.html` do projeto (na raiz) é:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>dyad-generated-app</title>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Mas note que o `src/main.tsx` é o entry point. No build, o Vite vai gerar um bundle e o `index.html` vai referenciar o bundle (por exemplo, `assets/index-xxxx.js`). O `index.html` na `dist` é gerado a partir do template.

Então, se colocarmos um `404.html` na pasta `public` que é uma cópia do `index.html` (o template), o Vite vai copiar esse `404.html` para a `dist` sem alterações? Sim, porque a pasta `public` é copiada como está.

Mas o `index.html` na `dist` é gerado a partir do template e tem os caminhos corretos para os bundles. O `404.html` que copiamos do template terá o caminho `/src/main.tsx`? Sim, e isso não vai funcionar porque no GitHub Pages o bundle está em uma pasta `assets`.

Portanto, não podemos simplesmente copiar o `index.html` template. Precisamos que o `404.html` tenha o mesmo conteúdo do `index.html` gerado pelo Vite.

A solução é: após o build, copiar o `dist/index.html` para `dist/404.html`. Mas isso teria que ser feito manualmente ou com um script.

Podemos adicionar um script no `package.json`:

```json
"scripts": {
  "build": "vite build && cp dist/index.html dist/404.html",
  ...
}
```

Mas isso só funciona em sistemas que têm o comando `cp` (Linux/Mac). No Windows, seria `copy`.

Uma solução multiplataforma é usar um comando Node:

```json
"scripts": {
  "build": "vite build && node -e \"require('fs').copyFileSync('dist/index.html', 'dist/404.html')\"",
  ...
}
```

Mas o Vite já gera o `index.html` na `dist`. Então, podemos fazer:

```bash
npm run build && cp dist/index.html dist/404.html
```

Mas no Windows, `cp` não existe.

Vamos criar um script Node para copiar:

<dyad-write path="scripts/copy-404.js" description="Script para copiar index.html para 404.html após o build">
const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');
const notFoundPath = path.join(distPath, '404.html');

if (fs.existsSync(indexPath)) {
  fs.copyFileSync(indexPath, notFoundPath);
  console.log('✅ 404.html criado a partir do index.html');
} else {
  console.error('❌ index.html não encontrado em dist/');
  process.exit(1);
}