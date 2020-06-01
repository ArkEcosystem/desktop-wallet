import {
	ValidationObserver,
	ValidationProvider
} from "vee-validate/dist/vee-validate.full";
import Vue from 'vue'

require('babel-plugin-require-context-hook/register')()

// Third-Party Components
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
