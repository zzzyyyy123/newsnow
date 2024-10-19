import clsx from "clsx"
import { Toaster } from "sonner"

export function Toast() {
  return (
    <Toaster
      toastOptions={{
        duration: 10000000,
        unstyled: true,
        classNames: {
          toast: clsx(
            "flex gap-1 p-1 rounded-xl backdrop-blur-5 items-center bg-op-70! w-full",
            "bg-blue",
            "data-[type=error]:(bg-red)",
            "data-[type=success]:(bg-green)",
            "data-[type=info]:(bg-blue)",
            "data-[type=warning]:(bg-yellow)",
          ),
          icon: "text-white ml-1 dark:text-dark-600 text-op-80!",
          content: "bg-base bg-op-70! p-2 rounded-lg color-base w-full backdrop-blur-md",
          title: "font-normal text-base",
          description: "color-base text-op-80! text-sm",
          actionButton: "bg-base bg-op-70! rounded-lg py-2 w-4em backdrop-blur-md hover:(bg-base bg-op-60!)",
          closeButton: "bg-base bg-op-50! border-0 hover:(bg-base bg-op-70!)",
        },
      }}
      closeButton
      expand
      style={{
        top: 10,
      }}
      position="top-center"
    />
  )
}
