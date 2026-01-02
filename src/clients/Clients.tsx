import { Link } from "react-router-dom"
import { useClientsQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Badge } from "../components/ui/badge"

export default function Clients() {
  const { data, loading, error } = useClientsQuery({})

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.clients.map((client) => (
          <Link key={client.id} to={`/clients/${client.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">
                  {client.name}
                </CardTitle>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={client.logo?.presignedUrl || undefined} />
                    <AvatarFallback>{client.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">{client.kind}</Badge>
                        <span className="text-xs text-muted-foreground">by {client.user.username}</span>
                    </div>
                    {client.release && (
                        <div className="text-xs text-muted-foreground">
                            Running {client.release.app.name} {client.release.version}
                        </div>
                    )}
                    {client.device && (
                        <div className="text-xs text-muted-foreground">
                            On {client.device.name}
                        </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
