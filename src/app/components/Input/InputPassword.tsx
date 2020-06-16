import { Icon } from "app/components/Icon";
import React from "react";

import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const togglePasswordVisibilty = () => setShow(!show);

	return (
		<InputGroup className="max-w-20">
			<Input ref={ref} type={show ? "text" : "password"} className="pr-12" {...props} />
			<InputAddonEnd className="mr-4">
				<button
					data-testid="InputPassword__toggle"
					type="button"
					onClick={togglePasswordVisibilty}
					className="flex items-center justify-center w-full h-full text-2xl focus:outline-none bg-theme-background text-theme-primary-400"
				>
					<Icon name={show ? "EyeOff" : "Eye"} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
});

InputPassword.displayName = "InputPassword";
