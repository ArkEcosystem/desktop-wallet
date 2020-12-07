import React from "react";

import { Input, InputAddonEnd, InputAddonStart, InputGroup } from "./index";

export default {
	title: "App / Components / InputGroup",
};

export const Start = () => (
	<InputGroup className="max-w-xs">
		<InputAddonStart>
			<span className="flex justify-center items-center w-10 h-full border-r bg-theme-neutral-contrast border-theme-neutral-300 dark:border-theme-neutral-800 text-theme-secondary-text">
				$
			</span>
		</InputAddonStart>
		<Input type="text" placeholder="Amount" className="pl-13" />
	</InputGroup>
);

export const End = () => (
	<InputGroup className="max-w-xs">
		<Input type="text" placeholder="Amount" className="pr-20" />
		<InputAddonEnd>
			<button className="px-4 text-theme-primary focus:outline-none">Send All</button>
		</InputAddonEnd>
	</InputGroup>
);

export const Both = () => (
	<InputGroup className="max-w-xs">
		<InputAddonStart>
			<span className="flex justify-center items-center w-10 h-full border-r bg-theme-neutral-contrast border-theme-neutral-300 dark:border-theme-neutral-800 text-theme-secondary-text">
				$
			</span>
		</InputAddonStart>
		<Input type="text" placeholder="Amount" defaultValue="0.01" className="pr-20 pl-13" />
		<InputAddonEnd>
			<button className="px-4 text-theme-primary focus:outline-none">Send All</button>
		</InputAddonEnd>
	</InputGroup>
);
