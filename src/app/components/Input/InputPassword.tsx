import { Icon } from "app/components/Icon";
import React from "react";

import { useFormField } from "../Form/useFormField";
import { Input } from "./Input";
import { InputAddonEnd, InputGroup } from "./InputGroup";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const fieldContext = useFormField();
	const togglePasswordVisibilty = () => setShow(!show);

	return (
		<InputGroup data-testid="InputPassword" className="max-w-20">
			<Input
				ref={ref}
				type={show ? "text" : "password"}
				className={fieldContext?.isInvalid ? "pr-18" : "pr-12"}
				errorClassName="mr-12"
				{...props}
			/>
			<InputAddonEnd className="my-px mr-4">
				<button
					data-testid="InputPassword__toggle"
					type="button"
					onClick={togglePasswordVisibilty}
					className="flex justify-center items-center w-full h-full text-2xl focus:outline-none text-theme-primary-300 dark:text-theme-secondary-600"
				>
					<Icon name={show ? "EyeOff" : "Eye"} />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
});

InputPassword.displayName = "InputPassword";
