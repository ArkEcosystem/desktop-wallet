import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
// UI Elements
import { Modal } from "app/components/Modal";
import { Select } from "app/components/Select";
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

	return (
		<Modal
			title={t("HELP.MODAL_CONTACT_US.TITLE")}
			description={t("HELP.MODAL_CONTACT_US.DESCRIPTION")}
			isOpen={props.isOpen}
			onClose={props.onClose}
		>
			<div className="flex px-16 pb-8 mt-2 mb-8 -mx-16 text-black border-b border-gray-500">
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
					<TextArea
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
