import ExchangeRate from "../../src/domain/entity/ExchangeRate";

test("Should create exchange rate object", function () {
  const exchangeRate = new ExchangeRate();
  exchangeRate.addRate("USD", 1.09);
  exchangeRate.addRate("BRL", 5.45);
  expect(exchangeRate.getRate("USD", "BRL")).toBe(5);
});