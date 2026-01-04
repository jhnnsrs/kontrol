import { ReactFlow, Position, type Node, type Edge, Handle, type NodeProps, type EdgeProps, BaseEdge, getBezierPath } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { type DetailDeviceGroupFragment } from '../api/graphql';
import { useMemo } from 'react';

interface DeviceGroupFlowProps {
    deviceGroup: DetailDeviceGroupFragment
}

const GroupNode = ({ data }: NodeProps) => {
    return (
        <div className="group relative flex items-center justify-center px-4 py-2 backdrop-blur-sm border rounded-lg shadow-sm transition-all hover:shadow-md bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30 hover:border-purple-500/50">
            <span className="text-sm font-semibold transition-colors text-purple-600 dark:text-purple-400">
                {data.label as string}
            </span>
            
            <Handle type="source" position={Position.Right} className="!w-1.5 !h-1.5 !-right-0.5 transition-opacity !bg-purple-500/30 opacity-0 group-hover:opacity-100" />
        </div>
    );
};

const DeviceNode = ({ data }: NodeProps) => {
    const device = data.device as any;
    
    return (
        <a 
            href={`/devices/${device.id}`}
            className="group relative flex flex-col px-2.5 py-1.5 backdrop-blur-sm border rounded-md shadow-sm transition-all hover:shadow-lg bg-gradient-to-br from-green-500/10 to-teal-500/10 border-green-500/20 hover:border-green-500/40 min-w-[140px] cursor-pointer no-underline"
        >
            <Handle type="target" position={Position.Left} className="!bg-green-500/30 !w-1.5 !h-1.5 !-left-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-green-600 dark:text-green-400 truncate">
                    {device.name || 'Unnamed Device'}
                </span>
                
                <span className="text-[8px] text-muted-foreground font-mono truncate">
                    {device.nodeId}
                </span>
            </div>
        </a>
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
            style={style} 
            className="transition-colors duration-300 stroke-border hover:stroke-purple-500/50" 
        />
    );
};

const nodeTypes = {
    group: GroupNode,
    device: DeviceNode,
};

const edgeTypes = {
    custom: CustomEdge,
};

export const DeviceGroupFlow = ({ deviceGroup }: DeviceGroupFlowProps) => {
    const { nodes, edges } = useMemo(() => {
        // Create group node at the center-left
        const groupNode: Node = {
            id: `group-${deviceGroup.id}`,
            position: { x: 0, y: 200 },
            data: { 
                label: deviceGroup.name
            },
            type: 'group',
        };

        // Flatten devices array (it seems to be nested)
        const devices = deviceGroup.devices.flat();

        // Create device nodes
        const deviceNodes: Node[] = devices.map((device, index) => ({
            id: `device-${device.id}`,
            position: { x: 280, y: index * 60 + 30 },
            data: { 
                device: device
            },
            type: 'device',
        }));

        // Create edges: group -> devices
        const groupToDeviceEdges: Edge[] = devices.map(device => ({
            id: `e-group-${device.id}`,
            source: `group-${deviceGroup.id}`,
            target: `device-${device.id}`,
            type: 'custom',
        }));

        return { 
            nodes: [groupNode, ...deviceNodes], 
            edges: groupToDeviceEdges 
        };
    }, [deviceGroup]);

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
