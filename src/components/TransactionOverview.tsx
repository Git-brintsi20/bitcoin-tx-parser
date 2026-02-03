import React from 'react';
import { TransactionInfo } from '../types/transaction';
import { Hash, FileCode, Layers, Clock, HardDrive, Scale } from 'lucide-react';

interface TransactionOverviewProps {
  info: TransactionInfo;
}

const TransactionOverview: React.FC<TransactionOverviewProps> = ({ info }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileCode className="text-orange-500" />
        Transaction Overview
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 text-orange-700 mb-2">
            <Hash className="w-5 h-5" />
            <span className="font-semibold">Transaction ID</span>
          </div>
          <p className="text-sm text-gray-800 font-mono break-all">{info.txid}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <Layers className="w-5 h-5" />
            <span className="font-semibold">Version</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{info.version}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-700 mb-2">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">Locktime</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{info.locktime}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 text-purple-700 mb-2">
            <HardDrive className="w-5 h-5" />
            <span className="font-semibold">Size</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{info.size} bytes</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <div className="flex items-center gap-2 text-pink-700 mb-2">
            <Scale className="w-5 h-5" />
            <span className="font-semibold">Weight</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{info.weight} WU</p>
          <p className="text-sm text-gray-600">vSize: {info.vsize} vB</p>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center gap-2 text-indigo-700 mb-2">
            <Layers className="w-5 h-5" />
            <span className="font-semibold">Inputs / Outputs</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {info.inputCount} / {info.outputCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionOverview;
