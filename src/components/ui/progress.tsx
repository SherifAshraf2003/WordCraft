"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root> {
  className?: string;
  // The value prop is optional and can be used to set the progress percentage
  // If not provided, the progress bar will not show any value
  // and will be determined by the progressStyle prop
  // The progressStyle prop is optional and can be used to set the progress bar style
  // It can be a string representing a CSS class or a Radix UI style
  // If not provided, the default style will be used
  value?: number;
  progressStyle?: string;
}

function Progress({
  className,
  value,
  progressStyle,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-slate-200 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          " h-full w-full flex-1 transition-all bg-gradient-to-r ",
          progressStyle
        )}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          transitionDuration: "0.5s",
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
