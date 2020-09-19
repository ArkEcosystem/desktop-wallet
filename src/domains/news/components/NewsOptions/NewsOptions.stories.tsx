import React from "react";

import { NewsOptions } from "./NewsOptions";

export default { title: "Domains / News / Components / News Options" };

export const Default = () => (
	<div className="max-w-sm">
		<NewsOptions selectedCategories={[]} selectedCoins={[]} onSubmit={() => void 0} />
	</div>
);
