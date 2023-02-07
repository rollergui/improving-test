import ExchangeRate from "../../../domain/entity/ExchangeRate";

export default interface ExchangeRateGateway {
  getExchangeRate(): Promise<ExchangeRate>;
}