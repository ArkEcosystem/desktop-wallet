import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

interface VotesEmptyProperties {
	onCreateWallet?: () => void;
	onImportWallet?: () => void;
}
export const VotesEmpty = ({ onCreateWallet, onImportWallet }: VotesEmptyProperties) => {
	const { t } = useTranslation();

	return (
		<EmptyBlock>
			<div className="flex justify-between items-center">
				<span>
					<Trans
						i18nKey="VOTE.VOTES_PAGE.EMPTY_MESSAGE"
						values={{
							create: t("DASHBOARD.WALLET_CONTROLS.CREATE"),
							import: t("DASHBOARD.WALLET_CONTROLS.IMPORT"),
						}}
						components={{ bold: <strong /> }}
					/>
				</span>

				<div className="flex -m-3 space-x-3">
					<Button onClick={onCreateWallet} variant="secondary">
						<div className="flex items-center space-x-2">
							<Icon name="Plus" width={12} height={12} />
							<span>{t("DASHBOARD.WALLET_CONTROLS.CREATE")}</span>
						</div>
					</Button>

					<Button onClick={onImportWallet} variant="secondary">
						<div className="flex items-center space-x-2">
							<Icon name="Import" width={15} height={15} />
							<span>{t("DASHBOARD.WALLET_CONTROLS.IMPORT")}</span>
						</div>
					</Button>
				</div>
			</div>
		</EmptyBlock>
	);
};
