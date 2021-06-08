import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TruncateMiddleDynamic } from "app/components/TruncateMiddleDynamic";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProps } from "../TransactionDetail";

type TransactionExplorerLinkProps = {
	id: string;
	link: string;
	variant: "block" | "transaction";
} & TransactionDetailProps;

export const TransactionExplorerLink = ({ id, link, variant, ...props }: TransactionExplorerLinkProps) => {
	const { t } = useTranslation();

	const ref = useRef(null);

	const isTransactionLink = () => variant === "transaction";

	return (
		<TransactionDetail label={isTransactionLink() ? t("TRANSACTION.ID") : t("TRANSACTION.BLOCK_ID")} {...props}>
			<div className="flex items-center space-x-3 overflow-hidden">
				<span ref={ref} className="overflow-hidden">
					<Link to={link} isExternal>
						<TruncateMiddleDynamic value={id} offset={22} parentRef={ref} />
					</Link>
				</span>

				<span className="flex text-theme-primary-300 dark:text-theme-secondary-600">
					<Clipboard variant="icon" data={id}>
						<Icon name="Copy" />
					</Clipboard>
				</span>
			</div>
		</TransactionDetail>
	);
};

TransactionExplorerLink.defaultProps = {
	variant: "transaction",
	borderPosition: "top",
};
