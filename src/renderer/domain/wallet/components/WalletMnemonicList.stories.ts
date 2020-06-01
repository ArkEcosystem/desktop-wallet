import WalletMnemonicList from "./WalletMnemonicList.vue"

export default { title: "Wallet / MnemonicList" }

export const Default = () => ({
	components: { WalletMnemonicList },
	data: () => ({ mnemonic: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipisicing', 'elit', 'nihil', 'nisi', 'natus', 'adipisci'] }),
	template: `<WalletMnemonicList class="p-5" :mnemonic="mnemonic"></WalletMnemonicList>`
})
