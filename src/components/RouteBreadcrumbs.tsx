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

  // Parse the pathname into breadcrumb segments
  const segments: BreadcrumbSegment[] = [{ label: "Home", path: "/" }]

  // Common breadcrumb patterns
  if (pathname.startsWith("/organization/")) {
    const match = pathname.match(/^\/organization\/([^/]+)(?:\/(\w+))?/)
    if (match) {
      const orgId = match[1]
      const section = match[2]

      segments.push({
        label: "Organization",
        path: `/organization/${orgId}`,
      })

      if (section === "members") {
        segments.push({ label: "Members", path: `/organization/${orgId}/members` })
      } else if (section === "invites") {
        segments.push({ label: "Invites", path: `/organization/${orgId}/invites` })
      } else if (section === "danger-zone") {
        segments.push({ label: "Danger Zone", path: `/organization/${orgId}/danger-zone` })
      }
    }
  } else if (pathname.startsWith("/services")) {
    const match = pathname.match(/^\/services\/([^/]+)$/)
    if (match) {
      segments.push({ label: "Services", path: "/services" })
      segments.push({ label: "Service Details", path: pathname })
    } else {
      segments.push({ label: "Services", path: "/services" })
    }
  } else if (pathname.startsWith("/service-instances")) {
    const match = pathname.match(/^\/service-instances\/([^/]+)$/)
    if (match) {
      segments.push({ label: "Service Instances", path: "/service-instances" })
      segments.push({ label: "Instance Details", path: pathname })
    } else {
      segments.push({ label: "Service Instances", path: "/service-instances" })
    }
  } else if (pathname.startsWith("/clients")) {
    const match = pathname.match(/^\/clients\/([^/]+)$/)
    if (match) {
      segments.push({ label: "Clients", path: "/clients" })
      segments.push({ label: "Client Details", path: pathname })
    } else {
      segments.push({ label: "Clients", path: "/clients" })
    }
  } else if (pathname.startsWith("/apps")) {
    const match = pathname.match(/^\/apps\/([^/]+)$/)
    if (match) {
      segments.push({ label: "Apps", path: "/apps" })
      segments.push({ label: "App Details", path: pathname })
    } else {
      segments.push({ label: "Apps", path: "/apps" })
    }
  } else if (pathname.startsWith("/releases")) {
    const match = pathname.match(/^\/releases\/([^/]+)$/)
    if (match) {
      segments.push({ label: "Releases", path: "/releases" })
      segments.push({ label: "Release Details", path: pathname })
    } else {
      segments.push({ label: "Releases", path: "/releases" })
    }
  } else if (pathname.startsWith("/devices")) {
    const match = pathname.match(/^\/devices\/([^/]+)$|^\/devices$/)
    if (match?.[1]) {
      segments.push({ label: "Devices", path: "/devices" })
      segments.push({ label: "Device Details", path: pathname })
    } else {
      segments.push({ label: "Devices", path: "/devices" })
    }
  } else if (pathname.match(/^\/organization\/([^/]+)\/devices\/groups\/([^/]+)$/)) {
    const match = pathname.match(/^\/organization\/([^/]+)\/devices\/groups\/([^/]+)$/)
    const orgId = match?.[1]
    const groupId = match?.[2]
    segments.push({ label: "Organizations", path: "/" })
    if (orgId) {
      segments.push({ label: "Organization", path: `/organization/${orgId}` })
      segments.push({ label: "Device Groups", path: `/organization/${orgId}/devices/groups` })
      segments.push({ label: "Group Details", path: pathname })
    }
  } else if (pathname.match(/^\/organization\/([^/]+)\/devices\/groups$/)) {
    const match = pathname.match(/^\/organization\/([^/]+)\/devices\/groups$/)
    const orgId = match?.[1]
    segments.push({ label: "Organizations", path: "/" })
    if (orgId) {
      segments.push({ label: "Organization", path: `/organization/${orgId}` })
      segments.push({ label: "Device Groups", path: pathname })
    }
  } else if (pathname === "/profile") {
    segments.push({ label: "Profile", path: "/profile" })
  } else if (pathname === "/account") {
    segments.push({ label: "Account", path: "/account" })
  }

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
