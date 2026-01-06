import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { firebaseConfig } from './config';

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Referência da coleção de tarefas
const tasksCollection = collection(db, 'tasks');

// Interface exportada
export interface Task {
  id?: string;
  title: string;
  status: 'afazer' | 'fazendo' | 'feito';
  userId: string; // NOVO: ID do usuário dono da tarefa
  createdAt?: any;
  description?: string;
  link?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Adicionar uma nova tarefa (userId opcional)
export const addTask = async (
  title: string,
  status: 'afazer' | 'fazendo' | 'feito',
  userId?: string,
  description?: string,
  link?: string,
  priority?: 'low' | 'medium' | 'high',
  createdAt?: any
) => {
  try {
    const data: any = {
      title,
      status,
      createdAt: Timestamp.now()
    };
    if (userId) {
      data.userId = userId;
    }
    if (description) {
      data.description = description;
    }
    if (link) {
      data.link = link;
    }
    if (priority) {
      data.priority = priority;
    }
    if (createdAt) {
      data.createdAt = createdAt;
    }

    const docRef = await addDoc(tasksCollection, data);
    console.log('Tarefa adicionada com ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error);
    throw error;
  }
};

// Atualizar status da tarefa
export const updateTaskStatus = async (taskId: string, newStatus: 'afazer' | 'fazendo' | 'feito') => {
  try {
    const taskDoc = doc(db, 'tasks', taskId);
    await updateDoc(taskDoc, {
      status: newStatus
    });
    console.log('Status da tarefa atualizado');
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    throw error;
  }
};

//atualizar informações da tarefa
export const updateTask = async (taskId: string, updatedData: Partial<Task>) => {
  try {
    const taskDoc = doc(db, 'tasks', taskId);
    const { id, ...dataToUpdate } = updatedData as any; 
    
    await updateDoc(taskDoc, dataToUpdate);
    console.log('Tarefa atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
};

// Deletar tarefa
export const deleteTask = async (taskId: string) => {
  try {
    const taskDoc = doc(db, 'tasks', taskId);
    await deleteDoc(taskDoc);
    console.log('Tarefa deletada');
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
};

// Observar mudanças em tempo real nas tarefas DO USUÁRIO
export const subscribeToUserTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  // Query que busca apenas tarefas do usuário logado
  const q = query(
    tasksCollection, 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      } as Task);
    });
    callback(tasks);
  }, (error) => {
    console.error('Erro ao observar tarefas:', error);
  });

  return unsubscribe;
};

// Observar mudanças em tempo real nas tarefas (todas)
export const subscribeToTasks = (callback: (tasks: Task[]) => void) => {
  const q = query(tasksCollection, orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const tasks: Task[] = [];
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,
        ...doc.data()
      } as Task);
    });
    callback(tasks);
  }, (error) => {
    console.error('Erro ao observar tarefas:', error);
  });

  return unsubscribe;
};

export { db };