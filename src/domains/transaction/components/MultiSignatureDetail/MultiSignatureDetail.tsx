import { Contracts } from "@arkecosystem/platform-sdk";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Form } from "app/components/Form";
import { Modal } from "app/components/Modal";
import { Spinner } from "app/components/Spinner";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import React, { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { AuthenticationStep } from "../AuthenticationStep";
import { SentStep } from "./SentStep";
import { SummaryStep } from "./SummaryStep";

type MultiSignatureDetailProps = {
	isOpen: boolean;
	wallet: ReadWriteWallet;
	transaction: Contracts.SignedTransactionData;
	onClose?: () => void;
};

const Paginator = (props: {
	onCancel?: () => void;
	onSign?: () => void;
	onBack?: () => void;
	onContinue?: () => void;
	isEnabled?: boolean;
	isLoading?: boolean;
	activeStep: number;
}) => {
	const { t } = useTranslation();
	return (
		<div className="flex justify-end mt-8 space-x-2">
			{props.activeStep === 1 && (
				<>
					<Button data-testid="Paginator__cancel" variant="plain" onClick={props.onCancel}>
						{t("COMMON.CANCEL")}
					</Button>

					<Button data-testid="Paginator__sign" onClick={props.onSign}>
						{t("COMMON.SIGN")}
					</Button>
				</>
			)}

			{props.activeStep === 2 && (
				<>
					<Button data-testid="Paginator__cancel" variant="plain" onClick={props.onBack}>
						{t("COMMON.BACK")}
					</Button>

					<Button
						disabled={!props.isEnabled || props.isLoading}
						data-testid="Paginator__continue"
						onClick={props.onContinue}
					>
						{props.isLoading ? <Spinner size="sm" /> : t("COMMON.CONTINUE")}
					</Button>
				</>
			)}
		</div>
	);
};

export const MultiSignatureDetail = ({ isOpen, wallet, transaction, onClose }: MultiSignatureDetailProps) => {
	const { persist } = useEnvironmentContext();
	const form = useForm({ mode: "onChange" });

	const { handleSubmit, formState } = form;
	const { isValid, isSubmitting } = formState;

	const [activeStep, setActiveStep] = useState(1);

	const needsFinalSignature = useMemo(() => wallet.coin().multiSignature().needsFinalSignature(transaction), [
		wallet,
		transaction,
	]);
	const isAwaitingOurSignature = wallet.transaction().isAwaitingOurSignature(transaction.id());

	const addSignature = useCallback(
		async ({ mnemonic }: { mnemonic: string }) => {
			await wallet.transaction().addSignature(transaction.id(), mnemonic);
			await wallet.transaction().sync();

			if (needsFinalSignature) {
				await wallet.transaction().broadcast(transaction.id());
			}

			await persist();
			setActiveStep(3);
		},
		[transaction, wallet, persist, needsFinalSignature],
	);

	return (
		<Modal title={""} isOpen={isOpen} onClose={onClose}>
			<Form context={form} onSubmit={() => void 0}>
				<Tabs activeId={activeStep}>
					<TabPanel tabId={1}>
						<SummaryStep wallet={wallet} transaction={transaction} />
					</TabPanel>

					<TabPanel tabId={2}>
						<AuthenticationStep wallet={wallet} />
					</TabPanel>

					<TabPanel tabId={3}>
						<SentStep transaction={transaction} wallet={wallet} />
					</TabPanel>

					{(isAwaitingOurSignature || needsFinalSignature) && (
						<Paginator
							activeStep={activeStep}
							onCancel={onClose}
							onSign={() => setActiveStep(2)}
							onBack={() => setActiveStep(1)}
							onContinue={handleSubmit((data: any) => addSignature(data))}
							isLoading={isSubmitting}
							isEnabled={isValid}
						/>
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
