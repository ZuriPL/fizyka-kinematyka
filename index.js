const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const controls = document.querySelector('fieldset')
const vText = document.querySelector('#vel-label > span')
const aText = document.querySelector('#a-label > span')

const timeText = document.querySelector('#time-label > span')
const timeMultiplierInput = document.querySelector('#time-input')

timeMultiplierInput.addEventListener('input', () => {
	timeText.textContent = Number.parseFloat(+timeMultiplierInput.value).toFixed(1)
})
timeText.textContent = Number.parseFloat(+timeMultiplierInput.value).toFixed(1)

const heightText = document.querySelector('#height-label > span')
const heightInput = document.querySelector('#height-input')

heightInput.addEventListener('input', () => {
	heightText.textContent = Number.parseFloat(+heightInput.value / 100).toFixed(2) + ' m'
})
heightText.textContent = Number.parseFloat(+heightInput.value / 100).toFixed(2) + ' m'

const ballText = document.querySelector('#ball-label > span')
const ballInput = document.querySelector('#ball-input')

ballInput.addEventListener('input', () => {
	ballText.textContent = Number.parseFloat(ballInput.value).toFixed(2) + ' m'
})
ballText.textContent = Number.parseFloat(ballInput.value).toFixed(2) + ' m'

const massText = document.querySelector('#mass-label > span')
const massInput = document.querySelector('#mass-input')

massInput.addEventListener('input', () => {
	massText.textContent = Number.parseFloat(massInput.value).toFixed(3) + ' kg'
})
massText.textContent = Number.parseFloat(massInput.value).toFixed(3) + ' kg'

const trampKText = document.querySelector('#tramp-k-label > span')
const trampKInput = document.querySelector('#tramp-k-input')

trampKInput.addEventListener('input', () => {
	trampKText.textContent = trampKInput.value + ' N/m'
})
trampKText.textContent = trampKInput.value + ' N/m'

const startButton = document.querySelector('#start-stop')
const stepButton = document.querySelector('#next-step')
const resetButton = document.querySelector('#reset')

stepButton.addEventListener('click', () => {
	if (isRunning) return
	controls.setAttribute('disabled', '')
	move(1 / 60)
})

resetButton.addEventListener('click', clear)

function stop() {
	isRunning = false
	startButton.textContent = 'Start'
}

function clear() {
	stop()

	controls.removeAttribute('disabled', '')
	y = +ballInput.value
	v = 0
	a = 9.81
}

let y = +ballInput.value
let v = 0
let a = 9.81

let lastT = 0
let isRunning = false

function move(dt) {
	a = 9.81 - (+trampKInput.value * Math.max(0, +heightInput.value / 100 - y)) / +massInput.value

	v += a * dt
	y -= v * dt
}

function animate(x) {
	ctx.lineWidth = 2
	ctx.fillStyle = '#ff1111'

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.strokeStyle = 'gray'

	ctx.beginPath()
	ctx.rect(canvas.width / 4 - 75, canvas.height - heightInput.value, 150, heightInput.value)
	ctx.stroke()

	ctx.strokeStyle = '#000000'

	// eww
	ctx.beginPath()
	ctx.moveTo(canvas.width / 4 - 75, canvas.height - heightInput.value)
	ctx.lineTo(canvas.width / 4 - 15, Math.max(canvas.height - heightInput.value, canvas.height - y * 100 + 16))
	ctx.moveTo(canvas.width / 4 - 16, Math.max(canvas.height - heightInput.value, canvas.height - y * 100 + 16))
	ctx.lineTo(canvas.width / 4 + 17, Math.max(canvas.height - heightInput.value, canvas.height - y * 100 + 16))
	ctx.moveTo(canvas.width / 4 + 16, Math.max(canvas.height - heightInput.value, canvas.height - y * 100 + 16))
	ctx.lineTo(canvas.width / 4 + 75, canvas.height - heightInput.value)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(canvas.width / 4, canvas.height - y * 100, 16, Math.PI * 2, 0, false)
	ctx.closePath()
	ctx.fill()

	if (isRunning) {
		move(((x - lastT) / 1000) * timeMultiplierInput.value)
	}

	lastT = x

	if (y < 0) clear()

	vText.textContent = v + ' m/s'
	aText.textContent = a + ' m/s^2'

	window.requestAnimationFrame(animate)
}

function toggle() {
	if (isRunning) {
		stop()
	} else {
		isRunning = true
		startButton.textContent = 'Stop'
		controls.setAttribute('disabled', '')
	}
}

window.requestAnimationFrame(animate)

startButton.addEventListener('click', toggle)
