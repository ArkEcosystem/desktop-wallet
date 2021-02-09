import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { Card } from "app/components/Card";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Image } from "app/components/Image";
import { Page, Section } from "app/components/Layout";
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
	const [selectedProfile, setSelectedProfile] = useState<Profile | undefined>();
	const [requestedAction, setRequestedAction] = useState<any>();

	const profileCardActions = [
		{ label: t("COMMON.SETTINGS"), value: "setting" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	useEffect(() => setScreenshotProtection(true));

	const navigateToProfile = (profile: Profile, subPath = "dashboard") => {
		history.push(`/profiles/${profile.id()}/${subPath}`);
	};

	const closeDeleteProfileModal = () => {
		setDeletingProfileId(undefined);
	};

	const closeSignInModal = () => {
		setSelectedProfile(undefined);
		setRequestedAction(undefined);
	};

	const handleClick = (profile: Profile) => {
		if (profile.usesPassword()) {
			setSelectedProfile(profile);
			setRequestedAction({ label: "Homepage", value: "home" });
		} else {
			restoreProfile(profile);
			navigateToProfile(profile);
		}
	};

	const handleProfileAction = (profile: Profile, action: any) => {
		if (profile.usesPassword()) {
			setRequestedAction(action);
			setSelectedProfile(profile);
		} else {
			handleRequestedAction(profile, action);
		}
	};

	const handleRequestedAction = (profile: Profile, action: any, password?: string) => {
		closeSignInModal();

		switch (action?.value) {
			case "home":
				restoreProfile(profile, password);
				navigateToProfile(profile);
				break;
			case "setting":
				restoreProfile(profile, password);
				navigateToProfile(profile, "settings");
				break;
			case "delete":
				setDeletingProfileId(profile.id());
				break;
		}
	};

	return (
		<>
			<Page navbarVariant="logo-only" title={t("COMMON.DESKTOP_WALLET")}>
				<Section className="flex flex-col flex-1 justify-center text-center">
					<div className="mx-auto w-72">
						<Image name="WelcomeBanner" />
					</div>

					<div className="mx-auto mt-8 max-w-lg md:max-w-xl">
						<h2 className="mx-4 text-xl font-bold md:text-2xl">
							{t("COMMON.SELECT_OPTION", { option: t("COMMON.PROFILE") })}
						</h2>

						<p className="text-sm text-theme-secondary-text md:text-base">
							{profiles.length > 0 && t("PROFILE.PAGE_WELCOME.HAS_PROFILES")}
							{profiles.length === 0 && t("PROFILE.PAGE_WELCOME.HAS_NO_PROFILES")}
						</p>

						<div className="mt-8">
							<div className="-my-2.5 flex flex-wrap justify-center">
								{profiles.map((profile: Profile, index: number) => (
									<ProfileCard
										onClick={() => handleClick(profile)}
										key={index}
										profile={profile}
										actions={profileCardActions}
										onSelect={(action: any) => handleProfileAction(profile, action)}
									/>
								))}

								<Card
									className="w-40 h-40 leading-tight m-2.5 group"
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
											{t("PROFILE.CREATE_PROFILE")}
										</span>
									</div>
								</Card>
							</div>
						</div>
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

			{selectedProfile && requestedAction && (
				<SignIn
					isOpen={!!selectedProfile}
					profile={selectedProfile}
					onCancel={closeSignInModal}
					onClose={closeSignInModal}
					onSuccess={(password) => handleRequestedAction(selectedProfile, requestedAction, password)}
				/>
			)}
		</>
	);
};
