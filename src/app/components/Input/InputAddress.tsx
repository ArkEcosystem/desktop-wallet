import { Icon } from "app/components/Icon";
import { useEnvironmentContext } from "app/contexts";
import { useDebounce } from "app/hooks";
import React, { useEffect, useState } from "react";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type InputAddressProps = { coin: string; network: string } & React.InputHTMLAttributes<any>;

export const InputAddress = React.forwardRef<HTMLInputElement, InputAddressProps>((props: InputAddressProps, ref) => {
	const { coin, network } = props;

	const { env } = useEnvironmentContext();

	const [address, setAddress] = useState("");

	const debouncedAddress = useDebounce(address, 500);

	useEffect(() => {
		const validateAddress = async () => {
			if (debouncedAddress) {
				const isValidAddress = await env.dataValidator().address(coin, network, debouncedAddress);

				console.log("debouncedAddress", debouncedAddress);
				console.log("isValid", isValidAddress);
			}
		};

		validateAddress();
	}, [coin, debouncedAddress, env, network]);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(event.target.value);
	};

	return (
		<InputGroup className="max-w-20">
			<Input ref={ref} type="text" className="pr-12" onChange={handleChange} {...props} />
			<InputAddonEnd className="my-px mr-4">
				<button
					type="button"
					className="flex items-center justify-center w-full h-full text-2xl focus:outline-none bg-theme-background text-theme-primary-400"
				>
					<Icon name="Qrcode" width={20} height={20} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
});

InputAddress.displayName = "InputAddress";
