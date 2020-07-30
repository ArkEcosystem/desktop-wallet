import React from "react";

import { Input, InputCounter, InputPassword } from "./index";

export default {
	title: "App / Components / Input",
};

export const Default = () => (
	<div className="max-w-xs space-y-4">
		<Input type="text" placeholder="Enabled" />
		<Input type="text" placeholder="Invalid" aria-invalid={true} />
		<Input type="text" placeholder="Disabled" disabled />
	</div>
);

export const Password = () => (
	<div className="max-w-xs">
		<InputPassword defaultValue="secret" />
	</div>
);

export const Counter = () => (
	<div className="max-w-xs">
		<InputCounter defaultValue="Hello" maxLength={255} />
	</div>
);
