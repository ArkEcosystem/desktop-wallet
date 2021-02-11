import { Profile } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { Route } from "react-router-dom";
import { act, env, fireEvent, getDefaultProfileId, renderWithRouter } from "testing-library";

import { plugins } from "../../data";
import { translations } from "../../i18n";
import { AddBlacklistPlugin } from "./AddBlacklistPlugin";

let profile: Profile;
const addToBlackList = jest.fn();

describe("AddBlacklistPlugin", () => {
	beforeAll(() => {
		profile = env.profiles().findById(getDefaultProfileId());
	});

	it("should not render if not open", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<AddBlacklistPlugin handleBlacklist={addToBlackList} isOpen={false} plugins={[]} blacklisted={[]} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(() => getByTestId("modal__inner")).toThrow(/Unable to find an element by/);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should render a modal", () => {
		const { asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<AddBlacklistPlugin handleBlacklist={addToBlackList} isOpen={true} plugins={plugins} blacklisted={[]} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});

	it("should add plugin to the black list", () => {
		const { container, asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<AddBlacklistPlugin handleBlacklist={addToBlackList} isOpen={true} plugins={plugins} blacklisted={[]} />
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION);
		expect(container.querySelectorAll("table > tbody > tr").length).toEqual(plugins.length);

		act(() => {
			fireEvent.click(getByTestId(`AddBlackListPlugin__btn-${plugins[1].id}`));
		});

		expect(addToBlackList).toHaveBeenCalled();

		expect(asFragment()).toMatchSnapshot();
	});

	it("should filter plugins with black list", () => {
		const { container, asFragment, getByTestId } = renderWithRouter(
			<Route path="/profiles/:profileId/settings">
				<AddBlacklistPlugin
					handleBlacklist={addToBlackList}
					isOpen={true}
					plugins={plugins}
					blacklisted={plugins}
				/>
			</Route>,
			{
				routes: [`/profiles/${profile.id()}/settings`],
			},
		);

		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.TITLE);
		expect(getByTestId("modal__inner")).toHaveTextContent(translations.MODAL_ADD_BLACKLIST_PLUGIN.DESCRIPTION);
		expect(asFragment()).toMatchSnapshot();
	});
});
