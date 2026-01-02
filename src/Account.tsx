import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useConfig } from "./auth";

export default function Account() {
  const config = useConfig();

  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account security and preferences</p>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Email Settings</CardTitle>
            <CardDescription>Manage your email address</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline">
              <Link to="/account/email">Change Email</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline">
              <Link to="/account/password/change">Change Password</Link>
            </Button>
            <Button asChild variant="outline" className="ml-2">
              <Link to="/account/password/reset">Reset Password</Link>
            </Button>
          </CardContent>
        </Card>

        {config?.data.socialaccount && (
          <Card>
            <CardHeader>
              <CardTitle>Social Accounts</CardTitle>
              <CardDescription>Manage connected social accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/account/providers">Manage Providers</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {config?.data.mfa && (
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Enhance your account security</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/account/2fa">Manage 2FA</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {config?.data.usersessions && (
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>View and manage your active sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/account/sessions">View Sessions</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
