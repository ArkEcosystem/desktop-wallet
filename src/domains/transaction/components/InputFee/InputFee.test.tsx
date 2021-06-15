import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { screen } from "@testing-library/react";
import { describe } from "jest-circus";
import React, { useState } from "react";
import { act, env, fireEvent, render } from "utils/testing-library";

import { translations as transactionTranslations } from "../../i18n";
import { InputFee } from "./InputFee";
import { InputFeeSimpleValue, InputFeeViewType } from "./InputFee.utils";

let defaultProps: any = {
	min: "0.006",
	max: "0.5",
	avg: "0.456",
	value: "0.3",
	step: 0.001,
	disabled: false,
	viewType: InputFeeViewType.Simple,
	simpleValue: InputFeeSimpleValue.Average,
	onChange: jest.fn(),
	onChangeViewType: jest.fn(),
	onChangeSimpleValue: jest.fn(),
};

let network: Networks.Network;
let profile: Contracts.IProfile;
let Wrapper: React.FC;

describe("InputFee", () => {
	beforeEach(() => {
		profile = env.profiles().first();
		network = profile.wallets().first().network();

		defaultProps = {
			...defaultProps,
			network,
			profile,
		};

		// eslint-disable-next-line react/display-name
		Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);
			const [viewType, setViewType] = useState(defaultProps.viewType);
			const [simpleValue, setSimpleValue] = useState(defaultProps.simpleValue);

			const handleChangeValue = (val: string) => {
				setValue(val);
				defaultProps.onChange(val);
			};

			const handleChangeViewType = (val: InputFeeViewType) => {
				setViewType(val);
				defaultProps.onChangeViewType(val);
			};

			const handleChangeSimpleValue = (val: InputFeeSimpleValue) => {
				setSimpleValue(val);
				defaultProps.onChangeSimpleValue(val);
			};

			return (
				<InputFee
					{...defaultProps}
					value={value}
					onChange={handleChangeValue}
					viewType={viewType}
					onChangeViewType={handleChangeViewType}
					simpleValue={simpleValue}
					onChangeSimpleValue={handleChangeSimpleValue}
				/>
			);
		};
	});

	it("should render", () => {
		const { asFragment } = render(<InputFee {...defaultProps} />);

		expect(screen.queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(screen.queryByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should keep different values for simple and advanced view types", () => {
		const { asFragment } = render(<Wrapper />);

		// go to advanced mode and check value changes
		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		});

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Advanced);
		expect(defaultProps.onChange).toBeCalledWith(defaultProps.value);

		expect(screen.queryByTestId("InputCurrency")).toBeInTheDocument();
		expect(screen.queryByTestId("ButtonGroup")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		// go to simple mode
		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.SIMPLE));
		});

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Simple);
		expect(defaultProps.onChange).toBeCalledWith(defaultProps.avg);

		expect(screen.queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(screen.queryByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		// go back to advanced mode and repeat checks
		act(() => {
			fireEvent.click(screen.getByText(transactionTranslations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		});

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Advanced);
		expect(defaultProps.onChange).toBeCalledWith(defaultProps.value);
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
