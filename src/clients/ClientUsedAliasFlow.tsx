import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type ListUsadAliasFragment } from '../api/graphql';
import { useMemo } from 'react';

interface ClientUsedAliasFlowProps {
    aliases: ListUsadAliasFragment[]
}

const KeyNode = ({ data }: NodeProps) => {
    return (
        <div className="group relative flex items-center justify-center px-3 py-1.5 bg-background/80 backdrop-blur-sm border border-border/50 rounded-full shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
            <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors font-mono">
                {data.label as string}
            </span>
            <Handle type="source" position={Position.Right} className="!bg-border !w-1 !h-1 !-right-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    );
};

const AliasNode = ({ data }: NodeProps) => {
    return (
        <div className="group relative flex items-center justify-center px-3 py-1.5 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
            <Handle type="target" position={Position.Left} className="!bg-primary/20 !w-1 !h-1 !-left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] font-semibold text-primary/70 group-hover:text-primary transition-colors font-mono">
                {data.label as string}
            </span>
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
        <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} className="stroke-border hover:stroke-primary/50 transition-colors duration-300" />
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
            data: { label: a.key },
            type: 'key',
        }));

        const aliasNodes: Node[] = uniqueAliases.map((alias, index) => {
            const url = `${alias.ssl ? "https" : "http"}://${alias.host || alias.layer.name}${alias.port ? `:${alias.port}` : ""}${alias.path || ""}`;
            return {
                id: `alias-${alias.id}`,
                position: { x: 300, y: index * 80 + (aliases.length * 50 / 2) - (uniqueAliases.length * 80 / 2) },
                data: { label: url },
                type: 'alias',
            };
        });

        const flowEdges: Edge[] = aliases.filter(a => a.alias).map(a => ({
            id: `e-${a.key}-${a.alias!.id}`,
            source: `key-${a.key}`,
            target: `alias-${a.alias!.id}`,
            type: 'custom',
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
