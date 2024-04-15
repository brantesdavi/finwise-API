const express = require('express');
const cors = require('cors');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const connectionString = require('./data/db');
const Transaction = require('./models/Transaction')

mongoose.connect(connectionString,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conexão bem-sucedida')
})
.catch((err) => {
    console.errror('Erro ao conectar ao banco', err)
})

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.post('/transactions', async (req, res) => {
    try {
        const transaction = new Transaction(req.body);
        await transaction.save();
        res.status(201).send(transaction);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.send(transactions);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/transactions', async (req, res) => {
    try {
      const { userId } = req.body; // Obtém o userId do corpo da solicitação
      const transactions = await Transaction.find({ userId });
      res.json(transactions);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      res.status(500).json({ message: 'Erro ao buscar transações' });
    }
  });
  

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
