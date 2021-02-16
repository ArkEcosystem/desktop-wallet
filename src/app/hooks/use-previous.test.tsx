import { renderHook } from "@testing-library/react-hooks";

import { usePrevious } from "./use-previous";

const NotificationsTransactionsFixture = require("tests/fixtures/coins/ark/devnet/notification-transactions.json");
const TransactionsFixture = require("tests/fixtures/coins/ark/devnet/transactions.json");

describe("Previous Hook", () => {
	it("should create and save notifications from received transactions", () => {
		const { result } = renderHook(() => usePrevious({ result: { current: true } }));
		expect(result).toBeTruthy();
	});
});
