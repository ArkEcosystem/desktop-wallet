import { Networks } from "@arkecosystem/platform-sdk";
import { useFormField } from "app/components/Form/useFormField";
import { Input } from "app/components/Input";
import cn from "classnames";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";

type Properties = {
	network?: Networks.Network;
	suggestion?: string;
} & React.InputHTMLAttributes<any>;

export const SelectNetworkInput = React.forwardRef<HTMLInputElement, Properties>(
	({ network, suggestion, ...properties }: Properties, reference) => {
		const fieldContext = useFormField();

		const isInvalidValue = fieldContext?.isInvalid;

		return (
			<Input
				data-testid="SelectNetworkInput__input"
				ref={reference}
				suggestion={suggestion}
				addons={{
					start: (
						<NetworkIcon
							data-testid="SelectNetworkInput__network"
							className={cn({
								"border-theme-danger-500 text-theme-danger-500": isInvalidValue,
								"border-theme-secondary-200 dark:border-theme-secondary-700 text-theme-secondary-500": !isInvalidValue,
							})}
							coin={network?.coin()}
							network={network?.id()}
							size="sm"
							showTooltip={false}
							noShadow
						/>
					),
				}}
				{...properties}
			/>
		);
	},
);

SelectNetworkInput.displayName = "SelectNetworkInput";
