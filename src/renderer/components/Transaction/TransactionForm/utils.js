export const populateFormFromSchema = (component, mappings) => {
  if (!component.schema) {
    return
  }

  for (const [key, value] of Object.entries(mappings)) {
    component.$set(component.form, key, value)
  }

  if (component.schema.wallet) {
    const currentProfileId = component.$store.getters['session/profileId']
    const ledgerWallets = component.$store.getters['ledger/isConnected']
      ? component.$store.getters['ledger/wallets']
      : []
    const wallets = []

    let foundNetwork = !component.schema.nethash
    if (currentProfileId) {
      if (component.schema.nethash) {
        const profile = component.$store.getters['profile/byId'](
          currentProfileId
        )
        const network = component.$store.getters['network/byId'](
          profile.networkId
        )
        if (network.nethash === component.schema.nethash) {
          foundNetwork = true
          wallets.push(
            ...component.$store.getters['wallet/byProfileId'](currentProfileId)
          )
        }
      } else {
        wallets.push(
          ...component.$store.getters['wallet/byProfileId'](currentProfileId)
        )
      }
    }

    wallets.push(...ledgerWallets)

    for (const profile of component.$store.getters['profile/all']) {
      if (currentProfileId !== profile.id) {
        if (component.schema.nethash) {
          const network = component.$store.getters['network/byId'](
            profile.networkId
          )
          if (network.nethash === component.schema.nethash) {
            foundNetwork = true
            wallets.push(
              ...component.$store.getters['wallet/byProfileId'](profile.id)
            )
          }
        } else {
          wallets.push(
            ...component.$store.getters['wallet/byProfileId'](profile.id)
          )
        }
      }
    }

    const wallet = wallets.filter(
      wallet => wallet.address === component.schema.wallet
    )
    if (wallet.length) {
      component.currentWallet = wallet[0]
    }
    if (!foundNetwork) {
      component.$emit('cancel')
      component.$error(
        `${component.$t('TRANSACTION.ERROR.NETWORK_NOT_CONFIGURED')}: ${
          component.schema.nethash
        }`
      )
    } else if (!wallet.length) {
      component.$emit('cancel')
      component.$error(
        `${component.$t('TRANSACTION.ERROR.WALLET_NOT_IMPORTED')}: ${
          component.schema.wallet
        }`
      )
    }
  }
}
