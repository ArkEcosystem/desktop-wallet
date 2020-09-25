import { Contracts } from "@arkecosystem/platform-sdk";
import { ExtendedTransactionData, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Modal } from "app/components/Modal";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AuthenticationStep } from "../AuthenticationStep";
import { FirstStep } from "./Step1";
import { ThirdStep } from "./Step3";

type MultiSignatureDetailProps = {
	transaction: ExtendedTransactionData | Contracts.SignedTransactionData;
	wallet?: ReadWriteWallet;
	isOpen: boolean;
	onClose?: any;
	onCancel?: any;
};

const SuccessBanner = images.common.SuccessBanner;

export const MultiSignatureDetail = ({ transaction, wallet, isOpen, onClose, onCancel }: MultiSignatureDetailProps) => {
	const { persist } = useEnvironmentContext();
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

	const signTransaction = async (values: object) => {
		const { mnemonic } = values as Record<string, string>;

		await wallet!.transaction().addSignature(transaction.id(), mnemonic);
		await persist();

		handleNext();
	};

	return (
		<Modal title={title} description={description} image={image} isOpen={isOpen} onClose={onClose}>
			<Form context={form} onSubmit={(data) => signTransaction(data)}>
				<Tabs activeId={activeStep}>
					<TabPanel tabId={1}>
						<FirstStep transaction={transaction} />
					</TabPanel>
					<TabPanel tabId={2}>
						<AuthenticationStep wallet={wallet!} />
					</TabPanel>
					<TabPanel tabId={3}>
						<ThirdStep />
					</TabPanel>

					{wallet?.transaction().isAwaitingOurSignature(transaction.id()) && (
						<div className="flex justify-end mt-8">
							<div className="flex-1">
								<Button variant="plain" onClick={onCancel} className="mr-2">
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
