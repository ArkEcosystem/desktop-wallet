import React from "react";
import { FormError } from "app/components/Form/FormError";

type Props = {
	type: string;
	label: string;
	name: string;
	error: string;
	innerSlot?: React.ReactNode;
	reference?: any;
};

const Input = ({ type, label, name, error, innerSlot, reference }: Props) => (
	<div className="flex flex-col" data-testid="input__wrapper">
		<label className="text-theme-medium" data-testid="input__label">
			{label}
			<div className="mt-2 pb-2 flex relative items-center">
				<input
					className="form-input transition-colors duration-200 w-full"
					type={type}
					name={name}
					ref={reference}
				/>
				{innerSlot && (
					<div className="absolute right-0 mr-4 mt-1" data-testid="input__inner-slot">
						{innerSlot}
					</div>
				)}
			</div>
		</label>
		{error && <FormError error={error} />}
	</div>
);

Input.defaultProps = {
	type: "text",
	label: "Input Label",
	name: "input",
};

export { Input };
