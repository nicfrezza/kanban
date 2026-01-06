import TaskCard from './TaskCard';

// definição da interface Task
interface Task {
  id: string;
  title: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  onEditTask?: (task: Task) => void;

}

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  handleDragStart: (task: Task, columnId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

const Column = ({
  columnId,
  title,
  tasks,
  handleDragStart,
  handleDragOver,
  handleDrop,
  deleteTask,
  onEditTask
}: ColumnProps) => {
  return (
    <div
      className={`column column-${columnId}`}
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(columnId)}
    >
      <div className="column-header">
        {title} ({tasks.length})
      </div>

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-column">
            Solte tarefas aqui
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columnId={columnId}
              handleDragStart={handleDragStart}
              deleteTask={deleteTask}
              onEditTask={onEditTask} // editar
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;