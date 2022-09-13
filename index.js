const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const vText = document.querySelector('#vel-label > span')
const yText = document.querySelector('#y-label > span')

const timeText = document.querySelector('#time-label > span')
const timeMultiplierInput = document.querySelector('#time-input')

timeMultiplierInput.addEventListener('input', () => {
	timeText.textContent = Number.parseFloat(+timeMultiplierInput.value).toFixed(1)
})
timeText.textContent = Number.parseFloat(+timeMultiplierInput.value).toFixed(1)

const heightText = document.querySelector('#height-label > span')
const heightInput = document.querySelector('#height-input')

heightInput.addEventListener('input', () => {
	heightText.textContent = Number.parseFloat(+heightInput.value / 100).toFixed(2)
})
heightText.textContent = Number.parseFloat(+heightInput.value / 100).toFixed(2)

const ballText = document.querySelector('#ball-label > span')
const ballInput = document.querySelector('#ball-input')

ballInput.addEventListener('input', () => {
	ballText.textContent = Number.parseFloat(ballInput.value).toFixed(1)
})
ballText.textContent = Number.parseFloat(ballInput.value).toFixed(1)

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

function max(a, b) {
	if (+a < +b) return b

	return a
}

ctx.fillStyle = '#ff1111'

function animate(x) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.beginPath()
	ctx.arc(canvas.width / 4, canvas.height - y * 100, 16, Math.PI * 2, 0, false)
	ctx.closePath()
	ctx.fill()

	ctx.strokeStyle = 'gray'

	ctx.beginPath()
	ctx.rect(canvas.width / 4 - 75, canvas.height - heightInput.value, 150, heightInput.value)
	ctx.stroke()

	ctx.strokeStyle = '#000000'

	ctx.beginPath()
	ctx.moveTo(canvas.width / 4 - 75, canvas.height - heightInput.value)
	ctx.lineTo(canvas.width / 4 + 1, max(canvas.height - heightInput.value, canvas.height - y * 100 + 16))
	ctx.moveTo(canvas.width / 4, max(canvas.height - heightInput.value, canvas.height - y * 100 + 16))
	ctx.lineTo(canvas.width / 4 + 75, canvas.height - heightInput.value)
	ctx.stroke()

	if (isRunning) {
		move(((x - lastT) / 1000) * timeMultiplierInput.value)
	} else {
		y = +ballInput.value
		v = 0
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
