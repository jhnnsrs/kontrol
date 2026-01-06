import { useMeQuery } from "@/api/graphql"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

export function ProfileSidebar() {

    const { data} = useMeQuery()
    
    const isActive = (path: string) => location.pathname === path

    return (
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-foreground text-base font-medium">
              Profile
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup className="px-0">
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive("/profile")}>
                                <Link to="/profile">Overview</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive("/account")}>
                                <Link to="/account">Account</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
             <SidebarGroup className="px-0">
                <Link to="/socialaccount/manage" className="px-4 text-xs font-semibold text-muted-foreground mb-2 mt-4">Social Accounts</Link>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {data?.me?.socialAccounts?.map((account) => (
                             <SidebarMenuItem key={account.id}>
                                <SidebarMenuButton asChild isActive={isActive(`/socialaccount/${account.id}`)}>
                                    <Link to={`/socialaccount/${account.id}`}>
                                    {account.id}
                                        <span className="text-muted-foreground">{account.provider}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    )
}
