import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type ServiceDeviceCodeFragment } from '../api/graphql';
import { useMemo } from 'react';
import { Server, Globe, Box } from 'lucide-react';

interface ServiceDeviceCodeFlowProps {
    serviceDeviceCode: ServiceDeviceCodeFragment
}

const ServiceNode = ({ data }: NodeProps) => {
    const manifest = data.manifest as ServiceDeviceCodeFragment['stagingManifest'];
    
    return (
        <div className="group relative flex flex-col px-3 py-2 backdrop-blur-sm border rounded-md shadow-sm transition-all hover:shadow-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:border-purple-500/40 min-w-[180px]">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 justify-between">
                    <div className="flex items-center gap-2">
                        <Box className="h-3 w-3 text-purple-500" />
                        <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 truncate">
                            {manifest?.identifier || "Unknown Service"}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground pl-5">
                    <span className="font-mono">v{manifest?.version || "latest"}</span>
                </div>
            </div>
            
            <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !-right-0.5 !bg-purple-500/30" />
        </div>
    );
};

const InstanceNode = ({ data }: NodeProps) => {
    const instance = data.instance as ServiceDeviceCodeFragment['instance'];
    
    return (
        <div className="group relative flex flex-col px-3 py-2 backdrop-blur-sm border rounded-md shadow-sm transition-all hover:shadow-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:border-blue-500/40 min-w-[160px]">
            <Handle type="target" position={Position.Left} className="!w-1.5 !h-1.5 !-left-0.5 !bg-blue-500/30" />
            
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 justify-between">
                    <div className="flex items-center gap-2">
                        <Server className="h-3 w-3 text-blue-500" />
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                            {instance?.identifier || "New Instance"}
                        </span>
                    </div>
                </div>
                
                {instance?.id && (
                    <div className="flex items-center gap-1 text-[8px] text-muted-foreground pl-5">
                        <span className="font-mono">{instance.id}</span>
                    </div>
                )}
            </div>
            
            <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !-right-0.5 !bg-blue-500/30" />
        </div>
    );
};

const AliasNode = ({ data }: NodeProps) => {
    const alias = data.alias as { host: string, port: number };
    
    return (
        <div className="group relative flex flex-col items-start justify-center px-3 py-2 bg-orange-500/5 backdrop-blur-sm border border-orange-500/10 rounded-md shadow-sm transition-all hover:border-orange-500/30 hover:shadow-md min-w-[150px]">
            <Handle type="target" position={Position.Left} className="!bg-orange-500/20 !w-1.5 !h-1.5 !-left-0.5" />
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-orange-500" />
                    <span className="text-[10px] font-bold text-orange-600/80 dark:text-orange-400/80">
                        {alias.host}
                    </span>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono pl-4.5">
                    Port: {alias.port}
                </span>
            </div>
        </div>
    );
};

const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: EdgeProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <BaseEdge 
            path={edgePath} 
            markerEnd={markerEnd} 
            style={{
                ...style,
                strokeWidth: 2,
                stroke: 'rgb(var(--border))'
            }}
        />
    );
};

const nodeTypes = {
    service: ServiceNode,
    instance: InstanceNode,
    alias: AliasNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export const ServiceDeviceCodeFlow = ({ serviceDeviceCode }: ServiceDeviceCodeFlowProps) => {
    const { nodes, edges } = useMemo(() => {
        const aliases = serviceDeviceCode.stagingAliases || [];
        const totalHeight = Math.max(aliases.length * 80, 100);
        const centerY = totalHeight / 2 - 25;

        // Service node
        const serviceNode: Node = {
            id: 'service',
            position: { x: 0, y: centerY },
            data: { manifest: serviceDeviceCode.stagingManifest },
            type: 'service',
        };

        // Instance node
        const instanceNode: Node = {
            id: 'instance',
            position: { x: 250, y: centerY },
            data: { instance: serviceDeviceCode.instance || { identifier: serviceDeviceCode.stagingManifest?.identifier } },
            type: 'instance',
        };

        // Alias nodes
        const aliasNodes: Node[] = aliases.map((alias, index) => ({
            id: `alias-${index}`,
            position: { x: 500, y: index * 80 + (centerY - (aliases.length * 80 / 2) + 40) },
            data: { alias },
            type: 'alias',
        }));

        // Edges
        const edges: Edge[] = [
            {
                id: 'e-service-instance',
                source: 'service',
                target: 'instance',
                type: 'custom',
            },
            ...aliases.map((_, index) => ({
                id: `e-instance-alias-${index}`,
                source: 'instance',
                target: `alias-${index}`,
                type: 'custom',
            }))
        ];

        return { 
            nodes: [serviceNode, instanceNode, ...aliasNodes], 
            edges 
        };
    }, [serviceDeviceCode]);

    return (
        <div className="h-[300px] w-full bg-muted/20 rounded-lg border">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                panOnScroll={false}
                zoomOnScroll={false}
                panOnDrag={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
            />
        </div>
    );
};
