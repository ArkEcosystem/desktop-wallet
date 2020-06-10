import React from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useForm } from "react-hook-form";
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
} & WrappedComponentProps;

export const ContactUs = injectIntl(({ intl: { formatMessage }, ...props }: ContactUsProps) => {
	const methods = useForm({ mode: "onChange" });

	return (
		<Modal
			title={formatMessage({ id: "MODAL_CONTACT_US_TITLE" })}
			description={formatMessage({ id: "MODAL_CONTACT_US_DESCRIPTION" })}
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
					<FormLabel>{formatMessage({ id: "MODAL_CONTACT_US_FIELD_NAME" })}</FormLabel>
					<Input ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="email">
					<FormLabel>{formatMessage({ id: "MODAL_CONTACT_US_FIELD_EMAIL" })}</FormLabel>
					<Input ref={methods.register({ required: "Field required" })} />
					<FormHelperText />
				</FormField>

				<FormField name="subject">
					<FormLabel>{formatMessage({ id: "MODAL_CONTACT_US_FIELD_SUBJECT" })}</FormLabel>
					<Select
						ref={methods.register({
							required: formatMessage({ id: "MODAL_CONTACT_US_SUBJECT_REQUIRED" }),
						})}
					>
						<option value="">{formatMessage({ id: "COMMON_SELECT" })}</option>
						<option value="security">
							{formatMessage({ id: "MODAL_CONTACT_US_SUBJECT_OPTION_SECURITY" })}
						</option>
						<option value="other">{formatMessage({ id: "MODAL_CONTACT_US_SUBJECT_OPTION_OTHER" })}</option>
					</Select>
				</FormField>

				<FormField name="message">
					<FormLabel>{formatMessage({ id: "MODAL_CONTACT_US_FIELD_MESSAGE" })}</FormLabel>
					<Textarea
						ref={methods.register({
							required: formatMessage({ id: "MODAL_CONTACT_US_MESSAGE_REQUIRED" }),
						})}
					/>
				</FormField>

				<div className="mt-4">
					<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
						{formatMessage({ id: "COMMON_CANCEL" })}
					</Button>

					<Button type="submit" color="primary" variant="solid">
						{formatMessage({ id: "COMMON_SEND" })}
					</Button>
				</div>
			</Form>
		</Modal>
	);
});

ContactUs.defaultProps = {
	isOpen: false,
};

ContactUs.displayName = "ContactUs";
