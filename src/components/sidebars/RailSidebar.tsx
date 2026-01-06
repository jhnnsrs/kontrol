import {
  Building2,
  LayoutDashboard,
  Plus,
  User
} from "lucide-react"
import * as React from "react"
import { ArkitektLogo, DynamicArkitektLogo } from '../../logos/ArkitektLogo'

import { useListOrganizationsQuery, useMeQuery } from "@/api/graphql"
import { CreateOrganizationDialog } from "../CreateOrganizationDialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Link, useLocation } from "react-router-dom"
import { useUser } from '../../auth'
import { NavUser } from "@/components/nav-user"

export function RailSidebar() {
  const user = useUser()
  const { data: orgData } = useListOrganizationsQuery({ skip: !user })
  const { data: meData } = useMeQuery({ skip: !user })
  const [createOrgOpen, setCreateOrgOpen] = React.useState(false)
  
  const location = useLocation()

  const organizations = orgData?.organizations || []

  const userData = meData?.me ? {
    name: meData.me.username,
    email: meData.me.email,
    avatar: meData.me.profile?.avatar?.presignedUrl || "",
  } : {
    name: user?.username || "User",
    email: user?.email || "",
    avatar: "",
  }

  const isProfile = location.pathname.startsWith('/profile') || location.pathname.startsWith('/account')
  const isManagement = location.pathname === '/' || location.pathname.startsWith('/apps') || location.pathname.startsWith('/releases') || location.pathname.startsWith('/devices') || location.pathname.startsWith('/services') || location.pathname.startsWith('/service-instances')
  
  // Organization logic
  // Extract orgId from path if exists
  const pathParts = location.pathname.split('/')
  const orgIndex = pathParts.indexOf('organization')
  const activeOrgId = orgIndex !== -1 ? pathParts[orgIndex + 1] : null


  return (
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)+1px)] border-r"
      >
        <SidebarHeader>
           <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0 mt-2">
                <Link to="/">
                  <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg my-2">
                    <DynamicArkitektLogo  width="100%" height="100%" strokeColor="#000000" cubeColor="#6f5cdeff" aColor="currentColor" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">Arkitekt</span>
                    <span className="truncate text-xs">Kontrol</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      tooltip={{
                        children: "Management",
                        hidden: false,
                      }}
                      asChild
                      isActive={isManagement}
                      className="px-2.5 md:px-2"
                    >
                    <Link to="/">
                        <LayoutDashboard />
                        <span>Management</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                      tooltip={{
                        children: "Profile",
                        hidden: false,
                      }}
                      asChild
                      isActive={isProfile}
                      className="px-2.5 md:px-2"
                    >
                    <Link to="/profile">
                        <User />
                        <span>Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
              <Separator className="my-2" />
              <SidebarMenu>
                {organizations.map((org) => (
                  <SidebarMenuItem key={org.id}>
                    <SidebarMenuButton
                      tooltip={{
                        children: org.name,
                        hidden: false,
                      }}
                      asChild
                      isActive={activeOrgId === org.id}
                      className="px-2.5 md:px-2"
                    >
                      <Link to={`/organization/${org.id}`}>
                        <Building2 />
                        <span>{org.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton
                      tooltip={{
                        children: "Create Organization",
                        hidden: false,
                      }}
                      onClick={() => setCreateOrgOpen(true)}
                      className="px-2.5 md:px-2"
                    >
                    <Plus />
                    <span>Create Organization</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <CreateOrganizationDialog open={createOrgOpen} onOpenChange={setCreateOrgOpen} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={userData} />
        </SidebarFooter>
      </Sidebar>
  )
}
