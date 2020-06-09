import React from "react";
import { InputGroup, InputAddonEnd } from "./InputGroup";
import { Input } from "./Input";
import { Icon } from "app/components/Icon";

type InputPasswordProps = React.InputHTMLAttributes<any>;

export const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>((props, ref) => {
	const [show, setShow] = React.useState(false);
	const togglePasswordVisibilty = () => setShow(!show);
	const handleQrCode = () => null;

	return (
		<InputGroup className="max-w-20">
			<Input ref={ref} type={show ? "text" : "password"} className="pr-12" {...props} />
			<InputAddonEnd className="w-24">
				<button
					data-testid="InputPassword__toggle"
					type="button"
					onClick={togglePasswordVisibilty}
					className="focus:outline-none bg-theme-background text-theme-primary-400 w-full h-full flex justify-center items-center text-2xl"
				>
					<Icon name={show ? "eyeOff" : "eye"} />
				</button>
				<button
					data-testid="InputPassword__qrcode"
					type="button"
					onClick={handleQrCode}
					className="focus:outline-none bg-theme-background text-theme-primary-400 w-full h-full flex justify-center items-center text-2xl mr-2"
				>
					<Icon name="qrcode" />
				</button>
			</InputAddonEnd>
		</InputGroup>
	);
});

InputPassword.displayName = "InputPassword";
