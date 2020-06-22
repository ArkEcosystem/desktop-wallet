import { boolean, select, text, withKnobs } from "@storybook/addon-knobs";
import { Button } from "app/components/Button";
import React from "react";

import { Modal } from "./Modal";

export default {
	title: "Components / Modal",
	decorators: [withKnobs],
};

export const Default = () => (
	<Modal
		title={text("Title", "Title")}
		description={text("Description", "Description")}
		size={select("Size", ["sm", "md", "lg", "xl", "2xl", "3xl"], "2xl")}
		isOpen={boolean("Is Open", true)}
		onClose={() => alert("closed")}
	>
		<div>{text("Content", "Modal Content")}</div>

		<div className="flex justify-end mt-4 space-x-3">
			<Button variant="plain" onClick={() => alert("cancel")}>
				Cancel
			</Button>

			<Button onClick={() => alert("continue")}>Continue</Button>
		</div>
	</Modal>
);
