const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const vText = document.querySelector('#vel-label > span')
const yText = document.querySelector('#y-label > span')

const timeText = document.querySelector('#time-label > span')
const timeMultiplierInput = document.querySelector('#time-input')

timeMultiplierInput.addEventListener('input', () => {
	timeText.textContent = timeMultiplierInput.value
})
timeText.textContent = timeMultiplierInput.value

const heightText = document.querySelector('#height-label > span')
const heightInput = document.querySelector('#height-input')

heightInput.addEventListener('input', () => {
	heightText.textContent = +heightInput.value / 100
})
heightText.textContent = +heightInput.value / 100

const ballText = document.querySelector('#ball-label > span')
const ballInput = document.querySelector('#ball-input')

ballInput.addEventListener('input', () => {
	ballText.textContent = ballInput.value
})
ballText.textContent = ballInput.value

const startButton = document.querySelector('#start-stop')

let y = +ballInput.value
let v = 0
let lastT = 0

let startTime
let isRunning = false

function move(dt) {
	v += 9.81 * dt
	y -= v * dt
}

function animate(x) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.beginPath()
	ctx.arc(canvas.width / 4, canvas.height - y * 100, 16, Math.PI * 2, 0, false)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.rect(canvas.width / 4 - 50, canvas.height - heightInput.value, 100, heightInput.value)
	ctx.stroke()

	if (isRunning) {
		move(((x - lastT) / 1000) * timeMultiplierInput.value)
	} else {
		y = +ballInput.value
	}

	lastT = x

	if (y < 0) {
		isRunning = false

		console.log(`Czas: ${(Date.now() - startTime) / 1000} s`)
		console.log(`Prędkość: ${v} m/s`)
		console.log(`Y: ${y}`)

		y = +ballInput.value
		v = 0
	}

	vText.textContent = v
	yText.textContent = y

	window.requestAnimationFrame(animate)
}

function toggle() {
	if (isRunning) {
		isRunning = false
	} else {
		isRunning = true
		startTime = Date.now()
	}
}

window.requestAnimationFrame(animate)

startButton.addEventListener('click', toggle)
