import { Contracts } from "@arkecosystem/platform-sdk";
import { Avatar } from "app/components/Avatar";
import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import React from "react";
import { useTranslation } from "react-i18next";

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
					className="bg-theme-background border-theme-neutral-900 text-theme-neutral-900"
				>
					<Icon name={item} className="text-xl" />
				</Circle>
			))}
			{rest > 0 && (
				<Circle
					data-testid="WalletRegistrations__icon-list__rest"
					size="lg"
					className="text-lg font-bold bg-theme-background border-theme-neutral-900 text-theme-neutral-900"
				>
					+{rest}
				</Circle>
			)}
		</div>
	);
};

type Props = {
	address: string | undefined;
	hasBridgechains?: boolean;
	hasPlugins?: boolean;
	hasSecondSignature?: boolean;
	isMultisig?: boolean;
	delegate?: Contracts.WalletData;
	business?: {
		name: string;
	};
	onRegister?: () => void;
	onShowAll?: () => void;
	defaultIsOpen?: boolean;
};

export const WalletRegistrations = ({
	address,
	delegate,
	business,
	hasBridgechains,
	hasSecondSignature,
	hasPlugins,
	isMultisig,
	onRegister,
	onShowAll,
	defaultIsOpen,
}: Props) => {
	const [isOpen, setIsOpen] = React.useState(defaultIsOpen!);

	const { t } = useTranslation();

	// @ts-ignore
	const iconsList: string[] = [
		hasSecondSignature && "Key",
		hasBridgechains && "Bridgechain",
		hasPlugins && "Plugin",
		isMultisig && "Multisig",
	].filter(Boolean);

	const hasNoRegistrations = !delegate && !business && iconsList.length === 0;

	return (
		<section data-testid="WalletRegistrations">
			<div className="flex items-center justify-between">
				<h2 className="font-bold">{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.TITLE")}</h2>
				<CollapseToggleButton
					data-testid="WalletRegistrations__toggle"
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</div>

			<Collapse isOpen={isOpen}>
				<div className="flex items-center justify-between px-1 py-4">
					{hasNoRegistrations ? (
						<div data-testid="WalletRegistrations__empty" className="flex items-center pr-8 space-x-4">
							<div className="flex items-center -space-x-2">
								<Circle size="lg" className="text-theme-neutral-light">
									<Icon name="Delegate" className="text-xl" />
								</Circle>
								<Circle size="lg" className="bg-theme-background" />
							</div>
							<div className="flex flex-col">
								<span className="text-sm font-semibold text-theme-neutral">
									{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.EMPTY.LABEL")}
								</span>
								<span className="font-semibold text-theme-neutral-900">
									{t("WALLETS.PAGE_WALLET_DETAILS.REGISTRATIONS.EMPTY.DESCRIPTION")}
									<a href="/#" className="px-2 text-theme-primary">
										{t("COMMON.LEARN_MORE")}
									</a>
								</span>
							</div>
						</div>
					) : (
						<div className="flex items-center divide-x-1 divide-theme-neutral-light">
							{delegate && delegate.hasData() && (
								<div className="flex items-center pr-8 space-x-4">
									<div className="flex items-center -space-x-2">
										<Circle size="lg" className="border-theme-neutral-900 text-theme-neutral-900">
											<Icon name="Delegate" className="text-xl" />
										</Circle>
										<Avatar size="lg" address={delegate.address()} />
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-semibold text-theme-neutral">
											{t("COMMON.DELEGATE")}
										</span>
										<span data-testid="WalletRegistrations__delegate" className="font-semibold">
											{delegate?.username()}
										</span>
									</div>
								</div>
							)}

							{business && (
								<div className="flex items-center px-8 space-x-4">
									<div className="flex items-center">
										<Circle size="lg" className="border-theme-neutral-900 text-theme-neutral-900">
											<Icon name="Business" className="text-xl" />
										</Circle>
									</div>
									<div className="flex flex-col">
										<span className="text-sm font-semibold text-theme-neutral">
											{t("COMMON.BUSINESS")}
										</span>
										<span data-testid="WalletRegistrations__business" className="font-semibold">
											{business?.name}
										</span>
									</div>
								</div>
							)}

							{iconsList.length && (
								<div className="px-8">
									<IconList icons={iconsList} limit={2} />
								</div>
							)}
						</div>
					)}

					<div className="space-x-2">
						{!hasNoRegistrations && (
							<button
								data-testid="WalletRegistrations__show-all"
								onClick={onShowAll}
								className="px-5 py-3 font-semibold leading-tight rounded text-theme-primary focus:outline-none focus:shadow-outline"
							>
								{t("COMMON.SHOW_ALL")}
							</button>
						)}

						<Button data-testid="WalletRegistrations__register" onClick={onRegister} variant="plain">
							{t("COMMON.REGISTER")}
						</Button>
					</div>
				</div>
			</Collapse>
		</section>
	);
};

WalletRegistrations.defaultProps = {
	defaultIsOpen: true,
};
