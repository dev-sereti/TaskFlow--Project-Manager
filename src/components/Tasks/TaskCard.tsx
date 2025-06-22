import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MessageSquare, 
  User, 
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';
import { format, isAfter } from 'date-fns';
import { Task } from '../../store/projectStore';

interface TaskCardProps {
  task: Task;
  projectId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.dueDate && isAfter(new Date(), task.dueDate) && task.status !== 'done';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-2">
            {task.title}
          </h4>
          {task.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="space-y-2">
        {/* Priority */}
        <div className="flex items-center justify-between">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          {isOverdue && (
            <span className="text-xs text-red-600 dark:text-red-400 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              Overdue
            </span>
          )}
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 mr-1" />
            Due {format(task.dueDate, 'MMM dd')}
          </div>
        )}

        {/* Time Info */}
        {(task.timeSpent > 0 || task.estimatedTime) && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {task.timeSpent > 0 && `${Math.round(task.timeSpent / 60)}h spent`}
            {task.estimatedTime && task.timeSpent > 0 && ' / '}
            {task.estimatedTime && `${Math.round(task.estimatedTime / 60)}h estimated`}
          </div>
        )}

        {/* Comments */}
        {task.comments.length > 0 && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-3 w-3 mr-1" />
            {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Assignee */}
        {task.assigneeId && (
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <User className="h-3 w-3 mr-1" />
            Assigned
          </div>
        )}

        {/* Labels */}
        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.labels.slice(0, 3).map((label, index) => (
              <span
                key={index}
                className="inline-block px-2 py-0.5 text-xs bg-primary-100 text-primary-800 dark:bg-primary-900/20 dark:text-primary-300 rounded"
              >
                {label}
              </span>
            ))}
            {task.labels.length > 3 && (
              <span className="text-xs text-gray-400">+{task.labels.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;