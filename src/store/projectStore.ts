import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  labels: string[];
  comments: Comment[];
  attachments: string[];
  timeSpent: number; // in minutes
  estimatedTime?: number; // in minutes
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  teamMembers: string[];
  tasks: Task[];
  color: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProject: (project: Project | null) => void;
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  addComment: (projectId: string, taskId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design',
    status: 'active',
    progress: 65,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    dueDate: new Date('2024-02-28'),
    teamMembers: ['user1', 'user2', 'user3'],
    color: '#6366f1',
    tasks: [
      {
        id: 't1',
        title: 'Design Homepage Mockup',
        description: 'Create high-fidelity mockup for the new homepage',
        status: 'done',
        priority: 'high',
        assigneeId: 'user1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-18'),
        dueDate: new Date('2024-01-25'),
        labels: ['design', 'frontend'],
        comments: [],
        attachments: [],
        timeSpent: 480,
        estimatedTime: 600,
      },
      {
        id: 't2',
        title: 'Implement Responsive Navigation',
        description: 'Build mobile-first navigation component',
        status: 'in-progress',
        priority: 'medium',
        assigneeId: 'user2',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-20'),
        dueDate: new Date('2024-01-30'),
        labels: ['frontend', 'responsive'],
        comments: [],
        attachments: [],
        timeSpent: 240,
        estimatedTime: 360,
      },
    ],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile application for task management',
    status: 'active',
    progress: 30,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-19'),
    dueDate: new Date('2024-03-15'),
    teamMembers: ['user2', 'user3', 'user4'],
    color: '#10b981',
    tasks: [],
  },
];

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: mockProjects,
  currentProject: null,
  
  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      tasks: [],
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date() }
          : project
      ),
    }));
  },
  
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter(project => project.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },
  
  setCurrentProject: (project) => {
    set({ currentProject: project });
  },
  
  addTask: (projectId, taskData) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      attachments: [],
      timeSpent: 0,
    };
    
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, newTask], updatedAt: new Date() }
          : project
      ),
    }));
  },
  
  updateTask: (projectId, taskId, updates) => {
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId
                  ? { ...task, ...updates, updatedAt: new Date() }
                  : task
              ),
              updatedAt: new Date(),
            }
          : project
      ),
    }));
  },
  
  deleteTask: (projectId, taskId) => {
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter(task => task.id !== taskId),
              updatedAt: new Date(),
            }
          : project
      ),
    }));
  },
  
  addComment: (projectId, taskId, commentData) => {
    const newComment: Comment = {
      ...commentData,
      id: uuidv4(),
      createdAt: new Date(),
    };
    
    set((state) => ({
      projects: state.projects.map(project =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map(task =>
                task.id === taskId
                  ? { ...task, comments: [...task.comments, newComment] }
                  : task
              ),
            }
          : project
      ),
    }));
  },
}));