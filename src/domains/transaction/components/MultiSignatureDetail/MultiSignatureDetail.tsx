import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";

type MultiSignatureDetailProps = {
	isOpen: boolean;
	transaction?: any;
	onClose?: any;
	onCancel?: any;
};

const SuccessBanner = images.common.SuccessBanner;

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
						<div className="flex justify-end mt-8">
							<div className="flex-1">
								<Button variant="plain" onClick={props.onCancel} className="mr-2">
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
									onClick={handleNext}
									className={activeStep === 1 ? "inline-block" : "hidden"}
								>
									{t("COMMON.SIGN")}
								</Button>

								<Button
									disabled={!isValid}
									data-testid="MultiSignatureDetail__submit-button"
									type="submit"
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
