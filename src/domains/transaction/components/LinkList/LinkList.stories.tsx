import React from "react";

import { LinkList } from "./LinkList";

export default { title: "Domains / Transaction / Components / LinkList" };

const links = [
	{
		value: "http://github.com/robank",
		type: "github",
	},
	{
		value: "http://gitlab.com/robank",
		type: "gitlab",
	},
	{
		value: "http://bitbucket.com/robank",
		type: "bitbucket",
	},
	{
		value: "http://npmjs.com/robank",
		type: "npm",
	},
];

export const Default = () => (
	<LinkList title="Repository" description="Show your projects through the repository" links={links} />
);
