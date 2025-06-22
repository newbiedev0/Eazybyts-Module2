import React, { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../api';
import { Repeat, DollarSign } from 'lucide-react';

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch transactions.');
      console.error('Fetch transactions error:', err);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="w-full h-full bg-gray-700 p-4 rounded-lg shadow-md mt-6 border border-gray-600 flex flex-col">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-4 flex items-center">
        <Repeat className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-teal-400" /> Transaction History
      </h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="overflow-x-auto flex-grow custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">Type</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price at Trade</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-600 transition duration-150 ease-in-out">
                <td className={`px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium ${tx.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{tx.type}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-teal-300">{tx.stockSymbol}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-200">{tx.stockName}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-200">{tx.quantity}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-200 flex items-center">
                  <DollarSign className="w-3 h-3 mr-0.5 text-green-400" /> {tx.priceAtTrade.toFixed(2)}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(tx.timestamp)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-400">No transactions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionHistory;