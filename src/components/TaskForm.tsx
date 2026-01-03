interface TaskFormProps { // define as propriedades que o componente TaskForm vai receber
  newTaskContent: string; // o conteúdo da nova tarefa
  setNewTaskContent: (value: string) => void; // função para atualizar o conteúdo da nova tarefa
  selectedColumn: string; // a coluna selecionada para adicionar a nova tarefa
  setSelectedColumn: (value: string) => void; // função para atualizar a coluna selecionada
  addTask: () => void; // função para adicionar a nova tarefa
}

function TaskForm({
  newTaskContent,
  setNewTaskContent,
  selectedColumn,
  setSelectedColumn,
  addTask
}: TaskFormProps) {
  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Digite uma nova tarefa..."
        value={newTaskContent}
        onChange={(e) => setNewTaskContent(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTask()} // adiciona a tarefa ao pressionar Enter
        className="task-input"
      />
      <select
        value={selectedColumn} // valor da coluna selecionada
        onChange={(e) => setSelectedColumn(e.target.value)}
        className="column-select"
      >
        <option value="afazer">A fazer</option>
        <option value="fazendo">Fazendo</option>
        <option value="feito">Feito</option>
      </select>
      <button onClick={addTask} className="add-button">
        ➕ Adicionar
      </button>
    </div>
  );
}

export default TaskForm;