import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
// UI Elements
import { Modal } from "app/components/Modal";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel, FormHelperText } from "app/components/Form";
import { Input } from "app/components/Input";
import { Select } from "app/components/Select";
import { Icon } from "app/components/Icon";
import { Textarea } from "app/components/Textarea";

type ContactUsProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
	onSend: any;
};

export const ContactUs = ({ ...props }: ContactUsProps) => {
	const methods = useForm({ mode: "onChange" });
	const { t } = useTranslation();

	return (
		<Modal
			title={t("HELP.MODAL_CONTACT_US.TITLE")}
			description={t("HELP.MODAL_CONTACT_US.DESCRIPTION")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="flex border-b border-gray-500 text-black mt-2 mb-8 -mx-16 px-16 pb-8">
				<a href="https://twitter.ark.io" className="rounded-full mr-2 hover:bg-theme-neutral-300">
					<Circle className="border-black hover:bg-transparent" noShadow={true}>
						<Icon name="Twitter" />
					</Circle>
				</a>

				<a href="https://slack.ark.io" className="rounded-full mr-2 hover:bg-theme-neutral-300">
					<Circle className="border-black hover:bg-transparent" noShadow={true}>
						<Icon name="Slack" />
					</Circle>
				</a>

				<a href="https://discord.ark.io/" className="rounded-full mr-2 hover:bg-theme-neutral-300">
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
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FIELD_NAME")}</FormLabel>
					<Input ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="email">
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FIELD_EMAIL")}</FormLabel>
					<Input ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="subject">
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FIELD_SUBJECT")}</FormLabel>
					<Select
						ref={methods.register({
							required: t("HELP.MODAL_CONTACT_US.SUBJECT_REQUIRED").toString(),
						})}
					>
						<option value="">{t("COMMON.SELECT")}</option>
						<option value="security">{t("HELP.MODAL_CONTACT_US.SUBJECT_OPTION.SECURITY")}</option>
						<option value="other">{t("HELP.MODAL_CONTACT_US.SUBJECT_OPTION.OTHER")}</option>
					</Select>
				</FormField>

				<FormField name="message">
					<FormLabel>{t("HELP.MODAL_CONTACT_US.FIELD_MESSAGE")}</FormLabel>
					<Textarea
						ref={methods.register({
							required: t("HELP.MODAL_CONTACT_US.MESSAGE_REQUIRED").toString(),
						})}
					/>
				</FormField>

				<div className="mt-4">
					<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
						{t("COMMON.CANCEL")}
					</Button>

					<Button type="submit" color="primary" variant="solid">
						{t("COMMON.SEND")}
					</Button>
				</div>
			</Form>
		</Modal>
	);
};

ContactUs.defaultProps = {
	isOpen: false,
};

ContactUs.displayName = "ContactUs";
