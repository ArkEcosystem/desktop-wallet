import { translations as COMMON } from "app/i18n/common/i18n";
import React from "react";
import { act, fireEvent, render } from "test-utils";

import { translations as PLUGINS } from "../../i18n";
import { InstallPlugin } from "./InstallPlugin";

describe("InstallPlugin", () => {
	it("should not render if not open", () => {
		const { asFragment, getByTestId } = render(<InstallPlugin isOpen={false} />);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = render(<InstallPlugin isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(PLUGINS.MODAL_INSTALL_PLUGIN.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should handle download action", () => {
		const handleDownload = jest.fn();

		const { asFragment, getByTestId, rerender } = render(
			<InstallPlugin step={1} isOpen={true} onDownload={handleDownload} />,
		);

		act(() => {
			fireEvent.click(getByTestId("install-plugin__download-button"));
		});

		expect(handleDownload).toHaveBeenCalled();
		expect(getByTestId("modal__inner")).toHaveTextContent(COMMON.ATTENTION);
		expect(asFragment()).toMatchSnapshot();

		rerender(<InstallPlugin step={2} isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(COMMON.DOWNLOADED);
		expect(asFragment()).toMatchSnapshot();

		rerender(<InstallPlugin step={3} isOpen={true} />);

		expect(getByTestId("modal__inner")).toHaveTextContent(COMMON.DOWNLOADED);
		expect(asFragment()).toMatchSnapshot();
	});
});
