var Vue = require('vue');
var hello = require('vue!./components/hello.vue');

$(document).ready(function(){

	var app = new Vue({
		el: '#app',
		data: {
			audioContext: "",
			source: "",
			destination: "",
			buffer: "",
			urlFile: ""
		},
		methods:
		{

			intiContext: function()
			{
				try {
					window.AudioContext = window.AudioContext||window.webkitAudioContext;
					this.audioContext = new AudioContext();
				}
				catch(e) {
					alert('Opps.. Your browser do not support audio API');
				}
			},
			loadSoundFile: function(url)
			{
				// делаем XMLHttpRequest (AJAX) на сервер
				var xhr = new XMLHttpRequest();
				xhr.open('GET', url, true);
				xhr.responseType = 'arraybuffer'; // важно
				let self = this;
				xhr.onload = function(e) {
					// декодируем бинарный ответ
					self.audioContext.decodeAudioData(this.response,
					function(decodedArrayBuffer) {
						// получаем декодированный буфер
						self.buffer = decodedArrayBuffer;
					}, function(e) {
						console.log('Error decoding file', e);
					});
				};
				xhr.send();
			},


			play: function()
			{
			  // создаем источник
			  this.source = this.audioContext.createBufferSource();
			  // подключаем буфер к источнику
			  this.source.buffer = this.buffer;
			  // дефолтный получатель звука
			  this.destination = this.audioContext.destination;
			  // подключаем источник к получателю
			  this.source.connect(this.destination);
			  // воспроизводим
			  this.source.start(0);

			},

			stop: function()
			{
				this.source.stop(0);
			}

		},
		components: {
			hello: hello
		}

	});
	app.intiContext();
})
