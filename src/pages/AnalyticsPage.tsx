import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { 
  TrendingUp, 
  Clock, 
  Target,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { format, subDays, eachDayOfInterval } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsPage: React.FC = () => {
  const { projects } = useProjectStore();

  // Calculate metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'done').length, 0);
  const avgProjectProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) 
    : 0;

  // Team productivity data
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const productivityData = {
    labels: last7Days.map(date => format(date, 'MMM dd')),
    datasets: [
      {
        label: 'Tasks Completed',
        data: [12, 8, 15, 20, 18, 25, 22], // Mock data
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Tasks Created',
        data: [15, 12, 18, 16, 20, 28, 24], // Mock data
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Project status distribution
  const projectStatusData = {
    labels: ['Active', 'Completed', 'On Hold'],
    datasets: [
      {
        data: [
          activeProjects,
          completedProjects,
          projects.filter(p => p.status === 'on-hold').length
        ],
        backgroundColor: [
          '#10b981',
          '#6366f1',
          '#f59e0b',
        ],
        borderWidth: 0,
      },
    ],
  };

  // Task priority distribution
  const taskPriorityData = {
    labels: projects.map(p => p.name),
    datasets: [
      {
        label: 'High Priority',
        data: projects.map(p => p.tasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
      {
        label: 'Medium Priority',
        data: projects.map(p => p.tasks.filter(t => t.priority === 'medium').length),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
      },
      {
        label: 'Low Priority',
        data: projects.map(p => p.tasks.filter(t => t.priority === 'low').length),
        backgroundColor: 'rgba(107, 114, 128, 0.8)',
      },
    ],
  };

  const metrics = [
    {
      title: 'Total Projects',
      value: totalProjects,
      change: '+12%',
      changeType: 'positive' as const,
      icon: Target,
      color: 'text-blue-600',
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      change: '+8%',
      changeType: 'positive' as const,
      icon: BarChart3,
      color: 'text-green-600',
    },
    {
      title: 'Task Completion Rate',
      value: `${totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%`,
      change: '+5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
    },
    {
      title: 'Avg. Project Progress',
      value: `${avgProjectProgress}%`,
      change: '+15%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Track your team's performance and project insights</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
              <metric.icon className={`h-8 w-8 ${metric.color}`} />
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className={`h-4 w-4 mr-1 ${
                metric.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
              }`} />
              <span className={`text-sm ${
                metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.change} from last month
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Productivity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Team Productivity</h3>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <Line
            data={productivityData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>

        {/* Project Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Project Status</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex justify-center">
            <div className="w-64">
              <Doughnut
                data={projectStatusData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task Priority Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Priority Distribution</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <Bar
          data={taskPriorityData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      {/* Recent Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Top Performers
          </h3>
          <div className="space-y-3">
            {['Sarah Johnson', 'Mike Chen', 'Emily Davis'].map((name, index) => (
              <div key={name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {15 - index * 3} tasks
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(95 - index * 5)}% completion
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800 dark:text-green-300">
                  Productivity up 25% this week
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Team is completing tasks faster than expected
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <span className="font-medium text-yellow-800 dark:text-yellow-300">
                  3 projects approaching deadline
                </span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                Consider reallocating resources
              </p>
            </div>
