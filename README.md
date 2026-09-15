# DLSU Class Schedule Maker

A class scheduling web application built for the LSCS Take-Home Assessment.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- Radix UI (Dialog)
- lucide-react icons

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` - start the Vite dev server
- `npm run build` - type-check and build for production
- `npm run lint` - run ESLint
- `npm run preview` - preview the production build

## Project Structure

- `src/data/mockCourses.json` - course, section, and schedule data
- `src/types/course.ts` - domain types (Course, Section, ScheduleSlot)
- `src/hooks/useSchedule.ts` - schedule state (added sections, total units)
- `src/hooks/useCourseFilter.ts` - course search filtering
- `src/components/` - UI components (layout, common, course, schedule)
- `src/utils/` - shared helpers (time math, colors, classnames)

## Data Rules

- Academic courses total 3 hours per week across two meetings; PE is a single
  two-hour meeting.
- Courses starting with ST or CS use `S` sections, PE courses use `Z` sections,
  and GE courses use either `S` or `Y`.
- Room is stored per meeting slot, so a course can be face-to-face on some days
  and Online on others.