import Column from './Column';

interface Task {
  id: string;
  title: string;
  description: string;
  link?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: any;
  onEditTask?: (task: Task) => void;
}

interface KanbanBoardProps {
  data: {
    afazer: Task[];
    fazendo: Task[];
    feito: Task[];
  };
  handleDragStart: (task: Task, columnId: string) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

function KanbanBoard({
  data,
  handleDragStart,
  handleDragOver,
  handleDrop,
  deleteTask,
  onEditTask
}: KanbanBoardProps) {
  const columnTitles = {
    afazer: 'A fazer',
    fazendo: 'Fazendo',
    feito: 'Feito'
  };

  return (
    <div className="kanban-board">
      {/* Aqui o Object.keys percorre as colunas */}
      {(Object.keys(data) as Array<keyof typeof data>).map((columnId) => (
        <Column
          key={columnId}
          columnId={columnId}
          title={columnTitles[columnId]}
          tasks={data[columnId]} 
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          deleteTask={deleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;