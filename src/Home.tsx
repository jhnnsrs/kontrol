import { GalleryVerticalEnd } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { useUser, useConfig } from './auth'


import * as React from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"



function NavBarItem (props: { to: string, icon: React.ReactNode, name: string }) {
  const location = useLocation()
  const isActive = (props.to && location.pathname.startsWith(props.to))
  const cls = isActive ? 'text-slate-800' : 'text-slate-800 hover:text-slate-600'
  return (
    <Link className={cls} to={props.to}>{props.icon} {props.name}</Link>
    
  )
}

export  function NavBar () {
  const user = useUser()
  const config = useConfig()
  const anonNav = (
    <>
      <NavBarItem to='/account/login' icon='🔑' name='Login' />
      <NavBarItem to='/account/signup' icon='🧑' name='Signup' />
      <NavBarItem to='/account/password/reset' icon='🔓' name='Reset password' />
    </>
  )
  const authNav = (
    <>
      <NavBarItem to='/account/email' icon='📬' name='Change Email' />
      <NavBarItem to='/account/password/change' icon='🔒' name='Change Password' />
      {config?.data.socialaccount
        ? <NavBarItem to='/account/providers' icon='👤' name='Providers' />
        : null}
      {config?.data.mfa
        ? <NavBarItem to='/account/2fa' icon='📱' name='Two-Factor Authentication' />
        : null}

      {config?.data.usersessions
        ? <NavBarItem to='/account/sessions' icon='🚀' name='Sessions' />
        : null}
      <NavBarItem to='/account/logout' icon='👋' name='Logout' />
    </>
  )
  return (
      <div className='container-fluid'>
        <Link to='/' className='navbar-brand'>React ❤️ django-allauth</Link>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarCollapse' aria-controls='navbarCollapse' aria-expanded='false' aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse' id='navbarCollapse'>
          <ul className='navbar-nav me-auto mb-2 mb-md-0'>
            <NavBarItem to='/calculator' icon='📈' name='Calculator' />
            {user ? authNav : anonNav}
          </ul>
        </div>
      </div>
  )
}


export function NavigationMenuDemo() {
  const isMobile = useIsMobile()
  const user = useUser()
  const config = useConfig()

  return (
    <NavigationMenu viewport={isMobile}>
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/calculator">Calculator</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {user ? (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Account</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
                <ListItem to='/account/email' title='Change Email'>
                  Manage your email addresses
                </ListItem>
                <ListItem to='/account/password/change' title='Change Password'>
                  Update your password
                </ListItem>
                {config?.data.socialaccount && (
                  <ListItem to='/account/providers' title='Providers'>
                    Manage third-party login providers
                  </ListItem>
                )}
                {config?.data.mfa && (
                  <ListItem to='/account/2fa' title='Two-Factor Authentication'>
                    Secure your account
                  </ListItem>
                )}
                {config?.data.usersessions && (
                  <ListItem to='/account/sessions' title='Sessions'>
                    Manage active sessions
                  </ListItem>
                )}
                <ListItem to='/account/logout' title='Logout'>
                  Sign out of your account
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ) : (
          <>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/account/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/account/signup">Signup</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function ListItem({
  title,
  children,
  to,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { to: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={to}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}


export default function Home () {
  return (
    <>
<NavigationMenuDemo />
    <NavBar />
    <div className="grid min-h-svh lg:grid-cols-2">

      <Link to="/account/login" className="flex flex-col ">
        <div className="flex justify-center gap-2 md:justify-start">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
        </div>
      </Link>
      <Link to="/account/logout" className="flex flex-col ">
        <div className="flex justify-center gap-2 md:justify-start">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
        </div>
      </Link>
    </div>
    </>
  )
}
