import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Statement {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const balanceAccumulator = {
      income: 0,
      outcome: 0,
      total: 0,
      changeValue(transaction: Transaction): void {
        if (transaction.type === 'income') {
          this.income += transaction.value;
        } else {
          this.outcome += transaction.value;
        }

        this.total = this.income - this.outcome;
      },
    };

    return this.transactions.reduce((balance, transaction) => {
      balance.changeValue(transaction);

      return balance;
    }, balanceAccumulator);
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }

  public getStatement(): Statement {
    return {
      transactions: this.all(),
      balance: this.getBalance(),
    };
  }
}

export default TransactionsRepository;
