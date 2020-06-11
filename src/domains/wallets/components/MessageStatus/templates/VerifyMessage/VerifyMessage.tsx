import React from "react";
// UI Elements
import { Header } from "app/components/Header";
// Assets
import { SvgCollection } from "app/assets/svg";

type Props = {
	type: "success" | "error";
};

export const VerifyMessage = ({ type }: Props) => {
	const { Confirmed, Mistake } = SvgCollection;

	if (type === "error")
		return (
			<div>
				<Header title="Mistake" subtitle="Mistake subtitle" />
				<Mistake className="mt-10" />
			</div>
		);

	return (
		<div>
			<Header title="Confirmed" subtitle="Verify was successfully confirmed" />
			<Confirmed className="mt-10" />
		</div>
	);
};

VerifyMessage.defaultProps = {
	type: "success",
};
