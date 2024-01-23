const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let accounts = [
  { id: 1, balance: 1000 },
  { id: 2, balance: 1500 },
  // Add more accounts as needed
];

app.get('/api/accounts', (req, res) => {
  res.json(accounts);
});

app.post('/api/distribute', (req, res) => {
  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);
  const equalAmount = totalBalance / accounts.length;

  accounts = accounts.map(account => ({
    ...account,
    balance: equalAmount,
  }));

  res.json(accounts);
});

app.post('/api/transfer', (req, res) => {
  const transferAmount = req.body.amount || 0;

  if (transferAmount === 0) {
    return res.status(400).json({ error: 'Please provide a valid transfer amount.' });
  }

  const totalBalance = accounts.reduce((total, account) => total + account.balance, 0);

  if (transferAmount > totalBalance / 2) {
    return res.status(400).json({ error: 'Transfer amount exceeds total balance!' });
  }

  const transferPercentage = transferAmount / totalBalance;

  accounts = accounts.map(account => ({
    ...account,
    balance: account.balance - account.balance * transferPercentage,
  }));

  res.json(accounts);
});

app.post('/api/credit', (req, res) => {
  const creditAmount = req.body.amount || 0;

  if (creditAmount === 0) {
    return res.status(400).json({ error: 'Please provide a valid credit amount.' });
  }

  const numberOfAccounts = accounts.length;

  accounts = accounts.map(account => ({
    ...account,
    balance: account.balance + creditAmount / numberOfAccounts,
  }));

  res.json(accounts);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
