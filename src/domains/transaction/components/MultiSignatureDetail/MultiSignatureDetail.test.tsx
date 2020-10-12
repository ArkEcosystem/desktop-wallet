import { renderHook } from "@testing-library/react-hooks";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { TransactionFixture } from "tests/fixtures/transactions";
import { act, fireEvent, render } from "utils/testing-library";

// i18n
import { translations } from "../../i18n";
import { MultiSignatureDetail } from "./MultiSignatureDetail";
import { FirstStep } from "./Step1";
import { ThirdStep } from "./Step3";

describe("MultiSignatureDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<MultiSignatureDetail transaction={TransactionFixture} isOpen={false} onCancel={() => void 0} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it.only("should render a modal and get to step 3", async () => {
		const { asFragment, findByTestId, getByTestId } = render(
			<MultiSignatureDetail transaction={TransactionFixture} isOpen={true} onCancel={() => void 0} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_MULTISIGNATURE_DETAIL.STEP_1.TITLE);
		expect(asFragment()).toMatchSnapshot();

		const signButton = getByTestId("MultiSignatureDetail__sign-button");

		act(() => {
			fireEvent.click(signButton);
		});
		const secondStepNode = await findByTestId("MultiSignatureDetail__second-step");
		expect(secondStepNode).toBeTruthy();

		act(() => {
			fireEvent.keyUp(getByTestId("import-wallet__passphrase-input"), { key: "A", code: "KeyA" });
			fireEvent.click(signButton);
		});
		const thirdStepNode = await findByTestId("MultiSignatureDetail__third-step");
		const successBannerElem = await findByTestId("MultiSignatureDetail__success-banner");
		expect(thirdStepNode).toBeTruthy();
		expect(successBannerElem).toBeTruthy();
	});

	it("should render a modal and go back", async () => {
		const { asFragment, findByTestId, getByTestId } = render(
			<MultiSignatureDetail transaction={TransactionFixture} isOpen={true} onCancel={() => void 0} />,
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_MULTISIGNATURE_DETAIL.STEP_1.TITLE);
		expect(asFragment()).toMatchSnapshot();

		const signButton = getByTestId("MultiSignatureDetail__sign-button");
		const backButton = getByTestId("MultiSignatureDetail__back-button");

		act(() => {
			fireEvent.click(signButton);
		});
		const secondStepNode = await findByTestId("MultiSignatureDetail__second-step");
		expect(secondStepNode).toBeTruthy();

		act(() => {
			fireEvent.click(backButton);
		});
		const firstStepNode = await findByTestId("MultiSignatureDetail__first-step");
		expect(firstStepNode).toBeTruthy();
	});

	it("should render 1st step", () => {
		const { asFragment, getByTestId } = render(<FirstStep transaction={TransactionFixture} />);

		expect(getByTestId("MultiSignatureDetail__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", () => {
		const { result: form } = renderHook(() => useForm());

		const { asFragment, getByTestId } = render(
			<FormProvider {...form.current}>
				<SecondStep />
			</FormProvider>,
		);

		expect(getByTestId("MultiSignatureDetail__second-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", () => {
		const { asFragment, getByTestId } = render(<ThirdStep transaction={TransactionFixture} />);

		expect(getByTestId("MultiSignatureDetail__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
