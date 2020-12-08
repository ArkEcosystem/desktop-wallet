import React from "react";

import { Card } from "./Card";
import { CardControl, CardControlState } from "./CardControl";

export default { title: "App / Components / Card" };

export const Default = () => <Card className="inline-flex">ARK Ecosystem</Card>;

export const Control = () => (
	<div className="grid grid-cols-3 gap-4 max-w-lg">
		<CardControl defaultChecked={true} className="grid">
			<div className="flex flex-col justify-between items-center space-y-3 h-full">
				<span className="text-center">ARK Ecosystem</span>
				<CardControlState />
			</div>
		</CardControl>
		<CardControl className="grid">
			<div className="flex flex-col justify-between items-center h-full">
				<span>Bitcoin</span>
				<CardControlState />
			</div>
		</CardControl>
		<CardControl className="grid" disabled>
			<div className="flex flex-col justify-between items-center h-full">
				<span>Ethereum</span>
				<CardControlState />
			</div>
		</CardControl>
	</div>
);
