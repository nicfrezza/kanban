interface Task {
  id: string;
  title: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
}

interface TaskCardProps { // define as propriedades que o componente TaskCard vai receber
  task: Task;
  columnId: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  handleDragStart: (task: Task, columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

function TaskCard({
  task,
  columnId,
  description,
  handleDragStart, // função que sera chamada quando a tarefa começar a ser arrastada
  deleteTask // função que sera chamada ao clicar no botão de deletar
}: TaskCardProps) {
  return (
    <div
      className={`task-card priority-${task.priority}`} // 
      draggable
      onDragStart={() => handleDragStart(task, columnId)}
    >
      <div className="task-content">
        <strong className="task-title">{task.title}</strong>
        
        {/* Mostra a descrição apenas se ela existir */}
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {/* Mostra o link apenas se existir */}
        {task.link && (
          <a href={task.link} target="_blank" rel="noreferrer" className="task-link">
            🔗 Ver link
          </a>
        )}

        <div className="task-footer">
          <span className={`priority-tag ${task.priority}`}>
            {task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
          </span>
        <small className="task-date">
  {task.createdAt && typeof task.createdAt === 'object' 
    ? new Date((task.createdAt as any).seconds * 1000).toLocaleDateString('pt-BR') 
    : task.createdAt}
</small>
        </div>
      </div>

      <button
        onClick={() => deleteTask(columnId, task.id)}
        className="delete-button"
        title="Excluir tarefa"
      >
        🗑️
      </button>
    </div>
  );
}

export default TaskCard;