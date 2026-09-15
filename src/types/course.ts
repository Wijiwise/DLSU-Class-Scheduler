export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'

export interface ScheduleSlot {
  day: DayOfWeek
  /** 24-hour format, e.g. "10:00" */
  startTime: string
  /** 24-hour format, e.g. "11:30" */
  endTime: string
  /** Location, e.g. "G203" or "Online" */
  room: string
}

export interface Section {
  /** e.g. "STSWENG-S03" */
  id: string
  /** e.g. "S03" */
  section: string
  instructor: string
  capacity: number
  enrolled: number
  schedule: ScheduleSlot[]
}

export interface Course {
  /** e.g. "CCPROG3" */
  id: string
  code: string
  title: string
  units: number
  sections: Section[]
}

export interface EnrolledEntry {
  course: Course
  section: Section
}