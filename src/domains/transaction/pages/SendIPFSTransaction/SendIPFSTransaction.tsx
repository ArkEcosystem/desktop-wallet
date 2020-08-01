import { NetworkData } from "@arkecosystem/platform-sdk-profiles";
import { Address } from "app/components/Address";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { useSelectionState } from "app/components/SelectionBar";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TransactionDetail } from "app/components/TransactionDetail";
import { useActiveProfile } from "app/hooks/env";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { InputFee } from "domains/transaction/components/InputFee";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionField } from "domains/transaction/components/TransactionField";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const FirstStep = ({ networks }: { networks: NetworkData[] }) => {
	const { register } = useFormContext();
	const selectionBarState = useSelectionState(1);

	useEffect(() => {
		register("hash", { required: true });
		register("fee", { required: true });
	}, [register]);

	const { t } = useTranslation();

	return (
		<div data-testid="SendIPFSTransaction__step--first">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_IPFS.FIRST_STEP.DESCRIPTION")}</div>

			<div>
				<TransactionField border={false} label={t("TRANSACTION.NETWORK")} padding={false}>
					<SelectNetwork id="SendIPFSTransaction__network" networks={networks} />
				</TransactionField>

				<TransactionField border={false} label={t("TRANSACTION.SENDER")} padding={false}>
					<div className="relative flex items-center">
						<Input type="text" disabled />
						<div className="absolute flex items-center ml-3">
							<Avatar address="test" size="sm" noShadow className="mr-3" />
							<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName="ROBank" />
						</div>
					</div>
				</TransactionField>

				<TransactionField border={false} label={t("TRANSACTION.IPFS_HASH")} padding={false}>
					<Input name="hash" />
				</TransactionField>

				<TransactionField border={false} label={t("TRANSACTION.TRANSACTION_FEE")} className="pb-0">
					<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
				</TransactionField>
			</div>
		</div>
	);
};

export const SecondStep = () => {
	const { t } = useTranslation();

	return (
		<section data-testid="SendIPFSTransaction__step--second">
			<h1 className="mb-0">{t("TRANSACTION.PAGE_IPFS.SECOND_STEP.TITLE")}</h1>
			<div className="text-theme-neutral-dark">{t("TRANSACTION.PAGE_IPFS.SECOND_STEP.DESCRIPTION")}</div>

			<div className="mt-2 grid grid-flow-row gap-2">
				<TransactionDetail
					border={false}
					label={t("TRANSACTION.NETWORK")}
					extra={
						<div className="ml-1 text-theme-danger">
							<Circle className="bg-theme-background border-theme-danger-light" size="lg">
								<Icon name="Ark" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					<span>ARK Ecosystem</span>
				</TransactionDetail>

				<TransactionDetail
					label="Sender"
					extra={<Avatar address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" size="lg" />}
				>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label={t("TRANSACTION.IPFS_HASH")}
					extra={
						<div className="ml-1">
							<Circle className="border-black bg-theme-background" size="lg">
								<Icon name="Ipfs" width={23} height={23} />
							</Circle>
						</div>
					}
				>
					<span className="font-semibold">QmceNpwJqQm7vXUivbQeeQYeGr1ivT1VDRPaWK9Pf</span>
				</TransactionDetail>

				<TotalAmountBox transactionAmount="1.00" transactionFee="0.09660435" />
			</div>
		</section>
	);
};

export const ThirdStep = () => {
	const { register } = useFormContext();

	useEffect(() => {
		register("passphrase", { required: true });
	}, [register]);

	const { t } = useTranslation();

	return (
		<section data-testid="SendIPFSTransaction__step--third">
			<div>
				<h1 className="mb-0">{t("TRANSACTION.AUTHENTICATION_STEP.TITLE")}</h1>
				<div className="text-theme-neutral-dark">{t("TRANSACTION.AUTHENTICATION_STEP.DESCRIPTION")}</div>

				<div className="grid grid-flow-row">
					<TransactionDetail
						border={false}
						label={t("TRANSACTION.ENCRYPTION_PASSWORD")}
						className="pt-8 pb-0"
					>
						<InputPassword name="passphrase" ref={register({ required: true })} />
					</TransactionDetail>
				</div>
			</div>
		</section>
	);
};

export const FourthStep = () => {
	const { t } = useTranslation();

	return (
		<TransactionSuccessful>
			<TransactionDetail label={t("TRANSACTION.IPFS_HASH")}>
				<span className="font-semibold">QmceNpwJqQm7vXUivbQeeQYeGr1ivT1VDRPaWK9Pf</span>
			</TransactionDetail>

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				className="pb-0"
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
			>
				1.00 ARK
			</TransactionDetail>
		</TransactionSuccessful>
	);
};

type Props = {
	onCopy?: () => void;
	onSubmit?: any;
	networks?: NetworkData[];
};

export const SendIPFSTransaction = ({ onCopy, onSubmit, networks }: Props) => {
	const [activeTab, setActiveTab] = React.useState(1);

	const form = useForm({ mode: "onChange" });
	// const { formState } = form;
	// const { isValid } = formState;

	const activeProfile = useActiveProfile();

	const { t } = useTranslation();

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	const crumbs = [
		{
			route: `/profiles/${activeProfile?.id()}/dashboard`,
			label: "Go back to Portfolio",
		},
	];

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={onSubmit}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-8">
							<TabPanel tabId={1}>
								<FirstStep networks={networks!} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep />
							</TabPanel>

							<div className="flex justify-end mt-8 space-x-2">
								{activeTab < 4 && (
									<>
										<Button
											disabled={activeTab === 1}
											data-testid="SendIPFSTransaction__button--back"
											variant="plain"
											onClick={handleBack}
										>
											{t("COMMON.BACK")}
										</Button>
										<Button
											data-testid="SendIPFSTransaction__button--continue"
											variant="solid"
											// disabled={!isValid}
											onClick={handleNext}
										>
											{t("COMMON.CONTINUE")}
										</Button>
									</>
								)}

								{activeTab === 4 && (
									<>
										<Button
											data-testid="SendIPFSTransaction__button--back-to-wallet"
											variant="plain"
											className={"block"}
										>
											{t("COMMON.BACK_TO_WALLET")}
										</Button>
										<Button
											onClick={onCopy}
											data-testid="SendIPFSTransaction__button--copy"
											variant="plain"
											className="space-x-2"
										>
											<Icon name="Copy" />
											<span>{t("COMMON.COPY")}</span>
										</Button>
									</>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};

SendIPFSTransaction.defaultProps = {
	networks: [],
};
