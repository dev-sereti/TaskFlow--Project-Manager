import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  MessageSquare,
  User,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import CreateTaskModal from '../components/Tasks/CreateTaskModal';
import TaskCard from '../components/Tasks/TaskCard';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjectStore();
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return <Navigate to="/projects" replace />;
  }

  const filteredTasks = project.tasks.filter(task => {
    if (statusFilter === 'all') return true;
    return task.status === statusFilter;
  });

  const tasksByStatus = {
    todo: project.tasks.filter(task => task.status === 'todo'),
    'in-progress': project.tasks.filter(task => task.status === 'in-progress'),
    review: project.tasks.filter(task => task.status === 'review'),
    done: project.tasks.filter(task => task.status === 'done'),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'review':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <MoreHorizontal className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Due: {project.dueDate ? format(project.dueDate, 'MMM dd, yyyy') : 'No due date'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {project.progress}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {project.teamMembers.length} members
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-gray-400" />
            <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
              {project.status.replace('-', ' ')}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Management */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Tasks</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {project.tasks.length} total tasks
          </p>
        </div>
        <button
          onClick={() => setShowCreateTask(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(tasksByStatus).map(([status, tasks]) => (
          <div key={status} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white capitalize flex items-center">
                <span className={`w-3 h-3 rounded-full mr-2 ${
                  status === 'todo' ? 'bg-gray-400' :
                  status === 'in-progress' ? 'bg-yellow-500' :
                  status === 'review' ? 'bg-purple-500' :
                  'bg-green-500'
                }`} />
                {status.replace('-', ' ')}
              </h3>
              <span className="text-sm text-gray-500 bg-white dark:bg-gray-700 px-2 py-1 rounded-full">
                {tasks.length}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} projectId={project.id} />
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">No tasks in {status.replace('-', ' ')}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateTask && (
        <CreateTaskModal
          projectId={project.id}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
};

export default ProjectDetail;