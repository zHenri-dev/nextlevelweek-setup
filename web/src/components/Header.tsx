import { Plus } from 'phosphor-react'
import { CreateHabitModal } from './CreateHabitModal'
import * as Dialog from '@radix-ui/react-dialog'

import logoImage from '../assets/logo.svg'

export function Header() {
  return (
    <header className="w-full max-w-3xl mx-auto flex items-center justify-between">
      <img src={logoImage} alt="Habits" />

      <Dialog.Root>
        <Dialog.Trigger className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 transition-colors hover:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background">
          <Plus />
          Novo hábito
        </Dialog.Trigger>

        <CreateHabitModal />
      </Dialog.Root>
    </header>
  )
}
