 // assuming your hook path
import { useTheme } from '@/providers/ThemeProvider';
import AutoLogo from './AutoLogo';
import type { ListClientFragment } from '@/api/graphql';
import { Card, CardHeader } from './ui/card';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';


export const ClientCard = ({ client }: { client: ListClientFragment }) => {
  const { theme } = useTheme(); // returns 'light' or 'dark'

  return (
     <Card>
       <AutoLogo 
         manifest={client.manifest} 
         theme={theme} 
       />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground"/>
                    <div className="font-medium">{client.name}</div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                <Link to={`/organization/${client.organization.id}/clients/${client.id}`}>
                    View <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
        </CardHeader>
     </Card>
  );
};