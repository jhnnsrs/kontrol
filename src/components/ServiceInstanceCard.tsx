import { useTheme } from '@/providers/ThemeProvider';
import type { ListServiceInstanceFragment } from '@/api/graphql';
import { Card } from './ui/card';
import { ArrowRight, Box } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import ServiceLogo from './ServiceLogo';
import { Badge } from './ui/badge';

export const ServiceInstanceCard = ({ instance }: { instance: ListServiceInstanceFragment }) => {
  const { theme } = useTheme();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md border-border/60">
      <div className="flex md:flex-row flex-col md:h-36">
        {/* Logo Section */}
        <div className="md:w-36 w-full h-36 md:h-auto relative flex-shrink-0 bg-muted/10 border-b md:border-b-0 md:border-r border-border/50">
          <div className="absolute inset-0">
            <ServiceLogo 
              service={instance.release.service.identifier} 
              theme={theme} 
            />
          </div>
          <div className="absolute w-full h-full bg-gradient-to-t from-background via-background/80 to-transparent" />
          
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-4 justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                    {instance.identifier}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Box className="w-3.5 h-3.5" />
                    <span>{instance.release.service.identifier}</span>
                </div>
              </div>
              <Badge variant="secondary" className="font-mono text-xs shadow-sm">
                v{instance.release.version}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <Button variant="default" size="sm" className="gap-2 group-hover:translate-x-0.5 transition-transform" asChild>
              <Link to={`/organization/${instance.organization.id}/service-instances/${instance.id}`}>
                View Instance <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};