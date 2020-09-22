import { ExtendedTransactionData } from "@arkecosystem/platform-sdk-profiles";
import { Table } from "app/components/Table";
import { TransactionTable } from "domains/transaction/components/TransactionTable";
import React from "react";

import { Icon } from "../Icon";
import { EmptyPlaceholderProps, NotificationsProps, PluginNotification } from "./models";

const Plugin = ({ logoUrl, logoClassName, title, description, action, onAction }: PluginNotification) => (
	<tr>
		<td className="w-8">
			<div className={logoClassName}>{logoUrl && <img src={logoUrl} alt={title} />}</div>
		</td>
		<td>
			<span className="font-bold text-md text-theme-neutral-600">{title}</span>
			<span className="text-md text-theme-neutral-600"> {description}</span>
		</td>
		<td>
			{action && action.label && (
				<div
					data-testid="notifications__plugin-action"
					className="font-bold text-right cursor-pointer text-md text-theme-primary-500"
					onClick={() => onAction(action.value)}
				>
					{action.label}
				</div>
			)}
		</td>
	</tr>
);

const EmptyPlaceholder = ({ title }: EmptyPlaceholderProps) => (
	<div>
		<div className="p-6 mb-5 border-2 border-theme-neutral-200 text-md rounded-xl text-theme-neutral-dark">
			{title}
		</div>
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
		<div className="my-3 border-2 border-b border-theme-neutral-contrast" />
		<div>
			<Icon name="Placeholder" width={200} height={80} />
		</div>
	</div>
);

export const Notifications = ({
	plugins,
	transactions,
	pluginsHeader,
	transactionsHeader,
	onAction,
	emptyText,
	profile,
}: NotificationsProps) => {
	const hiddenTableHeaders = [{ Header: "-", className: "hidden" }];

	if (!profile?.id() || (!transactions!.length && !plugins!.length)) {
		return <EmptyPlaceholder title={emptyText} />;
	}

	const handleTransactionClick = (transaction: ExtendedTransactionData) => {
		onAction?.("click", transaction);
	};

	if (!transactions!.length && !plugins!.length) {
		return <EmptyPlaceholder title={emptyText} />;
	}

	return (
		<div>
			<div className="mb-2 text-sm font-bold text-theme-neutral">{pluginsHeader}</div>
			<Table hideHeader columns={hiddenTableHeaders} data={plugins}>
				{(plugin: PluginNotification) => (
					<Plugin {...plugin} onAction={(name: string) => onAction?.(name, plugin)} />
				)}
			</Table>
			<div className="mb-2 text-sm font-bold mt-9 text-theme-neutral">{transactionsHeader}</div>
			<TransactionTable onRowClick={handleTransactionClick} transactions={transactions!} isCompact hideHeader />
		</div>
	);
};

Notifications.defaultProps = {
	pluginsHeader: "",
	emptyText: "You have no notifications at this time.",
	transactions: [],
	plugins: [],
};
