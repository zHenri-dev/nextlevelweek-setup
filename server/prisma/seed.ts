import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'

const prisma = new PrismaClient()

const firstHabitId = randomUUID()
const firstHabitCreationDate = new Date('2022-12-31T03:00:00.000')

const secondHabitId = randomUUID()
const secondHabitCreationDate = new Date('2023-01-03T03:00:00.000')

const thirdHabitId = randomUUID()
const thirdHabitCreationDate = new Date('2023-01-08T03:00:00.000')

async function run() {
  await prisma.habit.deleteMany()
  await prisma.day.deleteMany()

  /**
   * Create habits
   */
  await Promise.all([
    prisma.habit.create({
      data: {
        id: firstHabitId,
        title: 'Beber 2L água',
        createdAt: firstHabitCreationDate,
        weekDays: {
          create: [{ weekDay: 1 }, { weekDay: 2 }, { weekDay: 3 }],
        },
      },
    }),

    prisma.habit.create({
      data: {
        id: secondHabitId,
        title: 'Exercitar',
        createdAt: secondHabitCreationDate,
        weekDays: {
          create: [{ weekDay: 3 }, { weekDay: 4 }, { weekDay: 5 }],
        },
      },
    }),

    prisma.habit.create({
      data: {
        id: thirdHabitId,
        title: 'Dormir 8h',
        createdAt: thirdHabitCreationDate,
        weekDays: {
          create: [
            { weekDay: 1 },
            { weekDay: 2 },
            { weekDay: 3 },
            { weekDay: 4 },
            { weekDay: 5 },
          ],
        },
      },
    }),
  ])

  await Promise.all([
    /**
     * Habits (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Monday */
        date: new Date('2023-01-02T03:00:00.000z'),
        dayHabits: {
          create: {
            habitId: firstHabitId,
          },
        },
      },
    }),

    /**
     * Habits (Complete/Available): 1/1
     */
    prisma.day.create({
      data: {
        /** Friday */
        date: new Date('2023-01-06T03:00:00.000z'),
        dayHabits: {
          create: {
            habitId: firstHabitId,
          },
        },
      },
    }),

    /**
     * Habits (Complete/Available): 2/2
     */
    prisma.day.create({
      data: {
        /** Wednesday */
        date: new Date('2023-01-04T03:00:00.000z'),
        dayHabits: {
          create: [{ habitId: firstHabitId }, { habitId: secondHabitId }],
        },
      },
    }),
  ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
