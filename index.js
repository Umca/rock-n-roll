import Vue from 'vue'
import App from './src/App.vue'

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


