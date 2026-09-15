import { useMemo } from 'react'
import type { DayOfWeek, EnrolledEntry } from '@/types/course'
import { ScheduleBlock } from '@/components/schedule/ScheduleBlock'
import {
  DAYS,
  ROW_HEIGHT_PX,
  SLOT_MINUTES,
  formatTime,
  getHourMarks,
  getRowCount,
  getScheduleBounds,
  computeDayConflicts,
  type SlotConflictInfo,
} from '@/utils/timeUtils'
import { getCourseColor } from '@/utils/courseColors'

interface TimetableProps {
  entries: EnrolledEntry[]
  onRemove: (sectionId: string) => void
}

const GUTTER_WIDTH = 56

interface DayData {
  conflictMap: Map<string, SlotConflictInfo>
  maxLanes: number
}

export function Timetable({ entries, onRemove }: TimetableProps) {
  const bounds = getScheduleBounds(entries.map((entry) => entry.section))
  const rowCount = getRowCount(bounds)
  const hourMarks = getHourMarks(bounds)
  const gridHeight = rowCount * ROW_HEIGHT_PX

  const addedCourses = Array.from(
    new Map(entries.map((entry) => [entry.course.id, entry.course])).values(),
  )

  const dayData = useMemo(() => {
    const map = new Map<DayOfWeek, DayData>()

    for (const day of DAYS) {
      const daySlots = entries.flatMap((entry) =>
        entry.section.schedule
          .filter((slot) => slot.day === day)
          .map((slot) => ({
            key: `${entry.section.id}-${slot.day}-${slot.startTime}`,
            slot,
          })),
      )
      const conflictMap = computeDayConflicts(daySlots)
      const maxLanes =
        daySlots.length === 0
          ? 1
          : Math.max(...Array.from(conflictMap.values()).map((c) => c.totalLanes))
      map.set(day, { conflictMap, maxLanes })
    }

    return map
  }, [entries])

  const hasAnyConflict = useMemo(
    () => Array.from(dayData.values()).some((d) => d.maxLanes > 1),
    [dayData],
  )

  const columnTemplate = useMemo(() => {
    const widths = DAYS.map((day) => {
      const lanes = dayData.get(day)?.maxLanes ?? 1
      return `${lanes}fr`
    })
    return `${GUTTER_WIDTH}px ${widths.join(' ')}`
  }, [dayData])

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Weekly Schedule</h2>
          <p className="text-sm text-stone-500">
            {entries.length === 0
              ? 'No classes added yet.'
              : `${entries.length} class${entries.length === 1 ? '' : 'es'} added.`}
          </p>
        </div>

        {addedCourses.length > 0 && (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {addedCourses.map((course) => (
              <li
                key={course.id}
                className="flex items-center gap-2 text-xs font-medium text-stone-600"
              >
                <span
                  className="h-3 w-3 rounded-sm"
                  aria-hidden="true"
                  style={{ backgroundColor: getCourseColor(course.code) }}
                />
                {course.code}
              </li>
            ))}
            {hasAnyConflict && (
              <li className="flex items-center gap-2 text-xs font-medium text-red-600">
                <span
                  className="h-3 w-3 rounded-sm"
                  aria-hidden="true"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.25)' }}
                />
                Conflict
              </li>
            )}
          </ul>
        )}
      </div>

      <div className="relative overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div
              className="grid border-b border-stone-200 bg-stone-50"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className="flex items-end justify-end pb-2.5 pr-2 text-[10px] font-semibold uppercase tracking-wide text-stone-400">
                Time
              </div>
              {DAYS.map((day) => {
                const lanes = dayData.get(day)?.maxLanes ?? 1
                return (
<div
                      key={day}
                      className="border-l border-stone-200 px-2 py-3 text-center"
                    >
                    <p className="text-sm font-semibold text-stone-800">
                      {day}
                    </p>
                    {lanes > 1 && (
                      <p className="mt-0.5 text-[10px] font-medium text-red-500">
                        {lanes} conflicts
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div
              className="grid"
              style={{ gridTemplateColumns: columnTemplate }}
            >
              <div className="relative" style={{ height: `${gridHeight}px` }}>
                {hourMarks.map((minute) => (
                  <div
                    key={minute}
                    className="absolute right-2 -translate-y-1/2 text-[10px] font-medium tabular-nums text-stone-400"
                    style={{
                      top: `${
                        ((minute - bounds.startMinute) / SLOT_MINUTES) *
                        ROW_HEIGHT_PX
                      }px`,
                    }}
                  >
                    {formatTime(minute)}
                  </div>
                ))}
              </div>

              {DAYS.map((day) => {
                const { conflictMap } = dayData.get(day)!

                const dayEntries = entries.filter((entry) =>
                  entry.section.schedule.some((slot) => slot.day === day),
                )

                return (
                  <div
                    key={day}
                    className="relative border-l border-stone-200"
                    style={{ height: `${gridHeight}px` }}
                  >
                    {Array.from({ length: rowCount - 1 }).map((_, index) => {
                      const minute =
                        bounds.startMinute + (index + 1) * SLOT_MINUTES
                      const isHourLine = minute % 60 === 0
                      return (
                        <div
                          key={minute}
                          className={
                            isHourLine
                              ? 'absolute inset-x-0 border-t border-stone-200'
                              : 'absolute inset-x-0 border-t border-stone-100'
                          }
                          style={{ top: `${(index + 1) * ROW_HEIGHT_PX}px` }}
                        />
                      )
                    })}

                    {dayEntries.map((entry) =>
                      entry.section.schedule
                        .filter((slot) => slot.day === day)
                        .map((slot) => {
                          const key = `${entry.section.id}-${slot.day}-${slot.startTime}`
                          const info = conflictMap.get(key)

                          return (
                            <ScheduleBlock
                              key={key}
                              entry={entry}
                              slot={slot}
                              bounds={bounds}
                              onRemove={onRemove}
                              lane={info?.lane ?? 0}
                              totalLanes={info?.totalLanes ?? 1}
                              isConflict={info?.isConflict ?? false}
                            />
                          )
                        }),
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {entries.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/40">
            <div className="rounded-lg border border-dashed border-stone-300 bg-white/85 px-6 py-5 text-center shadow-sm">
              <p className="text-sm font-semibold text-stone-600">
                Your schedule is empty
              </p>
              <p className="mt-1 text-xs text-stone-500">
                Press "ADD A CLASS" to start planning your term.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}