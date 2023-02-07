import Transaction from "../../domain/entity/Transaction";
import TransactionRepository from "./interface/TransactionRepository";

export default class TransactionRepositoryInMemory implements TransactionRepository {
  transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  async save(transaction: Transaction): Promise<void> {
    this.transactions.push(transaction);
  }

  async getByUser(userId: number): Promise<Transaction[]> {
    return this.transactions.filter(transaction => transaction.userId === userId);
  }
}