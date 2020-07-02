import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "test-utils";

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

		const { asFragment } = render(
			<Router>
				<RepositoryModal isOpen repositories={repositories} handleClose={() => handleClose()} />,
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
