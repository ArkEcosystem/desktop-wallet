import React from "react";
import { Spinner } from "./Spinner";

export default {
	title: "Basic / Spinner",
};

export const Primary = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="primary" size="small" />
		<Spinner color="primary" size="default" />
		<Spinner color="primary" size="large" />
	</div>
);

export const Success = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="success" size="small" />
		<Spinner color="success" size="default" />
		<Spinner color="success" size="large" />
	</div>
);

export const Danger = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="danger" size="small" />
		<Spinner color="danger" size="default" />
		<Spinner color="danger" size="large" />
	</div>
);

export const Warning = () => (
	<div className="inline-flex space-x-4">
		<Spinner color="warning" size="small" />
		<Spinner color="warning" size="default" />
		<Spinner color="warning" size="large" />
	</div>
);
