import { Check, CircleNotch } from 'phosphor-react'
import { Checkbox } from './Checkbox'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../lib/axios'
import { AxiosError } from 'axios'

const availableWeekDays = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

const newHabitFormSchema = z.object({
  title: z.string().min(1, {
    message: 'Você deve dar um nome ao hábito.',
  }),
  weekDays: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        enabled: z.boolean(),
      }),
    )
    .length(7)
    .transform((weekDays) => weekDays.filter((item) => item.enabled))
    .refine((weekDays) => weekDays.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((weekDays) => weekDays.map((item) => item.weekDay)),
})

type NewHabitFormInput = z.input<typeof newHabitFormSchema>
type NewHabitFormOutput = z.output<typeof newHabitFormSchema>

export function NewHabitForm() {
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<NewHabitFormInput>({
    resolver: zodResolver(newHabitFormSchema),
    defaultValues: {
      weekDays: [
        { weekDay: 0, enabled: false },
        { weekDay: 1, enabled: true },
        { weekDay: 2, enabled: true },
        { weekDay: 3, enabled: true },
        { weekDay: 4, enabled: true },
        { weekDay: 5, enabled: true },
        { weekDay: 6, enabled: false },
      ],
    },
  })

  const { fields } = useFieldArray({
    control,
    name: 'weekDays',
  })

  async function handleCreateNewHabit(data: any) {
    const { title, weekDays } = data as NewHabitFormOutput

    try {
      await api.post('/habits', {
        title,
        weekDays,
      })

      reset()

      alert('Habito criado com sucesso!')
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.message) {
        alert(error.response.data.message)
        return
      }

      console.log(error)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(handleCreateNewHabit)}
      className="w-full flex flex-col mt-6"
    >
      <label htmlFor="title" className="font-semibold leading-tight">
        Qual seu comprometimento?
      </label>

      <input
        type="text"
        id="title"
        placeholder="ex.: Exercícios, dormir bem, etc..."
        className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
        autoFocus
        {...register('title')}
      />

      {errors.title && (
        <div className="text-red-400 mt-2">{errors.title.message}</div>
      )}

      <label htmlFor="" className="font-semibold leading-tight mt-4">
        Qual a recorrência?
      </label>

      <div className="mt-3 flex flex-col gap-2">
        {fields.map((field, index) => {
          const formattedWeekDay = availableWeekDays[field.weekDay]

          return (
            <Controller
              key={field.id}
              name={`weekDays.${index}.enabled`}
              control={control}
              render={({ field }) => {
                return (
                  <Checkbox
                    text={formattedWeekDay}
                    variant="secondary"
                    onCheckedChange={(checked) => {
                      field.onChange(checked === true)
                    }}
                    checked={field.value}
                  />
                )
              }}
            />
          )
        })}
      </div>

      {errors.weekDays && (
        <div className="text-red-400 mt-2">{errors.weekDays.message}</div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 rounded-lg p-4 flex gap-3 items-center justify-center font-semibold bg-green-600 transition-colors hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
      >
        {!isSubmitting ? (
          <>
            <Check size={20} weight="bold" />
            Confirmar
          </>
        ) : (
          <CircleNotch size={24} className="animate-spin" />
        )}
      </button>
    </form>
  )
}
