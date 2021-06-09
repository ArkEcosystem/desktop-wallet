import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { InputFee } from "domains/transaction/components/InputFee";
import { describe } from "jest-circus";
import React, { useState } from "react";
import { act, env, fireEvent, render } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";

let defaultProps: any = {
	min: "0.006",
	max: "0.5",
	avg: "0.456",
	value: "0.3",
	step: 0.001,
	showFeeOptions: true,
};

let network: Networks.Network;
let profile: Contracts.IProfile;
let Wrapper: React.FC;

describe("InputFee", () => {
	beforeAll(() => {
		profile = env.profiles().first();
		network = profile.wallets().first().network();

		defaultProps = {
			...defaultProps,
			onChange: jest.fn(),
			network,
			profile,
		};

		// eslint-disable-next-line react/display-name
		Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);

			const handleChange = (val: string) => {
				setValue(val);
				defaultProps.onChange(val);
			};

			return <InputFee {...defaultProps} value={value} onChange={handleChange} />;
		};
	});

	it("should render in simple view type by default", () => {
		const { asFragment, queryByTestId } = render(<InputFee {...defaultProps} />);

		expect(queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(queryByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should allow switching between simple and advanced view types", () => {
		const { asFragment, queryByTestId, getByText } = render(<InputFee {...defaultProps} />);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		});

		expect(queryByTestId("InputCurrency")).toBeInTheDocument();
		expect(queryByTestId("ButtonGroup")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.SIMPLE));
		});

		expect(queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(queryByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("simple view type", () => {
		const options = [
			{ text: transactionTranslations.FEES.SLOW, value: defaultProps.min },
			{ text: transactionTranslations.FEES.AVERAGE, value: defaultProps.avg },
			{ text: transactionTranslations.FEES.FAST, value: defaultProps.max },
		];

		it.each(options)("should update when clicking a simple option", (option) => {
			const { asFragment, getByText } = render(<Wrapper />);

			act(() => {
				fireEvent.click(getByText(option.text));
			});

			expect(defaultProps.onChange).toHaveBeenCalledWith(option.value);
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe("advanced view type", () => {
		it("should allow to input a value", () => {
			const { asFragment, getByText, getByTestId, queryByTestId } = render(<Wrapper />);

			act(() => {
				fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
			});

			expect(queryByTestId("InputCurrency")).toBeInTheDocument();

			const inputEl = getByTestId("InputCurrency");

			act(() => {
				fireEvent.input(inputEl, { target: { value: "0.447" } });
			});

			expect(defaultProps.onChange).toHaveBeenCalledWith("0.447");
			expect(inputEl).toHaveValue("0.447");
			expect(asFragment()).toMatchSnapshot();
		});
	});
});
