import { Enums, ExtendedTransactionData, Profile } from "@arkecosystem/platform-sdk-profiles";
import nock from "nock";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render, waitFor } from "testing-library";

import { EntityTableRowItem } from "./EntityTableRowItem";

let profile: Profile;
let entityRegistrations: ExtendedTransactionData[];

describe("EntityTableRowItem", () => {
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

	it("should render", async () => {
		const { asFragment, queryAllByTestId } = render(
			<table>
				<tbody>
					<EntityTableRowItem entity={entityRegistrations[0]} />
				</tbody>
			</table>,
		);

		await waitFor(() => expect(queryAllByTestId("TableRow")).toHaveLength(1));
		expect(asFragment()).toMatchSnapshot();
	});

	it("should set shadow color on mouse events", () => {
		const setState = jest.fn();
		const useStateSpy = jest.spyOn(React, "useState");

		useStateSpy.mockImplementation((state) => [state, setState]);

		const { getByTestId } = render(
			<table>
				<tbody>
					<EntityTableRowItem entity={entityRegistrations[0]} />
				</tbody>
			</table>,
		);

		fireEvent.mouseEnter(getByTestId("TableRow"));
		fireEvent.mouseLeave(getByTestId("TableRow"));

		expect(setState).toHaveBeenCalledWith("--theme-color-neutral-100");
		expect(setState).toHaveBeenCalledWith("");
	});
});
