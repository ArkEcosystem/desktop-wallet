import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { DeleteProfile } from "domains/profile/components/DeleteProfile/DeleteProfile";
import { ProfileCard } from "domains/profile/components/ProfileCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { setScreenshotProtection } from "utils/electron-utils";

const { WelcomeBanner } = images.common;

export const Welcome = () => {
	const context = useEnvironmentContext();
	const { t } = useTranslation();
	const history = useHistory();
	const profiles = React.useMemo(() => context.env.profiles().values(), [context]);
	const [deletingProfileId, setDeletingProfileId] = React.useState<string | undefined>();

	const profileCardActions = [
		{ label: t("COMMON.SETTINGS"), value: "setting" },
		{ label: t("COMMON.DELETE"), value: "delete" },
	];

	React.useEffect(() => setScreenshotProtection(true));

	const closeDeleteProfileModal = () => {
		setDeletingProfileId(undefined);
	};

	const handleProfileCardAction = (profile: Profile, action: any) => {
		switch (action?.value) {
			case "setting":
				history.push(`/profiles/${profile.id()}/settings`);
				break;
			case "delete":
				setDeletingProfileId(profile.id());
				break;
		}
	};

	return (
		<>
			<Page navbarStyle="logo-only">
				<Section className="flex flex-col justify-center flex-1 text-center">
					<h1 className="mb-8">{t("PROFILE.PAGE_WELCOME.TITLE")}</h1>

					<div className="w-64 mx-auto lg:w-128">
						<WelcomeBanner />
					</div>

					<div className="max-w-lg mx-auto mt-8 md:max-w-xl">
						<h2 className="mx-4 text-xl font-bold md:text-2xl">
							{t("COMMON.SELECT_OPTION", { option: t("COMMON.PROFILE") })}
						</h2>

						{profiles.length > 0 ? (
							<>
								<p className="text-sm text-theme-neutral-dark md:text-base">
									{t("PROFILE.PAGE_WELCOME.HAS_PROFILES")}
								</p>

								<div className="mt-8 space-y-3">
									{profiles.map((profile: any, index: number) => (
										<ProfileCard
											handleClick={() => history.push(`/profiles/${profile.id()}/dashboard`)}
											key={index}
											profile={profile}
											actions={profileCardActions}
											onSelect={(action: any) => handleProfileCardAction(profile, action)}
										/>
									))}
								</div>
							</>
						) : (
							<p className="text-sm text-theme-neutral-dark md:text-base">
								{t("PROFILE.PAGE_WELCOME.HAS_NO_PROFILES")}
							</p>
						)}

						<div className="flex flex-col justify-center mt-8 md:space-x-3 md:flex-row">
							<Button>
								<Icon name="Msq" width={20} height={20} />
								<span className="ml-2">{t("PROFILE.LOGIN")}</span>
							</Button>

							<Button
								variant="plain"
								className="mt-2 md:mt-0"
								onClick={() => history.push("/profiles/create")}
							>
								{t("PROFILE.CREATE_PROFILE")}
							</Button>
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
		</>
	);
};
