import { Link } from "react-router-dom"
import { useAppsQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

export default function Apps() {
  const { data, loading, error } = useAppsQuery({})

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Apps</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.apps.map((app) => (
          <Link key={app.id} to={`/apps/${app.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {app.identifier}
                </CardTitle>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={app.logo?.presignedUrl || undefined} />
                    <AvatarFallback>{app.identifier.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  {app.identifier}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
