import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";

import { HistoryModal } from "./HistoryModal";

export default {
	title: "Domains / Profile / Pages / MyRegistrations / Components / HistoryModal",
	decorators: [withKnobs],
};

const history = [
	{
		type: "REGISTRATION",
		date: "27 May 2020",
		transaction: "https://www.google.com.br",
	},
	{
		type: "UPDATE",
		date: "18 May 2020",
		transaction: "https://www.google.com.br",
	},
	{
		type: "UPDATE",
		date: "3 May 2020",
		transaction: "https://www.google.com.br",
	},
	{
		type: "RESIGN",
		date: "15 Jun 2020",
		transaction: "https://www.google.com.br",
	},
];

export const Default = () => (
	<HistoryModal isOpen={boolean("Is Open", true)} handleClose={() => alert("closed")} history={history} />
);
