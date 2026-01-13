interface Task {
  id: string;
  title: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  onEditTask?: (task: Task) => void;
}

interface TaskCardProps {
  task: Task;
  columnId: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  handleDragStart: (task: Task, columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

function TaskCard({
  task,
  columnId,
  handleDragStart,
  deleteTask,
  onEditTask
}: TaskCardProps) {
  return (
    <div
      className={`task-card priority-${task.priority}`}
      draggable
      onDragStart={() => handleDragStart(task, columnId)}
    >
      <div className="task-content">
        <strong className="task-title">{task.title}</strong>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        {task.link && (
          <a href={task.link} target="_blank" rel="noreferrer" className="task-link">
            🔗 Ver link
          </a>
        )}

        <div className="task-footer">
          <span className={`priority-tag ${task.priority}`}>
            {task.priority === 'high' ? '🔴 Alta' : task.priority === 'medium' ? '🟡 Média' : '🟢 Baixa'}
          </span>
          <div className="task-footer">
            {task.dueDate && (
              <span className="due-date-tag">
                ⏱️ Limite: {new Date(task.dueDate).toLocaleString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button
          onClick={() => onEditTask && onEditTask(task)}
          className="edit-button"
          title="Editar tarefa"
        >
          ✏️
        </button>

        <button
          onClick={() => deleteTask(columnId, task.id)}
          className="delete-button"
          title="Excluir tarefa"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
export default TaskCard;