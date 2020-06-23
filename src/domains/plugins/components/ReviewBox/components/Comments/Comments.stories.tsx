import React from "react";

import { Comments } from "./Comments";

export default { title: "Plugins / Components / Review Box / Components / Comments" };

const comments = [
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
	},
];

export const Default = () => <Comments comments={comments} />;
