import { Comments } from "domains/plugins/components/Comments";
import { PluginHeader } from "domains/plugins/components/PluginHeader";
import { PluginInfo } from "domains/plugins/components/PluginInfo";
import { ReviewBox } from "domains/plugins/components/ReviewBox";
import React from "react";

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

const commentsSortingOptions = [
	{ label: "Best", value: "best" },
	{ label: "Date", value: "date" },
];

const reviewComments = [
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
	},
	{
		author: "Gerard Blezer",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"As an open-source platform, the entire ARK codebase is readily available on GitHub providing blockchain developers with a convenient location for all ARK technologies and repositories.",
		replies: [
			{
				date: "2020-06-19T14:48:00.000Z",
				content: "<a href='#'>@Gerard Blezer</a> Our GitHub bount reward program utlilizes a tiered structure.",
			},
		],
	},
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
	},
	{
		author: "Rok Cernec",
		score: "4.6",
		date: "2020-06-19T14:48:00.000Z",
		comment:
			"As ARK Core is written exclusively in Node.js, the server-side framework for JavaScript and Typescript, installing Node.js is a necessity for core development. The code below installs Node.js from the source.",
	},
];

export const PluginDetails = () => (
	<section className="h-full bg-theme-neutral-100" data-testid="plugin-details__header">
		<PluginHeader
			author="ARK Ecosystem"
			category="Utility"
			url="github.com"
			rating="4.6"
			version="1.3.8"
			size="4.2"
		/>
		<PluginInfo
			about="Use the ARK Explorer to get full visibility of critical data from the ARK network. Data such as the latest blocks, wallet addresses and transactions. Plus monitor delegate status, their position and more."
			permissions={["Embedded Webpages", "API Requests", "Access to Profiles"]}
			screenshots={[1, 2, 3]}
		/>
		<div className="mt-5 bg-theme-background">
			<div className="py-24 mx-10 grid grid-cols-2 grid-flow-col divide-x divide-theme-neutral-300">
				<div className="col-span-2" data-testid="plugin-details__comments">
					<Comments comments={reviewComments} sortOptions={commentsSortingOptions} />
				</div>
				<div className="pl-10" data-testid="plugin-details__review-box">
					<ReviewBox averageScore="4.3" ratings={ratings} totalAvaliations={347} />
				</div>
			</div>
		</div>
	</section>
);
