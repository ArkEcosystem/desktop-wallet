import { Icon } from "app/components/Icon";
import React from "react";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type InputAddressProps = React.InputHTMLAttributes<any>;

export const InputAddress = React.forwardRef<HTMLInputElement, InputAddressProps>((props, ref) => (
	<InputGroup className="max-w-20">
		<Input ref={ref} type="text" className="pr-12" {...props} />
		<InputAddonEnd className="my-px mr-4">
			<button
				type="button"
				className="flex items-center justify-center w-full h-full text-2xl focus:outline-none bg-theme-background text-theme-primary-400"
			>
				<Icon name="Qrcode" width={20} height={20} />
			</button>
		</InputAddonEnd>
	</InputGroup>
));

InputAddress.displayName = "InputAddress";
