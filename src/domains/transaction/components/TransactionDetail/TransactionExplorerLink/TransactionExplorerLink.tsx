import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TruncateMiddle } from "app/components/TruncateMiddle";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail } from "../TransactionDetail";

type TransactionExplorerLinkProps = {
	id: string;
	link: string;
	variant: "block" | "transaction";
};

export const TransactionExplorerLink = ({ id, link, variant }: TransactionExplorerLinkProps) => {
	const { t } = useTranslation();

	const isTransactionLink = () => variant === "transaction";

	return (
		<TransactionDetail label={isTransactionLink() ? t("TRANSACTION.ID") : t("TRANSACTION.BLOCK_ID")}>
			<div className="flex items-center">
				<Link to={link} isExternal showExternalIcon={false}>
					<TruncateMiddle text={id} maxChars={30} className="text-theme-primary-dark" />
				</Link>

				<span className="inline-block ml-5 text-theme-primary-300">
					<Clipboard data={id}>
						<Icon name="Copy" />
					</Clipboard>
				</span>
			</div>
		</TransactionDetail>
	);
};

TransactionExplorerLink.defaultProps = {
	variant: "transaction",
};
