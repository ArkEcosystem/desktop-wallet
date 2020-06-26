import { Button } from "app/components/Button";
import { Circle } from "app/components/Circle";
import { Collapse, CollapseToggleButton } from "app/components/Collapse";
import { Icon } from "app/components/Icon";
import React from "react";

import { Avatar } from "../Avatar";

const IconList = ({ icons, limit }: { icons: string[]; limit: number }) => {
	const items = icons.slice(0, limit);
	const rest = Math.max(0, icons.length - limit);

	return (
		<div data-testid="WalletRegistrations__icon-list" className="flex items-center -space-x-2">
			{items.map((item) => (
				<Circle
					data-testid="WalletRegistrations__icon-list__icon"
					key={item}
					size="large"
					className="bg-theme-background border-theme-neutral-900 text-theme-neutral-900"
				>
					<Icon name={item} className="text-xl" />
				</Circle>
			))}
			{rest > 0 && (
				<Circle
					data-testid="WalletRegistrations__icon-list__rest"
					size="large"
					className="bg-theme-background font-bold text-lg border-theme-neutral-900 text-theme-neutral-900"
				>
					+{rest}
				</Circle>
			)}
		</div>
	);
};

type Props = {
	address: string;
	hasBridgechains?: boolean;
	hasPlugins?: boolean;
	hasSecondSignature?: boolean;
	isMultisig?: boolean;
	delegate?: {
		username: string;
	};
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
	// @ts-ignore
	const iconsList: string[] = [
		hasSecondSignature && "Key",
		hasBridgechains && "Bridgechain",
		hasPlugins && "Plugin",
		isMultisig && "Multisig",
	].filter(Boolean);

	return (
		<section data-testid="WalletRegistrations" className="px-12 py-8">
			<div className="flex items-center justify-between">
				<h2 className="font-bold">Registrations</h2>
				<CollapseToggleButton
					data-testid="WalletRegistrations__toggle"
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				/>
			</div>

			<Collapse isOpen={isOpen}>
				<div className="px-1 py-4 flex items-center justify-between">
					<div className="flex items-center divide-x-1 divide-theme-neutral-light">
						{delegate && (
							<div className="flex items-center space-x-4 pr-8">
								<div className="flex items-center -space-x-2">
									<Circle size="large" className="border-theme-neutral-900 text-theme-neutral-900">
										<Icon name="Delegate" className="text-xl" />
									</Circle>
									<Avatar size="large" address={address} />
								</div>
								<div>
									<p className="text-sm font-semibold text-theme-neutral">Delegate</p>
									<p data-testid="WalletRegistrations__delegate" className="font-semibold">
										{delegate?.username}
									</p>
								</div>
							</div>
						)}

						{business && (
							<div className="flex items-center space-x-4 px-8">
								<div className="flex items-center">
									<Circle size="large" className="border-theme-neutral-900 text-theme-neutral-900">
										<Icon name="Business" className="text-xl" />
									</Circle>
								</div>
								<div>
									<p className="text-sm font-semibold text-theme-neutral">Business</p>
									<p data-testid="WalletRegistrations__business" className="font-semibold">
										{business?.name}
									</p>
								</div>
							</div>
						)}

						{iconsList.length && (
							<div className="px-8">
								<IconList icons={iconsList} limit={2} />
							</div>
						)}
					</div>

					<div className="space-x-2">
						<button
							data-testid="WalletRegistrations__show-all"
							onClick={onShowAll}
							className="text-theme-primary px-5 py-3 font-semibold leading-tight rounded focus:outline-none focus:shadow-outline"
						>
							Show all
						</button>
						<Button data-testid="WalletRegistrations__register" onClick={onRegister} variant="plain">
							Register
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
