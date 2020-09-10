import React from "react";

import { LinkList } from "./LinkList";

export default { title: "Domains / Transaction / Components / LinkList" };

const links = [
	{
		displayName: "GitHub",
		value: "http://github.com/robank",
		type: "github",
	},
	{
		displayName: "GitLab",
		value: "http://gitlab.com/robank",
		type: "gitlab",
	},
	{
		displayName: "BitBucket",
		value: "http://bitbucket.com/robank",
		type: "bitbucket",
	},
	{
		displayName: "NPM",
		value: "http://npmjs.com/robank",
		type: "npm",
	},
];

export const Default = () => (
	<LinkList title="Repository" description="Show your projects through the repository" links={links} />
);
