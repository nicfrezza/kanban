# 📋 Kanban Board - Gerenciador de Tarefas

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)

> Sistema completo de gerenciamento de tarefas estilo Kanban com autenticação de usuários, drag-and-drop e sincronização em tempo real.

## ☁️ LIVE DEMO: 
kanban-tarefas-w7.surge.sh/

## 🚀 Funcionalidades

### ✅ Autenticação de Usuários
- 🔐 Login e registro com email/senha
- 👤 Cada usuário tem suas próprias tarefas
- 🔒 Dados protegidos e isolados por usuário
- 🚪 Sistema de logout seguro

### 📊 Gerenciamento de Tarefas
- ➕ Criar novas tarefas
- 🗑️ Deletar tarefas
- 🎯 Organizar em 3 colunas: **A fazer**, **Fazendo**, **Feito**
- 🖱️ Drag and Drop para mover tarefas entre colunas
- 🔄 Sincronização em tempo real entre dispositivos

### 💾 Persistência de Dados
- ☁️ Armazenamento em nuvem com Firebase Firestore
- 📱 Acesse suas tarefas de qualquer dispositivo
- ⚡ Atualizações instantâneas em tempo real

### 🎨 Interface Moderna
- 🌈 Design moderno com gradientes e animações
- 📱 Totalmente responsivo (mobile, tablet, desktop)
- ✨ Feedback visual para todas as interações
- 🎭 Cores personalizadas por coluna

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática e segurança no código
- **Firebase Authentication** - Autenticação de usuários
- **Firebase Firestore** - Banco de dados NoSQL em tempo real
- **Vite** - Build tool ultra-rápida
- **CSS3** - Estilização moderna com gradientes e animações
- **HTML5 Drag and Drop API** - Funcionalidade de arrastar e soltar

## 📁 Estrutura do Projeto

```
kanban-app/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx           # Tela de login
│   │   │   └── Register.tsx        # Tela de registro
│   │   ├── KanbanBoard.tsx         # Container do board
│   │   ├── Column.tsx              # Componente de coluna
│   │   ├── TaskCard.tsx            # Card individual de tarefa
│   │   └── TaskForm.tsx            # Formulário de nova tarefa
│   ├── firebase/
│   │   ├── config.ts               # Configurações do Firebase
│   │   ├── authService.ts          # Serviços de autenticação
│   │   └── firebaseService.ts      # Serviços do Firestore
│   ├── App.tsx                     # Componente principal
│   ├── index.css                   # Estilos globais
│   └── main.tsx                    # Ponto de entrada
├── public/
├── package.json
└── README.md
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ instalado
- Conta no Firebase (gratuita)
- Git

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/nicfrezza/kanban.git
cd kanban-app
```

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Configure o Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto
3. Ative o **Authentication** (Email/Password)
4. Ative o **Firestore Database**
5. Copie suas credenciais do Firebase

### 4️⃣ Configure as credenciais

Crie o arquivo `src/firebase/config.ts`:

```typescript
export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "seu-app-id"
};
```

### 5️⃣ Configure as regras do Firestore

No Firebase Console > Firestore Database > Regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /tasks/{taskId} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 6️⃣ Execute o projeto

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 🎯 Como Usar

1. **Criar Conta**: Clique em "Criar conta" e registre-se com email e senha
2. **Fazer Login**: Entre com suas credenciais
3. **Adicionar Tarefa**: Digite o nome da tarefa, escolha a coluna e clique em "Adicionar"
4. **Mover Tarefa**: Arraste e solte as tarefas entre as colunas
5. **Deletar Tarefa**: Clique no ícone da lixeira 🗑️
6. **Sair**: Clique no botão "Sair" no canto superior direito

## 🔐 Segurança

- ✅ Autenticação via Firebase Authentication
- ✅ Regras de segurança do Firestore
- ✅ Senhas criptografadas
- ✅ Dados isolados por usuário
- ✅ Validação no frontend e backend

## 🌟 Melhorias Futuras

- [ ] Filtros e busca de tarefas
- [ ] Temas claro/escuro
- [ ] Múltiplos boards por usuário
- [ ] Compartilhamento de boards
- [ ] Notificações por email
- [ ] Exportar tarefas (PDF, Excel)
- [ ] Modo offline com sincronização


## 👨‍💻 Autor

Desenvolvido com ❤️ por Nicoli Frezza (https://github.com/nicfrezza)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)]([https://linkedin.com/in/seu-perfil](https://www.linkedin.com/in/nicoli-frezza/))
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/nicfrezza)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:nicolifrezza@gmail.com)


⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!

