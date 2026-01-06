import { Link, useParams } from "react-router-dom"
import { useRolesQuery } from "../api/graphql"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"

export default function Roles() {
  const { orgId } = useParams<{ orgId: string }>()
  
  const { data, loading, error } = useRolesQuery({
    variables: {
        filters: {
            organization: orgId || undefined
        }
    }
  })

  if (loading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4">Error: {error.message}</div>

  const roles = data?.roles || []

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Roles</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <Link key={role.id} to={`/organization/${orgId}/roles/${role.id}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium truncate">
                  {role.identifier}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                    <div className="text-xs text-muted-foreground">
                       {role.description}
                    </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {roles.length === 0 && (
             <div className="col-span-4 text-center text-muted-foreground">
                 No roles found.
             </div>
        )}
      </div>
    </div>
  )
}
