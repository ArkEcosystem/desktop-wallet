import { images } from "app/assets/images";
import { Address } from "app/components/Address";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Form, FormField, FormLabel } from "app/components/Form";
import { Icon } from "app/components/Icon";
import { Input, InputPassword } from "app/components/Input";
import { Label } from "app/components/Label";
import { useSelectionState } from "app/components/SelectionBar";
import { Spinner } from "app/components/Spinner";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { TextArea } from "app/components/TextArea";
import { TransactionDetail } from "app/components/TransactionDetail";
import { InputFee } from "domains/transaction/components/InputFee";
import { LinkCollection } from "domains/transaction/components/LinkCollection";
import { LinkList } from "domains/transaction/components/LinkList";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React from "react";
import { useForm } from "react-hook-form";

type UpdateRegistrationProps = {
	formDefaultData?: any;
	onDownload: any;
};

const { ConfirmTransactionLedgerBanner } = images.transaction.common;

const FirstStep = ({ form }: { form: any }) => {
	const { register } = form;
	const selectionBarState = useSelectionState(1);

	return (
		<div data-testid="UpdateRegistration__first-step">
			<h1 className="mb-0">Update Business</h1>
			<div className="text-theme-neutral-700">
				Select the type of registration and the address you want to register with.
			</div>

			<div>
				<TransactionDetail border={false} className="pt-0 mt-6">
					<FormField name="name" className="font-normal">
						<FormLabel required>Name</FormLabel>
						<Input type="text" ref={register} defaultValue="ROBank Ecosystem" />
					</FormField>

					<FormField name="description" className="mt-8 font-normal">
						<FormLabel required>Description</FormLabel>
						<TextArea ref={register} defaultValue="Not a trustworthy bank" />
					</FormField>

					<FormField name="website" className="mt-8 font-normal">
						<FormLabel>Website</FormLabel>
						<Input type="website" ref={register} defaultValue="http://robank.com" />
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

				<TransactionDetail className="mt-4 pb-0">
					<FormField name="name" className="font-normal">
						<FormLabel>Fee ARK</FormLabel>
						<InputFee selectionBarState={selectionBarState} defaultValue={25} min={1} max={100} step={1} />
					</FormField>
				</TransactionDetail>
			</div>
		</div>
	);
};

const SecondStep = () => {
	const links = [
		{
			link: "http://github.com/robank",
			type: "github",
		},
		{
			link: "http://gitlab.com/robank",
			type: "gitlab",
		},
		{
			link: "http://bitbucket.com/robank",
			type: "bitbucket",
		},
		{
			link: "http://npmjs.com/robank",
			type: "npm",
		},
	];

	return (
		<div data-testid="UpdateRegistration__second-step">
			<div>
				<h1 className="mb-0">Transaction Review</h1>
				<p className="text-theme-neutral-dark">Check the information again before voting</p>
			</div>
			<div className="grid grid-flow-row mt-4">
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
					<div className="flex-auto font-semibold truncate text-theme-neutral-800 max-w-24">
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
						<Label color="warning">
							<span className="text-sm">Your address</span>
						</Label>
					</div>
					<Address address="AUexKjGtgsSpVzPLs6jNMM6vJ6znEVTQWK" walletName={"ROBank"} />
				</TransactionDetail>

				<TransactionDetail
					label="Type"
					extra={
						<div>
							<Circle className="border-black bg-theme-background" size="large">
								<Icon name="Business" width={20} height={20} />
							</Circle>
						</div>
					}
				>
					Update Business
				</TransactionDetail>

				<TransactionDetail label="Name">ROBank Eco</TransactionDetail>

				<TransactionDetail label="Description">Not a trustworthy bank</TransactionDetail>

				<TransactionDetail label="Website">
					<a href="https://ark.io" target="_blank" rel="noreferrer" className="link">
						https://ark.io
					</a>
				</TransactionDetail>

				<TransactionDetail className="mb-2">
					<LinkList
						title="Repository"
						description="Show your projects through the repository"
						links={links}
					/>
				</TransactionDetail>

				<div className="my-4">
					<TotalAmountBox transactionAmount="0.00" transactionFee="0.09660435" />
				</div>
			</div>
		</div>
	);
};

const ThirdStep = ({ form, passwordType }: { form: any; passwordType: "mnemonic" | "password" | "ledger" }) => {
	const { register } = form;

	return (
		<div data-testid="UpdateRegistration__third-step">
			{passwordType !== "ledger" && (
				<div>
					<h1 className="mb-0">Authenticate</h1>
					<div className="text-theme-neutral-700">
						Enter your twelve word mnemonic to authenticate the transaction.
					</div>

					<div className="mt-8">
						<FormField name="name">
							<FormLabel>{passwordType === "mnemonic" ? "Mnemonic" : "Encryption Password"}</FormLabel>
							<InputPassword name={passwordType} ref={register} />
						</FormField>

						<FormField name="name" className="mt-8">
							<FormLabel>2nd Mnemonic</FormLabel>
							<InputPassword name="secondMnemonic" ref={register} />
						</FormField>
					</div>
				</div>
			)}

			{passwordType === "ledger" && (
				<div>
					<h1 className="mb-0">Confirm Your Transaction</h1>
					<ConfirmTransactionLedgerBanner className="my-8" />

					<div className="mt-8 text-theme-neutral-700">
						Please review and verify the information on your Ledger device. Choose Accept to complete your
						transaction.
					</div>

					<div className="inline-flex items-center mt-8 space-x-3">
						<Spinner color="primary" size="default" />
						<span className="text-black">Waiting for confirmation...</span>
					</div>
				</div>
			)}
		</div>
	);
};

export const FourthStep = () => (
	<TransactionSuccessful>
		<TransactionDetail
			label="Transaction Type"
			extra={
				<Circle className="border-black" size="large">
					<Icon name="Business" width={20} height={20} />
				</Circle>
			}
		>
			Update Business
		</TransactionDetail>
		<TransactionDetail label="Name">ROBank Eco</TransactionDetail>
		<TransactionDetail label="Description">Not a trustworthy bank</TransactionDetail>
		<TransactionDetail label="Website">
			<a href="http://robank.com" target="_blank" rel="noreferrer" className="link">
				http://robank.com
			</a>
		</TransactionDetail>
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

export const UpdateRegistration = ({ formDefaultData, onDownload }: UpdateRegistrationProps) => {
	const form = useForm({ mode: "onChange", defaultValues: formDefaultData });
	const [activeTab, setActiveTab] = React.useState(1);
	const { formState } = form;
	const { isValid } = formState;

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<div data-testid="UpdateRegistration" className="max-w-xl mx-auto">
			<Form context={form} onSubmit={(data: any) => onDownload(data)}>
				<Tabs activeId={activeTab}>
					<StepIndicator size={6} activeIndex={activeTab} />

					<div className="mt-8">
						<TabPanel tabId={1}>
							<FirstStep form={form} />
						</TabPanel>
						<TabPanel tabId={2}>
							<SecondStep />
						</TabPanel>
						<TabPanel tabId={3}>
							<ThirdStep form={form} passwordType="mnemonic" />
						</TabPanel>
						<TabPanel tabId={4}>
							<ThirdStep form={form} passwordType="password" />
						</TabPanel>
						<TabPanel tabId={5}>
							<ThirdStep form={form} passwordType="ledger" />
						</TabPanel>
						<TabPanel tabId={6}>
							<FourthStep />
						</TabPanel>

						<div className="flex justify-end mt-8 space-x-3">
							{activeTab < 6 && (
								<Button
									disabled={activeTab === 1}
									data-testid="UpdateRegistration__back-button"
									variant="plain"
									onClick={handleBack}
								>
									Back
								</Button>
							)}

							{activeTab < 3 && (
								<Button
									data-testid="UpdateRegistration__continue-button"
									disabled={!isValid}
									onClick={handleNext}
								>
									Continue
								</Button>
							)}

							{activeTab >= 3 && activeTab < 6 && (
								<Button
									data-testid="UpdateRegistration__send-button"
									disabled={!isValid}
									onClick={handleNext}
								>
									<Icon name="Send" className="mr-2" width={20} height={20} />
									Send
								</Button>
							)}

							{activeTab === 6 && (
								<div className="flex justify-end space-x-3">
									<Button data-testid="UpdateRegistration__wallet-button" variant="plain">
										Back to wallet
									</Button>

									<Button
										type="submit"
										data-testid="UpdateRegistration__download-button"
										variant="plain"
									>
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

UpdateRegistration.defaultProps = {
	formDefaultData: {},
};
