import Column from './Column';

interface Task {
  id: string;
  title: string;
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
}

function KanbanBoard({
  data,
  handleDragStart,
  handleDragOver,
  handleDrop,
  deleteTask
}: KanbanBoardProps) {
  const columnTitles = {
    afazer: 'A fazer',
    fazendo: 'Fazendo',
    feito: 'Feito'
  };

  return (
    <div className="kanban-board">
      {Object.keys(data).map((columnId) => (
        <Column
          key={columnId}
          columnId={columnId}
          title={columnTitles[columnId as keyof typeof columnTitles]}
          tasks={data[columnId as keyof typeof data]}
          handleDragStart={handleDragStart}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
}

export default KanbanBoard;