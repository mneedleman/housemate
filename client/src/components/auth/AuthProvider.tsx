import { useApolloClient } from "@apollo/client";
import { useContext, createContext, PropsWithChildren, useState, useMemo } from "react";
import { To, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  useCurrentUserQuery,
  LoginMutationVariables,
  SignupMutationVariables,
  User,
  useLoginMutation,
  useSignupMutation
} from "src/__generated__/types";

type Login = (data: LoginMutationVariables, to: To) => Promise<void>
type Signup = (data: SignupMutationVariables, to: To) => Promise<void>

type AuthType = {
  token: string | null
  login: Login
  signup: Signup
  logout: () => void
  signedIn: boolean
  currentUser?: User | null
}

const TOKEN_KEY = "housemate-bearer"

const AuthContext = createContext<AuthType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [apiLogin] = useLoginMutation()
  const [apiSignup] = useSignupMutation()
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null)
  const navigate = useNavigate()
  const apollo = useApolloClient()

  const { data } = useCurrentUserQuery({
    skip: !token
  })

  const currentUser = data?.currentUser as User | null | undefined;

  const storeToken = (value: string) => {
    localStorage.setItem(TOKEN_KEY, value)
    setToken(value)
  }

  const login: Login = (data, to) =>
    apiLogin({ variables: data }).then(res => {
      const value = res.data?.login?.token
      if (!value) throw new Error("No token")
      storeToken(value)
      toast.success("Welcome back!")
      navigate(to)
    }).catch(() => {
      toast.error("That email and password didn't match")
    })

  const signup: Signup = (data, to) =>
    apiSignup({ variables: data }).then(res => {
      const value = res.data?.signup?.token
      if (!value) throw new Error("No token")
      storeToken(value)
      toast.success("Account created")
      navigate(to)
    }).catch(() => {
      toast.error("Couldn't create that account")
    })

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    // Drop the previous user's cached data so it can't flash for the next one
    apollo.clearStore()
    navigate("/login")
  }

  const signedIn = useMemo(() => !!token, [token])

  return (
    <AuthContext.Provider value={{ token, login, signup, logout, signedIn, currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => {
  return useContext(AuthContext)!
}
