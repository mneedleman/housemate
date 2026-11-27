import { CookieIcon, DashboardIcon, HomeIcon, LoopIcon } from "@radix-ui/react-icons"
import type { ComponentType, ReactNode } from "react"
import CreateHouseholdForm from "../households/CreateHouseholdForm"
import CreateLeftoverForm from "../leftovers/CreateLeftoverForm"
import CreateItemForm from "../timeline/forms/CreateItemForm"

export type NavItem = {
  to: string
  label: string
  description: string
  icon: ReactNode
  create?: {
    label: string
    title: string
    description?: string
    Form: ComponentType
  }
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "What needs attention around the house",
    icon: <DashboardIcon />,
  },
  {
    to: "/timeline",
    label: "Timeline",
    description: "Recurring tasks and when they're next due",
    icon: <LoopIcon />,
    create: {
      label: "New task",
      title: "New task",
      description: "Set how often it repeats and we'll track when it's due.",
      Form: CreateItemForm,
    },
  },
  {
    to: "/leftovers",
    label: "Leftovers",
    description: "What's in the fridge and when to toss it",
    icon: <CookieIcon />,
    create: {
      label: "Add leftover",
      title: "Add leftover",
      description: "Log it now so nothing gets forgotten at the back of the fridge.",
      Form: CreateLeftoverForm,
    },
  },
  {
    to: "/households",
    label: "Households",
    description: "The homes you share and who's in them",
    icon: <HomeIcon />,
    create: {
      label: "New household",
      title: "New household",
      description: "You'll be its first member.",
      Form: CreateHouseholdForm,
    },
  },
]

export const navItemFor = (pathname: string) =>
  NAV_ITEMS.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`)) ??
  (pathname === "/" ? NAV_ITEMS[0] : undefined)
