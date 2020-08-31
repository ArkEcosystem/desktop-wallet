import { Profile, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Form } from "app/components/Form";
import React from "react";
import { useForm } from "react-hook-form";
import { env, getDefaultProfileId, render, waitFor } from "utils/testing-library";

import { BusinessRegistrationForm } from "./BusinessRegistrationForm";

describe("BusinessRegistrationForm", () => {
	let profile: Profile;
	let wallet: ReadWriteWallet;
	let feeOptions: Record<string, string>;

	beforeAll(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		wallet = profile.wallets().first();
		feeOptions = {
			last: (2 * 1e8).toFixed(0),
			min: "0",
			max: (10 * 1e8).toFixed(0),
			average: (1.354 * 1e8).toFixed(0),
		};
	});

	const Component = ({ activeTab }: { activeTab: number }) => {
		const form = useForm();
		const onSubmit = jest.fn();

		return (
			<Form context={form} onSubmit={onSubmit}>
				<BusinessRegistrationForm.component activeTab={activeTab} feeOptions={{}} wallet={wallet} />
			</Form>
		);
	};

	it("should render 2nd step", async () => {
		const { asFragment, getByTestId } = render(<Component activeTab={2} />);

		await waitFor(() => expect(getByTestId("BusinessRegistrationForm__step--second")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3nd step", async () => {
		const { asFragment, getByTestId } = render(<Component activeTab={3} />);

		await waitFor(() => expect(getByTestId("BusinessRegistrationForm__step--third")).toBeTruthy());
		expect(asFragment()).toMatchSnapshot();
	});
});
