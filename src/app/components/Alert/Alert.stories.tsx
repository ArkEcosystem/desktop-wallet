import React from "react";
import { Alert } from "./Alert";
import { withKnobs, select, text } from "@storybook/addon-knobs";

export default {
	title: "Basic / Alert",
	decorators: [withKnobs],
};

export const Default = () => {
	const variant = select("Variant", ["primary", "success", "warning", "danger", "neutral"], "warning");
	const size = select("Size", ["small", "default", "large"], "default");
	const title = text("Title", "Titlle");

	return (
		<Alert variant={variant} size={size} title={title}>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda molestias voluptatibus minus eveniet
			cumque?
		</Alert>
	);
};
