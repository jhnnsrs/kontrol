import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar"
import { useUser } from "@/auth"
import { NavMain } from "@/components/nav-main"
import {
  BookOpen,
  Home,
  Package,
  Server,
} from "lucide-react"

export function ManagementSidebar() {
    const user = useUser()

      // Build services navigation items
    const servicesItems: any[] = []
    // Navigation items based on authentication
    const navMain = user ? [
        {
        title: "Apps",
        url: "#",
        icon: Package,
        items: [
            {
            title: "Apps",
            url: "/apps",
            },
            {
            title: "Releases",
            url: "/releases",
            },
            {
            title: "Public Devices",
            url: "/devices",
            },
        ],
        },
        {
        title: "Services",
        url: "#",
        icon: Server,
        items: [
            ...servicesItems,
            {
            title: "Service Instances",
            url: "/service-instances",
            },
            {
            title: "Mappings",
            url: "/service-instance-mappings",
            },
        ],
        },
    ] : [
        {
        title: "Home",
        url: "/",
        icon: Home,
        isActive: true,
        },
        {
        title: "Documentation",
        url: "https://arkitekt.live",
        icon: BookOpen,
        items: [
            {
            title: "Getting Started",
            url: "https://arkitekt.live/docs/getting-started",
            },
            {
            title: "API Reference",
            url: "https://arkitekt.live/docs/api",
            },
            {
            title: "Guides",
            url: "https://arkitekt.live/docs/guides",
            },
        ],
        },
    ]

    return (
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              Management
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
             <NavMain items={navMain} />
        </SidebarContent>
      </Sidebar>
    )
}
