import { Tasks } from "src/tasks/entities/task.entity";

  export interface OkrProgress {
    projectId: number;
    projectName: string;
    objectives: ObjectiveProgress[];
    keyResults: KeyResultProgress[];
  }
  
  export interface ObjectiveProgress {
    objectiveName: string;
    progress: number;
  }
  
  export interface KeyResultProgress {
    columnName: string;
    percentage: number;
  }

  export interface TaskPerformance {
    projectId: number;
    projectName: string;
    performanceByObjective: ObjectivePerformance[];
    delayedTasks: DelayedTaskSummary;
  }
  
  interface ObjectivePerformance {
    objectiveName: string;
    columns: TasksInColumn[];
  }
  
  interface TasksInColumn {
    columnName: string;
    totalTasks: number;
    averageCompletionTime: number;
    tasks: Tasks[];
  }
  
  export interface DelayedTaskSummary {
    totalDelayedTasks: number;
    delayedTasksByPriority: {
      high: number;
      medium: number;
      low: number;
    };
    delayReasons: Array<{
      reason: string;
      tasks: Array<{
        taskName: string;
        objectiveName: string;
        keyResultName: string;
      }>;
    }>;
  }

  export interface Task {
    task_name: string;
    objective_name: string;
    key_result_name: string;
    is_delayed: boolean;
    delay_reason?: string;
  }

  export interface ImportantDatesPdfData {
    projectId: number;
    projectName: string;
    objectives: ObjectiveData[];
  }
  
  interface ObjectiveData {
    objectiveName: string;
    completionDate: string | null;
    keyResults: KeyResultData[];
    completionPercentage: number;
  }
  
  interface KeyResultData {
    name: string;
    dueDate: string | null;
  }

  