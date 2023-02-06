import { Checkbox } from './Checkbox'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { CircleNotch } from 'phosphor-react'
import { AxiosError } from 'axios'
import { queryClient } from '../lib/react-query'
import dayjs from 'dayjs'

interface HabitsListProps {
  date: Date
  onCompletedChange: (completed: number) => void
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string
    title: string
    createdAt: string
  }>
  completedHabits: string[]
}

export function HabitsList({ date, onCompletedChange }: HabitsListProps) {
  const ISODate = date.toISOString()

  const { data: habitsInfo } = useQuery<HabitsInfo>(
    ['habitsInfo', ISODate],
    async () => {
      const response = await api.get('/day', {
        params: {
          date: ISODate,
        },
      })

      return response.data
    },
  )

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`)
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        alert(error.response.data.message)
        return
      }

      console.log(error)
    }

    if (!habitsInfo) {
      return
    }

    const isHabitAlreadyCompleted = habitsInfo.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo.completedHabits.filter(
        (id) => id !== habitId,
      )
    } else {
      completedHabits = [...habitsInfo.completedHabits, habitId]
    }

    queryClient.setQueryData<HabitsInfo>(['habitsInfo', ISODate], {
      possibleHabits: habitsInfo.possibleHabits,
      completedHabits,
    })

    onCompletedChange(completedHabits.length)
  }

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  return (
    <>
      {habitsInfo ? (
        <div className="mt-6 flex flex-col gap-3">
          {habitsInfo.possibleHabits.length > 0 ? (
            <>
              {habitsInfo.possibleHabits.map((habit) => {
                return (
                  <Checkbox
                    key={habit.id}
                    checked={habitsInfo.completedHabits.some(
                      (completedHabitId) => completedHabitId === habit.id,
                    )}
                    onCheckedChange={() => handleToggleHabit(habit.id)}
                    text={habit.title}
                    variant="primary"
                    disabled={isDateInPast}
                  />
                )
              })}
            </>
          ) : (
            <span className="text-red-400">
              Não há hábitos para serem mostrados neste dia.
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center mt-6">
          <CircleNotch size={40} className="animate-spin" />
        </div>
      )}
    </>
  )
}
