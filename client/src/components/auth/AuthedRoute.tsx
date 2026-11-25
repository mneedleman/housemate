import { type PropsWithChildren } from "react"
import { Navigate } from "react-router"
import AppShell from "../layout/AppShell"
import { useAuth } from "./AuthProvider"

const AuthedRoute = ({ children }: PropsWithChildren) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <AppShell>{children}</AppShell>
}

export default AuthedRoute
