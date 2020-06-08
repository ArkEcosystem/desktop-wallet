import React from "react";
import { addDecorator, addParameters } from "@storybook/react";
import { setIntlConfig, withIntl } from "storybook-addon-intl";
import StoryRouter from "storybook-react-router";
// Preview layout
import { Layout } from "./Layout";
// i18n
import { translations } from "../src/i18n";

const getMessages = (locale) => translations[locale];

setIntlConfig({
	locales: ["en-US"],
	defaultLocale: "en-US",
	getMessages,
});

addParameters({
	options: {
		showRoots: true,
	},
});

addDecorator(withIntl);
addDecorator(StoryRouter());
addDecorator((storyFn) => <Layout>{storyFn()}</Layout>);
