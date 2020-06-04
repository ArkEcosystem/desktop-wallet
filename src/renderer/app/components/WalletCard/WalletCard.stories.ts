import { select, withKnobs } from "@storybook/addon-knobs";

import WalletCard from "./WalletCard.vue";

export default { title: "Wallet / Wallet Card", decorators: [withKnobs] };

export const Blank = () => ({
	components: { WalletCard },
	template: `
		<div class="p-5">
		        <div class="mb-5"></div>
			<WalletCard class="mr-4" :isBlank="true"></WalletCard>

		        <div class="mb-5"></div>
			<WalletCard class="mr-4" :isBlank="true"></WalletCard>
			<WalletCard class="mr-4" :isBlank="true"></WalletCard>
			<WalletCard class="mr-4" :isBlank="true"></WalletCard>
		</div>
	`,
});

export const Filled = () => ({
	components: { WalletCard },
	template: `
		<div class="p-5">
		        <div class="mb-5"></div>

		        <div class="mb-5">
                          Input data required (type 'WalletCardContext')
		        </div>


                        <div class="mb-2 text-xs">
                                 :data   ="{</br>
                                      <div class="ml-5">
                                                <code>
                                                    avatarId: 'test',</br>
                                                    coinIcon: '₿', // svg icon name</br>
                                                    iconColor: 'yellow-200',</br>
                                                    walletName: 'Satoshi',</br>
                                                    address: 'Fa5eDSFDSF8DFaS3FJD',</br>
                                                    balance: '100,000,000',</br>
                                                    symbol: 'BTC',</br>
                                                  </code>
                                        </div>
                                  }"
                          </div>
                          Dropdown options
                          <div class="mb-3 text-xs">
                                  <code> :options="['Option 1', 'Option 2', 'Option 3']"</code>
                          </div>
                          Emittions
                          <div class="mb-8 text-xs">
                                  <code> @action="onSelectOption"</code>
                          </div>
                          <WalletCard
                                  class="mr-4"
                                  :options="['Option 1', 'Option 2', 'Option 3']"
                                  :data="{
                                          avatarId: 'test',
                                          coinIcon: '₿',
                                          iconColor: 'yellow-200',
                                          walletName: 'Satoshi',
                                          address: 'Fa5eDSFDSF8DFaS3FJD',
                                          balance: '100,000,000',
                                          symbol: 'BTC',
                                  }"
                          ></WalletCard>
                          <div class="mt-10">
                          <WalletCard
                                  class="mr-4 mb-4"
                                  :options="['Option 1', 'Option 2', 'Option 3']"
                                  :data="{
                                          avatarId: 'test',
                                          coinIcon: '₿',
                                          iconColor: 'yellow-200',
                                          walletName: 'Satoshi',
                                          address: 'Fa5eDSFDSF8DFaS3FJD',
                                          balance: '100,000,000',
                                          symbol: 'BTC',
                                  }"
                          ></WalletCard>
                          <WalletCard
                                  class="mr-4 mb-4"
                                  :options="['Option 1', 'Option 2', 'Option 3']"
                                  :data="{
                                          avatarId: 'test',
                                          coinIcon: '₿',
                                          iconColor: 'yellow-200',
                                          walletName: 'Satoshi',
                                          address: 'Fa5eDSFDSF8DFaS3FJD',
                                          balance: '100,000,000',
                                          symbol: 'BTC',
                                  }"
                          ></WalletCard>
                          </div>
                          </div>
	`,
});
