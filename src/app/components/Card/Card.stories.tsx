import React from "react";
import { Card } from "./Card";
import { CardControl, CardControlState } from "./CardControl";

export default { title: "Basic / Card" };

export const Default = () => <Card className="inline-flex">ARK Ecosystem</Card>;
export const Control = () => (
	<div className="grid grid-cols-2 gap-4 w-80">
		<CardControl defaultChecked={true} className="grid">
			<div className="flex space-y-3 flex-col h-full justify-between items-center">
				<span className="text-center">ARK Ecosystem</span>
				<CardControlState />
			</div>
		</CardControl>
		<CardControl className="grid">
			<div className="flex flex-col h-full justify-between items-center">
				<span>Bitcoin</span>
				<CardControlState />
			</div>
		</CardControl>
	</div>
);
