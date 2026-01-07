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
  updateTask,
} from './firebase/firebaseService';
import type { Task } from './firebase/firebaseService';
import { onAuthStateChange, logoutUser } from './firebase/authService';
import './index.css';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from './firebase/firebaseService'

// Define a estrutura dos dados das tarefas por coluna
interface TaskData {
  afazer: Task[];
  fazendo: Task[];
  feito: Task[];
}



function App() {
  const { projectId } = useParams<{ projectId: string } > ();
  const [projectName, setProjectName] = useState('');  
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  

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
      projectId      // O ID do projeto que veio do useParams
    );
    
    clearForm(); // Limpa os campos e fecha o modal
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    alert("Não foi possível adicionar a tarefa.");
  }
};
  
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
  const [description, setDescription] = useState(''); // nova descrição
  const [createdAt, setCreatedAt] = useState(''); // nova data de criação
  const [link, setLink] = useState(''); // novo link
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low'); // nova prioridade
  const [dueDate, setDueDate] = useState<string>('');


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


  const clearForm = () => {
    setNewTaskContent('');
    setDescription('');
    setLink('');
    setPriority('low');
    setCreatedAt('');
    setDueDate(''); // Limpa o novo campo de data também
    setEditingTask(null);
    setIsFormOpen(false); // FECHA O FORMULÁRIO
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
    setDueDate(task.dueDate || ''); // Garante que a data de vencimento apareça no form
    setIsFormOpen(true); // ABRE O FORMULÁRIO AO CLICAR EM EDITAR
    console.log("Botão de editar clicado! Dados da tarefa:", task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
  };

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
    if (!user || !projectId) return;

    setLoading(true); // Inicia o loading ao buscar tarefas
    const unsubscribe = subscribeToUserTasks(
      user.uid, 
      projectId,
      (tasks) => { // Filtra e agrupa tarefas por status
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
  }, [user, projectId]);

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
      <div className='nome-projeto'>
    <h1 className="nome-projeto">
          {projectName || 'Carregando...'}
        </h1>      </div>      

      <button 
        onClick={() => navigate('/home')} 
        className="btn-back" 
        style={{ marginBottom: '10px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
      >
        ← Voltar para Projetos
      </button>
          </div>
          <button onClick={handleLogout} className="logout-button">
            🚪 Sair
          </button>
        </div>
        <div className="search-bar-container">
      <input 
        type="text" 
        placeholder="🔍 Pesquisar tarefas..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <button 
        className="btn-add-task" 
        onClick={() => setIsFormOpen(true)}
      >
        ➕ Nova Tarefa
      </button>
    </div>
</div>
        
  

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
        addTask={editingTask ? saveTask : addTask} // se estiver editando, salva; senão, adiciona
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
        dueDate={dueDate} // estado
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
  );
}

export default App;