"use client"

import * as React from "react"
import {
  Home,
  Mail,
  Lock,
  Users,
  Smartphone,
  Rocket,
  LogOut,
  Settings,
  GalleryVerticalEnd,
  Building2,
  Server,
  ExternalLink,
  BookOpen,
  Plus,
  UserCircle,
  Package,
  Wrench,
} from "lucide-react"
import { ArkitektLogo } from '../logos/ArkitektLogo'

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { CreateOrganizationDialog } from "@/components/CreateOrganizationDialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser, useConfig } from '../auth'
import { useListOrganizationsQuery, useMeQuery, useListServicesQuery } from "@/api/graphql"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useUser()
  const config = useConfig()
  const { data: orgData } = useListOrganizationsQuery({ skip: !user })
  const { data: meData } = useMeQuery({ skip: !user })
  const { data: servicesData } = useListServicesQuery({ skip: !user })
  const [createOrgOpen, setCreateOrgOpen] = React.useState(false)

  const organizations = orgData?.organizations.map(org => ({
    name: org.name,
    logo: Building2,
    plan: "Active",
    id: org.id
  })) || []

  const userData = meData?.me ? {
    name: meData.me.username,
    email: meData.me.email,
    avatar: meData.me.profile?.avatar?.presignedUrl || "",
  } : {
    name: user?.username || "User",
    email: user?.email || "",
    avatar: "",
  }

  // Build services navigation items
  const servicesItems = servicesData?.services.map(service => ({
    title: service.identifier,
    url: `/services/${service.id}`,
  })) || []

  // Navigation items based on authentication
  const navMain = user ? [
    {
      title: "Management",
      url: "#",
      icon: Building2,
      items: [
        {
          title: "Organizations",
          url: "/",
        },
        {
          title: "Members",
          url: "/members",
        },
      ],
      action: {
        icon: Plus,
        onClick: () => setCreateOrgOpen(true),
        tooltip: "Create Organization",
      },
    },
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
          title: "Clients",
          url: "/clients",
        },
        {
          title: "Devices",
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
      action: {
        icon: Plus,
        onClick: () => {}, // TODO: Implement register service
        tooltip: "Register Service",
      },
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {user ? (
          <TeamSwitcher teams={organizations} />
        ) : (
          <div className="flex items-center gap-2 px-4 py-2">
            <a href="https://arkitekt.live" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <ArkitektLogo width={32} height={32} strokeColor="currentColor" cubeColor="#5CDECE" aColor="currentColor" />
              <span className="font-semibold text-lg">Arkitekt</span>
              <ExternalLink className="size-3 text-muted-foreground" />
            </a>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={userData} />}
      </SidebarFooter>
      <SidebarRail />
      <CreateOrganizationDialog open={createOrgOpen} onOpenChange={setCreateOrgOpen} />
    </Sidebar>
  )
}
