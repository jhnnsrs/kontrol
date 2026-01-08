import { Link, useParams } from "react-router-dom"
import { useCompositionsQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Layers } from "lucide-react"

export default function Compositions() {
  const { orgId } = useParams<{ orgId: string }>()
  
  const { data, loading, error } = useCompositionsQuery({
    variables: {
      filters: {
        organization: orgId || undefined
      }
    },
    skip: !orgId
  })

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  const compositions = data?.compositions || []

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Compositions</h2>
      </div>
      
      {compositions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Layers className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">No compositions found</p>
            <p className="text-sm text-muted-foreground">
              Compositions will appear here once they are deployed to your organization.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {compositions.map((composition) => (
            <Link key={composition.name} to={`/organization/${orgId}/compositions/${composition.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">
                      {composition.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {composition.instances.length} {composition.instances.length === 1 ? 'Service' : 'Services'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {composition.clients.length} {composition.clients.length === 1 ? 'Client' : 'Clients'}
                      </Badge>
                    </div>
                    
                    {composition.instances.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Services:</p>
                        <div className="flex flex-col gap-1">
                          {composition.instances.slice(0, 3).map((instance, idx) => (
                            <p key={idx} className="text-xs font-medium truncate">
                              • {instance.identifier}
                            </p>
                          ))}
                          {composition.instances.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{composition.instances.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
