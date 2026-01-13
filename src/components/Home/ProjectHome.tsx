import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseService'
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChange, logoutUser } from '../../firebase/authService'
import type { User } from 'firebase/auth';

interface Project {
  id: string;
  name: string;
  description: string;
}

const ProjectHome = () => {
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      if (!currentUser) navigate('/login');
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() || !user) return;

    try {
      const docRef = await addDoc(collection(db, 'projects'), {
        name: projectName,
        description: projectDesc,
        ownerId: user.uid,
        createdAt: serverTimestamp()
      });

      setProjectName('');
      setProjectDesc('');
      setIsModalOpen(false);
      navigate(`/project/${docRef.id}`);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    }
  };

  return (
    <div className="app-container">
      <header className="header-content">
        <div>
          <h1>Meus Projetos</h1>
          <p>Olá, {user?.email}. Selecione um projeto para gerenciar.</p>
        </div>
        <button onClick={() => logoutUser()} className="logout-button">🚪 Sair</button>
      </header>

      <div className="search-bar-container">
        <button className="btn-add-task" onClick={() => setIsModalOpen(true)}>
          ➕ Novo Projeto
        </button>
      </div>

      <div className="kanban-board">
        {projects.map((project) => (
          <div
            key={project.id}
            className="task-card project-card"
            onClick={() => navigate(`/project/${project.id}`)}
            style={{ cursor: 'pointer', borderLeftColor: 'var(--primary)' }}
          >
            <h3 className="task-title">{project.name}</h3>
            <p className="task-description">{project.description || 'Sem descrição.'}</p>
            <div className="task-footer">
              <span className="link-input">Acessar Quadro →</span>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p style={{ color: 'white', textAlign: 'center', gridColumn: '1/-1' }}>
            Você ainda não tem projetos. Crie o seu primeiro!
          </p>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Criar Novo Projeto</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateProject} className="task-form" style={{ display: 'flex', flexDirection: 'column' }}>
              <input
                type="text"
                placeholder="Nome do Projeto"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="task-input"
                required
              />
              <textarea
                placeholder="Descrição curta"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                className="description-input"
              />
              <button type="submit" className="add-button">🚀 Criar e Abrir</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHome;