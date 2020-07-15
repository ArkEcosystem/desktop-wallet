import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { pluginData, reviewData } from "../../data";
import { PluginDetails } from "./PluginDetails";

export default { title: "Domains / Plugin / Pages / PluginDetails", decorators: [withKnobs] };

const isInstalled = boolean("Is Installed?", false);

export const Default = () => (
	<PluginDetails pluginData={pluginData} reviewData={reviewData} isInstalled={isInstalled} />
);
