import { translations } from "app/i18n/common/i18n";
import React from "react";
import { fireEvent, render, screen } from "utils/testing-library";

import { ConfirmationModal } from "./ConfirmationModal";

describe("Confirmation Modal", () => {
	it("should render with default title and description", () => {
		const { container } = render(<ConfirmationModal isOpen />);

		expect(screen.getByText(translations.CONFIRMATION_MODAL.TITLE)).toBeInTheDocument();
		expect(screen.getByText(translations.CONFIRMATION_MODAL.DESCRIPTION)).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should render with custom title and description", () => {
		const title = "My Title";
		const description = "My Description";
		const { container } = render(<ConfirmationModal title={title} description={description} isOpen />);

		expect(screen.getByText(title)).toBeInTheDocument();
		expect(screen.getByText(description)).toBeInTheDocument();
		expect(container).toMatchSnapshot();
	});

	it("should trigger cancel", () => {
		const onCancel = jest.fn();

		render(<ConfirmationModal onCancel={onCancel} isOpen />);

		fireEvent.click(screen.getByText(translations.NO));

		expect(onCancel).toHaveBeenCalled();
	});

	it("should trigger confirm", () => {
		const onConfirm = jest.fn();

		render(<ConfirmationModal onConfirm={onConfirm} isOpen />);

		fireEvent.click(screen.getByText(translations.YES));

		expect(onConfirm).toHaveBeenCalled();
	});
});
