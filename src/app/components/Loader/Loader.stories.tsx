import React from "react";

import { Loader } from "./Loader";

export default { title: "App / Components / Loader" };

export const Default = () => (
	<div className="ml-2 space-y-5">
		<div className="my-4">Absolute position in relative container div</div>
		<div className="relative border border-theme-neutral-500" style={{ width: 600, height: 400 }}>
			<Loader />
		</div>
	</div>
);
