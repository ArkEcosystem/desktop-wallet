import React from "react";

import { EmptyResults } from "./EmptyResults";

export default { title: "App / Components / EmptyResults" };

export const Default = () => (
	<div className="ml-2 space-y-5">
		<div>
			<EmptyResults title="No results" subtitle="No results found. Refine your search and try again" />
		</div>
	</div>
);
