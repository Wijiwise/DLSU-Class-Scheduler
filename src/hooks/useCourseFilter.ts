import { useMemo, useState } from 'react'
import type { Course } from '@/types/course'

export function useCourseFilter(courses: Course[]) {
  const [query, setQuery] = useState('')

  const filteredCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (normalizedQuery === '') return courses
    return courses.filter(
      (course) =>
        course.code.toLowerCase().includes(normalizedQuery) ||
        course.title.toLowerCase().includes(normalizedQuery),
    )
  }, [courses, query])

  return {
    query,
    setQuery,
    filteredCourses,
  }
}