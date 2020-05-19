import Vue from "vue";

import i18n from "./i18n";
import SplashScreen from "./SplashScreen.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	components: { SplashScreen },
	i18n,
	template: "<SplashScreen/>",
}).$mount("#splashscreen");
