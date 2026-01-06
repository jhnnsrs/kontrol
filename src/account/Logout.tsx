import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { logout } from '../lib/allauth'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { LogOut, ArrowLeft } from 'lucide-react'

export default function Logout () {
  const [response, setResponse] = useState({ fetching: false, content: null })

  function submit () {
    setResponse({ ...response, fetching: true })
    logout().then((content) => {
      setResponse((r) => { return { ...r, content } })
    }).catch((e) => {
      console.error(e)
      window.alert(e)
    }).then(() => {
      setResponse((r) => { return { ...r, fetching: false } })
    })
  }
  if (response.content) {
    return <Navigate to='/' />
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
            <LogOut className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Sign Out</CardTitle>
          <CardDescription>
            Are you sure you want to logout from your account?
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>You'll need to sign in again to access your account and services.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button 
            disabled={response.fetching} 
            onClick={() => submit()}
            variant="destructive"
            className="w-full"
          >
            {response.fetching ? (
              <>
                <LogOut className="h-4 w-4 mr-2 animate-pulse" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
          <Link to="/" className="w-full">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
