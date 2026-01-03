interface Task {
  id: string;
  title: string;
}

interface TaskCardProps { // define as propriedades que o componente TaskCard vai receber
  task: Task;
  columnId: string;
  handleDragStart: (task: Task, columnId: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
}

function TaskCard({
  task,
  columnId,
  handleDragStart, // função que sera chamada quando a tarefa começar a ser arrastada
  deleteTask // função que sera chamada ao clicar no botão de deletar
}: TaskCardProps) {
  return (
    <div
      className="task-card"
      draggable // torna o card arrastável
      onDragStart={() => handleDragStart(task, columnId)} // quando começar a arrastar, chama a função handleDragStart com a tarefa e o id da coluna
    >
      <span className="task-title">{task.title}</span> {/* mostra o título da tarefa*/}
      <button
        onClick={() => deleteTask(columnId, task.id)} // ao clicar, chama a função deleteTask com o id da coluna e o id da tarefa
        className="delete-button"
      >
        🗑️
      </button>
    </div>
  );
}

export default TaskCard;