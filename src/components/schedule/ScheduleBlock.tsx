import { X } from 'lucide-react'
import type { ScheduleSlot } from '@/types/course'
import type { EnrolledEntry } from '@/types/course'
import type { ScheduleBounds } from '@/utils/timeUtils'
import { formatTime12, getBlockPosition } from '@/utils/timeUtils'
import { getCourseColor } from '@/utils/courseColors'

interface ScheduleBlockProps {
  entry: EnrolledEntry
  slot: ScheduleSlot
  bounds: ScheduleBounds
  onRemove: (sectionId: string) => void
  lane?: number
  totalLanes?: number
  isConflict?: boolean
}

const CONFLICT_BG = 'rgba(239, 68, 68, 0.13)'
const CONFLICT_BORDER = '#dc2626'

export function ScheduleBlock({
  entry,
  slot,
  bounds,
  onRemove,
  lane = 0,
  totalLanes = 1,
  isConflict = false,
}: ScheduleBlockProps) {
  const { course, section } = entry
  const color = getCourseColor(course.code)
  const { top, height } = getBlockPosition(slot, bounds)

  const lanePercent = (lane / totalLanes) * 100
  const laneWidth = (1 / totalLanes) * 100
  const accentColor = isConflict ? CONFLICT_BORDER : color

  return (
    <div
      className="absolute z-10 overflow-hidden rounded-md border-l-4 px-2 py-1 text-xs shadow-sm ring-1 ring-black/5"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        left: `calc(${lanePercent}% + 2px)`,
        width: `calc(${laneWidth}% - 4px)`,
        backgroundColor: isConflict ? CONFLICT_BG : `${color}1f`,
        borderLeftColor: accentColor,
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-1">
          <p
            className="max-w-full truncate font-bold leading-tight"
            style={{ color: accentColor }}
          >
            {course.code}
            <span className="ml-1 font-semibold">{section.section}</span>
          </p>
          <button
            type="button"
            aria-label={`Remove ${course.code} ${section.section}`}
            onClick={() => onRemove(section.id)}
            className="shrink-0 rounded p-0.5 text-stone-500 transition-colors hover:bg-white/70 hover:text-red-600 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red-600"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
        <p className="truncate leading-tight text-stone-700">
          {section.instructor}
        </p>
        <p className="mt-auto truncate leading-tight text-stone-700">
          {slot.room} &middot; {formatTime12(slot.startTime)}-
          {formatTime12(slot.endTime)}
        </p>
      </div>
    </div>
  )
}