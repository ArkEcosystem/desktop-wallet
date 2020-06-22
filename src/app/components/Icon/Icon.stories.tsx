import { number, text, withKnobs } from "@storybook/addon-knobs";
import { SvgCollection } from "app/assets/svg";
import { Clipboard } from "app/components/Clipboard";
import React from "react";

import { Icon } from "./Icon";

export default {
	title: "Basic / Icon",
	decorators: [withKnobs],
};

export const Default = () => {
	const options = { range: true, min: 10, max: 100, step: 1 };

	const iconColor = text("Color", "text-theme-primary");
	const width = number("Width", 20, options);
	const height = number("Height", 20, options);

	return (
		<div className="flex flex-wrap justify-center">
			{Object.keys(SvgCollection).map((icon) => (
				<div className="m-4" key={icon}>
					<Clipboard data={icon}>
						<div className="flex w-24 h-24 flex-col justify-center items-center space-y-6">
							<span className="text-sm">{icon}</span>
							<Icon className={iconColor} name={icon} width={width} height={height} />
						</div>
					</Clipboard>
				</div>
			))}
		</div>
	);
};
