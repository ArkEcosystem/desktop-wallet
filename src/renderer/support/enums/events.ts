export enum AppEvent {
	// Misc.
	Alert = "alert",
	// Application
	AppPreferences = "app:preferences",
	SplashscreenAppReady = "splashscreen:app-ready",
	// Client
	ClientChanged = "client:changed",
	// Ledger
	LedgerConnected = "ledger:connected",
	LedgerDisconnected = "ledger:disconnected",
	LedgerWalletsUpdated = "ledger:wallets-updated",
	// Plugins
	PluginManagerDownloadProgress = "plugin-manager:download-progress",
	PluginManagerError = "plugin-manager:error",
	PluginManagerPluginDownloaded = "plugin-manager:plugin-downloaded",
	PluginManagerPluginInstalled = "plugin-manager:plugin-installed",
	// Transactions
	Transaction = "transaction",
	TransactionsFetched = "transactions:fetched",
	// Updater
	UpdaterDownloadProgress = "updater:download-progress",
	UpdaterError = "updater:error",
	UpdaterUpdateAvailable = "updater:update-available",
	UpdaterUpdateDownloaded = "updater:update-downloaded",
	// Wallet
	WalletReload = "wallet:reload",
	WalletReloadBusinessBridgechains = "wallet:reload:business-bridgechains",
	WalletReloadMultiSignature = "wallet:reload:multi-signature",
}
