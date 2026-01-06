import { useLocation, Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb"

interface BreadcrumbSegment {
  label: string
  path: string
  hidden?: boolean
}

export const useRouteBreadcrumbs = (): BreadcrumbSegment[] => {
  const location = useLocation()
  const pathname = location.pathname

  const segments: BreadcrumbSegment[] = [{ label: "Home", path: "/" }]
  
  const pathParts = pathname.split('/').filter(Boolean)
  let currentPath = ''

  pathParts.forEach((part) => {
      currentPath += `/${part}`
      // Capitalize first letter, replace hyphens with spaces for better readability if desired, 
      // but "without advanced parsing" might imply kept simple. 
      // I'll do basic capitalization.
      segments.push({
          label: part.charAt(0).toUpperCase() + part.slice(1),
          path: currentPath
      })
  })

  return segments
}

export const RouteBreadcrumbs = () => {
  const breadcrumbs = useRouteBreadcrumbs()
  const location = useLocation()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          const isActive = location.pathname === crumb.path

          return (
            <div key={crumb.path} className="flex items-center gap-1.5">
              <BreadcrumbItem className={isActive ? "" : "hidden md:block"}>
                {isActive ? (
                  <span className="text-foreground font-medium">{crumb.label}</span>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.path} className="transition-colors hover:text-foreground">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className="hidden md:block">
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
