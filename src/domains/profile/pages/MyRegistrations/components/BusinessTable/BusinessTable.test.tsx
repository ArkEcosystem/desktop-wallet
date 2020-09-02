import { ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor, within } from "testing-library";

import { BusinessTable } from "./BusinessTable";

let businessRegistrations: ExtendedTransactionData[];
let profile: Profile;

describe("BusinessRegistrationsTable", () => {
	beforeAll(async () => {
		nock("https://dwallets.ark.io")
			.get("/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
			.reply(200, require("tests/fixtures/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"))
			.post("/api/transactions/search")
			.query(true)
			.reply(200, require("tests/fixtures/registrations/businesses.json"));

		profile = env.profiles().findById(getDefaultProfileId());

		const businesses = await profile.entityRegistrationAggregate().businesses();
		businessRegistrations = businesses.items();
	});

	it("should render empty state", () => {
		const { getAllByTestId, asFragment } = render(<BusinessTable businesses={[]} />);

		expect(asFragment()).toMatchSnapshot();
		expect(() => getAllByTestId("BusinessRegistrationRowItem")).toThrow(/Unable to find an element by/);
	});

	it("should render business registrations", async () => {
		const { getAllByTestId, asFragment } = render(<BusinessTable businesses={businessRegistrations} />);

		await waitFor(() => expect(getAllByTestId("BusinessRegistrationRowItem").length).toEqual(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle resign dropdown action", async () => {
		const onAction = jest.fn();
		const { asFragment, getAllByTestId } = render(
			<BusinessTable businesses={businessRegistrations} onAction={onAction} />,
		);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(getAllByTestId("BusinessRegistrationRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("BusinessRegistrationRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("BusinessRegistrationRowItem")[0]).getByTestId(
			"dropdown__option--1",
		);
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({
			walletId: businessRegistrations[0].wallet().id(),
			txId: businessRegistrations[0].id(),
			action: "resign",
		});
	});

	it("should handle resign dropdown action", async () => {
		const onAction = jest.fn();
		const { asFragment, getAllByTestId } = render(
			<BusinessTable businesses={businessRegistrations} onAction={onAction} />,
		);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(getAllByTestId("BusinessRegistrationRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("BusinessRegistrationRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("BusinessRegistrationRowItem")[0]).getByTestId(
			"dropdown__option--0",
		);
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({
			walletId: businessRegistrations[0].wallet().id(),
			txId: businessRegistrations[0].id(),
			action: "update",
		});
	});
});
