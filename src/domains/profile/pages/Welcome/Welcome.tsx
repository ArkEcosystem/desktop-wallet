import { images } from "app/assets/images";
import { Button } from "app/components/Button";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { ProfileCard } from "domains/profile/components/ProfileCard";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const { WelcomeBanner } = images.profile.pages.welcome;

export const Welcome = () => {
	const profileCardActions = [
		{ label: "Setting", value: "setting" },
		{ label: "Delete", value: "delete" },
	];
	const context = useEnvironmentContext();
	const { t } = useTranslation();
	const history = useHistory();
	const profiles = React.useMemo(() => context.env.profiles().all(), [context]);

	return (
		<Page navbarStyle="logo-only">
			<Section className="flex flex-col justify-center flex-1 text-center">
				<h1 className="mb-8">{t("PROFILE.PAGE_WELCOME.TITLE")}</h1>
				<div className="w-full mx-auto lg:w-4/5 xl:w-2/3">
					<WelcomeBanner />
				</div>

				<div className="max-w-lg mx-auto mt-8 md:max-w-xl">
					{profiles.length > 0 && (
						<>
							<h2 className="mx-4 text-xl font-bold md:text-2xl">
								{t("COMMON.SELECT_OPTION", { option: t("COMMON.PROFILE") })}
							</h2>
							<p className="text-sm text-theme-neutral-dark md:text-base">
								{t("PROFILE.PAGE_WELCOME.HAS_PROFILES")}
							</p>

							<div className="mt-6 mb-8 space-y-3">
								{profiles.map((profile: any, index: number) => (
									<ProfileCard
										handleClick={() => history.push(`/profiles/${profile.id()}/dashboard`)}
										key={index}
										profile={profile}
										actions={profileCardActions}
									/>
								))}
							</div>

							<Divider />
						</>
					)}
					<p className="mb-4 text-sm text-theme-neutral-dark md:text-base">
						{t("PROFILE.PAGE_WELCOME.DESCRIPTION")}
					</p>
					<div className="flex flex-col md:space-x-3 md:flex-row">
						<Button className="w-full">
							<Icon name="Msq" width={20} height={20} />
							<span className="ml-2">{t("PROFILE.LOGIN")}</span>
						</Button>
						<Button
							variant="plain"
							className="w-full mt-2 md:mt-0"
							onClick={() => history.push("/profiles/create")}
						>
							{t("PROFILE.CREATE_PROFILE")}
						</Button>
					</div>
				</div>
			</Section>
		</Page>
	);
};
