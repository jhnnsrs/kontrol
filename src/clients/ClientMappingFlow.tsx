import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type ListServiceInstanceMappingFragment } from '../api/graphql';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

interface ClientMappingFlowProps {
    mappings: ListServiceInstanceMappingFragment[]
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

const InstanceNode = ({ data }: NodeProps) => {
    return (
        <Link to={`/service-instances/${data.id}`} className="group relative flex items-center justify-center px-3 py-1.5 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full shadow-sm transition-all hover:border-primary/30 hover:shadow-md pointer-events-auto">
            <Handle type="target" position={Position.Left} className="!bg-primary/20 !w-1 !h-1 !-left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] font-semibold text-primary/70 group-hover:text-primary transition-colors">
                {data.label as string}
            </span>
        </Link>
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
    instance: InstanceNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export const ClientMappingFlow = ({ mappings }: ClientMappingFlowProps) => {
    const { nodes, edges } = useMemo(() => {
        const uniqueInstances = Array.from(new Set(mappings.map(m => m.instance.id)))
            .map(id => mappings.find(m => m.instance.id === id)!.instance);

        const keyNodes: Node[] = mappings.map((m, index) => ({
            id: `key-${m.key}`,
            position: { x: 0, y: index * 50 },
            data: { label: m.key },
            type: 'key',
        }));

        const instanceNodes: Node[] = uniqueInstances.map((inst, index) => ({
            id: `inst-${inst.id}`,
            position: { x: 300, y: index * 80 + (mappings.length * 50 / 2) - (uniqueInstances.length * 80 / 2) },
            data: { label: inst.identifier, id: inst.id },
            type: 'instance',
        }));

        const flowEdges: Edge[] = mappings.map(m => ({
            id: `e-${m.key}-${m.instance.id}`,
            source: `key-${m.key}`,
            target: `inst-${m.instance.id}`,
            type: 'custom',
        }));

        return { nodes: [...keyNodes, ...instanceNodes], edges: flowEdges };
    }, [mappings]);

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
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
            >
            </ReactFlow>
        </div>
    );
};
