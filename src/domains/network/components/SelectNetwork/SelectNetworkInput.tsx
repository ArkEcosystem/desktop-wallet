import { Coins } from "@arkecosystem/platform-sdk";
import { useFormField } from "app/components/Form/useFormField";
import { Input } from "app/components/Input";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";

type Props = {
	network?: Coins.Network;
	suggestion?: string;
} & React.InputHTMLAttributes<any>;

export const SelectNetworkInput = React.forwardRef<HTMLInputElement, Props>(
	({ network, suggestion, ...props }: Props, ref) => {
		const fieldContext = useFormField();

		return (
			<Input
				data-testid="SelectNetworkInput__input"
				ref={ref}
				suggestion={suggestion}
				addons={{
					start: (
						<NetworkIcon
							data-testid="SelectNetworkInput__network"
							coin={network?.coin()}
							network={network?.id()}
							size="sm"
							showTooltip={false}
							noShadow
						/>
					),
				}}
				{...props}
			/>
		);
	},
);

SelectNetworkInput.displayName = "SelectNetworkInput";
