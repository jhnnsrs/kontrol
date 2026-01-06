import { Outlet } from 'react-router-dom'
import { SidebarProvider } from "./ui/sidebar"
import { ErrorBoundary } from './ErrorBoundary'
import { ThemeProvider } from '@/providers/ThemeProvider'

export default function RootLayout() {

  return (
    <ThemeProvider>
    <SidebarProvider>
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
    </SidebarProvider>
    </ThemeProvider>
  )
}


export const ErrorLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <ThemeProvider>
    <SidebarProvider>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </SidebarProvider>
    </ThemeProvider>
  )
}
