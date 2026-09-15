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

## Rationale
The DLSU Class Schedule Maker puts the timetable at the center of the screen with a modal for the search feature to avoid covering the entire screen.
Unlike in Archer's Hub I allow the adding of 2 sections of the same subject so users can compare directly which sections would be better for them. In order to meet the deadline I chose to keep my implementation simple. I used React + TypeScript + Vite as a framework and Tailwind CSS for styling, Radix for an accessible modal and lucide-react for icons. For the search and selection feature I used a modal to keep it concise and within the same space. To represent courses I followed the examples provided in the handout but per section I also added the capacity and enrolled attribute to track how many students are enrolled for that class. A future feature I would like to add would be a feature to save the schedule in a data base or download it as an image. 
