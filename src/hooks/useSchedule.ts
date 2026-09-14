import { useCallback, useMemo, useState } from 'react'
import type { Course } from '@/types/course'
import type { EnrolledEntry } from '@/types/course'
import mockCourses from '@/data/mockCourses.json'

const courses = mockCourses as Course[]

export function useSchedule() {
  const [addedSectionIds, setAddedSectionIds] = useState<Set<string>>(
    () => new Set(),
  )

  const addSection = useCallback((sectionId: string) => {
    setAddedSectionIds((prev) => {
      if (prev.has(sectionId)) return prev
      const next = new Set(prev)
      next.add(sectionId)
      return next
    })
  }, [])

  const removeSection = useCallback((sectionId: string) => {
    setAddedSectionIds((prev) => {
      if (!prev.has(sectionId)) return prev
      const next = new Set(prev)
      next.delete(sectionId)
      return next
    })
  }, [])

  const toggleSection = useCallback((sectionId: string) => {
    setAddedSectionIds((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }, [])

  const isSectionAdded = useCallback(
    (sectionId: string) => addedSectionIds.has(sectionId),
    [addedSectionIds],
  )

  const entries = useMemo<EnrolledEntry[]>(() => {
    const result: EnrolledEntry[] = []
    for (const course of courses) {
      for (const section of course.sections) {
        if (addedSectionIds.has(section.id)) {
          result.push({ course, section })
        }
      }
    }
    return result
  }, [addedSectionIds])

  const totalUnits = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.course.units, 0),
    [entries],
  )

  return {
    courses,
    entries,
    totalUnits,
    addSection,
    removeSection,
    toggleSection,
    isSectionAdded,
  }
}