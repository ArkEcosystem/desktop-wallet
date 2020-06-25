import React from "react";

import { ReviewBox } from "./ReviewBox";

export default { title: "Plugins / Components / Review Box" };

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

export const Default = () => <ReviewBox averageScore="4.3" ratings={ratings} totalAvaliations={347} />;
