export const getDeeplinkRoute: any = (activeSession: { profileId: string; walletId: string }) => ({
	transfer: `/profiles/${activeSession.profileId}/wallets/${activeSession.walletId}/send-transfer`,
});
