import { Icon } from "app/components/Icon";
import React from "react";

import { Input } from "./Input";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const togglePasswordVisibilty = () => setShow(!show);

	return (
		<Input
			data-testid="InputPassword"
			ref={ref}
			type={show ? "text" : "password"}
			addons={{
				end: (
					<button
						data-testid="InputPassword__toggle"
						tabIndex={-1}
						type="button"
						onClick={togglePasswordVisibilty}
						className="flex items-center justify-center w-full h-full text-2xl"
					>
						<Icon name={show ? "EyeOff" : "Eye"} />
					</button>
				),
			}}
			{...props}
		/>
	);
});

InputPassword.displayName = "InputPassword";
