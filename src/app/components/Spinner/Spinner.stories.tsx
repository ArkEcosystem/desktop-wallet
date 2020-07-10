import React from "react";

import { Spinner } from "./Spinner";

export default {
	title: "App / Components / Spinner",
};

export const Primary = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="primary" size="sm" />
		<Spinner color="primary" />
		<Spinner color="primary" size="lg" />
	</div>
);

export const Success = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="success" size="sm" />
		<Spinner color="success" />
		<Spinner color="success" size="lg" />
	</div>
);

export const Danger = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="danger" size="sm" />
		<Spinner color="danger" />
		<Spinner color="danger" size="lg" />
	</div>
);

export const Warning = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="warning" size="sm" />
		<Spinner color="warning" />
		<Spinner color="warning" size="lg" />
	</div>
);
