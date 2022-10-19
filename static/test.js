// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'http://127.0.0.1:5173/test.js';
// document.head.appendChild(script);

// function importURL(src) {
// 	var script = document.createElement('script');
// 	script.type = 'text/javascript';
// 	script.src = src;
// 	document.head.appendChild(script);
// }

const volumeEl = document.createElement('div');
volumeEl.style.position = 'absolute';
volumeEl.style.height = '100px';
volumeEl.style.width = '100vw';
volumeEl.style.zIndex = '100000';
volumeEl.style.top = '0';
volumeEl.style.left = '0';
volumeEl.style.backgroundColor = 'rgba(255,0,0,0.9)';

document.body.appendChild(volumeEl);
window.volumeEl = volumeEl;

let bodyEl = document.querySelector('body');
console.log('bodyEl', bodyEl);

let targetSelector =
	localStorage.getItem('targetSelector') ||
	'body > div > div.flex.grow.flex-col > div.justify-center.items-center.grow.flex.p-4 > button';
let targetEl;

function getTargetSelector() {
	targetSelector = prompt(`Please write button target selector:`, targetSelector);
	localStorage.setItem('targetSelector', targetSelector);
	targetEl = document.querySelector(targetSelector);

	console.log('targetEl', targetEl);
}

getTargetSelector();

let maxVolume = 0;
let maxVolumeDecay = 0.01;
let volumeMaxTheshold = 0.1;
let volumeMinTheshold = 0.02;
let inRange = false;

async function getMedia() {
	let stream = null;

	let devices = await navigator.mediaDevices.enumerateDevices();
	let inputDevices = devices.filter((it) => it.kind == 'audioinput');
	console.log(inputDevices);

	let devicesListPrompt = inputDevices.map((it, i) => `[${i}] ${it.label}`).join('\n');

	let deviceInx = prompt(`Please select an input device: \n${devicesListPrompt}`, '0');
	let selectedDevice = inputDevices[parseInt(deviceInx)];

	console.log(selectedDevice);

	let constraints = {
		audio: { deviceId: selectedDevice.deviceId ? { exact: selectedDevice.deviceId } : undefined },
		video: false
	};

	try {
		stream = await navigator.mediaDevices.getUserMedia(constraints);
		/* use the stream */
	} catch (err) {
		/* handle the error */
	}

	const audioContext = new AudioContext();
	const mediaStreamAudioSourceNode = audioContext.createMediaStreamSource(stream);
	const analyserNode = audioContext.createAnalyser();
	// analyserNode.fftSize = 8;
	mediaStreamAudioSourceNode.connect(analyserNode);

	const pcmData = new Float32Array(analyserNode.fftSize);
	const onFrame = () => {
		analyserNode.getFloatTimeDomainData(pcmData);
		let sumSquares = 0.0;
		for (const amplitude of pcmData) {
			sumSquares += amplitude * amplitude;
		}
		let volume = Math.sqrt(sumSquares / pcmData.length);

		maxVolume = Math.max(maxVolume, volume);

		if (!inRange && maxVolume >= volumeMaxTheshold) {
			console.log('>> in');
			inRange = true;
			targetEl.click();
		}

		if (inRange && maxVolume <= volumeMinTheshold) {
			console.log('<< out');
			inRange = false;
			targetEl.click();
		}

		volumeEl.style.width = `${volume * 100}vw`;
		// console.log(maxVolume);

		maxVolume = Math.max(maxVolume - maxVolumeDecay, 0);
		window.requestAnimationFrame(onFrame);
	};
	window.requestAnimationFrame(onFrame);
}

getMedia();
