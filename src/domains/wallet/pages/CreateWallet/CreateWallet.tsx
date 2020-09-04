import { Environment, NetworkData, Profile, ReadWriteWallet, WalletSetting } from "@arkecosystem/platform-sdk-profiles";
import { Alert } from "app/components/Alert";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Clipboard } from "app/components/Clipboard";
import { Divider } from "app/components/Divider";
import { Form, FormField, FormHelperText, FormLabel } from "app/components/Form";
import { Header } from "app/components/Header";
import { Icon } from "app/components/Icon";
import { Input } from "app/components/Input";
import { Page, Section } from "app/components/Layout";
import { StepIndicator } from "app/components/StepIndicator";
import { TabPanel, Tabs } from "app/components/Tabs";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile } from "app/hooks/env";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { SelectNetwork } from "domains/network/components/SelectNetwork";
import { getNetworkExtendedData } from "domains/network/helpers";
import React, { useEffect, useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { MnemonicList } from "../../components/MnemonicList";
import { MnemonicVerification } from "../../components/MnemonicVerification";
import { FirstStep } from "./Step1";
import { SecondStep } from "./Step2";
import { ThirdStep } from "./Step3";
import { FourthStep } from "./Step4";

export const CreateWallet = () => {
	const { env, persist } = useEnvironmentContext();
	const history = useHistory();
	const { t } = useTranslation();

	const [activeTab, setActiveTab] = useState(1);
	const activeProfile = useActiveProfile();
	const dashboardRoute = `/profiles/${activeProfile.id()}/dashboard`;
	const nameMaxLength = 42;

	const crumbs = [
		{
			route: dashboardRoute,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const form = useForm({ mode: "onChange" });
	const { getValues, formState, register, setValue } = form;

	useEffect(() => {
		register("network", { required: true });
		register("wallet", { required: true });
		register("mnemonic", { required: true });
	}, [register]);

	const submitForm = async ({ name }: any) => {
		const formattedName = name.substring(0, nameMaxLength);
		activeProfile.wallets().findById(getValues("wallet").id()).settings().set(WalletSetting.Alias, formattedName);

		await persist();

		setValue("wallet", null);

		history.push(dashboardRoute);
	};

	useEffect(
		() => () => {
			const currentWallet = getValues("wallet");

			if (currentWallet) {
				activeProfile.wallets().forget(currentWallet.id());
			}
		},
		[activeProfile, getValues],
	);

	const handleBack = () => {
		setActiveTab(activeTab - 1);
	};

	const handleNext = () => {
		setActiveTab(activeTab + 1);
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section className="flex-1">
				<Form className="max-w-xl mx-auto" context={form} onSubmit={submitForm}>
					<Tabs activeId={activeTab}>
						<StepIndicator size={4} activeIndex={activeTab} />

						<div className="mt-4">
							<TabPanel tabId={1}>
								<FirstStep env={env} profile={activeProfile} />
							</TabPanel>
							<TabPanel tabId={2}>
								<SecondStep />
							</TabPanel>
							<TabPanel tabId={3}>
								<ThirdStep />
							</TabPanel>
							<TabPanel tabId={4}>
								<FourthStep nameMaxLength={nameMaxLength} />
							</TabPanel>

							<div className="flex justify-end mt-10 space-x-3">
								<Button
									disabled={activeTab === 1}
									data-testid="CreateWallet__back-button"
									variant="plain"
									onClick={handleBack}
								>
									Back
								</Button>

								{activeTab < 4 && (
									<Button
										data-testid="CreateWallet__continue-button"
										disabled={!formState.isValid}
										onClick={handleNext}
									>
										{t("COMMON.CONTINUE")}
									</Button>
								)}

								{activeTab === 4 && (
									<Button
										disabled={formState.isSubmitting}
										type="submit"
										data-testid="CreateWallet__save-button"
									>
										{t("COMMON.SAVE_FINISH")}
									</Button>
								)}
							</div>
						</div>
					</Tabs>
				</Form>
			</Section>
		</Page>
	);
};
