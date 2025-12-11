# Event Booking Frontend

Frontend para o sistema de reserva de locais para eventos desenvolvido com Next.js 16, React 19 e TypeScript.

## 🚀 Tecnologias

- **Next.js 16.0.8** - Framework React com App Router
- **React 19.2.1** - Biblioteca para interfaces de usuário  
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **TwicPics** - Otimização e entrega de imagens
- **ESLint** - Linter para qualidade de código

## 📌 Funcionalidades

### Para Usuários Normais
- ✅ Autenticação (login e registro)
- ✅ Visualizar locais disponíveis
- ✅ Ver detalhes de cada local
- ✅ Criar reservas para eventos
- ✅ Gerenciar minhas reservas
- ✅ Cancelar reservas

### Para Administradores
- ✅ Dashboard administrativo
- ✅ Gerenciar locais (criar, editar, deletar)
- ✅ Gerenciar todas as reservas
- ✅ Gerenciar usuários
- ✅ Visualizar estatísticas

## 📁 Estrutura do Projeto

```
event_booking_Frontend/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   │   ├── admin/             # Páginas do administrador
│   │   ├── dashboard/         # Dashboard do usuário
│   │   ├── login/             # Página de login
│   │   ├── my-bookings/       # Minhas reservas
│   │   ├── register/          # Página de registro
│   │   ├── venues/            # Listagem e detalhes de locais
│   │   ├── globals.css        # Estilos globais
│   │   ├── layout.tsx         # Layout raiz
│   │   └── page.tsx           # Página inicial
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes de interface
│   │   └── Navbar.tsx         # Barra de navegação
│   ├── contexts/              # Contextos React
│   │   └── AuthContext.tsx    # Contexto de autenticação
│   ├── lib/                   # Configurações e utilitários
│   │   └── api.ts            # Configuração da API
│   ├── services/              # Serviços de API
│   │   ├── authService.ts    # Autenticação
│   │   ├── bookingService.ts # Reservas
│   │   ├── eventService.ts   # Locais (venues)
│   │   └── userService.ts    # Usuários
│   ├── types/                 # Definições de tipos TypeScript
│   └── utils/                 # Funções utilitárias
├── public/                    # Arquivos estáticos
```

## 🛠️ Instalação

1. Clone o repositório

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

4. Edite o arquivo `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_TWICPICS_DOMAIN=https://viniciuspteste.twic.pics
```

## 💻 Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Build para Produção

```bash
npm run build
npm start
```

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Token) para autenticação:
- Tokens são armazenados no localStorage
- Refresh tokens para renovação automática
- Proteção de rotas baseada em autenticação e papel (admin/usuário)

## 🖼️ Gerenciamento de Imagens

As imagens dos locais são otimizadas via **TwicPics**:
- Armazenadas como paths relativos no banco
- Servidas através do domínio TwicPics
- Otimização automática de tamanho e formato

## 📱 Rotas Principais

### Públicas
- `/login` - Login
- `/register` - Registro

### Usuário Normal (Autenticadas)
- `/dashboard` - Dashboard do usuário
- `/venues` - Listagem de locais
- `/venues/[id]` - Detalhes e reserva de local
- `/my-bookings` - Minhas reservas

### Administrador (Autenticadas + Admin)
- `/admin` - Dashboard administrativo
- `/admin/venues` - Gerenciar locais
- `/admin/bookings` - Gerenciar reservas
- `/admin/users` - Gerenciar usuários

## 🧪 Linting

```bash
npm run lint
```

## 📝 Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL` - URL da API backend (http://localhost:3000/api)
- `NEXT_PUBLIC_TWICPICS_DOMAIN` - Domínio TwicPics para imagens
- `NODE_ENV` - Ambiente de execução

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Envie um pull request

## 📄 Licença

ISC
