import { createFixture, mockRequest } from "../../../utils/e2e-utils";
import { goToProfile } from "../../profile/e2e/common";
import { goToWallet, importWalletByAddress } from "../../wallet/e2e/common";
import { goToDelegateResignationPage, goToTransferPage } from "./common";

createFixture(`Transactions routing`, [
	mockRequest("https://dwallets.ark.io/api/wallets/DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS", {
		data: {
			address: "DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS",
			publicKey: "02e012f0a7cac12a74bdc17d844cbc9f637177b470019c32a53cef94c7a56e2ea9",
			nonce: "1",
			balance: "10000000000",
			attributes: {
				delegate: {
					username: "testwallet",
				},
			},
			isDelegate: true,
			isResigned: false,
		},
	}),
]);

test("should navigate to transfer page", async (t) => {
	await goToProfile(t);
	await goToWallet(t);
	await goToTransferPage(t);
});

test("should navigate to delegate resignation page", async (t) => {
	await goToProfile(t);
	await importWalletByAddress(t, "DDA5nM7KEqLeTtQKv5qGgcnc6dpNBKJNTS");
	await goToDelegateResignationPage(t);
});
