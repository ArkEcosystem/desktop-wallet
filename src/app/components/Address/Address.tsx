import React from "react";
import { truncateStringMiddle } from "./utils";

type Props = {
	walletName?: string;
	address?: string | undefined;
	maxChars?: number;
	className?: string;
	size?: "small" | "default" | "large";
};

export const Address = ({ address, walletName, maxChars, size }: Props) => {
	if (!address) return null;

	const getFontSize = () => {
		switch (size) {
			case "small":
				return "text-sm";
			case "default":
				return "text-base";
			case "large":
				return "text-xl";
			default:
				return "text-base";
		}
	};

	return (
		<div className="truncate inline-block">
			{walletName && (
				<span
					className={`text-theme-neutral-800 font-semibold max-w-24 flex-auto truncate mt-4 mr-1 ${getFontSize(
						size,
					)}`}
				>
					{walletName}
				</span>
			)}
			<span className={`text-theme-neutral-400 font-semibold ${getFontSize(size)}`}>
				{truncateStringMiddle(address, maxChars)}
			</span>
		</div>
	);
};

Address.defaultProps = {
	maxChars: 16,
	size: "default",
};
