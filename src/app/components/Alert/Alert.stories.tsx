import { select, text, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { Size } from "types";

import { Alert } from "./Alert";

export default {
	title: "App / Components / Alert",
	decorators: [withKnobs],
};

const sizeOptions: Record<string, Size | undefined> = {
	small: "sm",
	default: undefined,
	large: "lg",
};

export const Default = () => {
	const variant = select("Variant", ["info", "success", "warning", "danger", "hint"], "info");
	const size = select("Size", sizeOptions, undefined);
	const title = text("Title", "Title");

	return (
		<Alert variant={variant} size={size} title={title}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet fugit distinctio commodi, non sapiente
			doloribus ipsum adipisci fuga deleniti nostrum at hic deserunt incidunt veritatis temporibus corporis
			consequuntur eaque. Dolorem.
		</Alert>
	);
};
