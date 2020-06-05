import { select, withKnobs } from "@storybook/addon-knobs";

import Slider from "./Slider.vue";
import { WalletCard } from "@/app/components/WalletCard";

export default { title: "Basic / Slider", decorators: [withKnobs] };

export const Default = () => ({
	components: { Slider, WalletCard },
	template: `
		<div class="p-5">
		<div class="mb-2">Simple with pagination (3 items per page)</div>
                <div class="mb-4">
                </div>
                  <Slider :items="[1,2,3,4,5,6]" :options="{ gap: 20, slidesPerColumn: 2, slidesPerView: 3 }" style="height:280px">
                      <template v-slot:item="{ item }" style="height:100px">
                          <WalletCard
                                  class="mr-4 mb-4"
                                  :isBlank="true"
                          ></WalletCard>
                      </template>
                  </Slider>
		</div>
	`,
});
