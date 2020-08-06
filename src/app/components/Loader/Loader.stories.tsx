import React from "react";

import { Loader } from "./Loader";

export default { title: "App / Components / Loader" };

export const Default = () => (
	<div className="space-y-5 ml-2">
		<div className="my-4">Absolute position in relative container div</div>
		<div className="relative border-1 border-theme-neutral-500" style={{ width: 600, height: 400 }}>
			<Loader />
		</div>
	</div>
);

export const Fixed = () => (
	<div className="space-y-5">
		<Loader position="fixed" />
	</div>
);
