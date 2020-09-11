import { Contracts } from "@arkecosystem/platform-sdk";
import Tippy from "@tippyjs/react";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import React from "react";
import { useTranslation } from "react-i18next";

import { WalletRegistrationsSkeleton } from "./WalletRegistrationsSkeleton";

const IconList = ({ icons, limit }: { icons: string[]; limit: number }) => {
	const items = icons.slice(0, limit);
	const rest = Math.max(0, icons.length - limit);

	return (
		<div data-testid="WalletRegistrations__icon-list" className="flex items-center -space-x-2">
			{items.map((item) => (
				<Circle
					data-testid="WalletRegistrations__icon-list__icon"
					key={item}
					size="lg"
					className="bg-theme-background border-theme-text text-theme-text"
				>
					<Icon name={item} className="text-xl" />
				</Circle>
			))}
			{rest > 0 && (
				<Circle
					data-testid="WalletRegistrations__icon-list__rest"
					size="lg"
					className="text-lg font-bold bg-theme-background border-theme-text text-theme-text"
				>
					+{rest}
				</Circle>
			)}
		</div>
	);
};

type WalletRegistrationsProps = {
	business?: { name: string };
	delegate?: Contracts.WalletData;
	hasBridgechains?: boolean;
	hasPlugins?: boolean;
	hasSecondSignature?: boolean;
	isLoading?: boolean;
	isMultisig?: boolean;
	onButtonClick: () => void;
};

export const WalletRegistrations = ({
	business,
	delegate,
	hasBridgechains,
	hasPlugins,
	hasSecondSignature,
	isLoading,
	isMultisig,
	onButtonClick,
}: WalletRegistrationsProps) => {
	const { t } = useTranslation();

	// @ts-ignore
	const iconsList: string[] = [
		hasSecondSignature && "Key",
		hasBridgechains && "Bridgechain",
		hasPlugins && "Plugin",
		isMultisig && "Multisig",
	].filter(Boolean);

	const registrationCount = Number(!!delegate) + Number(!!business); // + registrations.length;
	const hasNoRegistrations = registrationCount === 0;

	const renderRegistrations = () => {
		if (hasNoRegistrations) {
			return (
				<div data-testid="WalletRegistrations__empty" className="flex items-center space-x-4">
					<div className="flex items-center -space-x-2">
						<Circle size="lg" className="text-theme-neutral-light">
							<Icon name="Delegate" className="text-xl" />
						</Circle>
						<Circle size="lg" />
					</div>

					<div className="font-semibold text-theme-text">
						<span className="mr-2">{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.EMPTY_DESCRIPTION")}</span>

						<Link to="@TODO" isExternal showExternalIcon={false}>
							{t("COMMON.LEARN_MORE")}
						</Link>
					</div>
				</div>
			);
		}

		const renderIcon = (icon: string, active?: boolean, tooltip?: string) => {
			const iconStyle = active
				? "border-theme-text text-theme-text"
				: "border-theme-neutral-light text-theme-neutral-light";

			const circle = (
				<Circle size="lg" className={iconStyle}>
					<Icon name={icon} width={21} height={21} />
				</Circle>
			);

			return tooltip ? <Tippy content={tooltip}>{circle}</Tippy> : circle;
		};

		return (
			<div className="flex items-center h-11">
				<div className="flex items-center mr-8 -space-x-2">
					{hasSecondSignature && renderIcon("Key", true, t("COMMON.SECOND_SIGNATURE"))}

					{delegate && renderIcon("Delegate", true, `${t("COMMON.DELEGATE")}: ${delegate.username()}`)}
				</div>

				{(!hasSecondSignature || !hasPlugins || !hasBridgechains) && (
					<div className="flex items-center pl-8 border-l border-theme-neutral-300 -space-x-2">
						{!hasSecondSignature && renderIcon("Key")}

						{!hasPlugins && renderIcon("Plugin")}

						{!hasBridgechains && renderIcon("Bridgechain")}
					</div>
				)}

				<Button variant="plain" className="ml-auto" onClick={() => onButtonClick()}>
					{t("COMMON.SHOW_ALL")}
				</Button>
			</div>
		);
	};

	return (
		<section data-testid="WalletRegistrations">
			<div className="flex mb-4">
				<h2 className="font-bold mb-0">{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.TITLE")}</h2>
				<span className="font-bold text-2xl text-theme-neutral-light ml-1">(0)</span>
			</div>

			{isLoading ? <WalletRegistrationsSkeleton /> : renderRegistrations()}
		</section>
	);
};
