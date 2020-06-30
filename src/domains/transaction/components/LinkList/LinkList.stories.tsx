import React from "react";

import { LinkList } from "./LinkList";

export default { title: "Components / Link List" };

const links = [
	{
		link: "http://github.com/robank",
		type: "github",
	},
	{
		link: "http://gitlab.com/robank",
		type: "gitlab",
	},
	{
		link: "http://bitbucket.com/robank",
		type: "bitbucket",
	},
	{
		link: "http://npmjs.com/robank",
		type: "npm",
	},
];

export const Default = () => (
	<LinkList title="Repository" description="Show your projects through the repository" links={links} />
);
