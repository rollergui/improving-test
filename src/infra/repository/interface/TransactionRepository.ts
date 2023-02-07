import Transaction from "../../../domain/entity/Transaction";

export default interface TransactionRepository {
  save(transaction: Transaction): Promise<void>;
  getByUser(userId: number): Promise<Transaction[]>;
}