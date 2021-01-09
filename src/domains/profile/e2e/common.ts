import { Selector } from "testcafe";

export const goToProfile = async (t: any) => {
	await t.click(Selector("p").withText("John Doe"));
};
