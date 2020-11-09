import { ReadOnlyWallet, ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { isEmptyObject } from "@arkecosystem/utils";
import { Icon } from "app/components//Icon";
import { Button } from "app/components/Button";
import { EmptyBlock } from "app/components/EmptyBlock";
import { Header } from "app/components/Header";
import { HeaderSearchBar } from "app/components/Header/HeaderSearchBar";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useQueryParams } from "app/hooks";
import { AddressTable } from "domains/vote/components/AddressTable";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";

export const Votes = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { walletId: hasWalletId } = useParams();
	const { env } = useEnvironmentContext();
	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const queryParams = useQueryParams();
	const unvoteAddresses = queryParams.get("unvotes")?.split(",");
	const voteAddresses = queryParams.get("votes")?.split(",");

	const walletAddress = hasWalletId ? activeWallet.address() : "";
	const walletMaxVotes = hasWalletId ? activeWallet.network().maximumVotesPerWallet() : undefined;

	const [address, setAddress] = useState(walletAddress);
	const [maxVotes, setMaxVotes] = useState(walletMaxVotes);
	const [delegates, setDelegates] = useState<ReadOnlyWallet[]>([]);
	const [votes, setVotes] = useState<ReadOnlyWallet[]>([]);

	const crumbs = [
		{
			route: `/profiles/${activeProfile.id()}/dashboard`,
			label: t("COMMON.GO_BACK_TO_PORTFOLIO"),
		},
	];

	const walletsByCoin = useMemo(() => {
		const wallets = activeProfile.wallets().allByCoin();

		return Object.keys(wallets).reduce(
			(coins, coin) => ({
				...coins,
				[coin]: Object.values(wallets[coin]),
			}),
			{} as Record<string, ReadWriteWallet[]>,
		);
	}, [activeProfile]);

	const loadVotes = useCallback(
		(address) => {
			const wallet = activeProfile.wallets().findByAddress(address);
			let votes: ReadOnlyWallet[] = [];

			try {
				votes = wallet!.votes();
			} catch {
				votes = [];
			}

			setVotes(votes);
		},
		[activeProfile],
	);

	useEffect(() => {
		if (address) {
			loadVotes(address);
		}
	}, [address, loadVotes]);

	const loadDelegates = useCallback(
		(wallet) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
			const delegates = env.delegates().all(wallet?.coinId()!, wallet?.networkId()!);
			setDelegates(delegates);
		},
		[env],
	);

	useEffect(() => {
		if (hasWalletId) {
			loadDelegates(activeWallet);
		}
	}, [activeWallet, loadDelegates, hasWalletId]);

	const handleSelectAddress = (address: string) => {
		const wallet = activeProfile.wallets().findByAddress(address);

		setAddress(address);
		setMaxVotes(wallet?.network().maximumVotesPerWallet());

		loadDelegates(wallet);
	};

	const handleContinue = (unvotes: string[], votes: string[]) => {
		const walletId = hasWalletId ? activeWallet.id() : activeProfile.wallets().findByAddress(address)?.id();

		const params = new URLSearchParams();

		if (unvotes?.length > 0) {
			params.append("unvotes", unvotes.join());
		}

		if (votes?.length > 0) {
			params.append("votes", votes.join());
		}

		history.push({
			pathname: `/profiles/${activeProfile.id()}/wallets/${walletId}/send-vote`,
			search: `?${params}`,
		});
	};

	return (
		<Page profile={activeProfile} crumbs={crumbs}>
			<Section>
				<Header
					title={t("VOTE.VOTES_PAGE.TITLE")}
					subtitle={t("VOTE.VOTES_PAGE.SUBTITLE")}
					extra={<HeaderSearchBar placeholder={t("VOTE.VOTES_PAGE.SEARCH_PLACEHOLDER")} />}
				/>
			</Section>

			{address ? (
				<Section className="flex-1">
					<DelegateTable
						delegates={delegates}
						maxVotes={maxVotes!}
						votes={votes}
						selectedUnvoteAddresses={unvoteAddresses}
						selectedVoteAddresses={voteAddresses}
						selectedWallet={address}
						onContinue={handleContinue}
					/>
				</Section>
			) : isEmptyObject(walletsByCoin) ? (
				<Section className="flex-1">
					<EmptyBlock>
						<div className="flex items-center justify-between">
							<Trans
								i18nKey="VOTE.VOTES_PAGE.EMPTY_MESSAGE"
								defaults="Your must first <bold>{{create}}</bold> or <bold>{{import}}</bold> an address to view your current voting status"
								values={{
									create: t("DASHBOARD.WALLET_CONTROLS.CREATE"),
									import: t("DASHBOARD.WALLET_CONTROLS.IMPORT"),
								}}
								components={{ bold: <strong /> }}
							/>

							<div className="flex -m-3 space-x-3">
								<Button
									onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
									variant="plain"
								>
									<div className="flex items-center space-x-2">
										<Icon name="Plus" width={12} height={12} />
										<span>{t("DASHBOARD.WALLET_CONTROLS.CREATE")}</span>
									</div>
								</Button>

								<Button
									onClick={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
									variant="plain"
								>
									<div className="flex items-center space-x-2">
										<Icon name="Import" width={15} height={15} />
										<span>{t("DASHBOARD.WALLET_CONTROLS.IMPORT")}</span>
									</div>
								</Button>
							</div>
						</div>
					</EmptyBlock>
				</Section>
			) : (
				Object.keys(walletsByCoin).map((coin, index) => (
					<Section className="flex-1" key={index}>
						<AddressTable wallets={walletsByCoin[coin]} onSelect={handleSelectAddress} />
					</Section>
				))
			)}
		</Page>
	);
};
