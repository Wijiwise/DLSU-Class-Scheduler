import { useState } from 'react'
import { CourseSearchModal } from '@/components/course/CourseSearchModal'
import { Header } from '@/components/layout/Header'
import { Timetable } from '@/components/schedule/Timetable'
import { useSchedule } from '@/hooks/useSchedule'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {
    courses,
    entries,
    totalUnits,
    addSection,
    removeSection,
    isSectionAdded,
  } = useSchedule()

  return (
    <div className="flex min-h-screen flex-col">
      <Header totalUnits={totalUnits} onAddClass={() => setIsModalOpen(true)} />

      <main className="flex-1">
        <Timetable entries={entries} onRemove={removeSection} />
      </main>

      <footer className="pb-8">
        <p className="text-center text-xs text-stone-400">
          LSCS Take-Home Assessment &middot; React + Vite + TypeScript +
          Tailwind CSS
        </p>
      </footer>

      <CourseSearchModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        courses={courses}
        isSectionAdded={isSectionAdded}
        onAddSection={addSection}
        onRemoveSection={removeSection}
      />
    </div>
  )
}

export default App