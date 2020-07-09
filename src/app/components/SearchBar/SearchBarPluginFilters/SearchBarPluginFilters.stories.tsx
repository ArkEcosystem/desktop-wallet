import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SearchBarPluginFilters } from "./SearchBarPluginFilters";

export default {
	title: "App / Components / SearchBar / Plugin Filters",
	decorators: [withKnobs],
};

export const Default = () => {
	const categories = [
		{
			label: "Game",
			value: "game",
		},
		{
			label: "Utility",
			value: "utility",
		},
		{
			label: "Themes",
			value: "themes",
		},
		{
			label: "Other",
			value: "other",
		},
	];
	return <SearchBarPluginFilters categories={categories} ratings={[5, 4, 3, 2, 1]} />;
};
