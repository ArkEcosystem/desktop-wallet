import React from "react";
import { InputGroup, InputAddonEnd } from "./InputGroup";
import { Input } from "./Input";
import { Icon } from "app/components/Icon";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const togglePasswordVisibilty = () => setShow(!show);

	return (
		<InputGroup className="max-w-20">
			<Input ref={ref} type={show ? "text" : "password"} className="pr-12" {...props} />
			<InputAddonEnd className="w-24">
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
