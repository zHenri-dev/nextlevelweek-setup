import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import { HabitDay } from './HabitDay'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { CircleNotch } from 'phosphor-react'
import dayjs from 'dayjs'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = Array<{
  id: string
  date: string
  amount: number
  completed: number
}>

export function SummaryTable() {
  const { data: summary } = useQuery<Summary>(['summary'], async () => {
    const response = await api.get('/summary')

    return response.data.summary
  })

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, index) => {
          return (
            <div
              key={`${weekDay}-${index}`}
              className="text-zinc-400 text-xl w-10 h-10 font-bold flex items-center justify-center"
            >
              {weekDay}
            </div>
          )
        })}
      </div>

      {summary ? (
        <div className="grid grid-rows-7 grid-flow-col gap-3">
          {summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, 'day')
            })

            return (
              <HabitDay
                key={date.toString()}
                date={date}
                amount={dayInSummary?.amount}
                defaultCompleted={dayInSummary?.completed}
              />
            )
          })}

          {amountOfDaysToFill > 0 &&
            Array.from({ length: amountOfDaysToFill }).map((_, index) => {
              return (
                <div
                  key={index}
                  className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"
                />
              )
            })}
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1">
          <CircleNotch size={60} className="animate-spin" />
        </div>
      )}
    </div>
  )
}
