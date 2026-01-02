import { useParams, Navigate, useLocation } from "react-router-dom";
import {
  useInviteByCodeQuery,
  useAcceptInviteMutation,
  useDeclineInviteMutation,
  useMeQuery
} from "@/api/graphql";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, CheckCircle2, Building2, XCircle, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStatus } from "@/auth/hooks";
import { URLs } from "@/auth/routing";

export function InvitePage() {
  const { code } = useParams<{ code: string }>();
  const location = useLocation();
  const [, status] = useAuthStatus();

  const { data: inviteData, loading: inviteLoading, error: inviteError } = useInviteByCodeQuery({
    variables: { code: code || "" },
    skip: !code,
  });

  const { data: meData } = useMeQuery();

  const [acceptInvite] = useAcceptInviteMutation();
  const [declineInvite] = useDeclineInviteMutation();

  const [submitted, setSubmitted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  if (!code) {
    return <div className="flex h-screen items-center justify-center">No invite code provided</div>;
  }

  if (inviteLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (inviteError) {
    return <div className="flex h-screen items-center justify-center">Error: {inviteError.message}</div>;
  }

  const invite = inviteData?.inviteByCode;

  if (!invite) {
    return <div className="flex h-screen items-center justify-center">Invalid or expired invite code</div>;
  }

  const onAccept = async () => {
    try {
      await acceptInvite({
        variables: {
          input: {
            token: invite.token
          }
        }
      });
      setAccepted(true);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const onDecline = async () => {
    try {
      await declineInvite({
        variables: {
          input: {
            token: invite.token
          }
        }
      });
      setAccepted(false);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  const isExpired = new Date(invite.expiresAt) < new Date();
  const isAlreadyAccepted = invite.status === "ACCEPTED";

  // Success state
  if (submitted) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>
              {accepted ? "Invitation Accepted" : "Invitation Declined"}
            </CardTitle>
            <CardDescription>
              {accepted 
                ? `You are now a member of ${invite.createdFor.name}` 
                : "You have declined this invitation"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/">Go to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form
  return (
    <div className="container max-w-3xl py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted">
            <Building2 className="h-8 w-8" />
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-semibold">Organization Invitation</h1>
            <p className="text-sm text-muted-foreground">
              You've been invited to join an organization
            </p>
            {meData?.me && (
              <p className="text-sm text-muted-foreground">
                Invited as <span className="font-medium">{meData.me.username}</span>
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Organization Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {invite.createdFor.name}
            </CardTitle>
            {invite.createdFor.description && (
              <CardDescription>{invite.createdFor.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={invite.createdBy.profile?.avatar?.presignedUrl || ""} />
                <AvatarFallback>
                  {invite.createdBy.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Invited by</p>
                <p className="text-sm text-muted-foreground">{invite.createdBy.username}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-sm text-muted-foreground">
                {new Date(invite.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium">Expires</p>
              <p className="text-sm text-muted-foreground">
                {new Date(invite.expiresAt).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Alerts */}
        {isExpired && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Invitation Expired</AlertTitle>
            <AlertDescription>
              This invitation has expired and can no longer be accepted.
            </AlertDescription>
          </Alert>
        )}

        {isAlreadyAccepted && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Already Accepted</AlertTitle>
            <AlertDescription>
              This invitation has already been accepted.
            </AlertDescription>
          </Alert>
        )}

        {!isExpired && !isAlreadyAccepted && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Review Required</AlertTitle>
            <AlertDescription>
              By accepting this invitation, you will become a member of {invite.createdFor.name}.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        {status.isAuthenticated ? (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onDecline}
              disabled={isExpired || isAlreadyAccepted}
            >
              Decline
            </Button>
            <Button 
              className="flex-1" 
              onClick={onAccept}
              disabled={isExpired || isAlreadyAccepted}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Accept Invitation
            </Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              asChild
            >
              <a href={`/account/signup?next=${encodeURIComponent(location.pathname + location.search)}`}>
                Sign Up
              </a>
            </Button>
            <Button 
              className="flex-1"
              asChild
            >
              <a href={`${URLs.LOGIN_URL}?next=${encodeURIComponent(location.pathname + location.search)}`}>
                Log In to Accept
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
