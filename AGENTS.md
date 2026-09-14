# OpenCode System Instructions

## Project Context
Class Scheduling Web Application built for LSCS Take-Home Assessment using React, Vite, TypeScript, and Tailwind CSS.

## Architecture & Coding Rules
1. Component Architecture: Use modular, single-responsibility functional components with explicit TypeScript interfaces.
2. State Separation: Keep UI presentation decoupled from business logic using custom hooks (`useSchedule`, `useCourseFilter`).
3. Path Aliases: Always import local modules using the `@/` prefix (e.g., `@/types/course`, `@/components/common/Button`).
4. Accessibility & UI States: Always handle empty, loading, disabled, and responsive states explicitly.