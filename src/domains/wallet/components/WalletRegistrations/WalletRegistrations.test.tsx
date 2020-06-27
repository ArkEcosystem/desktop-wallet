import { act, fireEvent, render } from "@testing-library/react";
import React from "react";

import { WalletRegistrations } from "./WalletRegistrations";

describe.only("WalletRegistrations", () => {
	it("should render blank", () => {
		const { asFragment } = render(<WalletRegistrations address="abc" />);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should emit actions", () => {
		const onShowAll = jest.fn();
		const onRegister = jest.fn();

		const { getByTestId } = render(
			<WalletRegistrations address="abc" onShowAll={onShowAll} onRegister={onRegister} />,
		);
		fireEvent.click(getByTestId("WalletRegistrations__show-all"));
		fireEvent.click(getByTestId("WalletRegistrations__register"));
		expect(onShowAll).toHaveBeenCalled();
		expect(onRegister).toHaveBeenCalled();
	});

	it("should render closed", () => {
		const { getByTestId } = render(<WalletRegistrations address="abc" defaultIsOpen={false} />);
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should toggle", () => {
		const { getByTestId } = render(<WalletRegistrations address="abc" />);
		act(() => {
			fireEvent.click(getByTestId("WalletRegistrations__toggle"));
		});
		expect(getByTestId("Collapse")).toHaveAttribute("aria-hidden", "true");
	});

	it("should show icons list", () => {
		const { getAllByTestId, asFragment } = render(
			<WalletRegistrations address="abc" hasSecondSignature isMultisig />,
		);
		expect(getAllByTestId("WalletRegistrations__icon-list__icon")).toHaveLength(2);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show icons list with rest", () => {
		const { getByTestId } = render(
			<WalletRegistrations address="abc" hasPlugins={true} isMultisig hasSecondSignature hasBridgechains />,
		);
		expect(getByTestId("WalletRegistrations__icon-list__rest")).toHaveTextContent("+2");
	});

	it("should show delegate", () => {
		const { getByTestId, asFragment } = render(
			<WalletRegistrations address="abc" delegate={{ username: "Test" }} />,
		);
		expect(getByTestId("WalletRegistrations__delegate")).toHaveTextContent("Test");
		expect(asFragment()).toMatchSnapshot();
	});

	it("should show business", () => {
		const { getByTestId } = render(<WalletRegistrations address="abc" business={{ name: "Test" }} />);
		expect(getByTestId("WalletRegistrations__business")).toHaveTextContent("Test");
	});
});
