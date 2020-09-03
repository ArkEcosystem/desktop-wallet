import { Enums, ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { act, env, fireEvent, getDefaultProfileId, render, waitFor, within } from "testing-library";

import { EntityTable } from "./EntityTable";

let entityRegistrations: ExtendedTransactionData[];
let profile: Profile;

describe("EntityRegistrationsTable", () => {
	beforeAll(async () => {
		nock("https://dwallets.ark.io")
			.get("/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb")
			.reply(200, require("tests/fixtures/delegates/D5sRKWckH4rE1hQ9eeMeHAepgyC3cvJtwb.json"))
			.post("/api/transactions/search")
			.query(true)
			.reply(200, require("tests/fixtures/registrations/businesses.json"));

		profile = env.profiles().findById(getDefaultProfileId());

		const businesses = await profile.entityAggregate().registrations(Enums.EntityType.Business);
		entityRegistrations = businesses.items();
	});

	it("should render empty state", () => {
		const { getAllByTestId, asFragment } = render(<EntityTable entities={[]} />);

		expect(asFragment()).toMatchSnapshot();
		expect(() => getAllByTestId("EntityTableRowItem")).toThrow(/Unable to find an element by/);
	});

	it("should render registrations", async () => {
		const { getAllByTestId, asFragment } = render(<EntityTable entities={entityRegistrations} />);

		await waitFor(() => expect(getAllByTestId("EntityTableRowItem").length).toEqual(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle resign dropdown action", async () => {
		const onAction = jest.fn();
		const { asFragment, getAllByTestId } = render(
			<EntityTable entities={entityRegistrations} onAction={onAction} />,
		);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(getAllByTestId("EntityTableRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("EntityTableRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("EntityTableRowItem")[0]).getByTestId("dropdown__option--1");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({
			walletId: entityRegistrations[0].wallet().id(),
			txId: entityRegistrations[0].id(),
			action: "resign",
		});
	});

	it("should handle resign dropdown action", async () => {
		const onAction = jest.fn();
		const { asFragment, getAllByTestId } = render(
			<EntityTable entities={entityRegistrations} onAction={onAction} />,
		);
		expect(asFragment()).toMatchSnapshot();

		await waitFor(() => expect(getAllByTestId("EntityTableRowItem").length).toEqual(1));

		const dropdownToggle = within(getAllByTestId("EntityTableRowItem")[0]).getByTestId("dropdown__toggle");
		act(() => {
			fireEvent.click(dropdownToggle);
		});

		const resignOption = within(getAllByTestId("EntityTableRowItem")[0]).getByTestId("dropdown__option--0");
		act(() => {
			fireEvent.click(resignOption);
		});

		expect(onAction).toBeCalledWith({
			walletId: entityRegistrations[0].wallet().id(),
			txId: entityRegistrations[0].id(),
			action: "update",
		});
	});
});
