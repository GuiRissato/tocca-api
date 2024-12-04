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
    result: ColumnPerformance[];
  }
  
  interface ColumnPerformance {
    columnName: string;
    totalTasks: number;
    averageCompletionTime: number;
  }
  
  export interface DelayedTaskSummary {
    totalDelayedTasks: number;
    reasons: {
      reason: string;
      tasks: {
        taskName: string;
        objectiveName: string;
        keyResultName: string;
      }[];
    }[];
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