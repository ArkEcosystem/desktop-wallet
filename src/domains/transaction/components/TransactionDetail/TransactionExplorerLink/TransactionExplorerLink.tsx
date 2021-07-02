import { Clipboard } from "app/components/Clipboard";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TruncateMiddleDynamic } from "app/components/TruncateMiddleDynamic";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionExplorerLinkProperties = {
	id: string;
	link: string;
} & TransactionDetailProperties;

export const TransactionExplorerLink = ({ id, link, ...properties }: TransactionExplorerLinkProperties) => {
	const { t } = useTranslation();

	const reference = useRef(null);

	return (
		<TransactionDetail
			label={t("TRANSACTION.ID")}
			{...properties}
		>
			<div className="flex overflow-hidden items-center space-x-3">
				<span ref={reference} className="overflow-hidden">
					<Link to={link} isExternal>
						<TruncateMiddleDynamic value={id} offset={22} parentRef={reference} />
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
	borderPosition: "top",
	variant: "transaction",
};
