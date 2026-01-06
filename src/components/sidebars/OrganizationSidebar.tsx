import { Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroupLabel, SidebarSeparator } from "@/components/ui/sidebar"
import { Link, useParams, useLocation } from "react-router-dom"
import { useSidebarOrganizationQuery } from "@/api/graphql"

export function OrganizationSidebar() {
    const { orgId } = useParams<{ orgId: string }>()
    const location = useLocation()
    const { data } = useSidebarOrganizationQuery({
        variables: { id: orgId! },
        skip: !orgId
    })

    const org = data?.organization

    if (!org) return (
         <Sidebar collapsible="none" className="hidden flex-1 md:flex">
             <SidebarContent></SidebarContent>
         </Sidebar>
    )

    const isActive = (path: string, exact = false) => {
        if (exact) return location.pathname === path
        return location.pathname.startsWith(path)
    }

    return (
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              {org.name}
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
             <SidebarGroup className="px-0">
                <SidebarGroupContent>
                     <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}`, true)}> 
                            <Link to={`/organization/${org.id}`}>
                              <span>Overview</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/profile`)}>
                            <Link to={`/organization/${org.id}/profile`}>
                              <span>Profile</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/members`)}>
                            <Link to={`/organization/${org.id}/members`}>
                              <span>Members</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/invites`)}>
                            <Link to={`/organization/${org.id}/invites`}>
                              <span>Invites</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                         <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/danger-zone`)}>
                            <Link to={`/organization/${org.id}/danger-zone`}>
                              <span>Settings</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup className="px-0">
                <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground mb-2 mt-4">Resources</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/clients`)}>
                            <Link to={`/organization/${org.id}/clients`}>
                              <span>Clients</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/service-instances`)}>
                            <Link to={`/organization/${org.id}/service-instances`}>
                              <span>Service Instances</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/devices`, true)}>
                            <Link to={`/organization/${org.id}/devices`}>
                              <span>Devices</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/devices/groups`)}>
                            <Link to={`/organization/${org.id}/devices/groups`}>
                              <span>Device Groups</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/scopes`)}>
                            <Link to={`/organization/${org.id}/scopes`}>
                              <span>Scopes</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton asChild isActive={isActive(`/organization/${org.id}/roles`)}>
                            <Link to={`/organization/${org.id}/roles`}>
                              <span>Roles</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            {(org.latestClients && org.latestClients.length > 0) && (
                <SidebarGroup className="px-0">
                    <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground mb-2 mt-4">Latest Clients</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {org.latestClients.map(client => (
                                <SidebarMenuItem key={client.id}>
                                    <SidebarMenuButton asChild isActive={isActive(`/clients/${client.id}`)}>
                                        <Link to={`/clients/${client.id}`}>
                                            <span>{client.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}
             {(org.latestServices && org.latestServices.length > 0) && (
                <SidebarGroup className="px-0">
                    <SidebarGroupLabel className="px-4 text-xs font-semibold text-muted-foreground mb-2 mt-4">Latest Instances</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {org.latestServices.map(instance => (
                                <SidebarMenuItem key={instance.id}>
                                    <SidebarMenuButton asChild isActive={isActive(`/service-instances/${instance.id}`)}>
                                        <Link to={`/service-instances/${instance.id}`}>
                                            <span>{instance.identifier}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            )}
        </SidebarContent>
      </Sidebar>
    )
}
