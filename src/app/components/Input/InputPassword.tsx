import React from "react";
import { InputGroup, InputAddonEnd } from "./InputGroup";
import { Input } from "./Input";
import { Icon } from "app/components/Icon";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const handleClick = () => setShow(!show);

	return (
		<InputGroup className="max-w-20">
			<Input ref={ref} type={show ? "text" : "password"} className="pr-12" {...props} />
			<InputAddonEnd className="w-12">
				<button
					data-testid="InputPassword__toggle"
					type="button"
					onClick={handleClick}
					className="focus:outline-none bg-theme-background text-theme-primary-400 w-full h-full flex justify-center text-2xl"
				>
					<Icon name={show ? "eyeOff" : "eye"} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
});

InputPassword.displayName = "InputPassword";