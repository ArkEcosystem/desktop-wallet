/* eslint-disable @typescript-eslint/require-await */
import { act, renderHook } from "@testing-library/react-hooks";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import nock from "nock";
import React from "react";
import { useForm } from "react-hook-form";
import { fireEvent, render, waitFor } from "testing-library";

import { InputAddress } from "./InputAddress";

const identityAddress = "DSzj2pHzzM2vks8JU181VsWpoUtLMrT9Sq";

describe("InputAddress", () => {
	beforeAll(() => {
		nock.disableNetConnect();

		nock("https://dwallets.ark.io")
			.get("/api/node/configuration")
			.reply(200, require("../../../tests/fixtures/coins/ark/configuration-devnet.json"))
			.get("/api/peers")
			.reply(200, require("../../../tests/fixtures/coins/ark/peers.json"))
			.get("/api/node/configuration/crypto")
			.reply(200, require("../../../tests/fixtures/coins/ark/cryptoConfiguration.json"))
			.get("/api/node/syncing")
			.reply(200, require("../../../tests/fixtures/coins/ark/syncing.json"))
			.get("/api/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib")
			.reply(200, require("../../../tests/fixtures/coins/ark/wallets/D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib.json"))
			.persist();
	});

	it("should render", () => {
		const { asFragment } = render(<InputAddress name="address" coin="ARK" network="devnet" />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should return an error message for invalid address", async () => {
		const { result: form } = renderHook(() => useForm({ mode: "onChange" }));
		const onSubmit = jest.fn();

		const { getByTestId, asFragment } = render(
			<Form context={form.current} onSubmit={onSubmit}>
				<FormField name="address">
					<FormLabel label="Address" />
					<InputAddress name="address" coin="ARK" network="devnet" isRequired />
					<FormHelperText />
				</FormField>
			</Form>,
		);

		await act(async () => {
			const addressInput = getByTestId("InputAddress__address-input");
			expect(addressInput).toBeTruthy();

			await fireEvent.input(addressInput, { target: { value: "123" } });

			await waitFor(() => {
				expect(form.current.getValues()).toEqual({ address: "123" });
			});

			await waitFor(() => {
				expect(form.current.errors.address.message).toEqual("The address is not valid");
			});

			expect(asFragment()).toMatchSnapshot();
		});
	});

	it("should return a valid address", async () => {
		const { result: form } = renderHook(() => useForm({ mode: "onChange" }));
		const onSubmit = jest.fn();

		const { getByTestId, asFragment } = render(
			<Form context={form.current} onSubmit={onSubmit}>
				<FormField name="address">
					<FormLabel label="Address" />
					<InputAddress name="address" coin="ARK" network="devnet" isRequired />
					<FormHelperText />
				</FormField>
			</Form>,
		);

		const addressInput = getByTestId("InputAddress__address-input");
		expect(addressInput).toBeTruthy();

		await act(async () => {
			fireEvent.input(addressInput, { target: { value: identityAddress } });
		});

		await waitFor(() => {
			expect(form.current.getValues()).toEqual({ address: identityAddress });
		});

		await waitFor(async () => {
			expect(form.current.errors.address).toEqual(undefined);
		});

		expect(asFragment()).toMatchSnapshot();
	});
});
