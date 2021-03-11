import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { PasswordModal } from "domains/profile/components/PasswordModal";
import { ImportError } from "domains/profile/pages/ImportProfile/ErrorStep";
import { ProcessingImport } from "domains/profile/pages/ImportProfile/ProcessingImportStep";
import { ProfileForm } from "domains/profile/pages/ImportProfile/ProfileFormStep";
import { SelectFileStep } from "domains/profile/pages/ImportProfile/SelectFileStep";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { ImportFile } from "./models";

export const ImportProfile = () => {
	const { env, persist } = useEnvironmentContext();
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [fileFormat, setFileFormat] = useState(".dwe");
	const [selectedFile, setSelectedFile] = useState<ImportFile>();
	const [password, setPassword] = useState<string>();
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [profile, setProfile] = useState<Profile>();
	const [error, setError] = useState<string>("");

	const handleSelectedFiled = (file: ImportFile) => {
		setSelectedFile(file);
		setActiveTab(2);
	};

	const handleImportError = (errorMessage: string) => {
		setError(errorMessage);
		setActiveTab(10);
	};

	const handleProfileSave = (updatedProfile: Profile) => {
		env.profiles().fill({ [updatedProfile.id()]: updatedProfile.dump() });
		persist();
		history.push("/");
	};

	return (
		<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
			<Section className="flex flex-col">
				<div className="mx-auto max-w-xl">
					<StepIndicator size={4} activeIndex={activeTab} />

					<Tabs activeId={activeTab} className="mt-8">
						<TabPanel tabId={1}>
							<SelectFileStep
								fileFormat={fileFormat}
								onFileFormatChange={setFileFormat}
								onFileSelected={handleSelectedFiled}
								onBack={() => history.push("/")}
							/>
						</TabPanel>

						<TabPanel tabId={2}>
							{selectedFile && (
								<ProcessingImport
									env={env}
									password={password}
									file={selectedFile}
									onSuccess={(profile) => {
										setProfile(profile);
										setActiveTab(3);
									}}
									onPasswordRequired={() => setIsPasswordModalOpen(true)}
									onError={handleImportError}
								/>
							)}
						</TabPanel>

						<TabPanel tabId={3}>
							{profile && (
								<ProfileForm
									file={selectedFile}
									env={env}
									profile={profile}
									onSave={handleProfileSave}
									onBack={() => {
										setIsPasswordModalOpen(false);
										setPassword(undefined);
										setActiveTab(1);
									}}
								/>
							)}
						</TabPanel>

						<TabPanel tabId={10}>
							{selectedFile && (
								<ImportError
									file={selectedFile}
									error={error}
									onRetry={() => handleSelectedFiled(selectedFile)}
									onBack={() => history.push("/")}
								/>
							)}
						</TabPanel>
					</Tabs>

					<div className="text-left items-left">
						<PasswordModal
							isOpen={isPasswordModalOpen}
							title={t("PROFILE.IMPORT.PASSWORD_TITLE")}
							description={t("PROFILE.IMPORT.PASSWORD_DESCRIPTION")}
							onSubmit={(enteredPassword) => {
								setIsPasswordModalOpen(false);
								setPassword(enteredPassword);
							}}
							onClose={() => {
								setIsPasswordModalOpen(false);
								setPassword(undefined);
								setActiveTab(1);
							}}
						/>
					</div>
				</div>
			</Section>
		</Page>
	);
};
