import React from 'react';
import { FeeInfo } from '../types/transaction';
import { DollarSign, TrendingUp, Activity, AlertCircle } from 'lucide-react';
import { formatBTCValue } from '../utils/bitcoin';

interface FeeAnalysisProps {
  feeInfo: FeeInfo;
}

const FeeAnalysis: React.FC<FeeAnalysisProps> = ({ feeInfo }) => {
  const getStatusColor = (status: string) => {
    const colors = {
      'low': 'bg-red-100 text-red-700 border-red-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'high': 'bg-green-100 text-green-700 border-green-300'
    };
    return colors[status as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'low') return <AlertCircle className="w-5 h-5" />;
    if (status === 'high') return <TrendingUp className="w-5 h-5" />;
    return <Activity className="w-5 h-5" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <DollarSign className="text-green-500" />
        Fee Analysis
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <span className="text-xs text-green-700 block mb-2 font-semibold">Total Input Value</span>
          <p className="text-lg font-bold text-gray-800">{formatBTCValue(feeInfo.totalInput)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <span className="text-xs text-blue-700 block mb-2 font-semibold">Total Output Value</span>
          <p className="text-lg font-bold text-gray-800">{formatBTCValue(feeInfo.totalOutput)}</p>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <span className="text-xs text-orange-700 block mb-2 font-semibold">Transaction Fee</span>
          <p className="text-lg font-bold text-gray-800">{formatBTCValue(feeInfo.fee)}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <span className="text-xs text-purple-700 block mb-2 font-semibold">Fee Rate</span>
          <p className="text-2xl font-bold text-gray-800">{feeInfo.feeRate.toFixed(2)} sat/vByte</p>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-lg border border-pink-200">
          <span className="text-xs text-pink-700 block mb-2 font-semibold">Fee Percentage</span>
          <p className="text-2xl font-bold text-gray-800">{feeInfo.feePercentage.toFixed(4)}%</p>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border-2 ${getStatusColor(feeInfo.status)} flex items-center gap-3`}>
        {getStatusIcon(feeInfo.status)}
        <div>
          <p className="font-semibold text-sm">
            Fee Status: {feeInfo.status.toUpperCase()}
          </p>
          <p className="text-xs mt-1">
            {feeInfo.status === 'low' && 'This transaction has a low fee rate and may take longer to confirm.'}
            {feeInfo.status === 'medium' && 'This transaction has a moderate fee rate for average confirmation time.'}
            {feeInfo.status === 'high' && 'This transaction has a high fee rate and should confirm quickly.'}
          </p>
        </div>
      </div>
      
      {feeInfo.recommendedFees && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Current Mempool Recommended Fees</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="text-xs text-gray-600 block mb-1">High Priority (Fastest)</span>
              <p className="text-lg font-bold text-green-600">{feeInfo.recommendedFees.fastestFee} sat/vB</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="text-xs text-gray-600 block mb-1">Medium Priority (~30 min)</span>
              <p className="text-lg font-bold text-yellow-600">{feeInfo.recommendedFees.halfHourFee} sat/vB</p>
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <span className="text-xs text-gray-600 block mb-1">Low Priority (~1 hour)</span>
              <p className="text-lg font-bold text-orange-600">{feeInfo.recommendedFees.hourFee} sat/vB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeAnalysis;
