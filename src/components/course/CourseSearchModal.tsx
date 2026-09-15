import { useState } from 'react'
import { ChevronDown, Search, Users } from 'lucide-react'
import type { Course } from '@/types/course'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/common/Dialog'
import { useCourseFilter } from '@/hooks/useCourseFilter'
import { formatTimeAndLocation } from '@/utils/timeUtils'
import { cn } from '@/utils/cn'

interface CourseSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  courses: Course[]
  isSectionAdded: (sectionId: string) => boolean
  onAddSection: (sectionId: string) => void
  onRemoveSection: (sectionId: string) => void
}

function getCapacityVariant(
  enrolled: number,
  capacity: number,
): 'success' | 'warning' | 'danger' {
  if (enrolled >= capacity) return 'danger'
  if (enrolled / capacity >= 0.85) return 'warning'
  return 'success'
}

export function CourseSearchModal({
  open,
  onOpenChange,
  courses,
  isSectionAdded,
  onAddSection,
  onRemoveSection,
}: CourseSearchModalProps) {
  const { query, setQuery, filteredCourses } = useCourseFilter(courses)
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Class</DialogTitle>
          <DialogDescription>
            Search courses and pick a section to add to your schedule.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="relative mb-4">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by course code or title..."
              aria-label="Search courses"
              autoFocus
              className="w-full rounded-lg border border-stone-300 bg-white py-2 pl-9 pr-3 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-stone-300 py-12 text-center">
              <Search className="h-6 w-6 text-stone-300" aria-hidden="true" />
              <p className="text-sm font-medium text-stone-500">
                No courses match "{query}".
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100">
              {filteredCourses.map((course) => {
                const isExpanded = expandedCourseId === course.id
                const openSectionCount = course.sections.filter(
                  (section) => section.enrolled < section.capacity,
                ).length

                return (
                  <li key={course.id}>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedCourseId((prev) =>
                          prev === course.id ? null : course.id,
                        )
                      }
                      className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-3 text-left transition-colors hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-stone-900">
                          {course.code}
                          <span className="ml-2 font-medium text-stone-500">
                            {course.title}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {course.sections.length} sections - {openSectionCount}{' '}
                          with open slots
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="default">{course.units} units</Badge>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 text-stone-400 transition-transform',
                            isExpanded && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-2 pb-4">
                        <div className="overflow-x-auto rounded-lg border border-stone-200">
                          <table className="w-full min-w-[640px] text-left text-xs">
                            <thead className="bg-stone-50 text-stone-500">
                              <tr>
                                <th className="px-3 py-2 font-semibold">
                                  Section
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                  Teacher
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                  Units
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                  Time &amp; Location
                                </th>
                                <th className="px-3 py-2 font-semibold">
                                  Capacity
                                </th>
                                <th className="px-3 py-2 text-right font-semibold">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 bg-white">
                              {course.sections.map((section) => {
                                const isAdded = isSectionAdded(section.id)
                                const isFull =
                                  section.enrolled >= section.capacity

                                return (
                                  <tr key={section.id}>
                                    <td className="whitespace-nowrap px-3 py-2.5 font-semibold text-stone-900">
                                      {section.section}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2.5 text-stone-600">
                                      {section.instructor}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2.5 text-stone-600">
                                      {course.units}
                                    </td>
                                    <td className="min-w-[280px] px-3 py-2.5 font-medium leading-relaxed text-stone-600">
                                      {formatTimeAndLocation(section)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2.5">
                                      <Badge
                                        variant={getCapacityVariant(
                                          section.enrolled,
                                          section.capacity,
                                        )}
                                      >
                                        <Users
                                          className="h-3 w-3"
                                          aria-hidden="true"
                                        />
                                        {section.enrolled}/{section.capacity}
                                      </Badge>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-2.5 text-right">
                                      {isAdded ? (
                                        <Button
                                          variant="danger"
                                          size="sm"
                                          onClick={() =>
                                            onRemoveSection(section.id)
                                          }
                                        >
                                          REMOVE
                                        </Button>
                                      ) : isFull ? (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          disabled
                                          title="This section is already full"
                                        >
                                          FULL
                                        </Button>
                                      ) : (
                                        <Button
                                          variant="primary"
                                          size="sm"
                                          onClick={() =>
                                            onAddSection(section.id)
                                          }
                                        >
                                          ADD
                                        </Button>
                                      )}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}