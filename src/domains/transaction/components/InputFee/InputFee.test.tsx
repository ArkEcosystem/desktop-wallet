import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { InputFee, InputFeeViewType } from "domains/transaction/components/InputFee";
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
	disabled: false,
	viewType: InputFeeViewType.Simple,
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
			onChangeViewType: jest.fn(),
			network,
			profile,
		};

		// eslint-disable-next-line react/display-name
		Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);
			const [viewType, setViewType] = useState(defaultProps.viewType);

			const handleChangeValue = (val: string) => {
				setValue(val);
				defaultProps.onChange(val);
			};

			const handleChangeViewType = (val: string) => {
				setViewType(val);
				defaultProps.onChangeViewType(val);
			};

			return (
				<InputFee
					{...defaultProps}
					value={value}
					onChange={handleChangeValue}
					viewType={viewType}
					onChangeViewType={handleChangeViewType}
				/>
			);
		};
	});

	it("should render", () => {
		const { asFragment, queryByTestId } = render(<InputFee {...defaultProps} />);

		expect(queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(queryByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should allow switching between simple and advanced view types", () => {
		const { asFragment, queryByTestId, getByText } = render(<Wrapper />);

		act(() => {
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		});

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Advanced);
		expect(queryByTestId("InputCurrency")).toBeInTheDocument();
		expect(queryByTestId("ButtonGroup")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		act(() => {
			fireEvent.click(getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.SIMPLE));
		});

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Simple);
		expect(queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(queryByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	describe("simple view type", () => {
		it.each([
			[transactionTranslations.FEES.SLOW, defaultProps.min],
			[transactionTranslations.FEES.AVERAGE, defaultProps.avg],
			[transactionTranslations.FEES.FAST, defaultProps.max],
		])("should update value when clicking button %s", (optionText, optionValue) => {
			const { asFragment, getByText } = render(<Wrapper />);

			act(() => {
				fireEvent.click(getByText(optionText));
			});

			expect(defaultProps.onChange).toHaveBeenCalledWith(optionValue);
			expect(asFragment()).toMatchSnapshot();
		});

		it("should display converted values when on live net", () => {
			jest.spyOn(network, "isLive").mockReturnValueOnce(true);

			const { asFragment, queryAllByTestId } = render(<Wrapper />);

			expect(queryAllByTestId("Amount")).toHaveLength(3);
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe("advanced view type", () => {
		it("should allow to input a value", () => {
			defaultProps.viewType = InputFeeViewType.Advanced;
			const { asFragment, getByTestId } = render(<Wrapper />);

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
