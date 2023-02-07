import TransactionService from "../../src/application/TransactionService";
import ExchangeRate from "../../src/domain/entity/ExchangeRate";
import ExchangeRateGateway from "../../src/infra/gateway/interface/ExchangeRateGateway";
import TransactionRepository from "../../src/infra/repository/interface/TransactionRepository";
import TransactionRepositoryInMemory from "../../src/infra/repository/TransactionRepositoryInMemory";

let transactionRepository: TransactionRepository;
let transactionService: TransactionService;
const userId = 1;


beforeAll(async function () {
  transactionRepository = new TransactionRepositoryInMemory();
  const exchangeRateGateway: ExchangeRateGateway = {
    async getExchangeRate(): Promise<ExchangeRate> {
      const exchangeRate = new ExchangeRate();
      exchangeRate.addRate("USD", 1.09);
      exchangeRate.addRate("BRL", 5.45);
      return exchangeRate;
    }
  }
  transactionService = new TransactionService(transactionRepository, exchangeRateGateway);
})

test("Should convert currency", async function () {
  const input = {
    userId,
    initialCurrency: "USD",
    initialAmount: 100,
    currency: "BRL",
  };
  const output = await transactionService.convert(input);
  expect(output.amount).toBe(500);
});

test("Should list transactions from specified user", async function () {
  const output = await transactionService.listByUser(userId);
  expect(output).toHaveLength(1);
  expect(output[0].amount).toBe(500);
});