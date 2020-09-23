import { Contracts } from "@arkecosystem/platform-sdk";
import { Enums } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { env, fireEvent, getDefaultProfileId, render } from "testing-library";

import { WalletRegistrations } from "./WalletRegistrations";

const delegate = {
	username: "test",
	isResigned: false,
};

let entities: Contracts.Entity[];

const businessEntity = {
	id: "id",
	type: Enums.EntityType.Business,
	subType: Enums.EntitySubType.None,
	name: "my business",
	hash: "hash",
};

const pluginEntity = {
	id: "id",
	type: Enums.EntityType.Plugin,
	subType: Enums.EntitySubType.None,
	name: "my business",
	hash: "hash",
};

const developerEntity = {
	id: "id",
	type: Enums.EntityType.Developer,
	subType: Enums.EntitySubType.None,
	name: "my business",
	hash: "hash",
};

describe("WalletRegistrations", () => {
	beforeEach(() => {
		const profile = env.profiles().findById(getDefaultProfileId());
		const wallet = profile.wallets().findById("ac38fe6d-4b67-4ef1-85be-17c5f6841129");

		entities = [businessEntity, pluginEntity, developerEntity];
	});

	it("should emit actions (register)", () => {
		const onButtonClick = jest.fn();

		const { getByTestId } = render(<WalletRegistrations entities={[]} onButtonClick={onButtonClick} />);

		fireEvent.click(getByTestId("WalletRegistrations__button"));

		expect(onButtonClick).toHaveBeenCalledWith(true);
	});

	it("should emit actions (show all)", () => {
		const onButtonClick = jest.fn();

		const { getByTestId } = render(
			<WalletRegistrations delegate={delegate} entities={entities} onButtonClick={onButtonClick} />,
		);

		fireEvent.click(getByTestId("WalletRegistrations__button"));

		expect(onButtonClick).toHaveBeenCalled();
	});

	it("should render loading state", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations isLoading={true} />);

		expect(getByTestId("WalletRegistrations__skeleton")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render inactive icons without a second signature registration", () => {
		const { getByTestId, asFragment } = render(
			<WalletRegistrations delegate={delegate} isSecondSignature={false} />,
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render inactive icons withour a multi signature registration", () => {
		const { getByTestId, asFragment } = render(
			<WalletRegistrations delegate={delegate} isSecondSignature isMultiSignature={false} />,
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render inactive icons when there are no entity registrations", () => {
		const { getByTestId, asFragment } = render(
			<WalletRegistrations delegate={delegate} isSecondSignature isMultiSignature entities={[]} />,
		);

		expect(getByTestId("WalletRegistrations__inactive")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show delegate icon", () => {
		const { getByText, asFragment } = render(<WalletRegistrations delegate={delegate} />);

		expect(getByText("delegate.svg")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show resigned delegate icon", () => {
		const { getByText, asFragment } = render(<WalletRegistrations delegate={{ ...delegate, isResigned: true }} />);

		expect(getByText("delegate-resigned.svg")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show business icon", () => {
		const { getAllByText, getByText, asFragment } = render(<WalletRegistrations entities={entities} />);

		expect(getAllByText("business.svg")).toHaveLength(1);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show business icon for multiple business entities", () => {
		const { getAllByText, getByText, asFragment } = render(
			<WalletRegistrations entities={[businessEntity, businessEntity]} />,
		);

		expect(getAllByText("business.svg")).toHaveLength(1);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show plugin icon", () => {
		const { getAllByText, getByText, asFragment } = render(<WalletRegistrations entities={entities} />);

		expect(getAllByText("plugin.svg")).toHaveLength(1);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show plugin icon for multiple plugin entities", () => {
		const { getAllByText, getByText, asFragment } = render(
			<WalletRegistrations entities={[pluginEntity, pluginEntity]} />,
		);

		expect(getAllByText("plugin.svg")).toHaveLength(1);

		expect(asFragment()).toMatchSnapshot();
	});

	it("should show generic icon", () => {
		const { getByText, asFragment } = render(<WalletRegistrations entities={[developerEntity]} />);

		expect(getByText("+1")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should render empty mode", () => {
		const { getByTestId, asFragment } = render(<WalletRegistrations />);

		expect(getByTestId("WalletRegistrations__empty")).toBeTruthy();

		expect(asFragment()).toMatchSnapshot();
	});
});
