import axios from "axios";
import ExchangeRate from "../../domain/entity/ExchangeRate";
import ExternalServiceError from "../../domain/error/ExternalServiceError";
import ExchangeRateGateway from "./interface/ExchangeRateGateway";

export default class ExchangeRateHttpGateway implements ExchangeRateGateway {
  async getExchangeRate(): Promise<ExchangeRate> {
    const response = await axios.get(`https://api.exchangeratesapi.io/latest?access_key=API_KEY&base=EUR&symbols=JPY,USD,BRL`);
    const exchangeRateData = response.data;
    if (!exchangeRateData.success) {
      throw new ExternalServiceError("Exchange rates api error");
    }
    const exchangeRate = new ExchangeRate();
    for (const rate of Object.keys(exchangeRateData.rates)) {
      exchangeRate.addRate(rate, exchangeRateData.rates[rate]);
    }
    return exchangeRate;
  }
}