import { createContext, useContext } from "react"

type CreateContextType = {
  /** Opens the create sheet for the current page, if it has one */
  openCreate: () => void
  canCreate: boolean
  createLabel?: string
}

export const CreateContext = createContext<CreateContextType>({
  openCreate: () => { },
  canCreate: false,
})

export const useCreate = () => useContext(CreateContext)
