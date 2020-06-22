import { action } from "@storybook/addon-actions";
import { text, withKnobs } from "@storybook/addon-knobs";
import { Button } from "app/components/Button";
import React from "react";

import { Header } from "./Header";
import { HeaderSearchBar } from "./HeaderSearchBar";

export default {
	title: "Basic / Header",
	decorators: [withKnobs],
};

export const Default = () => <Header title={text("Title", "Title")} subtitle={text("Subtitle", "Subtitle")} />;

export const WithExtra = () => {
	const title = text("Title", "Title");
	const subtitle = text("Subtitle", "Subtitle");

	return (
		<div className="space-y-10">
			<Header
				title={title}
				subtitle={subtitle}
				extra={
					<div className="flex justify-end space-x-3">
						<Button>Extra 1</Button>
						<Button>Extra 2</Button>
					</div>
				}
			/>

			<Header
				title={title}
				subtitle={subtitle}
				extra={
					<div className="flex justify-end">
						<HeaderSearchBar onSearch={action("onSearch")} />
					</div>
				}
			/>
		</div>
	);
};
