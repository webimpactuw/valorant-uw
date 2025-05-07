import type { BlueprintLog } from '../types.js';
export declare function formatLogEntry(log: BlueprintLog, withDate?: boolean, isNewest?: boolean): string;
export declare function formatRecentLogs(logs: BlueprintLog[]): string;
export declare function organizeLogsByDay(logs: BlueprintLog[]): Map<string, BlueprintLog[]>;
export declare function formatLogsByDay(logsByDay: Map<string, BlueprintLog[]>): string;
