 // assuming your hook path
import { useTheme } from '@/providers/ThemeProvider';
import AutoLogo from './AutoLogo';
import type { ListClientFragment, ListServiceInstanceFragment } from '@/api/graphql';
import { Card, CardHeader } from './ui/card';
import { ArrowRight, Terminal } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import ServiceInstance from '@/services/ServiceInstance';
import ServiceLogo from './ServiceLogo';


export const ServiceInstanceCard = ({ instance }: { instance: ListServiceInstanceFragment }) => {
  const { theme } = useTheme(); // returns 'light' or 'dark'

  return (
     <Card>
       <ServiceLogo 
         service={instance.release.service.identifier} 
         theme={theme} 
       />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground"/>
                    <div className="font-medium">{instance.release.service.identifier}</div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                <Link to={`/organization/${instance.organization.id}/service-instances/${instance.id}`}>
                    View <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                </Button>
        </CardHeader>
     </Card>
  );
};