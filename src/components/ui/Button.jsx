import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {

        const variants = {
            primary: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
            secondary: "bg-gray-800 text-white hover:bg-gray-700",
            outline: "border border-gray-700 bg-transparent hover:bg-gray-800 text-gray-100",
            ghost: "hover:bg-gray-800 text-gray-100",
            destructive: "bg-red-600 text-white hover:bg-red-700",
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8 text-lg",
            icon: "h-10 w-10 p-2 flex items-center justify-center"
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
