import React from "react";
import { render } from "utils/testing-library";

import { FilePreview } from "./FilePreview";

describe("FilePreview", () => {
	const file = { content: "dfdf", extension: ".dwe", name: "filename" };

	it("should render", () => {
		const { asFragment } = render(<FilePreview file={file} />);
		expect(asFragment).toMatchSnapshot();
	});

	it("should not render without file prop", () => {
		const { asFragment } = render(<FilePreview />);
		expect(asFragment).toMatchSnapshot();
	});

	it("should render without borders", () => {
		const { asFragment } = render(<FilePreview useBorders={false} file={file} />);
		expect(asFragment).toMatchSnapshot();
	});

	it("should render loading variant", () => {
		const { asFragment } = render(<FilePreview file={file} variant="loading" />);
		expect(asFragment).toMatchSnapshot();
	});

	it("should render success variant", () => {
		const { asFragment } = render(<FilePreview file={file} variant="success" />);
		expect(asFragment).toMatchSnapshot();
	});

	it("should render danger variant", () => {
		const { asFragment } = render(<FilePreview file={file} variant="danger" />);
		expect(asFragment).toMatchSnapshot();
	});

	it("should show default file icon if not provided", () => {
		const customFile = { content: "dfdf", extension: ".custom", name: "filename" };
		const { asFragment } = render(<FilePreview file={customFile} variant="danger" />);
		expect(asFragment).toMatchSnapshot();
	});
});
