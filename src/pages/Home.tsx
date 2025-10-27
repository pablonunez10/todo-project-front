import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { todosAPI } from '../services/api';
import type { Todo, CreateTodoDto } from '../types';
import { FiSearch, FiPlus, FiLogOut, FiTrash2, FiCheck, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Home() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'todas' | 'alta' | 'media' | 'baja'>('todas');
  const [showCompleted, setShowCompleted] = useState(true);

  // Modal nuevo todo
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState<CreateTodoDto>({
    title: '',
    description: '',
    priority: 'media'
  });

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todosAPI.getAll();
      setTodos(data);
    } catch (error) {
      toast.error('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await todosAPI.create(newTodo);
      setTodos([created, ...todos]);
      setNewTodo({ title: '', description: '', priority: 'media' });
      setShowModal(false);
      toast.success('Tarea creada');
    } catch (error) {
      toast.error('Error al crear tarea');
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    try {
      const updated = await todosAPI.update(todo.id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === todo.id ? updated : t));
      toast.success(updated.completed ? 'Tarea completada' : 'Tarea pendiente');
    } catch (error) {
      toast.error('Error al actualizar tarea');
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm('¿Eliminar esta tarea?')) return;
    try {
      await todosAPI.delete(id);
      setTodos(todos.filter(t => t.id !== id));
      toast.success('Tarea eliminada');
    } catch (error) {
      toast.error('Error al eliminar tarea');
    }
  };

  // Filtrado y búsqueda
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           todo.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === 'todas' || todo.priority === priorityFilter;
      const matchesCompleted = showCompleted || !todo.completed;

      return matchesSearch && matchesPriority && matchesCompleted;
    });
  }, [todos, searchTerm, priorityFilter, showCompleted]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'media': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'baja': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    alta: todos.filter(t => t.priority === 'alta' && !t.completed).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Kiki Todo</h1>
                <p className="text-sm text-gray-500">Hola, {user?.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-green-100">
            <div className="text-sm text-gray-500">Completadas</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-yellow-100">
            <div className="text-sm text-gray-500">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
            <div className="text-sm text-gray-500">Alta Prioridad</div>
            <div className="text-2xl font-bold text-red-600">{stats.alta}</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar tareas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Priority Filter */}
            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>

            {/* Show Completed */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Mostrar completadas</span>
            </label>

            {/* New Task Button */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all whitespace-nowrap"
            >
              <FiPlus />
              <span>Nueva Tarea</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-purple-100">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No hay tareas</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron resultados' : 'Crea tu primera tarea para comenzar'}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md ${
                  todo.completed ? 'border-gray-200 opacity-75' : 'border-purple-100'
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleComplete(todo)}
                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      todo.completed
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-500'
                        : 'border-gray-300 hover:border-purple-500'
                    }`}
                  >
                    {todo.completed && <FiCheck className="text-white" size={16} />}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-gray-800 mb-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className={`text-sm text-gray-600 mb-2 ${todo.completed ? 'line-through' : ''}`}>
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(todo.priority)}`}>
                            {todo.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(todo.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Nueva Tarea */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nueva Tarea</h2>
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  placeholder="Nombre de la tarea"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Detalles de la tarea (opcional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={newTodo.priority}
                  onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                >
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all font-medium"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
