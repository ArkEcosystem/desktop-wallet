import { select, withKnobs } from "@storybook/addon-knobs";
import React, { useState } from "react";

import { Pagination } from "./Pagination";

export default { title: "App / Components / Pagination", decorators: [withKnobs] };

export const Default = () => {
	const [currentPage, selectPage] = useState(1);

	return (
		<Pagination
			totalCount={12}
			itemsPerPage={4}
			onSelectPage={selectPage}
			currentPage={currentPage}
			variant={select("Variant", ["condensed", undefined], undefined)}
		/>
	);
};
