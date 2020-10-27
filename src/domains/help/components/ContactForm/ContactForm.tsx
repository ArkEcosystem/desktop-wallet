import { Button } from "app/components/Button";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Input } from "app/components/Input";
import { Select } from "app/components/SelectDropdown";
import { TextArea } from "app/components/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const ContactForm = () => {
	const { t } = useTranslation();
	const form = useForm({ mode: "onChange" });

	const { register } = form;

	const subjects = [
		{ label: "Security", value: "security" },
		{ label: "Other", value: "other" },
	];

	const handleSubmit = ({ name, email, subject, message }: any) => {
		console.log(name);
	};

	return (
		<Form className="flex flex-col flex-1 mt-8 space-y-8" context={form} onSubmit={handleSubmit}>
			<div className="flex flex-col space-y-8 sm:flex-row sm:space-x-3 sm:space-y-0">
				<div className="w-full">
					<FormField name="name">
						<FormLabel label={t("HELP.PAGE_CONTACT_US.FORM.NAME")} />
						<Input
							ref={register({
								required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
									field: t("HELP.PAGE_CONTACT_US.FORM.NAME"),
								}).toString(),
							})}
						/>
						<FormHelperText />
					</FormField>
				</div>

				<div className="w-full">
					<FormField name="email">
						<FormLabel label={t("HELP.PAGE_CONTACT_US.FORM.EMAIL")} />
						<Input
							ref={register({
								required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
									field: t("HELP.PAGE_CONTACT_US.FORM.EMAIL"),
								}).toString(),
							})}
						/>
						<FormHelperText />
					</FormField>
				</div>
			</div>

			<FormField name="subject">
				<FormLabel label={t("HELP.PAGE_CONTACT_US.FORM.SUBJECT")} />
				<Select
					placeholder={t("COMMON.SELECT_OPTION", {
						option: t("HELP.PAGE_CONTACT_US.FORM.SUBJECT"),
					})}
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("HELP.PAGE_CONTACT_US.FORM.SUBJECT"),
						}).toString(),
					})}
					options={subjects}
				/>
				<FormHelperText />
			</FormField>

			<FormField name="message">
				<FormLabel label={t("HELP.PAGE_CONTACT_US.FORM.MESSAGE")} />
				<TextArea
					name="message"
					rows={3}
					wrap="hard"
					placeholder={t("HELP.PAGE_CONTACT_US.FORM.MESSAGE_PLACEHOLDER")}
					ref={register({
						required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
							field: t("HELP.PAGE_CONTACT_US.FORM.MESSAGE"),
						}).toString(),
					})}
				/>
				<FormHelperText />
			</FormField>

			<div className="relative flex flex-col justify-end flex-1">
				<Button type="submit" data-testid="ContactForm__submit-button">
					{t("COMMON.SEND")}
				</Button>
			</div>
		</Form>
	);
};
