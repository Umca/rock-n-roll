import Vue from 'vue'
import * as VueGoogleMaps from "vue2-google-maps";
import API_KEYS from './src/utils/constants'
import App from './src/App.vue'

Vue.use(VueGoogleMaps, {
	load: {
		key: API_KEYS.GOOGLE_MAPS,
	}
});

// if ('serviceWorker' in navigator) {
// 	  navigator.serviceWorker.register('service-worker.js').then(function() {
// 		console.log('CLIENT: service worker registration complete.');
// 	}, function() {
// 		console.log('CLIENT: service worker registration failure.');
// 	});
// } else {
// 	console.log('CLIENT: service worker is not supported.');
// }

var app = new Vue({
    el: '#app',
    render: h => h(App)
  })


