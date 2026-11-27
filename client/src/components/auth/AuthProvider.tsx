import { useApolloClient, useMutation, useQuery } from "@apollo/client/react"
import { CombinedGraphQLErrors } from "@apollo/client"
import { useContext, createContext, type PropsWithChildren, useEffect, useState, useMemo } from "react";
import { type To, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { CurrentUserDocument, LoginDocument, SignupDocument, type CurrentUserQuery, type LoginMutationVariables, type SignupMutationVariables } from "src/__generated__/types";

export type CurrentUser = NonNullable<CurrentUserQuery["currentUser"]>

type Login = (data: LoginMutationVariables, to: To) => Promise<void>
type Signup = (data: SignupMutationVariables, to: To) => Promise<void>

type AuthType = {
  token: string | null
  login: Login
  signup: Signup
  logout: () => void
  signedIn: boolean
  currentUser?: CurrentUser | null
}

const TOKEN_KEY = "housemate-bearer"

const AuthContext = createContext<AuthType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [apiLogin] = useMutation(LoginDocument)
  const [apiSignup] = useMutation(SignupDocument)
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || null)
  const navigate = useNavigate()
  const apollo = useApolloClient()

  const { data } = useQuery(CurrentUserDocument, {
    skip: !token
  })

  const currentUser = data?.currentUser

  // The server answered but didn't recognise the token (expired or revoked): sign out
  const tokenRejected = !!token && data !== undefined && data.currentUser === null
  useEffect(() => {
    if (!tokenRejected) return
    localStorage.removeItem(TOKEN_KEY)
    toast.info("Your session expired. Please log in again.", { toastId: "session-expired" })
    apollo.clearStore().then(() => {
      setToken(null)
      navigate("/login")
    })
  }, [tokenRejected, apollo, navigate])

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
    }).catch((error) => {
      // Server messages (e.g. rate limiting) are shown as-is; a null token means bad credentials
      toast.error(CombinedGraphQLErrors.is(error) ? error.message : "That email and password didn't match")
    })

  const signup: Signup = (data, to) =>
    apiSignup({ variables: data }).then(res => {
      const value = res.data?.signup?.token
      if (!value) throw new Error("No token")
      storeToken(value)
      toast.success("Account created")
      navigate(to)
    }).catch((error) => {
      // e.g. "Password is too short (minimum is 8 characters)" or "Email has already been taken"
      toast.error(CombinedGraphQLErrors.is(error) ? error.message : "Couldn't create that account")
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
