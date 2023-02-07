import Transaction from "../../src/domain/entity/Transaction";

test("Should create transaction", function () {
  const transaction = new Transaction(1, "USD", 100, "BRL", 5.09, new Date());
  expect(transaction.getConvertedAmount()).toBe(509);
});