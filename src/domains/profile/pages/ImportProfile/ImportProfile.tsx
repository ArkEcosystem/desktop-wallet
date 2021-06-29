import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { ReadableFile } from "app/hooks/use-files";
import { ImportError } from "domains/profile/pages/ImportProfile/ErrorStep";
import { ProcessingImport } from "domains/profile/pages/ImportProfile/ProcessingImportStep";
import { ImportProfileForm } from "domains/profile/pages/ImportProfile/ProfileFormStep";
import { SelectFileStep } from "domains/profile/pages/ImportProfile/SelectFileStep";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

export const ImportProfile = () => {
	const { env, persist } = useEnvironmentContext();
	const { t } = useTranslation();
	const history = useHistory();

	const [activeTab, setActiveTab] = useState(1);
	const [fileFormat, setFileFormat] = useState(".dwe");
	const [selectedFile, setSelectedFile] = useState<ReadableFile>();
	const [password, setPassword] = useState<string>();
	const [profile, setProfile] = useState<Contracts.IProfile>();

	const handleSelectedFile = (file: ReadableFile) => {
		setSelectedFile(file);
		setActiveTab(2);
	};

	const handleImportError = () => {
		setActiveTab(10);
	};

	const handleProfileSave = (importedProfile: Contracts.IProfile) => {
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
								onSelect={handleSelectedFile}
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
									shouldValidate
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
									onRetry={() => handleSelectedFile(selectedFile)}
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
