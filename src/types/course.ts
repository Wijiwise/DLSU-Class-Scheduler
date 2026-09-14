export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface ScheduleSlot {
  day: DayOfWeek;
  startTime: string; // 24-hour format e.g., "10:00"
  endTime: string;   // 24-hour format e.g., "11:30"
}

export interface Section {
  id: string;          // e.g., "CCPROG3-Y01"
  section: string;     // e.g., "Y01"
  instructor: string;
  room: string;
  schedule: ScheduleSlot[];
}

export interface Course {
  id: string;          // e.g., "CCPROG3"
  code: string;
  title: string;
  units: number;
  sections: Section[];
}