import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMeQuery } from "@/api/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { data, loading } = useMeQuery();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  const user = data?.me;

  if (!user) {
    return <div className="flex h-screen items-center justify-center">User not found</div>;
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground">Manage your profile information</p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profile?.avatar?.presignedUrl || ""} />
                <AvatarFallback className="text-2xl">
                  {user.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Username</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
