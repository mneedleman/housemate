import { useQuery } from "@apollo/client/react"
import { ExitIcon, PlusIcon } from "@radix-ui/react-icons"
import { type PropsWithChildren, useMemo, useState } from "react"
import { NavLink, useLocation } from "react-router"
import { HouseholdsDocument } from "src/__generated__/types"
import { cn } from "src/utils/cn"
import { useAuth } from "../auth/AuthProvider"
import DropMenu from "../dropdown/DropMenu"
import Modal from "../modal/Modal"
import Avatar from "../ui/Avatar"
import Button from "../ui/Button"
import { CreateContext } from "./CreateContext"
import Logo from "./Logo"
import { NAV_ITEMS, navItemFor } from "./nav"

const UserMenu = () => {
  const { currentUser, logout } = useAuth()

  return (
    <DropMenu
      label="Account"
      triggerClass="h-10 w-10 p-0 hover:bg-transparent"
      trigger={<Avatar name={currentUser?.name} email={currentUser?.email} />}
      header={
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{currentUser?.name || "Signed in"}</p>
          <p className="truncate text-xs text-muted">{currentUser?.email}</p>
        </div>
      }
      options={[{ label: "Log out", icon: <ExitIcon />, onSelect: logout, tone: "danger" }]}
    />
  )
}

const Sidebar = () => {
  const { currentUser } = useAuth()
  const { data } = useQuery(HouseholdsDocument)
  const household = data?.households?.find((h) => h.id === currentUser?.householdId)

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-surface/50 px-3 py-5 md:flex lg:w-64">
      <div className="px-3 pb-6">
        <Logo />
      </div>
      <nav aria-label="Primary" className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors [&>svg]:h-[18px] [&>svg]:w-[18px]",
                isActive ? "bg-accent-soft text-accent-soft-ink" : "text-muted hover:bg-raised hover:text-ink"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
      {household && (
        <NavLink
          to="/households"
          className="mt-auto rounded-xl border border-line bg-surface px-3 py-3 transition-colors hover:bg-raised"
        >
          <p className="text-xs text-muted">Current household</p>
          <p className="truncate text-sm font-medium">{household.name}</p>
        </NavLink>
      )}
    </aside>
  )
}

const BottomNav = () => (
  <nav
    aria-label="Primary"
    className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 backdrop-blur-lg md:hidden"
  >
    <div className="mx-auto grid max-w-lg grid-cols-4">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors [&>svg]:h-5 [&>svg]:w-5",
              isActive ? "text-accent" : "text-muted"
            )
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </div>
  </nav>
)

const AppShell = ({ children }: PropsWithChildren) => {
  const { pathname } = useLocation()
  const item = navItemFor(pathname)
  const create = item?.create
  const [createOpen, setCreateOpen] = useState(false)

  const createValue = useMemo(() => ({
    openCreate: () => create && setCreateOpen(true),
    canCreate: !!create,
    createLabel: create?.label,
  }), [create])

  return (
    <CreateContext.Provider value={createValue}>
      <div className="min-h-dvh md:flex">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="pt-safe sticky top-0 z-20 border-b border-line/70 bg-canvas/85 backdrop-blur-lg">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6 md:h-20 lg:px-10">
              <span className="md:hidden">
                <Logo compact />
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">
                  {item?.label ?? "Housemate"}
                </h1>
                {item && (
                  <p className="hidden truncate text-sm text-muted sm:block">{item.description}</p>
                )}
              </div>
              {create && (
                // Wrapper owns visibility: the button's own inline-flex would override `hidden`
                <span className="hidden md:block">
                  <Button icon={<PlusIcon />} onClick={() => setCreateOpen(true)}>
                    {create.label}
                  </Button>
                </span>
              )}
              <UserMenu />
            </div>
          </header>

          {/* Bottom padding clears the mobile tab bar + FAB */}
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-5 pb-32 sm:px-6 md:pt-8 md:pb-16 lg:px-10">
            {children}
          </main>
        </div>

        <BottomNav />

        {create && (
          <button
            type="button"
            aria-label={create.label}
            onClick={() => setCreateOpen(true)}
            className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-ink shadow-pop transition-transform active:scale-95 md:hidden"
          >
            <PlusIcon className="h-6 w-6" />
          </button>
        )}

        {create && (
          <Modal
            open={createOpen}
            onClose={() => setCreateOpen(false)}
            title={create.title}
            description={create.description}
          >
            <create.Form />
          </Modal>
        )}
      </div>
    </CreateContext.Provider>
  )
}

export default AppShell
