import React from "react";

import { StarsCounters } from "./StarsCounters";

export default { title: "Plugins / Components / Review Box / Components / Stars Counters" };

const ratings = [
	{
		rating: 5,
		votes: 156,
	},
	{
		rating: 4,
		votes: 194,
	},
	{
		rating: 3,
		votes: 25,
	},
	{
		rating: 2,
		votes: 42,
	},
	{
		rating: 1,
		votes: 7,
	},
];

export const Default = () => <StarsCounters ratings={ratings} totalAvaliations={347} />;
