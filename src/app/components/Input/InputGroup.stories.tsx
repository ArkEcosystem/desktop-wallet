import React from "react";
import { Input, InputGroup, InputAddonEnd, InputAddonStart } from "./index";

export default {
	title: "Input / Input / InputGroup",
};

export const Start = () => {
	return (
		<InputGroup className="max-w-xs">
			<InputAddonStart>
				<span className="w-10 h-full bg-theme-neutral-100 border-r border-theme-neutral-300 text-theme-neutral-dark flex items-center justify-center">
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
				<button className="text-theme-primary px-4 focus:outline-none">Send All</button>
			</InputAddonEnd>
		</InputGroup>
	);
};

export const Both = () => {
	return (
		<InputGroup className="max-w-xs">
			<InputAddonStart>
				<span className="w-10 h-full bg-theme-neutral-100 border-r border-theme-neutral-300 text-theme-neutral-dark flex items-center justify-center">
					$
				</span>
			</InputAddonStart>
			<Input type="text" placeholder="Amount" defaultValue="0.01" className="pl-13 pr-20" />
			<InputAddonEnd>
				<button className="text-theme-primary px-4 focus:outline-none">Send All</button>
			</InputAddonEnd>
		</InputGroup>
	);
};
