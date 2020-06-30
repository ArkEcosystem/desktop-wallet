import { render } from "@testing-library/react";
import { i18n } from "app/i18n";
import React from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter as Router } from "react-router-dom";

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
				<I18nextProvider i18n={i18n}>
					<RepositoryModal isOpen repositories={repositories} handleClose={() => handleClose()} />,
				</I18nextProvider>
			</Router>,
		);

		expect(asFragment()).toMatchSnapshot();
	});
});
