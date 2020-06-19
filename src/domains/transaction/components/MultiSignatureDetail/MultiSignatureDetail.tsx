import { images } from "app/assets/images";
// UI Elements
import { Badge } from "app/components/Badge";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type MultiSignatureDetailProps = {
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

const SuccessBanner = images.common.SuccessBanner;

const Signatures = () => {
	const { t } = useTranslation();

	return (
		<div>
			<h2 className="mb-0">{t("TRANSACTION.SIGNATURES")}</h2>

			<div className="flex">
				<div>
					<div className="mb-2 text-sm font-semibold text-theme-neutral-500">{t("COMMON.YOU")}</div>

					<div className="pr-4 mr-2 border-r border-theme-neutral-300">
						<Circle avatarId="test" className="relative ml-2">
							<Badge
								className="bottom-0 -right-1 bg-theme-success-200 text-theme-success-500"
								icon="Checkmark"
							/>
						</Circle>
					</div>
				</div>

				<div>
					<div className="mb-2 ml-2 text-sm font-semibold text-theme-neutral-500">{t("COMMON.OTHER")}</div>

					<Circle avatarId="test" className="relative ml-2">
						<Badge
							className="bottom-0 -right-1 bg-theme-danger-100 text-theme-danger-400"
							icon="StatusClock"
						/>
					</Circle>

					<Circle avatarId="test" className="relative ml-4">
						<Badge
							className="bottom-0 -right-1 bg-theme-danger-100 text-theme-danger-400"
							icon="StatusClock"
						/>
					</Circle>

					<Circle avatarId="test" className="relative ml-4">
						<Badge
							className="bottom-0 -right-1 bg-theme-success-200 text-theme-success-500"
							icon="Checkmark"
						/>
					</Circle>

					<Circle avatarId="test" className="relative ml-4">
						<Badge
							className="bottom-0 -right-1 bg-theme-danger-100 text-theme-danger-400"
							icon="StatusClock"
						/>
					</Circle>
				</div>
			</div>
		</div>
	);
};

export const FirstStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="MultiSignatureDetail__first-step">
			<TransactionDetail label={t("TRANSACTION.SENDER")} extra={<Circle avatarId="test" />} border={false}>
				<div className="mt-2 font-semibold">ADDRESS</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.RECIPIENT")} extra={<Circle avatarId="test" />}>
				Bank
				<span className="ml-2 text-theme-neutral-500">ADDR...ESSS</span>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<Circle className="border-theme-danger-100 text-theme-danger-400">
						<Icon name="Sent" width={40} height={40} />
					</Circle>
				}
			>
				<Label color="danger">2,088.84557 ARK</Label>

				<span className="ml-2 text-theme-neutral-500">23,000.00 USD</span>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TRANSACTION_FEE")}>0.09812015 ARK</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.SMARTBRIDGE")}>
				<div className="flex justify-between">
					Hello!
					<Icon name="Smartbridge" width={20} height={20} />
				</div>
			</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.TIMESTAMP")}>14.04.2020 21:42:40</TransactionDetail>

			<TransactionDetail label={t("TRANSACTION.CONFIRMATIONS")} className="pb-0">
				{t("TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.WAITING_FOR_SIGNATURES")}
			</TransactionDetail>

			<div className="px-16 pt-8 mt-2 mt-8 -mx-16 text-black border-t border-gray-500">
				<Signatures />
			</div>
		</section>
	);
};

export const SecondStep = () => {
	const { t } = useTranslation();
	const { register } = useFormContext();

	return (
		<section data-testid="MultiSignatureDetail__second-step">
			<FormField name="passphrase">
				<FormLabel label={t("COMMON.YOUR_PASSPHRASE")} />
				<InputPassword data-testid="import-wallet__passphrase-input" ref={register({ required: true })} />
				<FormHelperText />
			</FormField>
		</section>
	);
};

export const ThirdStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="MultiSignatureDetail__third-step" className="my-4 text-black">
			<Signatures />
		</section>
	);
};

export const MultiSignatureDetail = (props: MultiSignatureDetailProps) => {
	const { t } = useTranslation();
	const [activeStep, setActiveStep] = React.useState(1);
	const title = t(`TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_${activeStep}.TITLE`);
	const description = t(`TRANSACTION.MODAL_MULTISIGNATURE_DETAIL.STEP_${activeStep}.DESCRIPTION`, "");
	let image = null;
	if (activeStep === 3) {
		image = <SuccessBanner data-testid="MultiSignatureDetail__success-banner" className="mt-8 mb-12" />;
	}

	const form = useForm({ mode: "onChange" });
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	return (
		<Modal title={title} description={description} image={image} isOpen={props.isOpen} onClose={props.onClose}>
			<Form context={form} onSubmit={handleNext}>
				<Tabs activeId={activeStep}>
					<TabPanel tabId={1}>
						<FirstStep />
					</TabPanel>
					<TabPanel tabId={2}>
						<SecondStep />
					</TabPanel>
					<TabPanel tabId={3}>
						<ThirdStep />
					</TabPanel>

					{activeStep < 3 && (
						<div className="flex justify-end mt-6">
							<div className="flex-1">
								<Button color="primary" variant="plain" onClick={props.onCancel} className="mr-2">
									{t("COMMON.CANCEL")}
								</Button>
							</div>

							<div className="space-x-3">
								<Button
									disabled={activeStep === 1}
									data-testid="MultiSignatureDetail__back-button"
									variant="plain"
									onClick={handleBack}
								>
									{t("COMMON.BACK")}
								</Button>

								<Button
									data-testid="MultiSignatureDetail__sign-button"
									variant="solid"
									onClick={handleNext}
									className={activeStep === 1 ? "inline-block" : "hidden"}
								>
									{t("COMMON.SIGN")}
								</Button>

								<Button
									disabled={!isValid}
									data-testid="MultiSignatureDetail__submit-button"
									type="submit"
									variant="solid"
									className={activeStep === 2 ? "inline-block" : "hidden"}
								>
									{t("COMMON.CONTINUE")}
								</Button>
							</div>
						</div>
					)}
				</Tabs>
			</Form>
		</Modal>
	);
};

MultiSignatureDetail.defaultProps = {
	isOpen: false,
};

MultiSignatureDetail.displayName = "MultiSignatureDetail";
