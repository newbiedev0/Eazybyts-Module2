import React, { useState, useEffect, useCallback } from 'react';
import { getUserCash } from '../api';
import StockList from './StockList';
import Portfolio from './Portfolio';
import TransactionHistory from './TransactionHistory';
import { IndianRupee, Wallet, Repeat, TrendingUp, Briefcase, Info, XCircle } from 'lucide-react';

const Dashboard = ({ username, onLogout }) => {
  const [userCash, setUserCash] = useState(0);
  const [activeTab, setActiveTab] = useState('stocks'); 
  const [message, setMessage] = useState('');

  const fetchUserCash = useCallback(async () => {
    try {
      const cash = await getUserCash();
      setUserCash(cash);
    } catch (error) {
      console.error('Error fetching user cash:', error);
      if (error.message.includes('authentication failed')) {
        onLogout();
      }
    }
  }, [onLogout]);

  useEffect(() => {
    fetchUserCash();
    const cashInterval = setInterval(fetchUserCash, 5000);
    return () => clearInterval(cashInterval);
  }, [fetchUserCash]);

  const showTemporaryMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-gray-900 border-b border-gray-700">
        <div className="flex items-center mb-3 sm:mb-0">
          <Wallet className="mr-2 h-6 w-6 text-teal-400" />
          <span className="text-xl sm:text-2xl font-bold text-gray-100">Your Balance:</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-green-400 ml-2">
            <IndianRupee className="w-6 h-6 inline-block mr-1" />
            {userCash.toFixed(2)}
          </p>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-3">
          <button
            onClick={() => setActiveTab('stocks')}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition duration-300 ease-in-out shadow-md
              ${activeTab === 'stocks' ? 'bg-teal-600 text-white transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Stocks
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition duration-300 ease-in-out shadow-md
              ${activeTab === 'portfolio' ? 'bg-teal-600 text-white transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Portfolio
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition duration-300 ease-in-out shadow-md
              ${activeTab === 'transactions' ? 'bg-teal-600 text-white transform scale-105' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            <Repeat className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Transactions
          </button>
        </div>
      </div>

      {message && (
        <div className="relative bg-blue-600 text-white px-4 py-3 rounded-b-lg text-center text-sm sm:text-base shadow-lg flex items-center justify-between">
          <Info className="w-5 h-5 mr-3" />
          <span className="flex-grow">{message}</span>
          <button onClick={() => setMessage('')} className="ml-3 text-white hover:text-gray-200">
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-grow p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-auto custom-scrollbar">
        {activeTab === 'stocks' && (
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <StockList onTradeSuccess={fetchUserCash} showMessage={showTemporaryMessage} />
          </div>
        )}
        {activeTab === 'portfolio' && (
          <div className="lg:col-span-2 h-full min-h-[400px]">
            <Portfolio onTradeSuccess={fetchUserCash} showMessage={showTemporaryMessage} />
          </div>
        )}
        {activeTab === 'transactions' && (
          <div className="lg:col-span-3 h-full min-h-[400px]">
            <TransactionHistory />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;