import Vue from "vue";

import SplashScreen from "./SplashScreen.vue";

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
	components: {
		SplashScreen,
	},
	template: "<SplashScreen/>",
}).$mount("#splashscreen");
