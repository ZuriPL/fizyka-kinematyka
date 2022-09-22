const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const controls = document.querySelector('fieldset')
const vText = document.querySelector('#vel-label > span')
const aText = document.querySelector('#a-label > span')
const gridInput = document.querySelector('#grid-check')
const dampingInput = document.querySelector('#damping')

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

const dampingInput = document.querySelector('#damping-input')
const dampingText = document.querySelector('#damping-input > span')

dampingInput.addEventListener('input', () => {
	dampingText.textContent = Number.parseFloat(dampingInput.value).toFixed(1)
})
dampingText.textContent = Number.parseFloat(dampingInput.value).toFixed(1)

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

function clear() {
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

function sgn(x) {
	if (x > 0) {
		return 1
	}
	if (x < 0) {
		return -1
	}
	return 0
}

function animate(x) {
	let trampVel = 0

	if (dampingInput.checked) trampVel = +heightInput.value - y > 0 ? v : 0

	a =
		+gravityInput.value -
		(+trampKInput.value * Math.max(0, +heightInput.value - y)) / +massInput.value -
		(2 * Math.sqrt(+trampKInput.value * +massInput.value) * trampVel * sgn(trampVel)) / +massInput.value

	ctx.clearRect(0, 0, canvas.width, canvas.height)

	let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
	gradient.addColorStop(0.1, '#0fb0e5')
	gradient.addColorStop(1, '#cfecfc')

	ctx.fillStyle = gradient
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	if (gridInput.checked) {
		ctx.lineWidth = 1
		ctx.strokeStyle = '#9a9a9a'

		for (let x = 0; x <= canvas.width; x += 100) {
			ctx.moveTo(x - 0.5, 0)
			ctx.lineTo(x - 0.5, canvas.height)
		}

		for (let x = 0; x <= canvas.height; x += 100) {
			ctx.moveTo(0, canvas.height - x - 0.5)
			ctx.lineTo(canvas.width, canvas.height - x - 0.5)
		}
		ctx.stroke()
	}

	ctx.beginPath()
	ctx.fillStyle = '#1bb21b'
	ctx.fillRect(0, canvas.height, canvas.width, -5)
	ctx.stroke()

	ctx.lineWidth = 2
	ctx.fillStyle = '#ff1111'
	ctx.strokeStyle = 'gray'

	ctx.beginPath()
	ctx.rect(canvas.width / 3 - 75, canvas.height - +heightInput.value * 100, 150, +heightInput.value * 100)
	ctx.stroke()

	ctx.strokeStyle = '#000000'

	let ballRadius = 15 + +massInput.value * 3

	let b = Math.sqrt(5625 + Math.pow(+heightInput.value * 100 - y * 100 - ballRadius - 1, 2))
	let c = Math.sqrt(Math.pow(b, 2) - Math.pow(ballRadius + 1, 2))

	let ang1 = Math.asin(((+heightInput.value - y) * 100 - ballRadius - 1) / b)
	let ang2 = Math.asin((ballRadius + 1) / b)

	let alpha = Math.PI * 0.5 - ang1 - ang2

	let o1 = c * Math.cos(alpha)
	let o2 = c * Math.sin(alpha)

	ctx.beginPath()
	ctx.moveTo(canvas.width / 3 - 75, canvas.height - +heightInput.value * 100)

	if (+heightInput.value > y) {
		ctx.lineTo(canvas.width / 3 - 75 + o2, canvas.height - heightInput.value * 100 + o1 + 1)
		ctx.moveTo(canvas.width / 3 + 75, canvas.height - +heightInput.value * 100)
		ctx.lineTo(canvas.width / 3 + 75 - o2, canvas.height - heightInput.value * 100 + o1 + 1)

		let a1 = Math.asin((o1 - (+heightInput.value * 100 - (y * 100 + ballRadius))) / (ballRadius + 1))
		let a2 = Math.acos((o1 - (+heightInput.value * 100 - (y * 100 + ballRadius))) / (ballRadius + 1))

		ctx.arc(canvas.width / 3, canvas.height - y * 100 - ballRadius, ballRadius + 1, a1, a1 + 2 * a2)
	} else {
		ctx.lineTo(canvas.width / 3 + 75, canvas.height - +heightInput.value * 100)
	}

	ctx.stroke()

	// ===

	ctx.beginPath()
	ctx.arc(canvas.width / 3, canvas.height - y * 100 - ballRadius, ballRadius, Math.PI * 2, 0, false)
	ctx.closePath()
	ctx.fill()

	if (isRunning) {
		move(((x - lastT) / 1000) * timeMultiplierInput.value)
	} else {
		stopSim()
	}

	lastT = x

	if (y <= 0) {
		y = 0
		v = 0
		console.log('Dotknięto podłogi')
	}

	vText.textContent = v.toFixed(2) + ' m/s'
	aText.textContent = a.toFixed(2) + ' m/s^2'
	document.querySelector('#y-text > span').textContent = y.toFixed(2) + ' m'

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
