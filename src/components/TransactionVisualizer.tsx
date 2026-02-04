import React from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow';
import type { Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import type { InputInfo, OutputInfo } from '../types/transaction';
import { satoshisToBTC } from '../utils/bitcoin';
import { Network } from 'lucide-react';

interface TransactionVisualizerProps {
  inputs: InputInfo[];
  outputs: OutputInfo[];
}

const TransactionVisualizer: React.FC<TransactionVisualizerProps> = ({ inputs, outputs }) => {
  const createNodes = (): Node[] => {
    const nodes: Node[] = [];
    
    // Input nodes
    inputs.forEach((input, index) => {
      nodes.push({
        id: `input-${index}`,
        type: 'default',
        position: { x: 0, y: index * 120 },
        data: {
          label: (
            <div className="p-2 text-xs">
              <div className="font-semibold text-orange-600">Input #{index}</div>
              <div className="text-gray-600 truncate w-32" title={input.txid}>
                {input.txid.substring(0, 12)}...
              </div>
              {input.value && (
                <div className="font-semibold text-green-600">
                  {satoshisToBTC(input.value)} BTC
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: '#fff7ed',
          border: '2px solid #fb923c',
          borderRadius: '8px',
          width: 180,
        },
      });
    });
    
    // Transaction node (center)
    nodes.push({
      id: 'transaction',
      type: 'default',
      position: { x: 300, y: (Math.max(inputs.length, outputs.length) * 120) / 2 - 60 },
      data: {
        label: (
          <div className="p-3 text-center">
            <Network className="w-6 h-6 mx-auto text-purple-600 mb-1" />
            <div className="font-bold text-purple-600">TRANSACTION</div>
            <div className="text-xs text-gray-600">{inputs.length} → {outputs.length}</div>
          </div>
        ),
      },
      style: {
        background: '#faf5ff',
        border: '3px solid #a855f7',
        borderRadius: '12px',
        width: 160,
      },
    });
    
    // Output nodes
    outputs.forEach((output, index) => {
      nodes.push({
        id: `output-${index}`,
        type: 'default',
        position: { x: 600, y: index * 120 },
        data: {
          label: (
            <div className="p-2 text-xs">
              <div className="font-semibold text-blue-600">Output #{index}</div>
              <div className="text-gray-600 truncate w-32" title={output.address}>
                {output.address.substring(0, 12)}...
              </div>
              <div className="font-semibold text-green-600">
                {satoshisToBTC(output.value)} BTC
              </div>
              <div className="text-gray-500 text-[10px]">{output.type}</div>
            </div>
          ),
        },
        style: {
          background: '#eff6ff',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          width: 180,
        },
      });
    });
    
    return nodes;
  };
  
  const createEdges = (): Edge[] => {
    const edges: Edge[] = [];
    
    // Input to transaction edges
    inputs.forEach((input, index) => {
      edges.push({
        id: `e-input-${index}`,
        source: `input-${index}`,
        target: 'transaction',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#fb923c', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#fb923c',
        },
        label: input.value ? `${satoshisToBTC(input.value)} BTC` : '',
        labelStyle: { fill: '#fb923c', fontWeight: 600, fontSize: 10 },
        labelBgStyle: { fill: '#fff7ed' },
      });
    });
    
    // Transaction to output edges
    outputs.forEach((output, index) => {
      edges.push({
        id: `e-output-${index}`,
        source: 'transaction',
        target: `output-${index}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6',
        },
        label: `${satoshisToBTC(output.value)} BTC`,
        labelStyle: { fill: '#3b82f6', fontWeight: 600, fontSize: 10 },
        labelBgStyle: { fill: '#eff6ff' },
      });
    });
    
    return edges;
  };
  
  const [nodes] = useNodesState(createNodes());
  const [edges] = useEdgesState(createEdges());

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Network className="text-purple-500" />
        Transaction Flow Visualization
      </h2>
      
      <div style={{ height: '500px' }} className="border border-gray-200 rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          attributionPosition="bottom-left"
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500 rounded"></div>
          <span>Inputs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500 rounded"></div>
          <span>Transaction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
          <span>Outputs</span>
        </div>
      </div>
    </div>
  );
};

export default TransactionVisualizer;
