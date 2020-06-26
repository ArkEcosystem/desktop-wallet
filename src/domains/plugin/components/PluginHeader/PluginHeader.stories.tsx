import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { PluginHeader } from "./PluginHeader";

export default { title: "Plugins / Components / Plugin Header", decorators: [withKnobs] };

export const Default = () => {
	const author = text("Author", "ARK Ecosystem");
	const category = text("Category", "Utility");
	const url = text("URL", "github.com");
	const rating = text("Rating", "4.6");
	const version = text("Version", "1.3.8");
	const size = text("Size", "4.2");
	const isInstalled = boolean("Is installed", false);

	return (
		<PluginHeader
			author={author}
			category={category}
			url={url}
			rating={rating}
			version={version}
			size={size}
			isInstalled={isInstalled}
		/>
	);
};
