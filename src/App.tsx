import { useEffect, useState } from 'react';
import * as React from 'react';
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
  updateTask,
} from './firebase/firebaseService';
import type { Task } from './firebase/firebaseService';
import { onAuthStateChange, logoutUser } from './firebase/authService';
import './index.css';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseService'



interface TaskData {
  afazer: Task[];
  fazendo: Task[];
  feito: Task[];
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="theme-toggle-btn"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}

function App() {
  const { projectId } = useParams<{ projectId: string }>();
  const [projectName, setProjectName] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();


  const [data, setData] = useState<TaskData>({
    afazer: [],
    fazendo: [],
    feito: []
  });

  const [newTaskContent, setNewTaskContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState<'afazer' | 'fazendo' | 'feito'>('afazer');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<'afazer' | 'fazendo' | 'feito' | null>(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [link, setLink] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [dueDate, setDueDate] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      console.log("Estado da auth mudou:", currentUser);
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProjectName = async () => {
      if (projectId) {
        try {
          const projectRef = doc(db, 'projects', projectId);
          const projectSnap = await getDoc(projectRef);

          if (projectSnap.exists()) {
            const data = projectSnap.data();
            setProjectName(data.name);
          } else {
            setProjectName('Projeto não encontrado');
          }
        } catch (error) {
          console.error("Erro ao buscar nome do projeto:", error);
          setProjectName('Erro ao carregar');
        }
      }
    };

    fetchProjectName();
  }, [projectId]);

  useEffect(() => {
    if (!user || !projectId) return;

    setLoading(true);
    const unsubscribe = subscribeToUserTasks(
      user.uid,
      projectId,
      (tasks) => {
        const groupedTasks: TaskData = {
          afazer: [],
          fazendo: [],
          feito: []
        };

        tasks.forEach((task) => {
          if (task.status && groupedTasks[task.status]) {
            groupedTasks[task.status].push(task);
          }
        });

        setData(groupedTasks);
        setLoading(false);
      });

    return () => unsubscribe();
  }, [user, projectId]);

  if (authLoading) {
    return <div className="loading-screen">Carregando...</div>;
  }

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  if (!projectId) {
    return (
      <div className="app-container">
        <div className="header">
          <h1>📋 Kanban Board</h1>
          <p>Projeto não encontrado. Por favor, selecione um projeto válido.</p>
          <button onClick={() => navigate('/home')} className="btn-back-link">
            ← Voltar para Meus Projetos
          </button>
        </div>
      </div>
    );
  }

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


  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }


  const addTask = async () => {
    if (!user || !projectId) return;
    if (newTaskContent.trim() === '') return;

    try {
      await addTaskFirebase(
        newTaskContent,
        selectedColumn,
        user.uid,
        description,
        link || '',
        priority,
        dueDate || '',
        projectId
      );

      clearForm();
    } catch (error) {
      console.error("Erro ao adicionar tarefa:", error);
      alert("Não foi possível adicionar a tarefa.");
    }
  };






  const clearForm = () => {
    setNewTaskContent('');
    setDescription('');
    setLink('');
    setPriority('low');
    setCreatedAt('');
    setDueDate('');
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const filteredData = {
    afazer: data.afazer.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())),
    fazendo: data.fazendo.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())),
    feito: data.feito.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase())),
  };

  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setNewTaskContent(task.title);
    setDescription(task.description);
    setLink(task.link || '');
    setPriority(task.priority);
    setCreatedAt(task.createdAt);
    setSelectedColumn(task.status);
    setDueDate(task.dueDate || '');
    setIsFormOpen(true);
    console.log("Botão de editar clicado! Dados da tarefa:", task);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  };

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



  const deleteTask = async (columnId: 'afazer' | 'fazendo' | 'feito', taskId: string) => {
    try {
      await deleteTaskFromFirebase(taskId);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      alert('Erro ao deletar tarefa. Tente novamente.');
    }
  };


  const saveTask = async () => {
    if (newTaskContent.trim() === '') return;

    try {
      if (editingTask && editingTask.id) {
        await updateTask(editingTask.id, {
          title: newTaskContent,
          description,
          link,
          priority,
          dueDate: dueDate || '',
          status: selectedColumn as 'afazer' | 'fazendo' | 'feito'
        });
      }
      clearForm();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      alert('Erro ao salvar.');
    }
  };


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
      <header className="header">
        <div className="header-content">

          <div className="header-info">
            <div className="projeto-status-badge">
              <span className="pulse-dot"></span> Projeto Ativo
            </div>
            <h1 className="nome-projeto">
              {projectName || 'Carregando...'}
            </h1>
            <button onClick={() => navigate('/home')} className="btn-back-link">
              ← Voltar para Meus Projetos
            </button>
          </div>

          <div className="header-actions">
            <div className='theme-wrapper'>
              <ThemeToggle />
            </div>
            <button onClick={() => logoutUser()} className="logout-button">
              🚪 Sair
            </button>
          </div>

        </div>

        <div className="search-bar-row">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="🔍 Pesquisar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="btn-add-task-primary" onClick={() => setIsFormOpen(true)}>
            ➕  Nova Tarefa
          </button>
        </div>
      </header>




      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
              <button className="close-btn" onClick={clearForm}>&times;</button>
            </div>
            <TaskForm
              newTaskContent={newTaskContent}
              setNewTaskContent={setNewTaskContent}
              selectedColumn={selectedColumn}
              setSelectedColumn={setSelectedColumn}
              addTask={editingTask ? saveTask : addTask}
              description={description}
              setDescription={setDescription}
              createdAt={createdAt}
              setCreatedAt={setCreatedAt}
              link={link}
              setLink={setLink}
              priority={priority}
              setPriority={setPriority}
              isEditing={!!editingTask}
              onCancel={clearForm}
              dueDate={dueDate}
              setDueDate={setDueDate}
            />
          </div>
        </div>
      )}




      <KanbanBoard
        data={filteredData}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        deleteTask={deleteTask}
        onEditTask={handleEditClick}
      />
    </div>
  )
}

export default App;
