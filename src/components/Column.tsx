import TaskCard from './TaskCard';

interface Task {
  id: string;
  title: string;
}

interface ColumnProps {
  columnId: string;
  title: string;
  tasks: Task[];
  handleDragStart: (task: Task, columnId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

const Column = ({
  columnId,
  title,
  tasks,
  handleDragStart,
  handleDragOver,
  handleDrop,
  deleteTask
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
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;