import { Alert } from "app/components/Alert";
import { Page, Section } from "app/components/Layout";
import { useEnvironmentContext } from "app/contexts";
import { useActiveProfile, useActiveWallet, useProfileUtils } from "app/hooks";
import { toasts } from "app/services";
import { DelegateTable } from "domains/vote/components/DelegateTable";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router-dom";
import { VotesHeader } from "domains/vote/components/VotesHeader";
import { VotesEmpty } from "domains/vote/components/VotesEmpty";
import { VotingWallets } from "domains/vote/components/VotingWallets/VotingWallets";
import { useDelegates } from "domains/vote/hooks/use-delegates";
import { useVoteFilters } from "domains/vote/hooks/use-vote-filters";
import { useVoteActions } from "domains/vote/hooks/use-vote-actions";
import { useVoteQueryParams } from "domains/vote/hooks/use-vote-query-params";

export const Votes = () => {
	const { t } = useTranslation();
	const history = useHistory();
	const { walletId: hasWalletId } = useParams();
	const { env } = useEnvironmentContext();

	const activeProfile = useActiveProfile();
	const activeWallet = useActiveWallet();

	const { getErroredNetworks } = useProfileUtils(env);
	const { filter, voteAddresses, unvoteAddresses } = useVoteQueryParams();

	const {
		filterProperties,
		isFilterChanged,
		filteredWalletsByCoin,
		hasEmptyResults,
		hasWallets,
		voteFilter,
		setVoteFilter,
		selectedAddress,
		setSelectedAddress,
		searchQuery,
		setSearchQuery,
		maxVotes,
		setMaxVotes,
	} = useVoteFilters({
		profile: activeProfile,
		wallet: activeWallet,
		hasWalletId,
		filter,
	});

	const {
		isLoadingDelegates,
		fetchDelegates,
		currentVotes,
		filteredDelegates,
		fetchVotes,
		votes,
		hasResignedDelegateVotes,
	} = useDelegates({
		env,
		profile: activeProfile,
		voteFilter,
		searchQuery,
	});

	const { navigateToSendVote } = useVoteActions({
		profile: activeProfile,
		wallet: activeWallet,
		selectedAddress,
		hasWalletId,
	});

	useEffect(() => {
		if (selectedAddress) {
			fetchVotes(selectedAddress);
		}
	}, [fetchVotes, selectedAddress]);

	useEffect(() => {
		if (hasWalletId) {
			fetchDelegates(activeWallet);
		}
	}, [activeWallet, fetchDelegates, hasWalletId]);

	useEffect(() => {
		if (votes?.length === 0) {
			setVoteFilter("all");
		}
	}, [votes]);

	useEffect(() => {
		const { hasErroredNetworks, erroredNetworks } = getErroredNetworks(activeProfile);
		if (!hasErroredNetworks) {
			return;
		}

		toasts.warning(
			<Trans
				i18nKey="COMMON.ERRORS.NETWORK_ERROR"
				values={{ network: erroredNetworks.join(", ") }}
				components={{ bold: <strong /> }}
			/>,
		);
	}, [getErroredNetworks, activeProfile, t]);

	const handleSelectAddress = (address: string) => {
		const wallet = activeProfile.wallets().findByAddress(address);

		setSearchQuery("");
		setSelectedAddress(address);
		setMaxVotes(wallet?.network().maximumVotesPerWallet());

		fetchDelegates(wallet);
	};

	const hasSelectedAddress = !!selectedAddress;

	return (
		<Page profile={activeProfile}>
			<Section border>
				<VotesHeader
					profile={activeProfile}
					setSearchQuery={setSearchQuery}
					selectedAddress={selectedAddress}
					isFilterChanged={isFilterChanged}
					filterProperties={filterProperties}
					totalCurrentVotes={currentVotes?.length || 0}
					selectedFilter={voteFilter}
					setSelectedFilter={setVoteFilter}
				/>
			</Section>

			{!hasWallets && (
				<Section>
					<VotesEmpty
						onCreateWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/create`)}
						onImportWallet={() => history.push(`/profiles/${activeProfile.id()}/wallets/import`)}
					/>
				</Section>
			)}

			{hasWallets && !hasSelectedAddress && (
				<VotingWallets
					showEmptyResults={hasEmptyResults}
					walletsByCoin={filteredWalletsByCoin}
					onSelectAddress={handleSelectAddress}
				/>
			)}

			{hasSelectedAddress && (
				<Section innerClassName="mb-27">
					<DelegateTable
						delegates={filteredDelegates}
						emptyText={t("VOTE.DELEGATE_TABLE.DELEGATES_NOT_FOUND")}
						isLoading={isLoadingDelegates}
						maxVotes={maxVotes!}
						votes={votes}
						selectedUnvoteAddresses={unvoteAddresses}
						selectedVoteAddresses={voteAddresses}
						selectedWallet={selectedAddress}
						onContinue={navigateToSendVote}
						isPaginationDisabled={searchQuery.length > 0}
						subtitle={
							hasResignedDelegateVotes ? (
								<Alert className="mb-6">
									<div data-testid="Votes__resigned-vote">
										<Trans
											i18nKey="VOTE.VOTES_PAGE.RESIGNED_VOTE"
											values={{
												name: currentVotes
													?.find((vote) => vote.isResignedDelegate())
													?.username(),
											}}
											components={{ bold: <strong /> }}
										/>
									</div>
								</Alert>
							) : null
						}
					/>
				</Section>
			)}
		</Page>
	);
};
