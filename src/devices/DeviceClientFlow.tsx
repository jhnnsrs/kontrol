import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type DetailDeviceFragment } from '../api/graphql';
import { useMemo } from 'react';

interface DeviceClientFlowProps {
    device: DetailDeviceFragment
}

const DeviceNode = ({ data }: NodeProps) => {
    return (
        <div className="group relative flex items-center justify-center px-4 py-2 backdrop-blur-sm border rounded-lg shadow-sm transition-all hover:shadow-md bg-background/80 border-border/50 hover:border-primary/50">
            <span className="text-xs font-medium transition-colors text-muted-foreground group-hover:text-foreground">
                {data.label as string}
            </span>
            
            <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !-right-0.5 transition-opacity !bg-border opacity-0 group-hover:opacity-100" />
        </div>
    );
};

const ClientNode = ({ data }: NodeProps) => {
    const client = data.client as any;
    
    return (
        <a 
            href={`/clients/${client.id}`}
            className="group relative flex flex-col px-2.5 py-1.5 backdrop-blur-sm border rounded-md shadow-sm transition-all hover:shadow-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 hover:border-blue-500/40 min-w-[160px] cursor-pointer no-underline"
        >
            <Handle type="target" position={Position.Left} className="!bg-blue-500/30 !w-1.5 !h-1.5 !-left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 justify-between">
                    <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                        {client.release.app.identifier}
                    </span>
                    <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 flex-shrink-0">
                        {client.kind}
                    </span>
                </div>
                
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground">
                    <span className="font-mono">v{client.release.version}</span>
                    {client.user && (
                        <>
                            <span>•</span>
                            <span>@{client.user.username}</span>
                        </>
                    )}
                </div>
            </div>
            
            <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !-right-0.5 transition-opacity !bg-blue-500/30 opacity-0 group-hover:opacity-100" />
        </a>
    );
};

const AliasNode = ({ data }: NodeProps) => {
    const isValid = data.valid !== false;
    const reason = data.reason as string;

    return (
        <div className={`group relative flex flex-col items-start justify-center px-3 py-2 backdrop-blur-sm border rounded-md shadow-sm transition-all hover:shadow-md min-w-[150px] ${
            isValid 
                ? "bg-primary/5 border-primary/10 hover:border-primary/30" 
                : "bg-destructive/10 border-destructive/50 hover:border-destructive"
        }`}>
            <Handle type="target" position={Position.Left} className={`!w-1 !h-1 !-left-0.5 opacity-0 group-hover:opacity-100 transition-opacity ${
                isValid ? "!bg-primary/20" : "!bg-destructive"
            }`} />
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold ${isValid ? "text-primary/80" : "text-destructive"}`}>
                        {data.serviceIdentifier as string}
                    </span>
                    <span className="text-[8px] text-muted-foreground">/</span>
                    <span className={`text-[10px] ${isValid ? "text-primary/60" : "text-destructive/80"}`}>
                        {data.instanceIdentifier as string}
                    </span>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono break-all">
                    {data.url as string}
                </span>
            </div>

            {!isValid && reason && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-destructive text-destructive-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {reason}
                </div>
            )}
        </div>
    );
};

const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data }: EdgeProps) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isValid = data?.valid !== false;

    return (
        <BaseEdge 
            path={edgePath} 
            markerEnd={markerEnd} 
            style={style} 
            className={`transition-colors duration-300 ${
                isValid 
                    ? "stroke-border hover:stroke-primary/50" 
                    : "stroke-destructive/50 hover:stroke-destructive"
            }`} 
        />
    );
};

const nodeTypes = {
    device: DeviceNode,
    client: ClientNode,
    alias: AliasNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export const DeviceClientFlow = ({ device }: DeviceClientFlowProps) => {
    const { nodes, edges } = useMemo(() => {
        // Create device node at the center-left
        const deviceNode: Node = {
            id: `device-${device.id}`,
            position: { x: 0, y: 200 },
            data: { 
                label: device.name || device.nodeId
            },
            type: 'device',
        };

        // Create client nodes
        const clientNodes: Node[] = device.clients.map((client, index) => ({
            id: `client-${client.id}`,
            position: { x: 250, y: index * 70 + 30 },
            data: { 
                client: client
            },
            type: 'client',
        }));

        // Create alias nodes from all clients' used aliases
        const aliasNodesMap = new Map<string, Node>();
        let aliasYPosition = 0;
        
        device.clients.forEach(client => {
            client.usedAliases?.forEach(usedAlias => {
                if (usedAlias.alias && !aliasNodesMap.has(usedAlias.alias.id)) {
                    let url: string;
                    if (!usedAlias.alias.host || usedAlias.alias.host === "") {
                        const protocol = window.location.protocol;
                        const hostname = window.location.hostname;
                        const port = window.location.port ? `:${window.location.port}` : "";
                        const path = usedAlias.alias.path || "";
                        url = `${protocol}//${hostname}${port}/${path}`;
                    } else {
                        url = `${usedAlias.alias.ssl ? "https" : "http"}://${usedAlias.alias.host}${usedAlias.alias.port ? `:${usedAlias.alias.port}` : ""}/${usedAlias.alias.path || ""}`;
                    }

                    aliasNodesMap.set(usedAlias.alias.id, {
                        id: `alias-${usedAlias.alias.id}`,
                        position: { x: 520, y: aliasYPosition },
                        data: { 
                            url: url,
                            serviceIdentifier: usedAlias.alias.instance?.service?.identifier || 'Unknown Service',
                            instanceIdentifier: usedAlias.alias.instance?.identifier || 'Unknown Instance',
                            valid: usedAlias.valid,
                            reason: usedAlias.reason
                        },
                        type: 'alias',
                    });
                    aliasYPosition += 90;
                }
            });
        });

        const aliasNodes = Array.from(aliasNodesMap.values());

        // Create edges: device -> clients
        const deviceToClientEdges: Edge[] = device.clients.map(client => ({
            id: `e-device-${client.id}`,
            source: `device-${device.id}`,
            target: `client-${client.id}`,
            type: 'custom',
            data: { valid: true }
        }));

        // Create edges: clients -> aliases
        const clientToAliasEdges: Edge[] = [];
        device.clients.forEach(client => {
            client.usedAliases?.forEach(usedAlias => {
                if (usedAlias.alias) {
                    clientToAliasEdges.push({
                        id: `e-${client.id}-${usedAlias.alias.id}`,
                        source: `client-${client.id}`,
                        target: `alias-${usedAlias.alias.id}`,
                        type: 'custom',
                        data: { valid: usedAlias.valid }
                    });
                }
            });
        });

        return { 
            nodes: [deviceNode, ...clientNodes, ...aliasNodes], 
            edges: [...deviceToClientEdges, ...clientToAliasEdges] 
        };
    }, [device]);

    return (
        <div className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.5, maxZoom: 1 }}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                panOnDrag={false}
                zoomOnScroll={false}
                zoomOnPinch={false}
                zoomOnDoubleClick={false}
                preventScrolling={false}
                proOptions={{ hideAttribution: true }}
                className="bg-transparent"
            />
        </div>
    );
};
