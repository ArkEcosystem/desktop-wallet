import { Avatar } from "app/components/Avatar";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import cn from "classnames";
import { useTransactionTypes } from "domains/transaction/hooks/use-transaction-types";
import React from "react";
import { Size } from "types";

interface Properties {
	type: string;
	recipient?: string;
	size?: Size;
}

export const TransactionRowRecipientIcon = ({ type, recipient, size }: Properties) => {
	const { getIcon } = useTransactionTypes();

	const shadowClasses =
		"ring-theme-background bg-theme-background group-hover:ring-theme-secondary-100 group-hover:bg-secondary-100 dark:group-hover:ring-black dark:group-hover:bg-black";

	if (type === "transfer") {
		return <Avatar size={size} address={recipient} className={shadowClasses} />;
	}

	return (
		<Circle
			data-testid="TransactionRowRecipientIcon"
			size={size}
			className={cn(
				"border-theme-text text-theme-text dark:border-theme-secondary-600 dark:text-theme-secondary-600",
				shadowClasses,
			)}
		>
			<Icon name={getIcon(type)} width={20} height={20} />
		</Circle>
	);
};

TransactionRowRecipientIcon.defaultProps = {
	size: "lg",
};
