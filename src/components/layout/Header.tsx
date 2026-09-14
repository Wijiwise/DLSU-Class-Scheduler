import { CalendarDays, GraduationCap, Plus } from 'lucide-react'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'

interface HeaderProps {
  totalUnits: number
  onAddClass: () => void
}

export function Header({ totalUnits, onAddClass }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold leading-tight text-stone-900 sm:text-xl">
              DLSU Class Schedule Maker
            </h1>
            <p className="hidden text-xs text-stone-500 sm:block">
              Enrollment planner - Term 1, AY 2026-2027
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Badge
            variant="brand"
            className="hidden px-3 py-1 sm:inline-flex"
          >
            <GraduationCap
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Total Units: {totalUnits}
          </Badge>
          <Button variant="primary" onClick={onAddClass}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">ADD A CLASS</span>
            <span className="sm:hidden">ADD</span>
          </Button>
        </div>
      </div>
      <div className="border-t border-stone-100 bg-emerald-50 px-4 py-1.5 sm:hidden">
        <p className="text-center text-xs font-semibold text-emerald-800">
          Total Units: {totalUnits}
        </p>
      </div>
    </header>
  )
}