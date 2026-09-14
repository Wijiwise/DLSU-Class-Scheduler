import type { DayOfWeek, ScheduleSlot, Section } from '@/types/course'

export const DAYS: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const SHORT_DAYS: Record<DayOfWeek, string> = {
  Monday: 'MON',
  Tuesday: 'TUE',
  Wednesday: 'WED',
  Thursday: 'THU',
  Friday: 'FRI',
  Saturday: 'SAT',
}

/** Default earliest time shown on the timetable grid (07:30 AM). */
export const DEFAULT_GRID_START = 7 * 60 + 30

/** Latest time shown on the timetable grid (09:15 PM). */
export const DEFAULT_GRID_END = 21 * 60 + 15

/** Height in pixels of a single 15-minute time row on the grid. */
export const ROW_HEIGHT_PX = 14

/** Grid snap interval in minutes. */
export const SLOT_MINUTES = 15

export interface ScheduleBounds {
  startMinute: number
  endMinute: number
}

/** Converts a 24-hour "HH:MM" string to minutes since midnight. */
export function parseTime(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + (minutes ?? 0)
}

/** Formats minutes since midnight as a 24-hour "HH:MM" string. */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/** Formats a 24-hour "HH:MM" string as 12-hour time, e.g. "18:00" -> "06:00 PM". */
export function formatTime12(time: string): string {
  const total = parseTime(time)
  let hours = Math.floor(total / 60)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  if (hours === 0) hours = 12
  const mins = total % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${suffix}`
}

/** Formats a section's full recurring schedule as time & location strings, e.g. "[TUESDAY - 06:00 PM - 07:30 PM | G203]". */
export function formatTimeAndLocation(section: Section): string {
  return section.schedule
    .map(
      (slot) =>
        `[${slot.day.toUpperCase()} - ${formatTime12(slot.startTime)} - ${formatTime12(slot.endTime)} | ${slot.room}]`,
    )
    .join('   ')
}

/**
 * Computes the dynamic time bounds of the timetable grid based on the earliest
 * start and latest end of every scheduled class. The grid never starts later
 * than 07:30 AM and never ends past 09:15 PM, but expands/crops as needed.
 */
export function getScheduleBounds(sections: Section[]): ScheduleBounds {
  if (sections.length === 0) {
    return { startMinute: DEFAULT_GRID_START, endMinute: DEFAULT_GRID_END }
  }

  const starts = sections.flatMap((section) =>
    section.schedule.map((slot) => parseTime(slot.startTime)),
  )
  const ends = sections.flatMap((section) =>
    section.schedule.map((slot) => parseTime(slot.endTime)),
  )

  const earliestStart = Math.min(...starts)
  const latestEnd = Math.max(...ends)

  const startMinute = Math.min(DEFAULT_GRID_START, earliestStart)
  const endMinute = Math.min(DEFAULT_GRID_END, Math.max(latestEnd, startMinute + 90))

  return { startMinute, endMinute }
}

/** Number of 15-minute rows needed to render the given time bounds. */
export function getRowCount(bounds: ScheduleBounds): number {
  return (bounds.endMinute - bounds.startMinute) / SLOT_MINUTES
}

/** Pixel top offset and height for a schedule block on the grid. */
export function getBlockPosition(
  slot: ScheduleSlot,
  bounds: ScheduleBounds,
): { top: number; height: number } {
  const start = parseTime(slot.startTime)
  const end = parseTime(slot.endTime)
  const top = ((start - bounds.startMinute) / SLOT_MINUTES) * ROW_HEIGHT_PX
  const height = ((end - start) / SLOT_MINUTES) * ROW_HEIGHT_PX
  return { top, height }
}

/** Minute marks at the top of every hour, used for the time gutter labels. */
export function getHourMarks(bounds: ScheduleBounds): number[] {
  const marks: number[] = []
  let minute = Math.ceil(bounds.startMinute / 60) * 60
  while (minute < bounds.endMinute) {
    marks.push(minute)
    minute += 60
  }
  return marks
}

export interface SlotConflictInfo {
  lane: number
  totalLanes: number
  isConflict: boolean
}

/**
 * Detects time overlaps among slots on a single day and assigns each
 * conflicting slot a lane for side-by-side rendering.
 *
 * Uses a greedy interval-graph colouring approach:
 *   1. Sort slots by start time.
 *   2. Group into connected components (intervals that transitively overlap).
 *   3. Within each component, assign each slot to the first lane where it
 *      doesn't overlap the existing occupant.
 *   4. A component with >1 slot is a conflict group.
 */
export function computeDayConflicts(
  daySlots: Array<{ key: string; slot: ScheduleSlot }>,
): Map<string, SlotConflictInfo> {
  const result = new Map<string, SlotConflictInfo>()

  if (daySlots.length === 0) return result

  if (daySlots.length === 1) {
    result.set(daySlots[0].key, { lane: 0, totalLanes: 1, isConflict: false })
    return result
  }

  const sorted = [...daySlots].sort(
    (a, b) =>
      parseTime(a.slot.startTime) - parseTime(b.slot.startTime) ||
      parseTime(b.slot.endTime) - parseTime(a.slot.endTime),
  )

  // Group into connected components of overlapping intervals
  const groups: Array<Array<(typeof sorted)[number]>> = []
  let currentGroup = [sorted[0]]
  let currentGroupEnd = parseTime(sorted[0].slot.endTime)

  for (let i = 1; i < sorted.length; i++) {
    const start = parseTime(sorted[i].slot.startTime)
    if (start < currentGroupEnd) {
      currentGroup.push(sorted[i])
      currentGroupEnd = Math.max(currentGroupEnd, parseTime(sorted[i].slot.endTime))
    } else {
      groups.push(currentGroup)
      currentGroup = [sorted[i]]
      currentGroupEnd = parseTime(sorted[i].slot.endTime)
    }
  }
  groups.push(currentGroup)

  // Assign lanes within each group
  for (const group of groups) {
    if (group.length === 1) {
      result.set(group[0].key, { lane: 0, totalLanes: 1, isConflict: false })
      continue
    }

    const lanes: Array<Array<(typeof group)[number]>> = []

    for (const item of group) {
      const start = parseTime(item.slot.startTime)
      let assigned = false

      for (let i = 0; i < lanes.length; i++) {
        const lastEnd = parseTime(lanes[i][lanes[i].length - 1].slot.endTime)
        if (start >= lastEnd) {
          lanes[i].push(item)
          result.set(item.key, { lane: i, totalLanes: 0, isConflict: true })
          assigned = true
          break
        }
      }

      if (!assigned) {
        lanes.push([item])
        result.set(item.key, {
          lane: lanes.length - 1,
          totalLanes: 0,
          isConflict: true,
        })
      }
    }

    const totalLanes = lanes.length
    for (const lane of lanes) {
      for (const item of lane) {
        const info = result.get(item.key)!
        result.set(item.key, { ...info, totalLanes })
      }
    }
  }

  return result
}