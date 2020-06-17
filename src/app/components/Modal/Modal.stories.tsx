import { boolean, text, withKnobs } from "@storybook/addon-knobs";
import { Button } from "app/components/Button";
import React from "react";

import { Modal } from "./";

export default {
	title: "Components / Modal",
	decorators: [withKnobs],
};

export const Default = () => (
	<Modal
		title={text("Title", "Title")}
		description={text("Description", "Description")}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
	>
		<div>{text("Content", "Modal Content")}</div>

		<div className="mt-4">
			<Button color="primary" variant="plain" onClick={() => alert("cancel")} className="mr-2">
				Cancel
			</Button>

			<Button color="primary" variant="solid" onClick={() => alert("continue")}>
				Continue
			</Button>
		</div>
	</Modal>
);
