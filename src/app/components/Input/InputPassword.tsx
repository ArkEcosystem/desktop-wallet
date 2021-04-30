import { Icon } from "app/components/Icon";
import React from "react";

import { Input } from "./Input";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const togglePasswordVisibility = () => setShow(!show);

	return (
		<Input
			data-testid="InputPassword"
			ref={ref}
			type={show ? "text" : "password"}
			addons={{
				end: (
					<button
						data-testid="InputPassword__toggle"
						type="button"
						onClick={togglePasswordVisibility}
						className="relative flex items-center justify-center w-full h-full text-2xl focus:outline-none group"
					>
						{/* icon border on focus */}
						<div className="absolute inset-0 -m-2 rounded ring-theme-primary-400 group-focus:ring-2" />

						<Icon name={show ? "EyeOff" : "Eye"} />
					</button>
				),
			}}
			{...props}
		/>
	);
});

InputPassword.displayName = "InputPassword";
