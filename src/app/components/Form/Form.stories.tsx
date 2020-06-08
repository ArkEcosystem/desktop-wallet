import React from "react";
import { Form, FormField, FormLabel } from "./index";
import { useForm } from "react-hook-form";
import { FormHelperText } from "./FormHelperText";
import { Input } from "app/components/Input";
import { Select } from "app/components/Select";

export default { title: "Form / Form" };

export const Default = () => {
	const methods = useForm({ mode: "onChange" });

	return (
		<div className="max-w-md">
			<Form context={methods} onSubmit={() => void 0}>
				<FormField name="name">
					<FormLabel>Name</FormLabel>
					<Input ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="password">
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						ref={methods.register({
							required: "Field required",
							minLength: 3,
							maxLength: {
								value: 10,
								message: "Max length is 10",
							},
						})}
					/>
					<FormHelperText
						errorMessage={
							methods.errors.password?.type === "minLength" && <span>Custom min length error</span>
						}
					>
						Password must be 3–10 characters, and include a number, a symbol, a lower and a upper case
						letter.
					</FormHelperText>
				</FormField>

				<FormField name="coin">
					<FormLabel>Coin</FormLabel>
					<Select
						ref={methods.register({
							required: "Coin required",
						})}
					>
						<option value="">Select</option>
						<option value="ark">ARK</option>
						<option value="bitcoin">Bitcoin</option>
					</Select>
				</FormField>
			</Form>
		</div>
	);
};
