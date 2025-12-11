# Event Booking Frontend

Sistema de reserva de eventos desenvolvido com Next.js 16, React 19 e TypeScript.

## 🚀 Tecnologias

- **Next.js 16.0.8** - Framework React com App Router
- **React 19.2.1** - Biblioteca para interfaces de usuário
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **ESLint** - Linter para qualidade de código

## 📁 Estrutura do Projeto

```
event_booking_Frontend/
├── src/
│   ├── app/              # Páginas e rotas (App Router)
│   │   ├── globals.css   # Estilos globais
│   │   ├── layout.tsx    # Layout raiz
│   │   └── page.tsx      # Página inicial
│   ├── components/       # Componentes reutilizáveis
│   │   └── ui/          # Componentes de interface
│   ├── contexts/        # Contextos React
│   ├── hooks/           # Hooks customizados
│   ├── lib/             # Configurações e utilitários de biblioteca
│   ├── services/        # Serviços de API
│   ├── types/           # Definições de tipos TypeScript
│   └── utils/           # Funções utilitárias
├── public/              # Arquivos estáticos
└── ...                  # Arquivos de configuração
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

4. Edite o arquivo `.env.local` com suas configurações

## 💻 Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📦 Build

Para criar uma versão de produção:

```bash
npm run build
npm start
```

## 🧪 Linting

Execute o linter:

```bash
npm run lint
```

## 📝 Variáveis de Ambiente

- `NEXT_PUBLIC_API_URL` - URL da API backend
- `NODE_ENV` - Ambiente de execução

## 🤝 Contribuindo

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Envie um pull request

## 📄 Licença

Este projeto é privado.
