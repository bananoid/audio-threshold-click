// var script = document.createElement('script');
// script.type = 'text/javascript';
// script.src = 'http://127.0.0.1:5173/test.js';
// document.head.appendChild(script);

const volumeEl = document.createElement('div');
volumeEl.style.position = 'absolute';
volumeEl.style.height = '100px';
volumeEl.style.width = '100vw';
volumeEl.style.zIndex = '100000';
volumeEl.style.top = '0';
volumeEl.style.left = '0';
volumeEl.style.backgroundColor = 'rgba(255,0,0,0.7)';

const maxVolEl = volumeEl.cloneNode();
maxVolEl.style.backgroundColor = 'rgba(255,100,0,0.3)';

document.body.appendChild(volumeEl);
document.body.appendChild(maxVolEl);
window.volumeEl = volumeEl;

let bodyEl = document.querySelector('body');
console.log('bodyEl', bodyEl);

let onTargetSelector =
	localStorage.getItem('onTargetSelector') ||
	'body > div > div.flex.grow.flex-col > div.justify-center.items-center.grow.flex.p-4 > button';
let onTargetEl;

let offTargetSelector = localStorage.getItem('offTargetSelector') || onTargetSelector;
let offTargetEl;

function getTargetSelector() {
	onTargetSelector = prompt(`Please write on button target selector:`, onTargetSelector);
	localStorage.setItem('onTargetSelector', onTargetSelector);
	onTargetEl = document.querySelector(onTargetSelector);

	offTargetSelector = prompt(`Please write off button target selector:`, offTargetSelector);
	localStorage.setItem('offTargetSelector', offTargetSelector);
	offTargetEl = document.querySelector(offTargetSelector);

	console.log('onTargetEl', onTargetEl);
	console.log('offTargetEl', offTargetEl);
}

getTargetSelector();

let maxVolume = 0;
let maxVolumeDecay = 0.01;
let volumeMaxTheshold = 0.1;
let silenceTimeoutMS = 1000;
let isActive;

let smoothVolume = 0;

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
	analyserNode.fftSize = 32;
	mediaStreamAudioSourceNode.connect(analyserNode);

	const pcmData = new Float32Array(analyserNode.fftSize);

	console.log('analyserNode.fftSize', analyserNode.fftSize);

	let activeTimeoutId;

	function setActive() {
		if (!isActive) {
			isActive = true;
			onTargetEl.click();
		}

		clearTimeout(activeTimeoutId);
		activeTimeoutId = activeTimeoutId = setTimeout(() => {
			isActive = false;
			offTargetEl.click();
		}, silenceTimeoutMS);
	}

	const onFrame = () => {
		analyserNode.getFloatTimeDomainData(pcmData);
		let volume = 0.0;
		for (const amplitude of pcmData) {
			volume += amplitude * amplitude * 10;
		}
		volume = Math.sqrt(volume / pcmData.length);

		maxVolume = Math.max(maxVolume, volume);
		smoothVolume += (volume - smoothVolume) * 0.1;

		if (volume >= volumeMaxTheshold) {
			// console.log('>> in');
			setActive();
		}

		volumeEl.style.width = `${volume * 100}vw`;
		maxVolEl.style.width = `${maxVolume * 100}vw`;

		maxVolume = Math.max(maxVolume - maxVolumeDecay, 0);
		window.requestAnimationFrame(onFrame);
	};
	window.requestAnimationFrame(onFrame);
}

getMedia();
