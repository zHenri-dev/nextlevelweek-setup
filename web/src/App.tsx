import './styles/global.css'
import './lib/dayjs'

import { Header } from './components/Header'
import { SummaryTable } from './components/SummaryTable'
import { queryClient } from './lib/react-query'
import { QueryClientProvider } from '@tanstack/react-query'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Header />
          <SummaryTable />
        </div>
      </div>
    </QueryClientProvider>
  )
}
