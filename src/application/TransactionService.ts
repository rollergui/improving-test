import Transaction from "../domain/entity/Transaction";
import ExchangeRateGateway from "../infra/gateway/interface/ExchangeRateGateway";
import TransactionRepository from "../infra/repository/interface/TransactionRepository";

export default class TransactionService {
  constructor(
    readonly transactionRepository: TransactionRepository,
    readonly exchangeRateGateway: ExchangeRateGateway
  ) {}

  async convert(input: Input): Promise<Output> {
    const exchangeRate = await this.exchangeRateGateway.getExchangeRate();
    const transactionDate = new Date();
    const transaction = new Transaction(
      input.userId,
      input.initialCurrency,
      input.initialAmount,
      input.currency,
      exchangeRate.getRate(input.initialCurrency, input.currency),
      transactionDate
    );
    await this.transactionRepository.save(transaction);
    return {
      transactionId: transaction.transactionId,
      userId: input.userId,
      initialCurrency: input.initialCurrency,
      initialAmount: input.initialAmount,
      currency: input.currency,
      amount: transaction.getConvertedAmount(),
      exchangeRate: transaction.exchangeRate,
      transactionDate
    };
  }

  async listByUser(userId: number): Promise<Output[]> {
    const output = [];
    const transactions = await this.transactionRepository.getByUser(userId);
    for (const transaction of transactions) {
      output.push({...transaction, amount: transaction.getConvertedAmount()});
    }
    return output;
  }
}

type Input = {
  userId: number,
  initialCurrency: string,
  initialAmount: number,
  currency: string,
};

type Output = {
  transactionId: string,
  userId: number,
  initialCurrency: string,
  initialAmount: number,
  currency: string,
  amount: number,
  exchangeRate: number,
  transactionDate: Date
};
