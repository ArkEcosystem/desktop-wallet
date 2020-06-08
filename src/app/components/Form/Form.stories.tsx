import React from "react";
import { Form, FormField, FormLabel } from "./index";
import { useForm } from "react-hook-form";
import { FormHelperText } from "./FormHelperText";

export default { title: "Form / Form" };

export const Default = () => {
	const methods = useForm({ mode: "onChange" });

	return (
		<div className="max-w-md">
			<Form context={methods} onSubmit={() => void 0}>
				<FormField name="name">
					<FormLabel>Name</FormLabel>
					<input name="name" ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>
			</Form>
		</div>
	);
};
