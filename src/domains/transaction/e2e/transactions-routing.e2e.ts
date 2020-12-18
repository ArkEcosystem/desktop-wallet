import { createFixture } from "../../../utils/e2e-utils";
import { goToWallet } from "../../wallet/e2e/common";
import { goToDelegateResignationPage, goToTransferPage } from "./common";

createFixture(`Transactions routing`);

test("should navigate to transfer page", async (t) => {
	await goToWallet(t);
	await goToTransferPage(t);
});

test("should navigate to delegate resignation page", async (t) => {
	await goToWallet(t, "D9YiyRYMBS2ofzqkufjrkB9nHofWgJLM7f");
	await goToDelegateResignationPage(t);
});
