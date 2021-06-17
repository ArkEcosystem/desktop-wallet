import { Icon } from "app/components/Icon";
import React from "react";

import { Input } from "./Input";

type InputPasswordProperties = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProperties>((properties, reference) => {
	const [show, setShow] = React.useState(false);
	const togglePasswordVisibility = () => setShow(!show);

	return (
		<Input
			data-testid="InputPassword"
			ref={reference}
			type={show ? "text" : "password"}
			addons={{
				end: (
					<button
						data-testid="InputPassword__toggle"
						type="button"
						onClick={togglePasswordVisibility}
						className="flex relative justify-center items-center w-full h-full text-2xl focus:outline-none group"
					>
						{/* icon border on focus */}
						<div className="absolute inset-0 -m-1 rounded group-focus-visible group-focus:ring-2 ring-theme-primary-400" />

						<Icon name={show ? "EyeOff" : "Eye"} />
					</button>
				),
			}}
			{...properties}
		/>
	);
});

InputPassword.displayName = "InputPassword";
