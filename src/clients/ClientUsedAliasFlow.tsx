import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type ListUsedAliasFragment } from '../api/graphql';
import { useMemo } from 'react';

interface ClientUsedAliasFlowProps {
    aliases: ListUsedAliasFragment[]
}

const KeyNode = ({ data }: NodeProps) => {
    const isValid = data.valid !== false;
    const reason = data.reason as string;

    return (
        <div className={`group relative flex items-center justify-center px-3 py-1.5 backdrop-blur-sm border rounded-full shadow-sm transition-all hover:shadow-md ${
            isValid 
                ? "bg-background/80 border-border/50 hover:border-primary/50" 
                : "bg-destructive/10 border-destructive/50 hover:border-destructive"
        }`}>
            <span className={`text-[10px] font-medium transition-colors font-mono ${
                isValid ? "text-muted-foreground group-hover:text-foreground" : "text-destructive"
            }`}>
                {data.label as string}
            </span>
            
            {!isValid && reason && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-destructive text-destructive-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {reason}
                </div>
            )}

            <Handle type="source" position={Position.Right} className={`!w-1 !h-1 !-right-0.5 transition-opacity ${
                isValid ? "!bg-border opacity-0 group-hover:opacity-100" : "!bg-destructive opacity-100"
            }`} />
        </div>
    );
};

const AliasNode = ({ data }: NodeProps) => {
    return (
        <div className="group relative flex flex-col items-start justify-center px-3 py-2 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-md shadow-sm transition-all hover:border-primary/30 hover:shadow-md min-w-[150px]">
            <Handle type="target" position={Position.Left} className="!bg-primary/20 !w-1 !h-1 !-left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-primary/80">
                        {data.serviceIdentifier as string}
                    </span>
                    <span className="text-[8px] text-muted-foreground">/</span>
                    <span className="text-[10px] text-primary/60">
                        {data.instanceIdentifier as string}
                    </span>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono break-all">
                    {data.url as string}
                </span>
            </div>
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
    key: KeyNode,
    alias: AliasNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export const ClientUsedAliasFlow = ({ aliases }: ClientUsedAliasFlowProps) => {
    const { nodes, edges } = useMemo(() => {
        const uniqueAliases = Array.from(new Set(aliases.map(a => a.alias?.id).filter(Boolean)))
            .map(id => aliases.find(a => a.alias?.id === id)!.alias!);

        const keyNodes: Node[] = aliases.map((a, index) => ({
            id: `key-${a.key}`,
            position: { x: 0, y: index * 50 },
            data: { 
                label: a.key,
                valid: a.valid,
                reason: a.reason
            },
            type: 'key',
        }));

        const aliasNodes: Node[] = uniqueAliases.map((alias, index) => {
            let url: string;
            if (!alias.host || alias.host === "") {
                const protocol = window.location.protocol;
                const hostname = window.location.hostname;
                const port = window.location.port ? `:${window.location.port}` : "";
                const path = alias.path || "";
                url = `${protocol}//${hostname}${port}/${path}`;
            } else {
                url = `${alias.ssl ? "https" : "http"}://${alias.host}${alias.port ? `:${alias.port}` : ""}/${alias.path || ""}`;
            }

            return {
                id: `alias-${alias.id}`,
                position: { x: 300, y: index * 80 + (aliases.length * 50 / 2) - (uniqueAliases.length * 80 / 2) },
                data: { 
                    label: url, // Keep label for backward compatibility if needed
                    url: url,
                    serviceIdentifier: alias.instance?.service?.identifier || 'Unknown Service',
                    instanceIdentifier: alias.instance?.identifier || 'Unknown Instance'
                },
                type: 'alias',
            };
        });

        const flowEdges: Edge[] = aliases.filter(a => a.alias).map(a => ({
            id: `e-${a.key}-${a.alias!.id}`,
            source: `key-${a.key}`,
            target: `alias-${a.alias!.id}`,
            type: 'custom',
            data: { valid: a.valid }
        }));

        return { nodes: [...keyNodes, ...aliasNodes], edges: flowEdges };
    }, [aliases]);

    return (
        <div className="h-full w-full">
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
