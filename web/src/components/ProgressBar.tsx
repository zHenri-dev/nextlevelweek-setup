import * as Progress from '@radix-ui/react-progress'

interface ProgressBarProps extends Progress.ProgressProps {
  value: number
  max?: number
}

export function ProgressBar({ value, max = 100, ...rest }: ProgressBarProps) {
  const progressStyles = {
    transform: `translateX(-${max - value}%)`,
  }

  return (
    <Progress.Root
      className="h-3 rounded-xl bg-zinc-700 w-full mt-4 overflow-hidden"
      value={value}
      max={max}
      {...rest}
    >
      <Progress.Indicator
        className={`h-3 rounded-xl bg-violet-600 transition-all`}
        style={progressStyles}
      />
    </Progress.Root>
  )
}
