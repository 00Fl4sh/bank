import React, { useState, useEffect,useCallback } from 'react';

const MoneyDistributor = () => {
  const [accounts, setAccounts] = useState([]);
  const [customAmount, setCustomAmount] = useState(0);

//   useEffect(() => {
//     // Fetch initial account data when the component mounts
//     fetchAccounts();
//   }, []);

  const fetchAccounts = useCallback(async () => {
    try {
      // Fetch accounts
      const response = await fetch('http://localhost:5000/api/accounts');
      const data = await response.json();
      console.log('Accounts:', data);
      setAccounts(data);
  
      // Make a POST request to /api/transfer
      const transferAmount = 100;
      const transferResponse = await fetch('http://localhost:5000/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: transferAmount }),
      });
  
      if (transferResponse.ok) {
        // If the transfer was successful, fetch accounts again to update the UI
        fetchAccounts();
      } else {
        console.error('Transfer request failed:', transferResponse.statusText);
        // Handle the case when the transfer request fails
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      // Handle the error, e.g., show an error message to the user
    }
  }, []); // No dependencies for fetchAccounts

  useEffect(() => {
    // Fetch initial account data when the component mounts
    fetchAccounts();
  }, [fetchAccounts]); // Include fetchAccounts in the dependency array

  const distributeMoneyEqually = async () => {
    try {
      await fetch('http://localhost:5000/api/distribute', { method: 'POST' });
      fetchAccounts();
    } catch (error) {
      console.error('Error distributing money:', error);
    }
  };


  const transferMoneyEqually = async () => {
    const transferAmount = customAmount || 0;

    if (transferAmount === 0) {
      alert("Please enter a valid transfer amount.");
      return;
    }

    try {
      await fetch('http://localhost:5000/api/transfer', { // Update the URL to use port 5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: transferAmount }),
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error transferring money:', error);
    }
  };

  const creditEqually = async () => {
    const creditAmount = customAmount || 0;

    if (creditAmount === 0) {
      alert("Please enter a valid credit amount.");
      return;
    }

    try {
      await fetch('http://localhost:5000/api/credit', { // Update the URL to use port 5000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: creditAmount }),
      });
      fetchAccounts();
    } catch (error) {
      console.error('Error crediting money:', error);
    }
  };

  return (
    <div>
      <h2>Bank Accounts</h2>
      <ul>
        {accounts.map(account => (
          <li key={account.id}>
            Account {account.id}: ${account.balance.toFixed(2)}
          </li>
        ))}
      </ul>
      <div>
        <label>
          Custom Amount:
          <input
            type="number"
            value={customAmount}
            onChange={(e) => setCustomAmount(parseFloat(e.target.value))}
          />
        </label>
      </div>
      <button onClick={distributeMoneyEqually}>Distribute Equally</button>
      <button onClick={transferMoneyEqually}>Transfer Equally</button>
      <button onClick={creditEqually}>Credit Equally</button>
    </div>
  );
};

export default MoneyDistributor;
