import { Icon } from "app/components/Icon";
import cn from "classnames";
import React from "react";

import { useFormField } from "../Form/useFormField";
import { Input } from "./Input";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const fieldContext = useFormField();
	const togglePasswordVisibilty = () => setShow(!show);

	return (
		<Input
			ref={ref}
			type={show ? "text" : "password"}
			addons={{
				end: (
					<button
						data-testid="InputPassword__toggle"
						type="button"
						onClick={togglePasswordVisibilty}
						className={cn("flex justify-center items-center w-full h-full text-2xl focus:outline-none", {
							"text-theme-danger-500": fieldContext?.isInvalid,
							"text-theme-primary-300 dark:text-theme-secondary-600": !fieldContext?.isInvalid,
						})}
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
