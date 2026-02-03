import axios from 'axios';

const BLOCKSTREAM_API = 'https://blockstream.info/api';
const MEMPOOL_API = 'https://mempool.space/api/v1';

export async function fetchInputValue(txid: string, vout: number): Promise<number | null> {
  try {
    const response = await axios.get(`${BLOCKSTREAM_API}/tx/${txid}`);
    if (response.data && response.data.vout && response.data.vout[vout]) {
      return response.data.vout[vout].value;
    }
    return null;
  } catch (error) {
    console.error('Error fetching input value:', error);
    return null;
  }
}

export async function fetchRecommendedFees(): Promise<{
  fastestFee: number;
  halfHourFee: number;
  hourFee: number;
} | null> {
  try {
    const response = await axios.get(`${MEMPOOL_API}/fees/recommended`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recommended fees:', error);
    return null;
  }
}

export async function fetchAllInputValues(inputs: Array<{ txid: string; vout: number }>): Promise<(number | null)[]> {
  const promises = inputs.map(input => fetchInputValue(input.txid, input.vout));
  return Promise.all(promises);
}
