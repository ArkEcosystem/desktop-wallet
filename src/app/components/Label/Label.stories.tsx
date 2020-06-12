import React from "react";
import { Label } from "./Label";

export default {
	title: "Basic / Label",
};

export const All = () => (
	<div className="space-x-4">
		<Label color="primary">Label</Label>
		<Label color="success">Label</Label>
		<Label color="danger">Label</Label>
		<Label color="warning">Label</Label>
		<Label color="neutral">Label</Label>
	</div>
);

export const Primary = () => (
	<div className="space-x-4">
		<Label color="primary">Label</Label>

		<Label color="primary" size="large">
			Large Label
		</Label>
	</div>
);

export const Success = () => (
	<div className="space-x-4">
		<Label color="success">Label</Label>

		<Label color="success" size="large">
			Large Label
		</Label>
	</div>
);

export const Danger = () => (
	<div className="space-x-4">
		<Label color="danger">Label</Label>

		<Label color="danger" size="large">
			Large Label
		</Label>
	</div>
);

export const Warning = () => (
	<div className="space-x-4">
		<Label color="warning">Label</Label>

		<Label color="warning" size="large">
			Large Label
		</Label>
	</div>
);

export const Neutral = () => (
	<div className="space-x-4">
		<Label color="neutral">Label</Label>

		<Label color="neutral" size="large">
			Large Label
		</Label>
	</div>
);
