import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/utils/cn'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </DialogPrimitive.Root>
  )
}

interface DialogContentProps {
  className?: string
  children: ReactNode
}

function DialogContent({ className, children }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 flex max-h-[85vh] w-[calc(100vw-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-xl bg-white shadow-xl',
          className,
        )}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}

function DialogHeader({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'border-b border-stone-200 px-5 py-4 pr-12',
        className,
      )}
    >
      {children}
    </div>
  )
}

function DialogTitle({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <DialogPrimitive.Title
      className={cn('text-lg font-bold text-stone-900', className)}
    >
      {children}
    </DialogPrimitive.Title>
  )
}

function DialogDescription({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <DialogPrimitive.Description
      className={cn('mt-1 text-sm text-stone-500', className)}
    >
      {children}
    </DialogPrimitive.Description>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription }