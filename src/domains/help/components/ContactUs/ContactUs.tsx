import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
// UI Elements
import { Modal } from "app/components/Modal";
import { Select } from "app/components/SelectDropdown";
import { TextArea } from "app/components/TextArea";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ContactUsProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSend: any;
};

export const ContactUs = (props: ContactUsProps) => {
	const methods = useForm({ mode: "onChange" });

	const { t } = useTranslation();

	const subjects = ["security", "other"];

	return (
		<Modal
			title={t("HELP.MODAL_CONTACT_US.TITLE")}
			description={t("HELP.MODAL_CONTACT_US.DESCRIPTION")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="flex px-10 pb-8 mt-4 mb-8 -mx-10 text-black border-b border-gray-500">
				<a href="https://twitter.ark.io" className="mr-2 rounded-full hover:bg-theme-neutral-300">
					<Circle className="border-black hover:bg-transparent" noShadow={true}>
						<Icon name="Twitter" />
					</Circle>
				</a>

				<a href="https://slack.ark.io" className="mr-2 rounded-full hover:bg-theme-neutral-300">
					<Circle className="border-black hover:bg-transparent" noShadow={true}>
						<Icon name="Slack" />
					</Circle>
				</a>

				<a href="https://discord.ark.io/" className="mr-2 rounded-full hover:bg-theme-neutral-300">
					<Circle className="border-black hover:bg-transparent" noShadow={true}>
						<Icon name="Discord" />
					</Circle>
				</a>

				<a href="mailto:info@ark.io" className="rounded-full hover:bg-theme-neutral-300">
					<Circle className="border-black hover:bg-transparent" noShadow={true}>
						<Icon name="Send" />
					</Circle>
				</a>
			</div>

			<Form context={methods} onSubmit={props.onSend}>
				<FormField name="name">
					<h2 className="mb-0">Feedback</h2>

					<FormLabel>{t("HELP.MODAL_CONTACT_US.FORM.NAME")}</FormLabel>
					<Input
						ref={methods.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("HELP.MODAL_CONTACT_US.FORM.NAME"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="email">
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FORM.EMAIL")}</FormLabel>
					<Input
						ref={methods.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("HELP.MODAL_CONTACT_US.FORM.EMAIL"),
							}).toString(),
						})}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="subject">
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FORM.SUBJECT")}</FormLabel>
					<Select
						ref={methods.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("HELP.MODAL_CONTACT_US.FORM.SUBJECT"),
							}).toString(),
						})}
						placeholder={t("COMMON.SELECT")}
						options={subjects.map((value: string) => ({
							label: t(`COMMON.${value.toUpperCase()}`),
							value,
						}))}
					/>
					<FormHelperText />
				</FormField>

				<FormField name="message">
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FORM.MESSAGE")}</FormLabel>
					<TextArea
						ref={methods.register({
							required: t("COMMON.VALIDATION.FIELD_REQUIRED", {
								field: t("HELP.MODAL_CONTACT_US.FORM.MESSAGE"),
							}).toString(),
						})}
					/>
				</FormField>

				<div className="flex justify-end mt-4 space-x-3">
					<Button variant="plain" onClick={props.onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button type="submit">{t("COMMON.SEND")}</Button>
				</div>
			</Form>
		</Modal>
	);
};

ContactUs.defaultProps = {
	isOpen: false,
};

ContactUs.displayName = "ContactUs";
