import { Networks } from "@arkecosystem/platform-sdk";
import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { translations } from "domains/transaction/i18n";
import { describe } from "jest-circus";
import React, { useState } from "react";
import { env, render } from "utils/testing-library";

import { InputFee } from "./InputFee";
import { InputFeeProperties, InputFeeSimpleValue, InputFeeViewType } from "./InputFee.contracts";

const getDefaultProperties = (): InputFeeProperties => ({
	avg: 0.456,
	disabled: false,
	max: 0.5,
	min: 0.006,
	onChange: jest.fn(),
	onChangeSimpleValue: jest.fn(),
	onChangeViewType: jest.fn(),
	simpleValue: InputFeeSimpleValue.Average,
	step: 0.001,
	value: "0.3",
	viewType: InputFeeViewType.Simple,
});

let defaultProps: InputFeeProperties;
let network: Networks.Network;
let profile: Contracts.IProfile;
let Wrapper: React.FC;

describe("InputFee", () => {
	beforeEach(() => {
		profile = env.profiles().first();
		network = profile.wallets().first().network();

		defaultProps = {
			...getDefaultProperties(),
			network,
			profile,
		};

		// eslint-disable-next-line react/display-name
		Wrapper = () => {
			const [value, setValue] = useState(defaultProps.value);
			const [viewType, setViewType] = useState(defaultProps.viewType);
			const [simpleValue, setSimpleValue] = useState(defaultProps.simpleValue);

			const handleChangeValue = (newValue: string) => {
				setValue(newValue);
				defaultProps.onChange(newValue);
			};

			const handleChangeViewType = (newValue: InputFeeViewType) => {
				setViewType(newValue);
				defaultProps.onChangeViewType(newValue);
			};

			const handleChangeSimpleValue = (value_: InputFeeSimpleValue) => {
				setSimpleValue(value_);
				defaultProps.onChangeSimpleValue(value_);
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
		expect(screen.getByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should keep different values for simple and advanced view types", () => {
		const { asFragment } = render(<Wrapper />);

		// go to advanced mode and check value changes
		userEvent.click(screen.getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Advanced);
		expect(defaultProps.onChange).toBeCalledWith(defaultProps.value);

		expect(screen.getByTestId("InputCurrency")).toBeInTheDocument();
		expect(screen.queryByTestId("ButtonGroup")).not.toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		// go to simple mode
		userEvent.click(screen.getByText(translations.INPUT_FEE_VIEW_TYPE.SIMPLE));

		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Simple);
		expect(defaultProps.onChange).toBeCalledWith(defaultProps.avg.toString());

		expect(screen.queryByTestId("InputCurrency")).not.toBeInTheDocument();
		expect(screen.getByTestId("ButtonGroup")).toBeInTheDocument();
		expect(asFragment()).toMatchSnapshot();

		// go back to advanced mode and repeat checks
		userEvent.click(screen.getByText(translations.INPUT_FEE_VIEW_TYPE.ADVANCED));
		expect(defaultProps.onChangeViewType).toBeCalledWith(InputFeeViewType.Advanced);
		expect(defaultProps.onChange).toBeCalledWith(defaultProps.value);
	});

	describe("simple view type", () => {
		it.each([
			[translations.FEES.SLOW, getDefaultProperties().min],
			[translations.FEES.AVERAGE, getDefaultProperties().avg],
			[translations.FEES.FAST, getDefaultProperties().max],
		])("should update value when clicking button %s", (optionText, optionValue) => {
			const { asFragment } = render(<Wrapper />);

			userEvent.click(screen.getByText(optionText));
			expect(defaultProps.onChange).toHaveBeenCalledWith(optionValue.toString());
			expect(asFragment()).toMatchSnapshot();
		});

		it("should display converted values when on live net", () => {
			jest.spyOn(network, "isLive").mockReturnValueOnce(true);

			// use fiat currency for the converted balance
			jest.spyOn(profile.settings(), "get").mockReturnValue("EUR");

			const { asFragment } = render(<InputFee {...defaultProps} />);

			expect(screen.getAllByTestId("AmountCrypto")).toHaveLength(3);
			expect(screen.getAllByTestId("AmountFiat")).toHaveLength(3);
			expect(asFragment()).toMatchSnapshot();
		});
	});

	describe("advanced view type", () => {
		it("should allow to input a value", () => {
			defaultProps.viewType = InputFeeViewType.Advanced;
			const { asFragment } = render(<Wrapper />);

			const inputElement = screen.getByTestId("InputCurrency");
			expect(inputElement).toBeInTheDocument();

			act(() => {
				fireEvent.input(inputElement, { target: { value: "0.447" } });
			});

			expect(defaultProps.onChange).toHaveBeenCalledWith("0.447");
			expect(inputElement).toHaveValue("0.447");
			expect(asFragment()).toMatchSnapshot();
		});

		it("should use avg as the default value", () => {
			defaultProps.viewType = InputFeeViewType.Advanced;
			defaultProps.avg = 0.1234;
			defaultProps.value = undefined;

			render(<InputFee {...defaultProps} />);

			expect(screen.getByTestId("InputCurrency")).toHaveValue("0.1234");
		});
	});
});
