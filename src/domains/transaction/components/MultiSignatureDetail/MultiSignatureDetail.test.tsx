import { act, fireEvent, render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { i18n } from "app/i18n";
import React from "react";
import { FormContext, useForm } from "react-hook-form";
import { I18nextProvider } from "react-i18next";

// i18n
import { translations } from "../../i18n";
import { FirstStep, MultiSignatureDetail, SecondStep, ThirdStep } from "./MultiSignatureDetail";

describe("MultiSignatureDetail", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<MultiSignatureDetail isOpen={false} onCancel={() => void 0} />
			</I18nextProvider>,
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal and get to step 3", async () => {
		const { asFragment, findByTestId, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<MultiSignatureDetail isOpen={true} onCancel={() => void 0} />
			</I18nextProvider>,
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
			<I18nextProvider i18n={i18n}>
				<MultiSignatureDetail isOpen={true} onCancel={() => void 0} />
			</I18nextProvider>,
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
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<FirstStep />
			</I18nextProvider>,
		);

		expect(getByTestId("MultiSignatureDetail__first-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 2nd step", () => {
		const { result: form } = renderHook(() => useForm());

		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<FormContext {...form.current}>
					<SecondStep />
				</FormContext>
				,
			</I18nextProvider>,
		);

		expect(getByTestId("MultiSignatureDetail__second-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render 3rd step", () => {
		const { asFragment, getByTestId } = render(
			<I18nextProvider i18n={i18n}>
				<ThirdStep />
			</I18nextProvider>,
		);

		expect(getByTestId("MultiSignatureDetail__third-step")).toBeTruthy();
		expect(asFragment()).toMatchSnapshot();
	});
});
