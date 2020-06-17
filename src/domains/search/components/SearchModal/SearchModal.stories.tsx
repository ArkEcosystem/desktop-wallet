import { text, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { SearchModal } from "./SearchModal";

export default { title: "Search / Search Modal", decorators: [withKnobs] };

export const Default = () => {
	return <SearchModal isOpen={true} />;
};
