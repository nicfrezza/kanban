import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import KanbanBoard from './components/KanbanBoard';
import TaskForm from './components/TaskForm';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import {
  addTask as addTaskFirebase,
  updateTaskStatus,
  deleteTask as deleteTaskFromFirebase,
  subscribeToUserTasks,
} from './firebase/firebaseService';
import type { Task } from './firebase/firebaseService';
import { onAuthStateChange, logoutUser } from './firebase/authService';
import './index.css';

// Define a estrutura dos dados das tarefas por coluna
interface TaskData {
  afazer: Task[];
  fazendo: Task[];
  feito: Task[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  
  const [data, setData] = useState<TaskData>({
    afazer: [],
    fazendo: [],
    feito: []
  });
  const [newTaskContent, setNewTaskContent] = useState(''); // conteúdo da nova tarefa
  const [selectedColumn, setSelectedColumn] = useState<'afazer' | 'fazendo' | 'feito'>('afazer'); // coluna selecionada
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<'afazer' | 'fazendo' | 'feito' | null>(null); // coluna de origem do drag
  const [loading, setLoading] = useState(true); // estado de loading das tarefas

  // Monitora mudanças na autenticação do usuário
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Carrega tarefas quando o usuário está logado
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true); // Inicia o loading ao buscar tarefas
    const unsubscribe = subscribeToUserTasks(user.uid, (tasks) => { // Filtra e agrupa tarefas por status
      const groupedTasks: TaskData = { // inicializa o objeto de tarefas agrupadas
        afazer: [],
        fazendo: [],
        feito: []
      };

      tasks.forEach((task) => { // agrupa as tarefas conforme o status
        if (task.status && groupedTasks[task.status]) {
          groupedTasks[task.status].push(task);
        }
      });

      setData(groupedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleDragStart = (task: Task, fromColumn: 'afazer' | 'fazendo' | 'feito') => {
    setDraggedTask(task);
    setDraggedFrom(fromColumn);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (toColumn: 'afazer' | 'fazendo' | 'feito') => {
    if (!draggedTask || !draggedFrom || !draggedTask.id) return;

    try {
      await updateTaskStatus(draggedTask.id, toColumn);
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      alert('Erro ao mover tarefa. Tente novamente.');
    }

    setDraggedTask(null);
    setDraggedFrom(null);
  };

  const addTask = async () => {
    if (!user) return;
    if (newTaskContent.trim() === '') return;

    try {
      await addTaskFirebase(newTaskContent, selectedColumn, user.uid);
      setNewTaskContent('');
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      alert('Erro ao adicionar tarefa. Tente novamente.');
    }
  };

  const deleteTask = async (columnId: 'afazer' | 'fazendo' | 'feito', taskId: string) => {
    try {
      await deleteTaskFromFirebase(taskId);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      alert('Erro ao deletar tarefa. Tente novamente.');
    }
  };

  // Tela de loading inicial
  if (authLoading) {
    return (
      <div className="app-container">
        <div className="header">
          <h1>📋 Kanban Board</h1>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Tela de autenticação (Login ou Registro)
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Tela principal do Kanban (usuário logado)
  if (loading) {
    return (
      <div className="app-container">
        <div className="header">
          <h1>📋 Kanban Board</h1>
          <p>Carregando suas tarefas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-content">
          <div>
            <h1>📋 Kanban Board</h1>
            <p>Olá, {user.email}! Organize suas tarefas</p>
          </div>
          <button onClick={handleLogout} className="logout-button">
            🚪 Sair
          </button>
        </div>
      </div>

      <TaskForm
        newTaskContent={newTaskContent}
        setNewTaskContent={setNewTaskContent}
        selectedColumn={selectedColumn}
        setSelectedColumn={setSelectedColumn}
        addTask={addTask}
      />

      <KanbanBoard
        data={data}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;