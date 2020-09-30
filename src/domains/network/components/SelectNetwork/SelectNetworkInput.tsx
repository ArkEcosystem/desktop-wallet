import { Coins } from "@arkecosystem/platform-sdk";
import { Input, InputAddon, InputAddonStart, InputGroup } from "app/components/Input";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";

type Props = {
	network?: Coins.Network;
	suggestion?: string;
} & React.InputHTMLAttributes<any>;

const TypeAhead = ({ value }: { value?: string }) => (
	<InputAddon
		as="span"
		data-testid="SelectNetworkInput__typeahead"
		className="py-3 font-normal border border-transparent opacity-50 pointer-events-none pl-15"
	>
		{value}
	</InputAddon>
);

export const SelectNetworkInput = React.forwardRef<HTMLInputElement, Props>(
	({ network, suggestion, ...props }: Props, ref) => (
		<InputGroup data-testid="SelectNetworkInput">
			<InputAddonStart className="px-4">
				<NetworkIcon
					data-testid="SelectNetworkInput__network"
					coin={network?.coin()}
					network={network?.id()}
					size="sm"
					showTooltip={false}
					noShadow
				/>
			</InputAddonStart>
			{suggestion && <TypeAhead value={suggestion} />}
			<Input data-testid="SelectNetworkInput__input" ref={ref} className="pl-15" {...props} />
		</InputGroup>
	),
);

SelectNetworkInput.displayName = "SelectNetworkInput";
