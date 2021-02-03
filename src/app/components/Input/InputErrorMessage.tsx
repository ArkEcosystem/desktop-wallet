import { Icon } from "app/components/Icon";
import { Tooltip } from "app/components/Tooltip";
import React from "react";

import { useFormField } from "../Form/useFormField";
import { InputAddonEnd } from "./InputGroup";

type InputErrorMessageProps = {
	className?: string;
};

export const InputErrorMessage = ({ className }: InputErrorMessageProps) => {
	const fieldContext = useFormField();

	return fieldContext?.isInvalid ? (
		<InputAddonEnd className={"my-px mr-4" + (className ? ` ${className}` : "")}>
			<Tooltip content={fieldContext?.errorMessage}>
				<span>
					<Icon name={"AlertWarning"} className="text-theme-danger-500" width={20} height={20} />
				</span>
			</Tooltip>
		</InputAddonEnd>
	) : (
		<></>
	);
};
