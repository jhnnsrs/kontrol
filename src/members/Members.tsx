import { useParams } from "react-router-dom"
import { useOrganizationQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import { useState } from "react"
import { CreateInviteDialog } from "../components/CreateInviteDialog"
import { Badge } from "@/components/ui/badge"


export default function Members() {
  const { id } = useParams<{ id: string }>()
  const [inviteOpen, setInviteOpen] = useState(false)
  const { data, loading, error } = useOrganizationQuery({
    variables: { id: id! },
    skip: !id,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data?.organization) return <div>Organization not found</div>

  const org = data.organization

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Members</h2>
            <p className="text-muted-foreground">
                Manage members of {org.name}
            </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
            Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Members List</CardTitle>
            <CardDescription>
                People with access to this organization
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4">
                {org.memberships.map(membership => (
                    <div key={membership.id} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={membership.user.profile?.avatar?.presignedUrl || undefined} />
                                <AvatarFallback>{membership.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{membership.user.username}</div>
                                <div className="text-xs text-muted-foreground">
                                    {membership.roles.map(r => <Badge key={r.identifier}>{r.identifier}</Badge>)}
                                </div>
                            </div>
                        </div>
                        {/* Add actions here if needed, e.g. remove member */}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
      <CreateInviteDialog open={inviteOpen} onOpenChange={setInviteOpen} orgId={org.id} />
    </div>
  )
}
