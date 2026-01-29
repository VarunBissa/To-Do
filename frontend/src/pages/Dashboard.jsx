import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Trash2, Edit2, Check, Calendar, Filter } from 'lucide-react';
import { boardsAPI, todosAPI } from '../services/api';
import { Button, Card, Modal, Input, Badge } from '../components/common';
import toast from 'react-hot-toast';
import { format, isPast } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Todo Item Component
const TodoItem = ({ todo, onUpdate, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Fade out original when dragging
    zIndex: isDragging ? 50 : 1,
  };

  const priorityVariants = {
    low: 'bg-green-100/80 text-green-900 border-green-900',
    medium: 'bg-yellow-100/80 text-yellow-900 border-yellow-900',
    high: 'bg-red-100/80 text-red-900 border-red-900',
  };

  const isOverdue = todo.due_date && isPast(new Date(todo.due_date)) && !todo.is_completed;

  return (
    <div className="relative group mx-2">
       {/* Tape element */}
       <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-100/40 -rotate-1 z-20 pointer-events-none" 
            style={{
              maskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0 L100%25 0 L100%25 100%25 L0 100%25 Z\' fill=\'black\'/%3E%3C/svg%3E")',
              WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0 L100%25 0 L100%25 100%25 L0 100%25 Z\' fill=\'black\'/%3E%3C/svg%3E")',
              boxShadow: '0 1px 1px rgba(0,0,0,0.1)' 
            }}
       ></div>

      <div
        ref={setNodeRef}
        style={{...style, borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px'}}
        {...attributes}
        {...listeners}
        className={`relative bg-white border-2 border-ink-900 p-5 shadow-sketch transition-all cursor-move
                    hover:-translate-y-1 hover:shadow-sketch-hover
                    ${todo.is_completed ? 'opacity-70 bg-gray-50' : ''}
                    `}
      >
        <div className="flex items-start gap-4">
          {/* Custom Checkbox */}
          <div 
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              onUpdate(todo.id, { isCompleted: !todo.is_completed });
            }}
            className="mt-1 cursor-pointer flex-shrink-0"
          >
             <div className={`w-6 h-6 border-2 border-ink-900 rounded-sm flex items-center justify-center bg-white transition-colors hover:bg-gray-50
                            ${todo.is_completed ? 'bg-primary-100' : ''}`}
                  style={{ borderRadius: '3px 2px 4px 2px' }}
             >
               {todo.is_completed && <Check size={18} className="text-primary-600 animate-wiggle" strokeWidth={3} />}
             </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-display text-xl leading-tight text-ink-900 ${todo.is_completed ? 'line-through decoration-2 decoration-ink-400' : ''}`}>
              {todo.title}
            </h3>
            
            {todo.description && (
              <p className="font-sans text-lg text-ink-500 mt-1 leading-snug">
                {todo.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`px-2 py-0.5 border-2 rounded-sm text-sm font-bold uppercase tracking-wide transform -rotate-2 ${priorityVariants[todo.priority]}`}
                    style={{ borderRadius: '15px 225px 15px 255px / 255px 15px 225px 15px' }}
              >
                {todo.priority}
              </span>
              
              {todo.due_date && (
                <span className={`text-sm font-bold flex items-center gap-1 ${isOverdue ? 'text-red-600 bg-red-50 px-1 -skew-x-6' : 'text-ink-500'}`}>
                  <Calendar size={14} strokeWidth={2.5} />
                  {format(new Date(todo.due_date), 'MMM d')}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onEdit(todo)}
              className="p-2 text-ink-500 hover:text-primary-600 hover:bg-primary-50 rounded-full border-2 border-transparent hover:border-primary-200 transition-all"
              title="Edit"
            >
              <Edit2 size={20} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="p-2 text-ink-500 hover:text-red-600 hover:bg-red-50 rounded-full border-2 border-transparent hover:border-red-200 transition-all"
              title="Delete"
            >
              <Trash2 size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Dashboard = () => {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed

  // Modals
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  // Form states
  const [boardName, setBoardName] = useState('');
  const [boardDesc, setBoardDesc] = useState('');
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (currentBoard) {
      fetchTodos(currentBoard.id);
    }
  }, [currentBoard]);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.getAll();
      setBoards(response.data.boards);
      if (response.data.boards.length > 0 && !currentBoard) {
        setCurrentBoard(response.data.boards[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodos = async (boardId) => {
    try {
      const response = await todosAPI.getAll(boardId);
      setTodos(response.data.todos);
    } catch (error) {
      toast.error('Failed to fetch todos');
    }
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    try {
      const response = await boardsAPI.create({ name: boardName, description: boardDesc });
      setBoards([...boards, response.data.board]);
      setCurrentBoard(response.data.board);
      toast.success('Board created!');
      setShowBoardModal(false);
      setBoardName('');
      setBoardDesc('');
    } catch (error) {
      toast.error('Failed to create board');
    }
  };

  const handleDeleteBoard = async (boardId) => {
    if (!confirm('Delete this board and all its todos?')) return;
    
    // Optimistic update for board deletion
    const previousBoards = [...boards];
    const previousCurrentBoard = currentBoard;
    
    const newBoards = boards.filter(b => b.id !== boardId);
    setBoards(newBoards);
    if (currentBoard?.id === boardId) {
      setCurrentBoard(newBoards[0] || null);
    }

    try {
      await boardsAPI.delete(boardId);
      toast.success('Board deleted!');
    } catch (error) {
      setBoards(previousBoards);
      setCurrentBoard(previousCurrentBoard);
      toast.error('Failed to delete board');
    }
  };

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await todosAPI.create(currentBoard.id, {
        title: todoForm.title,
        description: todoForm.description,
        priority: todoForm.priority,
        dueDate: todoForm.dueDate || null,
      });
      setTodos([...todos, response.data.todo]);
      toast.success('Todo created!');
      setShowTodoModal(false);
      setTodoForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (error) {
      toast.error('Failed to create todo');
    }
  };

  const handleUpdateTodo = async (id, updates) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos(todos.map(t => t.id === id ? { ...t, ...updates, is_completed: updates.isCompleted ?? t.is_completed } : t));
    
    try {
      await todosAPI.update(id, updates);
      // toast.success('Todo updated!'); // Optional: reduce noise for simple toggles
    } catch (error) {
      setTodos(previousTodos); // Revert on failure
      toast.error('Failed to update todo');
    }
  };

  const handleEditTodo = async (e) => {
    e.preventDefault();
    
    const updates = {
      title: todoForm.title,
      description: todoForm.description,
      priority: todoForm.priority,
      dueDate: todoForm.dueDate || null,
    };

    // Optimistic update
    const previousTodos = [...todos];
    setTodos(todos.map(t => t.id === editingTodo.id ? { ...t, ...updates } : t));
    setShowTodoModal(false);
    setEditingTodo(null);
    setTodoForm({ title: '', description: '', priority: 'medium', dueDate: '' });

    try {
      await todosAPI.update(editingTodo.id, updates);
      toast.success('Todo updated!');
    } catch (error) {
      setTodos(previousTodos);
      toast.error('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    // Optimistic delete
    const previousTodos = [...todos];
    setTodos(todos.filter(t => t.id !== id));
    
    try {
      await todosAPI.delete(id);
      toast.success('Todo deleted!');
    } catch (error) {
      setTodos(previousTodos);
      toast.error('Failed to delete todo');
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = todos.findIndex(t => t.id === active.id);
      const newIndex = todos.findIndex(t => t.id === over.id);
      
      const reordered = arrayMove(todos, oldIndex, newIndex);
      setTodos(reordered);

      // Update positions on backend
      const updates = reordered.map((todo, index) => ({
        id: todo.id,
        position: index,
      }));

      try {
        await todosAPI.reorder(updates);
      } catch (error) {
        toast.error('Failed to save order');
        fetchTodos(currentBoard.id); // Revert on error
      }
    }
  };

  const openEditTodo = (todo) => {
    setEditingTodo(todo);
    
    let formattedDate = '';
    if (todo.due_date) {
      const date = new Date(todo.due_date);
      if (!isNaN(date.getTime())) {
        formattedDate = format(date, 'yyyy-MM-dd');
      }
    }

    setTodoForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      dueDate: formattedDate,
    });
    setShowTodoModal(true);
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.is_completed;
    if (filter === 'completed') return todo.is_completed;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <svg className="animate-spin h-12 w-12 text-primary-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Boards */}
          <div className="lg:col-span-1">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <LayoutGrid size={20} />
                  Boards
                </h2>
                <Button size="sm" onClick={() => setShowBoardModal(true)}>
                  <Plus size={16} />
                </Button>
              </div>

              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {boards.map(board => (
                  <div
                    key={board.id}
                    className={`p-3 rounded-lg cursor-pointer transition flex items-center justify-between group ${
                      currentBoard?.id === board.id
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => setCurrentBoard(board)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{board.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {board.completed_count}/{board.todo_count} completed
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBoard(board.id);
                      }}
                      className="text-gray-400 hover:text-red-500 transition ml-2 opacity-0 group-hover:opacity-100 p-1 hover:bg-white dark:hover:bg-slate-800 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {boards.length === 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No boards yet. Create one!
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* Main Area - Todos */}
          <div className="lg:col-span-3">
            {currentBoard ? (
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {currentBoard.name}
                    </h1>
                    {currentBoard.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {currentBoard.description}
                      </p>
                    )}
                  </div>
                  <Button onClick={() => { setEditingTodo(null); setTodoForm({ title: '', description: '', priority: 'medium', dueDate: '' }); setShowTodoModal(true); }}>
                    <Plus size={20} className="mr-2" />
                    Add Todo
                  </Button>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-ink-500" />
                    <span className="font-display text-lg">Filters:</span>
                  </div>
                  <div className="flex gap-2">
                    {['all', 'active', 'completed'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1 font-bold text-lg transition-transform hover:-rotate-2 ${
                          filter === f 
                            ? 'text-primary-600 underline decoration-wavy decoration-2 underline-offset-4' 
                            : 'text-ink-400 hover:text-ink-900'
                        }`}
                      >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Todos List */}
                {filteredTodos.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={filteredTodos.map(t => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-4 px-2 pb-4">
                        {filteredTodos.map(todo => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onUpdate={handleUpdateTodo}
                            onDelete={handleDeleteTodo}
                            onEdit={openEditTodo}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-ink-400 rounded-lg m-4 opacity-70">
                    <p className="font-display text-2xl text-ink-500 rotate-1">
                      {filter === 'completed' ? 'Nothing finished yet...' :
                       filter === 'active' ? 'No work to do!' :
                       'Empty page... start sketching!'}
                    </p>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="text-center py-12">
                <LayoutGrid size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Select a board or create a new one to get started
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Board Modal */}
      <Modal
        isOpen={showBoardModal}
        onClose={() => { setShowBoardModal(false); setBoardName(''); setBoardDesc(''); }}
        title="Create New Board"
      >
        <form onSubmit={handleCreateBoard}>
          <Input
            label="Board Name"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="e.g., Work Tasks"
            required
          />
          <Input
            label="Description (optional)"
            value={boardDesc}
            onChange={(e) => setBoardDesc(e.target.value)}
            placeholder="What's this board for?"
          />
          <div className="flex gap-3 justify-end mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowBoardModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Board</Button>
          </div>
        </form>
      </Modal>

      {/* Todo Modal */}
      <Modal
        isOpen={showTodoModal}
        onClose={() => { setShowTodoModal(false); setEditingTodo(null); setTodoForm({ title: '', description: '', priority: 'medium', dueDate: '' }); }}
        title={editingTodo ? 'Edit Todo' : 'Create New Todo'}
      >
        <form onSubmit={editingTodo ? handleEditTodo : handleCreateTodo}>
          <Input
            label="Title"
            value={todoForm.title}
            onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
            placeholder="What needs to be done?"
            required
          />
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={todoForm.description}
              onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
              placeholder="Add details..."
              className="input min-h-[100px]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Priority
            </label>
            <select
              value={todoForm.priority}
              onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value })}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <Input
            label="Due Date (optional)"
            type="date"
            value={todoForm.dueDate}
            onChange={(e) => setTodoForm({ ...todoForm, dueDate: e.target.value })}
          />

          <div className="flex gap-3 justify-end mt-4">
            <Button type="button" variant="secondary" onClick={() => { setShowTodoModal(false); setEditingTodo(null); }}>
              Cancel
            </Button>
            <Button type="submit">{editingTodo ? 'Update' : 'Create'} Todo</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
