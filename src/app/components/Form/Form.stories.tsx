import { Input } from "app/components/Input";
import { Select } from "app/components/SelectDropdown";
import { TextArea } from "app/components/TextArea";
import React from "react";
import { useForm } from "react-hook-form";

import { FormHelperText } from "./FormHelperText";
import { Form, FormField, FormLabel } from "./index";

export default { title: "App / Components / Form" };

export const Default = () => {
	const methods = useForm({ mode: "onChange" });

	return (
		<div className="mx-auto max-w-md">
			<h1>Form</h1>
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
						placeholder="Select coin"
						options={[
							{ label: "ARK", value: "ark" },
							{ label: "Bitcoin", value: "bitcoin" },
						]}
						ref={methods.register({
							required: "Coin required",
						})}
					/>
				</FormField>

				<FormField name="message">
					<FormLabel>Message</FormLabel>
					<TextArea
						ref={methods.register({
							required: "Message required",
						})}
					/>
				</FormField>
			</Form>
		</div>
	);
};
