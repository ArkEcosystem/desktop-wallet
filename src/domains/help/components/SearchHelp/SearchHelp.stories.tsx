import { withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { searchData as data } from "../../data";
import { SearchHelp } from "./SearchHelp";

export default { title: "Search / Search Help", decorators: [withKnobs] };

export const Default = () => {
	return <SearchHelp isOpen={true} data={data} />;
};
