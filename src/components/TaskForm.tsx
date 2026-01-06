interface TaskFormProps { // define as propriedades que o componente TaskForm vai receber
  newTaskContent: string; // o conteúdo da nova tarefa
  // novos campos
 description: string;
  setDescription: (value: string) => void; 
  createdAt: any;
  setCreatedAt: (value: any) => void;
  link?: string;
  setLink: (value: string) => void; 
  priority: 'low' | 'medium' | 'high';
  setPriority: (value: 'low' | 'medium' | 'high') => void;
  setNewTaskContent: (value: string) => void; // função para atualizar o conteúdo da nova tarefa
  selectedColumn: string; // a coluna selecionada para adicionar a nova tarefa
  setSelectedColumn: (value: string) => void; // função para atualizar a coluna selecionada
  addTask: () => void; // função para adicionar a nova tarefa
}

function TaskForm({
  newTaskContent,
  setNewTaskContent,
  description,
  setDescription,
  link,
  setLink,
  priority,
  setPriority,
  createdAt,
  setCreatedAt,
  selectedColumn,
  setSelectedColumn,
  addTask
}: TaskFormProps) {
  return (
    <div className="task-form">
      {/*TÍTULO*/}
      <input 
      type="text"
      placeholder="Descrição da tarefa"
      value={newTaskContent}
      onChange={(e) => setNewTaskContent(e.target.value)}
      className="task-input"
      />


    {/* DESCRIÇÃO (description) */}
      <textarea 
        placeholder="Descrição detalhada..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="description-input"
      />

      {/*LINK*/}
      <input 
      type="text"
      placeholder="Link relacionado (opcional)"
      value={link}
      onChange={(e) => setLink(e.target.value)}
      className="link-input"
      />

     {/* PRIORIDADE E DATA EM UMA LINHA */}
      <div className="form-row">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="priority-select"
        >
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
        </select>

        <input 
          type="date"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          className="date-input"
        />
      </div>

    {/* SELEÇÃO DE COLUNA E BOTÃO */}
      <div className="form-row">
        <select
          value={selectedColumn}
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
    </div>
  );
}

export default TaskForm;