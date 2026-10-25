import React, { useState, useEffect, useMemo } from 'react';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Trash2, 
  DollarSign, 
  ArrowUpDown, 
  Download,
  Calendar,
  Tag,
  AlertCircle
} from 'lucide-react';

/**
 * UTILITY: Helper functions for financial calculations and formatting
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
};

/**
 * COMPONENT: TransactionForm
 */
const TransactionForm = ({ onAddTransaction }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Uncategorized',
    type: 'expense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  const [error, setError] = useState('');

  useEffect(() => {
    const now = new Date();
    setFormData(prev => ({
      ...prev,
      date: now.toISOString().split('T')[0],
      amount: '' 
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      setError("Please fill in Description and Amount fields.");
      return;
    }

    const amountValue = parseFloat(formData.amount);
    if (amountValue <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    const newTransaction = {
      id: Date.now().toString(),
      ...formData,
      amount: amountValue,
      category: formData.category === 'Uncategorized' ? 'Other' : formData.category,
      type: formData.type === 'expense' ? 'expense' : 'income',
    };
    
    onAddTransaction(newTransaction);
    
    setFormData({
      title: '',
      category: 'Uncategorized',
      type: 'expense',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    });
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5 text-indigo-600" /> Add Transaction
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-2 text-sm rounded-r-md">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Title / Description */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
          <input 
            type="text" 
            name="title"
            placeholder="E.g., Grocery Shopping, Salary"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Amount */}
        <div className="col-span-1">
           <label className="block text-sm font-medium text-slate-600 mb-1">Amount</label>
           <div className="flex rounded-lg border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all overflow-hidden">
             <span className="flex items-center px-3 text-slate-500 bg-gray-100 border-r border-gray-200 font-medium text-sm">
                SAR
             </span>
             <input 
               type="number" 
               name="amount"
               placeholder="0.00"
               step="0.01"
               value={formData.amount}
               onChange={handleChange}
               className="w-full px-3 py-2.5 text-slate-800 font-mono bg-transparent focus:outline-none"
             />
           </div>
        </div>

        {/* Date */}
        <div className="col-span-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">Date</label>
          <input 
            type="date" 
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        {/* Type Selection */}
        <div className="col-span-1 md:col-span-2 flex gap-2 h-[46px] self-end">
           <button 
            type="button" 
            onClick={() => { setFormData({...formData, type: 'expense'}); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium transition-all border ${
              formData.type === 'expense' 
              ? 'bg-red-50 text-red-700 border-red-200 shadow-sm' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
           >
             <TrendingDown size={18} />
             Expense
           </button>
           <button 
            type="button" 
            onClick={() => { setFormData({...formData, type: 'income'}); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg font-medium transition-all border ${
              formData.type === 'income' 
              ? 'bg-green-50 text-green-700 border-green-200 shadow-sm' 
              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
            }`}
           >
             <TrendingUp size={18} />
             Income
           </button>
        </div>

        {/* Category */}
        <div className="col-span-1 md:col-span-1 self-end">
          <select 
            name="category" 
            value={formData.category}
            onChange={handleChange}
            className="w-full h-[46px] rounded-lg border border-gray-200 bg-gray-50 px-4 text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="Uncategorized">Uncategorized</option>
            <option value="Housing">Housing</option>
            <option value="Food">Food</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-1 self-end">
          <button 
            type="submit" 
            className="w-full h-[46px] flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2"
          >
            <Plus size={18} /> Add
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * COMPONENT: FilterBar
 */
const FilterBar = ({ filters, setFilters }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="relative w-full max-w-md">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder="Search by description..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>
      
      <div className="flex gap-3 w-full md:w-auto">
        <select 
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="flex-1 md:flex-none cursor-pointer rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="expense">Expense Only</option>
        </select>

        <div className="flex-1 md:flex-none relative">
           <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none">
             <ArrowUpDown size={16} />
           </div>
           <select 
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="w-full cursor-pointer rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 py-2.5 text-sm text-slate-700 focus:bg-white focus:border-indigo-500 focus:outline-none transition-all"
           >
             <option value="date_desc">Newest First</option>
             <option value="date_asc">Oldest First</option>
             <option value="amount_desc">Highest Amount</option>
             <option value="amount_asc">Lowest Amount</option>
           </select>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: TransactionList
 */
const TransactionList = ({ transactions, filters, onDeleteTransaction }) => {
  const [deletingId, setDeletingId] = useState(null);
  
  // Filter and Sort Logic
  const processedTransactions = useMemo(() => {
    // 1. Filter
    let result = transactions.filter(t => {
      const matchesSearch = t.title ? t.title.toLowerCase().includes(filters.search.toLowerCase()) : false;
      const matchesType = filters.type === 'all' || t.type === filters.type;
      return matchesSearch && matchesType;
    });

    // 2. Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'amount_desc') return b.amount - a.amount;
      if (filters.sortBy === 'amount_asc') return a.amount - b.amount;
      if (filters.sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
      // Default: date_desc
      return new Date(b.date) - new Date(a.date) || b.id - a.id;
    });

    return result;
  }, [transactions, filters]);

  const confirmDelete = (id) => {
    onDeleteTransaction(id);
    setDeletingId(null);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-12">
      {processedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <DollarSign size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800">No transactions found</h3>
          <p className="text-slate-500 mt-1 max-w-sm">
            {transactions.length === 0 
              ? "Your list is empty. Add your first transaction above to start tracking." 
              : "No transactions match your current search and filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Description & Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-[100px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-800 divide-y divide-gray-100">
              {processedTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800">{t.title}</p>
                    <span className="inline-block px-2 py-0.5 mt-1 text-xs font-medium bg-gray-100 text-gray-600 rounded">
                      {t.category === 'Uncategorized' ? 'Other' : t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(t.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-lg font-semibold tracking-tight ${t.type === 'expense' ? 'text-slate-800' : 'text-green-600'}`}>
                      {t.type === 'expense' ? '-' : '+'}{formatCurrency(Math.abs(t.amount))}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {deletingId === t.id ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-red-500 font-medium">Delete?</span>
                        <div className="flex gap-2">
                          <button onClick={() => confirmDelete(t.id)} className="text-red-600 hover:text-red-800 font-bold text-sm">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="text-gray-500 hover:text-gray-700 font-bold text-sm">No</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeletingId(t.id)} 
                        className="text-gray-300 group-hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Delete transaction"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/**
 * COMPONENT: Dashboard
 */
const Dashboard = ({ transactions }) => {
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpenses = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else totalExpenses += t.amount;
    });
    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses,
    };
  }, [transactions]);
  
  // Assume a limit just for visualization purposes
  const MONTH_LIMIT = 5000;
  const usedPercentage = Math.round((stats.expenses / MONTH_LIMIT) * 100);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Income Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-[180px] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 bg-green-50 w-24 h-24 rounded-full opacity-50 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-2 z-10">
           <div className="bg-green-100 p-2.5 rounded-lg">
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Income</h2>
        </div>
        <div className="z-10 mt-auto">
           <span className="block text-3xl font-bold text-slate-800">{formatCurrency(stats.income)}</span>
        </div>
      </div>

      {/* Expense Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-[180px] relative overflow-hidden">
        <div className="absolute -right-4 -top-4 bg-red-50 w-24 h-24 rounded-full opacity-50 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-2 z-10">
           <div className="bg-red-100 p-2.5 rounded-lg">
            <TrendingDown size={20} className="text-red-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</h2>
        </div>
        <div className="z-10 mt-auto">
           <span className="block text-3xl font-bold text-slate-800">{formatCurrency(stats.expenses)}</span>
           <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
             <div 
               className={`h-1.5 rounded-full ${usedPercentage > 90 ? 'bg-red-500' : 'bg-slate-400'}`} 
               style={{ width: `${Math.min(usedPercentage, 100)}%` }}
             ></div>
           </div>
        </div>
      </div>

       {/* Balance Card */}
       <div className={`p-6 rounded-xl shadow-sm flex flex-col justify-between h-[180px] text-white relative overflow-hidden ${
          stats.balance >= 0 ? 'bg-indigo-600' : 'bg-red-600'
       }`}>
        <div className="absolute -right-6 -bottom-6 bg-white/10 w-32 h-32 rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-2 z-10">
           <div className="bg-white/20 p-2.5 rounded-lg backdrop-blur-sm">
            <CreditCard size={20} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Net Balance</h2>
        </div>
        <div className="z-10 mt-auto">
          <span className="block text-4xl font-bold tracking-tight">
            {formatCurrency(stats.balance)}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: ConfirmModal
 */
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        
        <div className="flex justify-end gap-3">
           <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-200 transition-colors"
           >
             Cancel
           </button>
           <button 
            onClick={onConfirm} 
            className="px-4 py-2 bg-red-600 rounded-lg text-sm font-bold text-white shadow-sm hover:bg-red-700 transition-colors focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2"
           >
             Confirm
           </button>
        </div>
      </div>
    </div>
  );
};

/**
 * APP: Main Component
 */
export default function App() {
  const [transactions, setTransactions] = useState(() => {
     try {
       const saved = localStorage.getItem('budgetTrackerData');
       if(saved) return JSON.parse(saved);
     } catch (e) {
       console.error("Failed to parse local storage data", e);
     }
     
     // Mock Data if empty
     return [
       { id: '1', title: 'Monthly Salary', category: 'Salary', type: 'income', amount: 4200, date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] },
       { id: '2', title: 'Groceries at Whole Foods', category: 'Food', type: 'expense', amount: 145.20, date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
       { id: '3', title: 'Electric Bill', category: 'Utilities', type: 'expense', amount: 95.00, date: new Date().toISOString().split('T')[0] },
     ];
  });

  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    sortBy: 'date_desc'
  });

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('budgetTrackerData', JSON.stringify(transactions));
  }, [transactions]);

  const handleExport = () => {
     const headers = "Date,Description,Category,Type,Amount\n";
     const rows = transactions.map(e => 
        `${e.date},"${e.title || ''}",${e.category},${e.type},${e.amount}`
     ).join("\n");
     
     const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
     
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "budget_tracker_export.csv");
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  const handleAddTransaction = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleClearAll = () => {
    setTransactions([]);
    setIsClearModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-100">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm backdrop-blur-md bg-white/90">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-sm">
              <CreditCard size={22} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Nafi & Rafiu's Monthly Expense</h1>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => setIsClearModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Clear all data"
            >
               <Trash2 size={18} />
               <span className="hidden sm:inline">Clear Data</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors"
            >
               <Download size={18} />
               <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* DASHBOARD STATS */}
        <Dashboard transactions={transactions} />

        {/* ADD TRANSACTION FORM */}
        <TransactionForm onAddTransaction={handleAddTransaction} />

        {/* LIST & FILTERS HEADER */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
        </div>

        {/* FILTERS & SEARCH */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* DATA TABLE SECTION */}
        <TransactionList 
          transactions={transactions} 
          filters={filters} 
          onDeleteTransaction={handleDeleteTransaction}
        />
      </main>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={isClearModalOpen} 
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleClearAll}
        title="Clear All Data?"
        message="This will permanently delete all your transactions. This action cannot be undone."
      />
    </div>
  );
}