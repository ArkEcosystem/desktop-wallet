import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { Tooltip } from "app/components/Tooltip";
import React from "react";
import { useTranslation } from "react-i18next";

import { WalletRegistrationsSkeleton } from "./WalletRegistrationsSkeleton";

type DelegateInfo = {
	username?: string;
	isResigned: boolean;
};

type WalletRegistrationsProps = {
	wallet: ReadWriteWallet;
	onButtonClick: (newRegistration?: boolean) => void;
};

export const WalletRegistrations = ({ wallet, onButtonClick }: WalletRegistrationsProps) => {
	const { t } = useTranslation();

	if (!wallet.hasSyncedWithNetwork()) {
		return <section data-testid="WalletRegistrations">{<WalletRegistrationsSkeleton />}</section>;
	}

	const delegate = wallet.isDelegate()
		? {
				username: wallet.username(),
				isResigned: wallet.isResignedDelegate(),
		  }
		: undefined;

	const isMultiSignature = wallet.isMultiSignature();
	const isSecondSignature = wallet.isSecondSignature();

	const renderRegistrations = () => {
		if (!delegate && !isSecondSignature && !isMultiSignature) {
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
				</div>

				{(!delegate || !isSecondSignature || !isMultiSignature) && (
					<div
						data-testid="WalletRegistrations__inactive"
						className="flex items-center pl-8 -space-x-2 border-l border-theme-neutral-300 dark:border-theme-neutral-800"
					>
						{!isSecondSignature && renderIcon("Key")}

						{!isMultiSignature && renderIcon("Multisig")}

						{!delegate && renderIcon("Delegate")}
					</div>
				)}
			</div>
		);
	};

	return (
		<section data-testid="WalletRegistrations">
			<div className="flex mb-4">
				<h2 className="mb-0 font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.TITLE")}</h2>
			</div>

			{renderRegistrations()}
		</section>
	);
};
