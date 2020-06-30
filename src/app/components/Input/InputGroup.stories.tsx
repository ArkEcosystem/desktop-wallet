import React from "react";

import { Input, InputAddonEnd, InputAddonStart, InputGroup } from "./index";

export default {
	title: "App / Components / InputGroup",
};

export const Start = () => {
	return (
		<InputGroup className="max-w-xs">
			<InputAddonStart>
				<span className="bg-theme-neutral-100 border-theme-neutral-300 text-theme-neutral-dark flex items-center justify-center w-10 h-full border-r">
					$
				</span>
			</InputAddonStart>
			<Input type="text" placeholder="Amount" className="pl-13" />
		</InputGroup>
	);
};

export const End = () => {
	return (
		<InputGroup className="max-w-xs">
			<Input type="text" placeholder="Amount" className="pr-20" />
			<InputAddonEnd>
				<button className="text-theme-primary focus:outline-none px-4">Send All</button>
			</InputAddonEnd>
		</InputGroup>
	);
};

export const Both = () => {
	return (
		<InputGroup className="max-w-xs">
			<InputAddonStart>
				<span className="bg-theme-neutral-100 border-theme-neutral-300 text-theme-neutral-dark flex items-center justify-center w-10 h-full border-r">
					$
				</span>
			</InputAddonStart>
			<Input type="text" placeholder="Amount" defaultValue="0.01" className="pl-13 pr-20" />
			<InputAddonEnd>
				<button className="text-theme-primary focus:outline-none px-4">Send All</button>
			</InputAddonEnd>
		</InputGroup>
	);
};
