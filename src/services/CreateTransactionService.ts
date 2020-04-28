import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction, { TransactionType } from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  type: string;
  value: number;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, type, value }: CreateTransactionDTO): Transaction {
    if (!value) {
      throw Error('A transaction should have a significative value');
    }

    if (!['income', 'outcome'].includes(type)) {
      throw Error('Invalid Transaction type');
    }

    const balance = this.transactionsRepository.getBalance();
    if (type === 'outcome' && Math.abs(value) > balance.total) {
      throw Error('Cannot retrieve an amount greater than your funds');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type: type as TransactionType,
    });

    return transaction;
  }
}

export default CreateTransactionService;
