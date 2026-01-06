import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type DeviceCodeFragment, type ValidateDeviceCodeQuery } from '../api/graphql';
import { useMemo } from 'react';
import { Smartphone, Monitor, Globe, Key, Server, Box, XCircle } from 'lucide-react';

interface DeviceCodeFlowProps {
    deviceCode: DeviceCodeFragment;
    validation?: ValidateDeviceCodeQuery['validateDeviceCode'];
    className?: string;
}

const DeviceNode = ({ data }: NodeProps) => {
    const deviceCode = data.deviceCode as DeviceCodeFragment;
    const manifest = deviceCode.stagingManifest;
    const client = deviceCode.client;
    
    const kind = deviceCode.stagingKind || client?.kind || "development";
    
    let Icon = Smartphone;
    if (kind === "desktop") Icon = Monitor;
    if (kind === "website") Icon = Globe;

    return (
        <div className="group relative flex flex-col px-3 py-2 backdrop-blur-sm border rounded-md shadow-sm transition-all hover:shadow-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-500/20 hover:border-blue-500/40 min-w-[180px]">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1 justify-between">
                    <div className="flex items-center gap-2">
                        <Icon className="h-3 w-3 text-blue-500" />
                        <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                            {manifest?.identifier || client?.name || "Unknown App"}
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-1 text-[8px] text-muted-foreground pl-5">
                    <span className="font-mono">v{manifest?.version || client?.release?.version || "latest"}</span>
                </div>
            </div>
            
            <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !-right-0.5 !bg-blue-500/30" />
        </div>
    );
};

const EmptyNode = ({ data }: NodeProps) => {
    return (
        <div className="group relative flex flex-col items-center justify-center px-3 py-2 bg-muted/30 border border-dashed border-muted-foreground/30 rounded-md min-w-[150px] min-h-[50px]">
            <Handle type="target" position={Position.Left} className="!bg-muted-foreground/30 !w-1.5 !h-1.5 !-left-0.5" />
            <span className="text-[10px] text-muted-foreground text-center">
                Map Service
            </span>
        </div>
    );
};

const ServiceInstanceNode = ({ data }: NodeProps) => {
    const instance = data.instance as { identifier: string, id: string };
    
    return (
        <div className="group relative flex flex-col items-start justify-center px-3 py-2 bg-purple-500/5 backdrop-blur-sm border border-purple-500/10 rounded-md shadow-sm transition-all hover:border-purple-500/30 hover:shadow-md min-w-[150px]">
            <Handle type="target" position={Position.Left} className="!bg-purple-500/20 !w-1.5 !h-1.5 !-left-0.5" />
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                    <Box className="h-3 w-3 text-purple-500" />
                    <span className="text-[10px] font-bold text-purple-600/80 dark:text-purple-400/80">
                        {instance.identifier}
                    </span>
                </div>
                <span className="text-[9px] text-muted-foreground font-mono pl-4.5">
                    {instance.id}
                </span>
            </div>
        </div>
    );
};

const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data, label }: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const isValid = data?.valid !== false;
    const isOptional = data?.optional as boolean;
    const onRemove = data?.onRemove as () => void;

    return (
        <>
            <BaseEdge 
                path={edgePath} 
                markerEnd={markerEnd} 
                style={{
                    ...style,
                    strokeWidth: 2,
                    stroke: isValid ? 'rgb(0, 0, 0)' : 'rgb(220, 38, 38)',
                }}
            />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="flex flex-col items-center gap-1"
                >
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

const nodeTypes = {
    device: DeviceNode,
    empty: EmptyNode,
    instance: ServiceInstanceNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export const DeviceCodeFlow = ({ deviceCode, validation, className }: DeviceCodeFlowProps) => {
    const { nodes, edges } = useMemo(() => {
        const mappings = validation?.mappings || [];
        
        // If no mappings (e.g. no org selected), just show device node
        if (mappings.length === 0) {
             const deviceNode: Node = {
                id: 'device',
                position: { x: 0, y: 0 },
                data: { deviceCode },
                type: 'device',
            };
            return { nodes: [deviceNode], edges: [] };
        }

        // Collect all unique targets
        // 1. Mapped instances
        const uniqueInstances = Array.from(new Set(mappings.map(m => m.serviceInstance?.id).filter(Boolean)))
            .map(id => mappings.find(m => m.serviceInstance?.id === id)!.serviceInstance!);

        // 2. Unmapped keys (each needs an EmptyNode)
        const unmappedKeys = mappings.filter(m => !m.serviceInstance).map(m => m.key);

        const totalTargets = uniqueInstances.length + unmappedKeys.length;
        const totalHeight = Math.max(totalTargets * 100, 100);
        const centerY = totalHeight / 2 - 25;

        // Device node
        const deviceNode: Node = {
            id: 'device',
            position: { x: 0, y: centerY },
            data: { deviceCode },
            type: 'device',
        };

        // Target nodes
        const instanceNodes: Node[] = uniqueInstances.map((instance, index) => ({
            id: `instance-${instance.id}`,
            position: { x: 400, y: index * 100 + (centerY - (totalTargets * 100 / 2) + 40) },
            data: { instance },
            type: 'instance',
        }));

        const emptyNodes: Node[] = unmappedKeys.map((key, index) => ({
            id: `empty-${key}`,
            position: { x: 400, y: (uniqueInstances.length + index) * 100 + (centerY - (totalTargets * 100 / 2) + 40) },
            data: { label: "Map Service" },
            type: 'empty',
        }));

        // Edges
        const edges: Edge[] = mappings.map((mapping, index) => {
            const targetId = mapping.serviceInstance 
                ? `instance-${mapping.serviceInstance.id}`
                : `empty-${mapping.key}`;
            
            return {
                id: `e-device-${mapping.key}`,
                source: 'device',
                target: targetId,
                type: 'custom',
                label: mapping.key,
                data: { 
                    valid: !!mapping.serviceInstance,
                    optional: true, // TODO: Check if optional from client mappings
                    onRemove: () => console.log("Remove mapping", mapping.key)
                }
            };
        });

        return { 
            nodes: [deviceNode, ...instanceNodes, ...emptyNodes], 
            edges: edges 
        };
    }, [deviceCode, validation]);

    return (
        <div className={className}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                proOptions={{ hideAttribution: true }}
            />
        </div>
    );
};
