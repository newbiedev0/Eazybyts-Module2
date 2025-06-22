import React, { useState, useEffect, useCallback } from 'react';
import { getStocks, buyStock, sellStock } from '../api';
import { DollarSign, ArrowDown, ShoppingCart, TrendingUp } from 'lucide-react';

function StockList({ onTradeSuccess, showMessage }) {
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState('');
  const [quantityInput, setQuantityInput] = useState({});

  const fetchStocks = useCallback(async () => {
    try {
      const data = await getStocks();
      setStocks(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch stocks.');
      console.error('Fetch stocks error:', err);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 5000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  const handleQuantityChange = (stockId, value) => {
    setQuantityInput(prev => ({ ...prev, [stockId]: value }));
  };

  const handleBuy = async (stockId, symbol) => {
    const quantity = parseInt(quantityInput[stockId] || 0);
    if (quantity <= 0) {
      showMessage('Please enter a valid quantity.');
      return;
    }
    setError('');
    try {
      await buyStock(stockId, quantity);
      showMessage(`Successfully bought ${quantity} shares of ${symbol}!`);
      onTradeSuccess();
      setQuantityInput(prev => ({ ...prev, [stockId]: '' }));
    } catch (err) {
      setError(err.message || 'Failed to buy stock.');
    }
  };

  const handleSell = async (stockId, symbol) => {
    const quantity = parseInt(quantityInput[stockId] || 0);
    if (quantity <= 0) {
      showMessage('Please enter a valid quantity.');
      return;
    }
    setError('');
    try {
      await sellStock(stockId, quantity);
      showMessage(`Successfully sold ${quantity} shares of ${symbol}!`);
      onTradeSuccess();
      setQuantityInput(prev => ({ ...prev, [stockId]: '' }));
    } catch (err) {
      setError(err.message || 'Failed to sell stock.');
    }
  };

  return (
    <div className="w-full h-full bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 flex flex-col">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-teal-400" /> Available Stocks
      </h3>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="overflow-x-auto flex-grow custom-scrollbar">
        <table className="min-w-full divide-y divide-gray-600">
          <thead className="bg-gray-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">Symbol</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quantity</th>
              <th className="px-4 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-700 divide-y divide-gray-600">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-gray-600 transition duration-150 ease-in-out">
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-teal-300">{stock.symbol}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-200">{stock.name}</td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-200 flex items-center">
                  <DollarSign className="w-3 h-3 mr-0.5 text-green-400" /> {stock.currentPrice.toFixed(2)}
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                  <input
                    type="number"
                    min="1"
                    value={quantityInput[stock.id] || ''}
                    onChange={(e) => handleQuantityChange(stock.id, e.target.value)}
                    className="w-20 sm:w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded-md text-gray-100 text-sm focus:ring-1 focus:ring-teal-500"
                  />
                </td>
                <td className="px-4 py-2 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleBuy(stock.id, stock.symbol)}
                      className="inline-flex items-center justify-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs sm:text-sm font-semibold transition duration-200 ease-in-out shadow-sm transform hover:scale-105"
                    >
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Buy
                    </button>
                    <button
                      onClick={() => handleSell(stock.id, stock.symbol)}
                      className="inline-flex items-center justify-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs sm:text-sm font-semibold transition duration-200 ease-in-out shadow-sm transform hover:scale-105"
                    >
                      <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> Sell
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center text-gray-400">No stocks available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StockList;