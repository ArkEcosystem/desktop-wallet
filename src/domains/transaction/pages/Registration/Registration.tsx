import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { Select } from "app/components/Select";
import { useSelectionState } from "app/components/SelectionBar";
import { Spinner } from "app/components/Spinner";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { ProfileFormField } from "domains/profile/components/ProfileFormField";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { styled } from "twin.macro";

type RegistrationProps = {
	addresses: any;
	formDefaultData: any;
	onSubmit: any;
	networks: any;
	registrationTypes: any;
};

type Network = { label: string; value: string; icon: string; iconClass: string };
type RegistrationType = { label: string; value: string };

const { ConfirmTransactionLedgerBanner } = images.transaction.common;

const FormWrapper = styled.div`
	.select-transparent {
		select {
			&:not([disabled]) {
				background-color: transparent;
				color: transparent;
			}
			option {
				color: var(--theme-color-neutral-900);
			}
		}
	}

	.send-transaction {
		&__select-contact {
			> div:first-child {
				width: 100%;
				svg {
					display: none;
				}
			}
		}
	}
`;

// TODO: To be removed with new component in design update
const NetworkFormField = ({ className, networks, register, selectedNetwork }: any) => {
	return (
		<FormField name="network" className={`relative h-20 ${className}`}>
			<div className="mb-2">
				<FormLabel label="Network" />
			</div>
			<div className=" select-transparent">
				<Select placeholder=" " name="network" ref={register} data-testid="send-transaction__network-select">
					{networks &&
						networks.map((network: any, index: number) => (
							<option key={index} value={network.value} data-testid="send-transaction__network-option">
								{network.label}
							</option>
						))}
				</Select>
			</div>

			{!selectedNetwork && (
				<div className="absolute ml-4 -mt-10">
					<Circle className="border-theme-neutral-200" size="small" noShadow />
				</div>
			)}

			{selectedNetwork && (
				<div className="flex items-center ml-4 -mt-10">
					<Circle className={selectedNetwork.iconClassName} size="small" noShadow>
						<Icon name={selectedNetwork.icon} width={18} height={18} />
					</Circle>
					<div className="ml-4 text-theme-neutral-800">{selectedNetwork.label}</div>
				</div>
			)}
		</FormField>
	);
};

const RegistrationTypeDropdown = ({ className, register, registrationTypes, selectedType }: any) => (
	<FormField name="registrationType" className={`relative h-20 ${className}`}>
		<div className="mb-2">
			<FormLabel label="Registration Type" />
		</div>
		<div className="select-transparent">
			<Select
				placeholder=" "
				name="registrationType"
				ref={register}
				data-testid="send-transaction__network-select"
			>
				{registrationTypes &&
					registrationTypes.map((registrationType: any, index: number) => (
						<option
							key={index}
							value={registrationType.value}
							data-testid="send-transaction__network-option"
						>
							{registrationType.label}
						</option>
					))}
			</Select>

			{selectedType && <div className="flex items-center ml-4 -mt-9 leading-tight">{selectedType.label}</div>}
		</div>
	</FormField>
);

const getNetworkByName = (networks: any[], networkValue: string) => {
	return networks.find((network: any) => network.value === networkValue);
};

const getAddressInfo = (addresses: any[], address: string) => {
	return addresses.find((profile: any) => profile.address === address);
};

const getRegistrationByName = (registrationTypes: any[], registrationType: string) => {
	return registrationTypes.find((type: any) => type.value === registrationType);
};

const FirstStep = ({
	addresses,
	form,
	networks,
	registrationTypes,
}: {
	addresses: any;
	form: any;
	networks: Network[];
	registrationTypes: RegistrationType[];
}) => {
	const { register } = form;
	const { address, network, registrationType } = form.watch();

	return (
		<div>
			<h1>Registration</h1>
			<div className="text-theme-neutral-700">
				Select the type of registration and the address you want to register with.
			</div>

			<FormWrapper className="mt-5">
				<NetworkFormField
					register={register({ required: true })}
					selectedNetwork={getNetworkByName(networks, network)}
					networks={networks}
				/>

				<ProfileFormField
					disabled={!network}
					formName="address"
					formLabel="Address"
					profiles={addresses}
					selectedProfile={getAddressInfo(addresses, address)}
					register={register({ required: true })}
					withoutAdditional={true}
					className="mt-8"
				/>

				<RegistrationTypeDropdown
					register={register({ required: true })}
					selectedType={getRegistrationByName(registrationTypes, registrationType)}
					registrationTypes={registrationTypes}
					className="mt-8"
				/>
			</FormWrapper>
		</div>
	);
};

const SecondStep = ({ form }: { form: any }) => {
	const { register } = form;
	const selectionBarState = useSelectionState(1);
	const { network, address, registrationType } = form.watch();

	return (
		<div>
			<h1>Register {registrationType}</h1>
			<div className="text-theme-neutral-700">
				Select the type of registration and the address you want to register with.
			</div>

			<FormWrapper>
				<TransactionDetail border={false} className="mb-8">
					<FormField name="name">
						<FormLabel>Name</FormLabel>
						<Input type="text" ref={register({ required: true })} />
					</FormField>

					<FormField name="name" className="mt-8">
						<FormLabel>Description *</FormLabel>
						<TextArea ref={register({ required: true })} />
					</FormField>

					<FormField name="website" className="mt-8">
						<FormLabel>Website</FormLabel>
						<Input type="website" ref={register} />
					</FormField>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkCollection
						title="Repository"
						description="Show your projects through your repository"
						types={[
							{ label: "BitBucket", value: "bitbucket" },
							{ label: "GitHub", value: "github" },
							{ label: "GitLab", value: "gitlab" },
						]}
						typeName="repository"
					/>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkCollection
						title="Social Media"
						description="Tell people more about yourself through social media"
						types={[
							{ label: "Facebook", value: "facebook" },
							{ label: "Twitter", value: "twitter" },
							{ label: "LinkedIn", value: "linkedin" },
						]}
						typeName="media"
					/>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkCollection
						title="Photo and Video"
						description="Get more users and add more information about yourself"
						types={[
							{ label: "YouTube", value: "youtube" },
							{ label: "Vimeo", value: "vimeo" },
							{ label: "Flickr", value: "flickr" },
						]}
						typeName="files"
						selectionTypes={["flickr"]}
						selectionTypeTitle="Avatar"
					/>
				</TransactionDetail>

				<TransactionDetail label="Fee ARK" className="mt-4">
					<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
				</TransactionDetail>
			</FormWrapper>
		</div>
	);
};

const ThirdStep = () => (
	<section className="space-y-8">
		<div>
			<h1 className="mb-0">Transaction Review</h1>
			<p className="text-theme-neutral-dark">Check the information again before voting</p>
		</div>
		<div className="grid grid-flow-row gap-2">
			<TransactionDetail
				border={false}
				label="Network"
				extra={
					<div className="ml-1 text-theme-danger-500">
						<Circle className="bg-theme-background border-theme-danger-200" size="large">
							<Icon name="Ark" width={20} height={20} />
						</Circle>
					</div>
				}
			>
				<div className="flex-auto text-xl font-semibold truncate text-theme-neutral-800 max-w-24">
					ARK Ecosystem
				</div>
			</TransactionDetail>

			<TransactionDetail
				label=" "
				extra={
					<div>
						<Circle avatarId="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" />
					</div>
				}
			>
				<div className="mb-2 text-sm font-semibold text-theme-neutral-500">
					<span className="mr-1">Sender</span>
					<Label color="warning">Your address</Label>
				</div>
				<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} size="large" />
			</TransactionDetail>

			<TransactionDetail
				label="Type"
				extra={
					<div>
						<Circle className="bg-theme-background border-black" size="large">
							<Icon name="Business" width={32} height={32} />
						</Circle>
					</div>
				}
			>
				Business Registration
			</TransactionDetail>

			<TransactionDetail label="Name">ROBank Eco</TransactionDetail>

			<TransactionDetail label="Description">Not a trustworthy bank</TransactionDetail>

			<TransactionDetail label="Website">
				<a href="https://ark.io">https://ark.io</a>
			</TransactionDetail>

			<TransactionDetail className="mb-2">
				<LinkCollection
					title="Repository"
					description="Show your projects through your repository"
					types={[
						{ label: "BitBucket", value: "bitbucket" },
						{ label: "GitHub", value: "github" },
						{ label: "GitLab", value: "gitlab" },
					]}
					data={[
						{ link: "test", type: "bitbucket" },
						{ link: "test 2", type: "github" },
					]}
					typeName="repository"
					readonly
				/>
			</TransactionDetail>

			<TransactionDetail className="mb-2">
				<LinkCollection
					title="Social Media"
					description="Tell people more about yourself through social media"
					types={[
						{ label: "Facebook", value: "facebook" },
						{ label: "Twitter", value: "twitter" },
						{ label: "LinkedIn", value: "linkedin" },
					]}
					data={[
						{ link: "test", type: "facebook" },
						{ link: "test 2", type: "twitter" },
					]}
					typeName="media"
					readonly
				/>
			</TransactionDetail>

			<TransactionDetail className="mb-2">
				<LinkCollection
					title="Photo and Video"
					description="Get more users and add more information about yourself"
					types={[
						{ label: "YouTube", value: "youtube" },
						{ label: "Vimeo", value: "vimeo" },
						{ label: "Flickr", value: "flickr" },
					]}
					data={[
						{ link: "test", type: "youtube" },
						{ link: "test 2", type: "flickr" },
					]}
					typeName="files"
					selectionTypes={["flickr"]}
					selectionTypeTitle="Avatar"
					readonly
				/>
			</TransactionDetail>

			<div className="my-4">
				<TotalAmountBox transactionAmount="0.00" transactionFee="0.09660435" />
			</div>
		</div>
	</section>
);

const FourthStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;
	const selectionBarState = useSelectionState(1);
	const { mnemonic, password } = form.watch();

	return (
		<div>
			{passwordType !== "ledger" && (
				<div>
					<h1>Authenticate</h1>
					<div className="text-theme-neutral-700 text-sm">
						Enter your twelve word mnemonic to authenticate the transaction.
					</div>

					<FormWrapper className="mt-5">
						<FormField name="name">
							<FormLabel>{passwordType === "mnemonic" ? "Mnemonic" : "Encryption Password"}</FormLabel>
							<InputPassword name={passwordType} ref={register({ required: true })} />
						</FormField>

						<FormField name="name" className="mt-8">
							<FormLabel>2nd Mnemonic</FormLabel>
							<InputPassword name="secondMnemonic" ref={register({ required: true })} />
						</FormField>
					</FormWrapper>
				</div>
			)}

			{passwordType === "ledger" && (
				<div>
					<h1>Confirm Your Transaction</h1>
					<ConfirmTransactionLedgerBanner />

					<div className="text-theme-neutral-700 mt-8">
						Please review and verify the information on your Ledger device. Choose Accept to complete your
						transaction.
					</div>

					<div className="inline-flex items-center mt-5 space-x-3">
						<Spinner color="primary" size="default" />
						<span className="text-black">Waiting for confirmation...</span>
					</div>
				</div>
			)}
		</div>
	);
};

export const FifthStep = () => (
	<TransactionSuccessful>
		<TransactionDetail
			label="Transaction Type"
			extra={
				<Circle className="border-black" size="large">
					<Icon name="Business" width={20} height={20} />
				</Circle>
			}
		>
			Business Registration
		</TransactionDetail>
		<TransactionDetail label="Name">ROBank Eco</TransactionDetail>
		<TransactionDetail label="Description">Not a trustworthy bank</TransactionDetail>
		<TransactionDetail label="Website">ROBank Eco</TransactionDetail>
		<TransactionDetail
			label="Amount"
			extra={
				<div className="ml-1 text-theme-danger">
					<Circle className="bg-theme-background border-theme-danger-200" size="large">
						<Icon name="Sent" width={50} height={50} />
					</Circle>
				</div>
			}
		>
			1.09660435 ARK
		</TransactionDetail>
	</TransactionSuccessful>
);

export const Registration = ({
	addresses,
	formDefaultData,
	onSubmit,
	networks,
	registrationTypes,
}: RegistrationProps) => {
	const { t } = useTranslation();

	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const [activeTab, setActiveTab] = React.useState(7);
	const { formState } = form;
	const { isValid } = formState;
	const { network, address, registrationType } = form.watch();

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div data-testid="Registration" className="max-w-xl mx-auto">
			<Form context={form} onSubmit={(data: any) => onSubmit(data)}>
				<Tabs activeId={activeTab}>
					<StepIndicator size={7} activeIndex={activeTab} />

					<div className="mt-4">
						<TabPanel tabId={1}>
							<FirstStep
								addresses={addresses}
								form={form}
								networks={networks}
								registrationTypes={registrationTypes}
							/>
						</TabPanel>
						<TabPanel tabId={2}>
							<SecondStep form={form} />
						</TabPanel>
						<TabPanel tabId={3}>
							<ThirdStep />
						</TabPanel>
						<TabPanel tabId={4}>
							<FourthStep form={form} passwordType="mnemonic" />
						</TabPanel>
						<TabPanel tabId={5}>
							<FourthStep form={form} passwordType="password" />
						</TabPanel>
						<TabPanel tabId={6}>
							<FourthStep form={form} passwordType="ledger" />
						</TabPanel>
						<TabPanel tabId={7}>
							<FifthStep />
						</TabPanel>

						<div className="flex justify-end mt-8 space-x-3">
							{activeTab < 7 && (
								<Button
									disabled={activeTab === 1}
									data-testid="CreateWallet__back-button"
									variant="plain"
									onClick={handleBack}
								>
									Back
								</Button>
							)}

							{activeTab < 4 && (
								<Button
									data-testid="CreateWallet__continue-button"
									disabled={!isValid}
									onClick={handleNext}
								>
									Continue
								</Button>
							)}

							{activeTab >= 4 && activeTab < 7 && (
								<Button
									data-testid="CreateWallet__save-button"
									disabled={!isValid}
									onClick={handleNext}
								>
									<Icon name="Send" className="mr-2" width={20} height={20} />
									Send
								</Button>
							)}

							{activeTab === 7 && (
								<div className="flex justify-end space-x-3">
									<Button data-testid="CreateWallet__save-button" variant="plain">
										Back to wallet
									</Button>

									<Button type="submit" data-testid="CreateWallet__save-button" variant="plain">
										<Icon name="Download" className="mr-2" />
										Download
									</Button>
								</div>
							)}
						</div>
					</div>
				</Tabs>
			</Form>
		</div>
	);
};
