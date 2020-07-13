import React from "react";

import { Input, InputAddonEnd, InputAddonStart, InputGroup } from "./index";

export default {
	title: "App / Components / InputGroup",
};

export const Start = () => {
	return (
		<InputGroup className="max-w-xs">
			<InputAddonStart className="flex items-center justify-center w-12 h-auto border-r bg-theme-neutral-contrast border-theme-neutral-300 text-theme-neutral-dark">
				<span>$</span>
			</InputAddonStart>
			<Input type="text" placeholder="Amount" className="rounded-l-none" />
		</InputGroup>
	);
};

export const End = () => {
	return (
		<InputGroup className="max-w-xs">
			<Input type="text" placeholder="Amount" className="pr-20" />
			<InputAddonEnd>
				<button className="px-4 text-theme-primary focus:outline-none">Send All</button>
			</InputAddonEnd>
		</InputGroup>
	);
};

export const Both = () => {
	return (
		<InputGroup className="max-w-xs">
			<InputAddonStart className="flex items-center justify-center w-12 h-auto border-r bg-theme-neutral-contrast border-theme-neutral-300 text-theme-neutral-dark">
				<span>$</span>
			</InputAddonStart>
			<Input type="text" placeholder="Amount" defaultValue="0.01" className="pr-20 rounded-l-none" />
			<InputAddonEnd>
				<button className="px-4 text-theme-primary focus:outline-none">Send All</button>
			</InputAddonEnd>
		</InputGroup>
	);
};
