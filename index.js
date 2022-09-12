const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const timeText = document.querySelector('#time-label > span')
const timeMultiplierInput = document.querySelector('#time-input')

timeMultiplierInput.addEventListener('input', () => {
	timeText.textContent = timeMultiplierInput.value
})
timeText.textContent = timeMultiplierInput.value

const heightText = document.querySelector('#height-label > span')
const heightInput = document.querySelector('#height-input')

heightInput.addEventListener('input', () => {
	heightText.textContent = heightInput.value
})
heightText.textContent = heightInput.value

let y = 0
let v = 0
let lastT = 0

function move(dt) {
	v += 9.81 * dt
	y += v * dt
}

function animate(x) {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	ctx.beginPath()
	ctx.arc(canvas.width / 4, y, 16, Math.PI * 2, 0, false)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.rect(canvas.width / 4 - 50, canvas.height - heightInput.value, 100, heightInput.value)
	ctx.stroke()

	move(((x - lastT) / 1000) * timeMultiplierInput.value)
	lastT = x

	if (y > canvas.height) {
		y = 0
		v = 0
	}

	window.requestAnimationFrame(animate)
}

window.requestAnimationFrame(animate)
