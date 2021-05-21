import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { useTextTruncate } from "app/hooks/use-text-truncate";
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
	const [TruncatedId] = useTextTruncate({ text: id, parentRef: ref });

	const isTransactionLink = () => variant === "transaction";

	return (
		<TransactionDetail
			ref={ref}
			label={isTransactionLink() ? t("TRANSACTION.ID") : t("TRANSACTION.BLOCK_ID")}
			{...props}
		>
			<div className="flex items-center space-x-3">
				<Link to={link} isExternal>
					<TruncatedId className="text-theme-primary-700" />
				</Link>

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
