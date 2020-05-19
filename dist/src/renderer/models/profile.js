import BaseModel from './base';
export default new BaseModel({
    type: 'object',
    properties: {
        id: {
            type: 'string',
            minLength: 1,
            maxLength: 16
        },
        avatar: {
            anyOf: [
                // Images provided by the app
                {
                    type: 'string',
                    minLength: 1
                },
                // Images provided by the plugins
                {
                    type: 'object',
                    properties: {
                        avatarName: {
                            type: 'string'
                        },
                        pluginId: {
                            type: 'string'
                        }
                    }
                },
                // No avatar (use name first character)
                {
                    type: 'null'
                }
            ]
        },
        background: {
            type: 'string',
            minLength: 1
        },
        currency: {
            type: 'string',
            minLength: 3,
            maxLength: 3
        },
        timeFormat: {
            type: 'string',
            default: 'Default'
        },
        hideWalletButtonText: {
            type: 'boolean',
            format: function (data) { return data.hideWalletButtonText !== undefined ? data.hideWalletButtonText : false; }
        },
        marketChartOptions: {
            type: 'object',
            format: function (data) { return data.marketChartOptions || { isEnabled: true, isExpanded: true, period: 'day' }; }
        },
        language: {
            type: 'string',
            minLength: 1
        },
        bip39Language: {
            type: ['string', 'null'],
            format: function (data) { return data.bip39Language || null; }
        },
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 120
        },
        networkId: {},
        theme: {
            type: 'string',
            minLength: 1
        },
        screenshotProtection: {
            type: 'boolean',
            format: function (data) { return data.screenshotProtection !== undefined ? data.screenshotProtection : true; }
        },
        backgroundUpdateLedger: {
            type: 'boolean',
            format: function (data) { return data.backgroundUpdateLedger !== undefined ? data.backgroundUpdateLedger : true; }
        },
        broadcastPeers: {
            type: 'boolean',
            format: function (data) { return data.broadcastPeers !== undefined ? data.broadcastPeers : true; }
        },
        ledgerCache: {
            type: 'boolean',
            format: function (data) { return data.ledgerCache || false; }
        },
        showPluginConfirmation: {
            type: 'boolean',
            format: function (data) { return typeof data.showPluginConfirmation === 'boolean' ? data.showPluginConfirmation : true; }
        },
        transactionTableRowCount: {
            type: 'integer',
            format: function (data) { return data.transactionTableRowCount || 10; }
        },
        unconfirmedVotes: {
            type: 'array',
            format: function (data) { return data.unconfirmedVotes || []; }
        },
        pluginManagerLayout: {
            type: 'string',
            format: function (data) { return data.pluginManagerLayout || 'grid'; }
        },
        pluginMenuOpen: {
            type: 'boolean',
            format: function (data) { return data.pluginMenuOpen !== undefined ? data.pluginMenuOpen : true; }
        },
        walletLayout: {
            type: 'string',
            format: function (data) { return data.walletLayout || 'grid'; }
        },
        walletSidebarSortParams: {
            type: 'object',
            format: function (data) { return data.walletSidebarSortParams || { field: 'name', type: 'asc' }; }
        },
        walletSidebarFilters: {
            type: 'object',
            format: function (data) { return data.walletSidebarFilters || {}; }
        },
        walletSortParams: {
            type: 'object',
            format: function (data) { return data.walletSortParams || { field: 'balance', type: 'desc' }; }
        },
        contactSortParams: {
            type: 'object',
            format: function (data) { return data.contactSortParams || { field: 'name', type: 'asc' }; }
        },
        pluginSortParams: {
            type: 'object',
            format: function (data) { return data.pluginSortParams || { field: 'title', type: 'asc' }; }
        },
        lastFees: {
            type: 'object',
            format: function (data) { return data.lastFees || {}; }
        },
        multiSignaturePeer: {
            type: ['object', 'null'],
            format: function (data) { return data.multiSignaturePeer || null; }
        },
        filterBlacklistedPlugins: {
            type: 'boolean',
            format: function (data) { return data.filterBlacklistedPlugins !== undefined ? data.filterBlacklistedPlugins : true; }
        },
        pluginAdapter: {
            type: 'string',
            format: function (data) { return data.pluginAdapter || 'npm'; }
        },
        priceApi: {
            type: 'string',
            format: function (data) { return data.priceApi || 'coingecko'; }
        },
        isAdvancedModeEnabled: {
            type: 'boolean',
            format: function (data) { return data.isAdvancedModeEnabled || false; }
        },
        defaultChosenFee: {
            type: 'string',
            format: function (data) { return data.defaultChosenFee || 'AVERAGE'; }
        }
    },
    required: ['background', 'currency', 'language', 'name', 'networkId', 'theme']
});
//# sourceMappingURL=profile.js.map