import crypto from "crypto";
import InvalidAmountError from "../error/InvalidAmountError";

export default class Transaction {
  constructor(
    readonly userId: number,
    readonly initialCurrency: string,
    readonly initialAmount: number,
    readonly currency: string,
    readonly exchangeRate: number,
    readonly transactionDate: Date,
    readonly transactionId: string = crypto.randomUUID(),
  ) {
    if (initialAmount <= 0) throw new InvalidAmountError();
  }

  getConvertedAmount(): number {
    return this.initialAmount * this.exchangeRate;
  }
}