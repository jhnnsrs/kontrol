import { useParams, Link } from "react-router-dom"
import { useDetailAppQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

export default function App() {
  const { id } = useParams<{ id: string }>()
  const { data, loading, error } = useDetailAppQuery({
    variables: { id: id! },
    skip: !id,
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data?.app) return <div>App not found</div>

  const app = data.app

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={app.logo?.presignedUrl || undefined} alt={app.identifier} />
            <AvatarFallback>{app.identifier.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{app.identifier}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
            <h3 className="font-semibold mb-2">Releases</h3>
            <div className="grid gap-2">
                {app.releases.map(release => (
                    <Link key={release.id} to={`/releases/${release.id}`}>
                        <div className="p-2 border rounded-md hover:bg-muted/50 transition-colors flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={release.logo?.presignedUrl || undefined} />
                                <AvatarFallback>{release.version.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-medium">{release.version}</div>
                            </div>
                        </div>
                    </Link>
                ))}
                {app.releases.length === 0 && (
                    <div className="text-sm text-muted-foreground">No releases found</div>
                )}
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
