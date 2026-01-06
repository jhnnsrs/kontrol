import { Link, useParams } from "react-router-dom"
import { useScopesQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

export default function Scopes() {
  const { orgId } = useParams<{ orgId: string }>()
  
  const { data, loading, error } = useScopesQuery({
    variables: {
        filters: {
            organization: orgId || undefined
        }
    }
  })

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  const scopes = data?.scopes || []

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Scopes</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {scopes.map((scope) => (
          <Link key={scope.id} to={`/organization/${orgId}/scopes/${scope.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">
                  {scope.identifier}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="text-xs text-muted-foreground">
                       {scope.description}
                    </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {scopes.length === 0 && (
             <div className="col-span-4 text-center text-muted-foreground">
                 No scopes found.
             </div>
        )}
      </div>
    </div>
  )
}
