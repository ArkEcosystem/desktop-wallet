import React from "react";
import { renderWithRouter } from "testing-library";

import { RepositoryModal } from "./RepositoryModal";

describe("RepositoryModal", () => {
	const repositories = [
		{
			provider: "GitHub",
			url: "http://github.com/robank",
		},
		{
			provider: "GitLab",
			url: "http://gitlab.com/robank",
		},
		{
			provider: "BitBucket",
			url: "http://bitbucket.com/robank",
		},
		{
			provider: "Npm",
			url: "http://npmjs.com/robank",
		},
	];

	it("should render empty state", () => {
		const handleClose = jest.fn();

		const { asFragment } = renderWithRouter(
			<RepositoryModal isOpen repositories={repositories} handleClose={() => handleClose()} />,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
