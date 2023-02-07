import UnsuportedCurrencyError from "../error/UnsuportedCurrencyError";

export default class ExchangeRate {
  private rates: { [key: string]: number } = {};

  constructor(
    readonly baseCurrency: string = "EUR"
  ) {
    this.rates[baseCurrency] = 1;
  }

  addRate(currency: string, rate: number): void {
    this.rates[currency] = rate;
  }

  getRate(initialCurrency: string, currency: string): number {
    if (!this.rates[initialCurrency] || !this.rates[currency]) {
      throw new UnsuportedCurrencyError();
    }
    return this.rates[currency] / this.rates[initialCurrency];
  }
}