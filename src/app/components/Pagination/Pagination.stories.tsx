import { select, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { Pagination } from "./Pagination";

export default { title: "App / Components / Pagination", decorators: [withKnobs] };

export const Default = () => (
	<Pagination
		totalCount={12}
		itemsPerPage={4}
		onSelectPage={console.log}
		currentPage={1}
		size={select("Size", ["sm", "md", "lg"], "md")}
	/>
);
