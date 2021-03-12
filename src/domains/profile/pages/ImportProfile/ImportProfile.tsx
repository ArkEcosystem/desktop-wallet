import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { ImportError } from "domains/profile/pages/ImportProfile/ErrorStep";
import { ProcessingImport } from "domains/profile/pages/ImportProfile/ProcessingImportStep";
import { ImportProfileForm } from "domains/profile/pages/ImportProfile/ProfileFormStep";
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
		updatedProfile.save(password);
		env.profiles().fill({ [updatedProfile.id()]: updatedProfile.dump() });

		persist();
		history.push("/");
	};

	return (
		<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
			<Section className="flex flex-col">
				<div className="mx-auto max-w-xl">
					<StepIndicator size={3} activeIndex={activeTab} />

					<Tabs activeId={activeTab} className="mt-8">
						<TabPanel tabId={1}>
							<SelectFileStep
								fileFormat={fileFormat}
								onFileFormatChange={setFileFormat}
								onSelect={handleSelectedFiled}
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
									onPasswordChange={setPassword}
									onBack={() => setActiveTab(1)}
									onError={handleImportError}
								/>
							)}
						</TabPanel>

						<TabPanel tabId={3}>
							{profile && (
								<ImportProfileForm
									file={selectedFile}
									env={env}
									profile={profile}
									password={password}
									onSubmit={handleProfileSave}
									onBack={() => {
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
				</div>
			</Section>
		</Page>
	);
};
