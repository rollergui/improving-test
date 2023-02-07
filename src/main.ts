import TransactionService from "./application/TransactionService";
import ExchangeRateHttpGateway from "./infra/gateway/ExchangeRateHttpGateway";
import Controller from "./infra/http/Controller";
import TransactionRepositoryInMemory from "./infra/repository/TransactionRepositoryInMemory";

const transactionRepository = new TransactionRepositoryInMemory();
const exchangeRateGateway = new ExchangeRateHttpGateway();
const transactionService = new TransactionService(transactionRepository, exchangeRateGateway);
new Controller(transactionService);