import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { searchData as data } from "../../data";
import { SearchHelp } from "./SearchHelp";

export default { title: "Domains / Help / Components / SearchHelp", decorators: [withKnobs] };

export const Default = () => {
	return <SearchHelp isOpen={true} data={data} />;
};
