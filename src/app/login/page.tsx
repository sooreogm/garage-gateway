import { HardDrive, KeyRound } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
    loggedOut?: string;
  }>;
};

function getErrorMessage(error?: string) {
  switch (error) {
    case "invalid":
      return {
        title: "Invalid access key",
        description: "The secret key you entered did not match the configured dashboard access key.",
      };
    case "config":
      return {
        title: "Access key not configured",
        description: "Set GARAGE_GATEWAY_ACCESS_KEY in the server environment before signing in.",
      };
    default:
      return null;
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next =
    typeof params.next === "string" && params.next.startsWith("/")
      ? params.next
      : "";
  const error = getErrorMessage(params.error);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden px-6 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.05),transparent_50%)]" />
      <div className="relative w-full max-w-md">
        <Card className="border border-border/60 bg-background/95 shadow-xl backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HardDrive className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Garage Gateway</CardTitle>
                <CardDescription>Enter the shared secret to access the dashboard.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {params.loggedOut === "1" && (
              <Alert>
                <AlertTitle>Signed out</AlertTitle>
                <AlertDescription>Your dashboard session has been cleared.</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertTitle>{error.title}</AlertTitle>
                <AlertDescription>{error.description}</AlertDescription>
              </Alert>
            )}

            <form action="/api/auth/login" method="post" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="secretKey">Dashboard secret key</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="secretKey"
                    name="secretKey"
                    type="password"
                    placeholder="Enter the shared access key"
                    className="h-10 pl-10"
                    autoComplete="current-password"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {next && <input type="hidden" name="next" value={next} />}

              <Button type="submit" className="h-10 w-full">
                Unlock Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
