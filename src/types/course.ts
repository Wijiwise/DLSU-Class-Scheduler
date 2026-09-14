export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface ScheduleSlot {
  day: DayOfWeek;
  startTime: string; // 24-hour format e.g., "10:00"
  endTime: string;   // 24-hour format e.g., "11:30"
  room: string;      // Location e.g., "G203" or "Online"
}

export interface Section {
  id: string;          // e.g., "STSWENG-S03"
  section: string;     // e.g., "S03"
  instructor: string;  // Teacher
  capacity: number;    // Maximum capacity (e.g., 45)
  enrolled: number;    // Current enrolled count (e.g., 40)
  schedule: ScheduleSlot[];
}

export interface Course {
  id: string;          // e.g., "CCPROG3"
  code: string;
  title: string;
  units: number;
  sections: Section[];
}

export interface EnrolledEntry {
  course: Course;
  section: Section;
}