import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PersonalFinances() {
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-01-15', description: 'Grocery Shopping', amount: -75.50, category: 'Expenses' },
    { id: 2, date: '2024-01-20', description: 'Salary', amount: 2500.00, category: 'Income' }
  ]);

  const [newTransaction, setNewTransaction] = useState({
    date: '',
    description: '',
    amount: '',
    category: 'Expenses'
  });

  const addTransaction = () => {
    if (newTransaction.description && newTransaction.amount) {
      setTransactions([...transactions, {
        id: transactions.length + 1,
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      }]);
      setNewTransaction({ date: '', description: '', amount: '', category: 'Expenses' });
    }
  };

  const calculateTotal = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Finances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-bold">Total Balance: ${calculateTotal()}</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input 
                type="date" 
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
              />
              <Input 
                placeholder="Description" 
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              />
              <Input 
                type="number" 
                placeholder="Amount" 
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              />
              <Select 
                value={newTransaction.category}
                onValueChange={(value) => setNewTransaction({...newTransaction, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Expenses">Expenses</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addTransaction} className="col-span-full">Add Transaction</Button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Description</th>
                      <th className="p-2 text-right">Amount</th>
                      <th className="p-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b">
                        <td className="p-2">{transaction.date}</td>
                        <td className="p-2">{transaction.description}</td>
                        <td className={`p-2 text-right ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${transaction.amount.toFixed(2)}
                        </td>
                        <td className="p-2">{transaction.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
