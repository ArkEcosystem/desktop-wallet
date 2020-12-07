import { Contracts } from "@arkecosystem/platform-sdk";
import { Enums } from "@arkecosystem/platform-sdk-profiles";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { Tooltip } from "app/components/Tooltip";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { WalletRegistrationsSkeleton } from "./WalletRegistrationsSkeleton";

type DelegateInfo = {
	username?: string;
	isResigned: boolean;
};

type WalletRegistrationsProps = {
	delegate?: DelegateInfo;
	entities: Contracts.Entity[];
	isLoading?: boolean;
	isMultiSignature?: boolean;
	isSecondSignature?: boolean;
	onButtonClick: (newRegistration?: boolean) => void;
};

export const WalletRegistrations = ({
	delegate,
	entities,
	isLoading,
	isMultiSignature,
	isSecondSignature,
	onButtonClick,
}: WalletRegistrationsProps) => {
	const { t } = useTranslation();

	const registrationCount =
		Number(!!delegate) + Number(!!isMultiSignature) + Number(!!isSecondSignature) + entities.length;
	const hasNoRegistrations = registrationCount === 0;

	const showInactiveIcons = !isSecondSignature || !isMultiSignature || !entities.length;

	const { businesses, plugins } = useMemo(() => {
		const filterEntities = (type: number): Contracts.Entity[] =>
			entities.filter((entity: Contracts.Entity) => entity.type === type);

		return {
			businesses: filterEntities(Enums.EntityType.Business),
			plugins: filterEntities(Enums.EntityType.Plugin),
		};
	}, [entities]);

	const lengthRemaining = entities.length - businesses.length - plugins.length;

	const renderRegistrations = () => {
		if (hasNoRegistrations) {
			return (
				<div data-testid="WalletRegistrations__empty" className="flex items-center space-x-4">
					<div className="flex items-center -space-x-2">
						<Circle
							size="lg"
							className="border-theme-neutral-500 dark:border-theme-neutral-700 text-theme-neutral-500 dark:text-theme-neutral-700"
						>
							<Icon name="Delegate" className="text-xl" />
						</Circle>
						<Circle size="lg" className="border-theme-neutral-500 dark:border-theme-neutral-700" />
					</div>

					<div className="flex flex-1 justify-between">
						<div className="flex flex-col mr-4 font-semibold leading-snug text-theme-text">
							<span className="mr-2">
								{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.EMPTY_DESCRIPTION")}
							</span>

							<div className="mt-1 mr-auto">
								<Link to="@TODO" isExternal>
									{t("COMMON.LEARN_MORE")}
								</Link>
							</div>
						</div>

						<Button
							variant="plain"
							onClick={() => onButtonClick(true)}
							data-testid="WalletRegistrations__button"
						>
							{t("COMMON.REGISTER")}
						</Button>
					</div>
				</div>
			);
		}

		const renderIcon = (icon: string, tooltip?: string, active?: boolean) => {
			const iconStyle = active
				? "border-theme-text text-theme-text"
				: "border-theme-neutral-500 dark:border-theme-neutral-700 text-theme-neutral-500 dark:text-theme-neutral-700";

			const circle = (
				<Circle size="lg" className={iconStyle}>
					<Icon name={icon} width={21} height={21} />
				</Circle>
			);

			return tooltip ? <Tooltip content={tooltip}>{circle}</Tooltip> : circle;
		};

		const renderBusinessIcon = () => {
			if (!businesses.length) return;

			if (businesses.length === 1) {
				return renderIcon("Business", `${t("COMMON.BUSINESS")}: ${businesses[0].name}`, true);
			}

			return renderIcon("Business", `${t("COMMON.BUSINESS_COUNT", { count: businesses.length })}`, true);
		};

		const renderPluginIcon = () => {
			if (!plugins.length) return;

			if (plugins.length === 1) {
				return renderIcon("Plugin", `${t("COMMON.PLUGIN")}: ${plugins[0].name}`, true);
			}

			return renderIcon("Plugin", `${t("COMMON.PLUGIN_COUNT", { count: plugins.length })}`, true);
		};

		return (
			<div className="flex items-center h-11">
				<div className="flex items-center mr-8 -space-x-2">
					{isSecondSignature && renderIcon("Key", t("COMMON.SECOND_SIGNATURE"), true)}

					{isMultiSignature && renderIcon("Multisig", t("COMMON.MULTISIGNATURE"), true)}

					{delegate &&
						renderIcon(
							delegate.isResigned ? "DelegateResigned" : "Delegate",
							delegate.isResigned
								? `${t("COMMON.DELEGATE")}: ${delegate.username} (${t("COMMON.RESIGNED")})`
								: `${t("COMMON.DELEGATE")}: ${delegate.username}`,
							true,
						)}

					{renderBusinessIcon()}

					{renderPluginIcon()}

					{lengthRemaining > 0 && (
						<Circle size="lg" className="relative border-theme-text text-theme-text">
							<span className="font-semibold">+{lengthRemaining}</span>
						</Circle>
					)}
				</div>

				{showInactiveIcons && (
					<div
						data-testid="WalletRegistrations__inactive"
						className="flex items-center pl-8 -space-x-2 border-l border-theme-neutral-300 dark:border-theme-neutral-800"
					>
						{!isSecondSignature && renderIcon("Key")}

						{!isMultiSignature && renderIcon("Multisig")}

						{!delegate && renderIcon("Delegate")}

						{entities.length === 0 && renderIcon("Entity")}
					</div>
				)}

				<Button
					variant="plain"
					className="ml-auto"
					onClick={() => onButtonClick()}
					data-testid="WalletRegistrations__button"
				>
					{t("COMMON.SHOW_ALL")}
				</Button>
			</div>
		);
	};

	return (
		<section data-testid="WalletRegistrations">
			<div className="flex mb-4">
				<h2 className="mb-0 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.TITLE")}</h2>
				{!isLoading && (
					<span className="ml-1 text-2xl font-bold text-theme-neutral-500 dark:text-theme-neutral-700">
						({registrationCount})
					</span>
				)}
			</div>

			{isLoading ? <WalletRegistrationsSkeleton /> : renderRegistrations()}
		</section>
	);
};

WalletRegistrations.defaultProps = {
	entities: [],
};
