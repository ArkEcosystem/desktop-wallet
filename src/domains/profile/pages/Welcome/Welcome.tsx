import { Contracts } from "@arkecosystem/platform-sdk-profiles";
import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
import { Link } from "app/components/Link";
import { useEnvironmentContext } from "app/contexts";
import { useProfileRestore } from "app/hooks";
import { DeleteProfile } from "domains/profile/components/DeleteProfile/DeleteProfile";
import { ProfileCard } from "domains/profile/components/ProfileCard";
import { SignIn } from "domains/profile/components/SignIn/SignIn";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setScreenshotProtection } from "utils/electron-utils";

export const Welcome = () => {
	const context = useEnvironmentContext();
	const { restoreProfile } = useProfileRestore();
	const history = useHistory();

	const { t } = useTranslation();

	const profiles = useMemo(() => context.env.profiles().values(), [context]);

	const [deletingProfileId, setDeletingProfileId] = useState<string | undefined>();
	const [selectedProfile, setSelectedProfile] = useState<Contracts.IProfile | undefined>();
	const [requestedAction, setRequestedAction] = useState<any>();

	const profileCardActions = [
		{ label: t("COMMON.SETTINGS"), value: "setting" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	useEffect(() => setScreenshotProtection(true));

	const navigateToProfile = (profile: Contracts.IProfile, subPath = "dashboard") => {
		history.push(`/profiles/${profile.id()}/${subPath}`);
	};

	const closeDeleteProfileModal = () => {
		setDeletingProfileId(undefined);
	};

	const closeSignInModal = () => {
		setSelectedProfile(undefined);
		setRequestedAction(undefined);
	};

	const handleClick = (profile: Contracts.IProfile) => {
		if (profile.usesPassword()) {
			setSelectedProfile(profile);
			setRequestedAction({ label: "Homepage", value: "home" });
		} else {
			restoreProfile(profile);
			navigateToProfile(profile);
		}
	};

	const handleProfileAction = (profile: Contracts.IProfile, action: any) => {
		if (profile.usesPassword()) {
			setRequestedAction(action);
			setSelectedProfile(profile);
		} else {
			handleRequestedAction(profile, action);
		}
	};

	const handleRequestedAction = (profile: Contracts.IProfile, action: any, password?: string) => {
		closeSignInModal();

		if (password) {
			profile.password().set(password);
		}

		switch (action?.value) {
			case "home":
				navigateToProfile(profile);
				break;
			case "setting":
				navigateToProfile(profile, "settings");
				break;
			case "delete":
				setDeletingProfileId(profile.id());
				break;
		}
	};

	const hasProfiles = profiles.length > 0;

	return (
		<>
			<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
				<Section className="flex flex-col flex-1 justify-center text-center">
					<div className="mx-auto w-72">
						<Image name="WelcomeBanner" />
					</div>

					<div className="mx-auto mt-8 max-w-lg md:max-w-xl">
						<h2 className="mx-4 text-xl font-bold md:text-2xl">
							{hasProfiles
								? t("PROFILE.PAGE_WELCOME.WITH_PROFILES.TITLE")
								: t("PROFILE.PAGE_WELCOME.WITHOUT_PROFILES.TITLE")}
						</h2>

						<p className="text-sm text-theme-secondary-text md:text-base">
							{hasProfiles
								? t("PROFILE.PAGE_WELCOME.WITH_PROFILES.DESCRIPTION")
								: t("PROFILE.PAGE_WELCOME.WITHOUT_PROFILES.DESCRIPTION")}
						</p>

						<div className="mt-8">
							<div className="ml-4.5 -mb-4.5 flex flex-wrap justify-center">
								{profiles.map((profile: Contracts.IProfile, index: number) => (
									<ProfileCard
										key={index}
										actions={profileCardActions}
										className="mr-4.5 mb-4.5"
										profile={profile}
										onClick={() => handleClick(profile)}
										onSelect={(action: any) => handleProfileAction(profile, action)}
									/>
								))}

								<Card
									className="w-40 h-40 leading-tight mr-4.5 mb-4.5 group"
									onClick={() => history.push("/profiles/create")}
								>
									<div className="flex flex-col justify-center items-center mx-auto h-full">
										<div>
											<Circle
												size="xl"
												noShadow
												className="text-theme-primary-600 dark:text-white dark:group-hover:border-theme-secondary-800 dark:group-hover:bg-theme-secondary-800 group-hover:text-white group-hover:bg-theme-primary-700"
											>
												<Icon name="Plus" width={12} height={12} />
											</Circle>
										</div>
										<span className="mt-3 font-semibold text-theme-primary-600 dark:text-white max-w-32 truncate dark:group-hover:text-white group-hover:text-theme-primary-700">
											{hasProfiles ? t("PROFILE.CREATE_PROFILE") : t("COMMON.CREATE")}
										</span>
									</div>
								</Card>
							</div>
						</div>

						<p className="text-sm text-theme-secondary-text md:text-base mt-16">
							<span>{t("PROFILE.PAGE_WELCOME.HAS_EXPORTED_PROFILES")} </span>
							<Link to="/profiles/import" title={t("PROFILE.PAGE_WELCOME.IMPORT_PROFILE_TITLE")}>
								{t("PROFILE.PAGE_WELCOME.IMPORT_PROFILE")}
							</Link>
						</p>
					</div>
				</Section>
			</Page>

			<DeleteProfile
				profileId={deletingProfileId!}
				isOpen={!!deletingProfileId}
				onCancel={closeDeleteProfileModal}
				onClose={closeDeleteProfileModal}
				onDelete={closeDeleteProfileModal}
			/>

			<SignIn
				isOpen={!!selectedProfile && requestedAction}
				profile={selectedProfile!}
				onCancel={closeSignInModal}
				onClose={closeSignInModal}
				onSuccess={(password) => handleRequestedAction(selectedProfile!, requestedAction, password)}
			/>
		</>
	);
};
