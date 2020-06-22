import { text, withKnobs } from "@storybook/addon-knobs";
import { Button } from "app/components/Button";
import React from "react";

import { Header } from "./Header";

export default {
	title: "Basic / Header",
	decorators: [withKnobs],
};

export const Default = () => <Header title={text("Title", "Title")} subtitle={text("Subtitle", "Subtitle")} />;

export const WithExtra = () => (
	<Header
		title={text("Title", "Title")}
		subtitle={text("Subtitle", "Subtitle")}
		extra={
			<div className="flex justify-end space-x-3">
				<Button>Extra 1</Button>
				<Button>Extra 2</Button>
			</div>
		}
	/>
);
