import React from "react";
import { Modal } from "./";
import { Button } from "app/components/Button";
import { boolean, select, text, withKnobs } from "@storybook/addon-knobs";

export default {
	title: "Components / Modal",
	decorators: [withKnobs],
};

export const Default = () => (
	<Modal
		title={text("Title", "Title")}
		description={text("Description", "Description")}
		size={select("Size", ["sm", "md", "lg", "xl", "default"], "default")}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
	>
		<div>{text("Content", "Modal Content")}</div>

		<div className="mt-4">
			<Button color="primary" variant="plain" className="mr-2" onClick={() => alert("cancel")}>
				Cancel
			</Button>

			<Button color="primary" variant="solid" onClick={() => alert("continue")}>
				Continue
			</Button>
		</div>
	</Modal>
);
