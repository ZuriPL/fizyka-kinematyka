const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const controls = document.querySelector('fieldset')
const vText = document.querySelector('#vel-label > span')
const aText = document.querySelector('#a-label > span')
const gridInput = document.querySelector('#grid-check')

const timeText = document.querySelector('#time-label > span')
const timeMultiplierInput = document.querySelector('#time-input')

timeMultiplierInput.addEventListener('input', () => {
	timeText.textContent = Number.parseFloat(+timeMultiplierInput.value).toFixed(1)
})
timeText.textContent = Number.parseFloat(+timeMultiplierInput.value).toFixed(1)

const heightText = document.querySelector('#height-label > span')
const heightInput = document.querySelector('#height-input')

heightInput.addEventListener('input', () => {
	heightText.textContent = Number.parseFloat(+heightInput.value).toFixed(2) + ' m'
})
heightText.textContent = Number.parseFloat(+heightInput.value).toFixed(2) + ' m'

const gravityText = document.querySelector('#gravity-label > span')
const gravityInput = document.querySelector('#gravity-input')

gravityInput.addEventListener('input', () => {
	gravityText.textContent = Number.parseFloat(+gravityInput.value).toFixed(2) + ' m/s^2'
})
gravityText.textContent = Number.parseFloat(+gravityInput.value).toFixed(2) + ' m/s^2'

const ballText = document.querySelector('#ball-label > span')
const ballInput = document.querySelector('#ball-input')

ballInput.addEventListener('input', () => {
	ballText.textContent = Number.parseFloat(ballInput.value).toFixed(2) + ' m'
	y = +ballInput.value
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

function stopSim() {
	isRunning = false
	startButton.textContent = 'Start'
}

function clear(x) {
	stopSim()

	controls.removeAttribute('disabled', '')
	y = +ballInput.value
	v = 0
	a = +gravityInput.value
}

document.addEventListener('keypress', (e) => {
	if (e.key === 'p') {
		if (controls.hasAttribute('disabled')) return controls.removeAttribute('disabled', '')

		controls.setAttribute('disabled', '')
	}
})

let y = +ballInput.value
let v = 0
let a = +gravityInput.value

let lastT = 0
let isRunning = false

function move(dt) {
	v += a * dt
	y -= v * dt
}

function animate(x) {
	a = +gravityInput.value - (+trampKInput.value * Math.max(0, +heightInput.value - y)) / +massInput.value

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	if (gridInput.checked) {
		ctx.lineWidth = 1
		ctx.strokeStyle = '#bbb'

		for (let x = 0; x <= canvas.width; x += 100) {
			ctx.moveTo(canvas.height - x - 0.5, 0)
			ctx.lineTo(canvas.height - x - 0.5, canvas.height)
		}

		for (let x = 0; x <= canvas.height; x += 100) {
			ctx.moveTo(0, canvas.height - x - 0.5)
			ctx.lineTo(canvas.width, canvas.height - x - 0.5)
		}
		ctx.stroke()
	}

	ctx.lineWidth = 2
	ctx.fillStyle = '#ff1111'
	ctx.strokeStyle = 'gray'

	ctx.beginPath()
	ctx.rect(canvas.width / 4 - 75, canvas.height - +heightInput.value * 100, 150, +heightInput.value * 100)
	ctx.stroke()

	ctx.strokeStyle = '#000000'

	let ballRadius = 15 + +massInput.value * 3

	ctx.beginPath()
	ctx.moveTo(canvas.width / 4 - 75, canvas.height - +heightInput.value * 100)
	ctx.lineTo(
		canvas.width / 4 - ballRadius + 1,
		Math.max(canvas.height - +heightInput.value * 100, canvas.height - y * 100)
	)
	ctx.moveTo(
		canvas.width / 4 - ballRadius,
		Math.max(canvas.height - +heightInput.value * 100, canvas.height - y * 100)
	)
	ctx.lineTo(
		canvas.width / 4 + ballRadius + 1,
		Math.max(canvas.height - +heightInput.value * 100, canvas.height - y * 100)
	)
	ctx.moveTo(
		canvas.width / 4 + ballRadius,
		Math.max(canvas.height - +heightInput.value * 100, canvas.height - y * 100)
	)
	ctx.lineTo(canvas.width / 4 + 75, canvas.height - +heightInput.value * 100)
	ctx.stroke()

	ctx.beginPath()
	ctx.arc(canvas.width / 4, canvas.height - y * 100 - ballRadius, ballRadius, Math.PI * 2, 0, false)
	ctx.closePath()
	ctx.fill()

	if (isRunning) {
		move(((x - lastT) / 1000) * timeMultiplierInput.value)
	} else {
		stopSim()
	}

	lastT = x

	if (y < 0) {
		y = 0
		v = 0
		console.log('Dotknięto podłogi')
	}

	vText.textContent = v + ' m/s'
	aText.textContent = a + ' m/s^2'

	window.requestAnimationFrame(animate)
}

function toggle() {
	if (isRunning) {
		stopSim()
	} else {
		isRunning = true
		startButton.textContent = 'Stop'
		controls.setAttribute('disabled', '')
	}
}

window.requestAnimationFrame(animate)

startButton.addEventListener('click', toggle)
