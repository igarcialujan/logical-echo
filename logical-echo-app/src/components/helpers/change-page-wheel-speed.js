function changePageWheelSpeed(speedY) {
	let scrollY = 0
    let removed = false

	const handleMouseWheel = (e) => {
		// e.preventDefault()

		scrollY += speedY * e.deltaY

		if (scrollY < 0) {
			scrollY = 0
		} else {
			let scrollHeight = Math.max(
				document.body.scrollHeight, document.documentElement.scrollHeight,
				document.body.offsetHeight, document.documentElement.offsetHeight,
				document.body.clientHeight, document.documentElement.clientHeight
			)

			if (scrollY > scrollHeight) {
				scrollY = scrollHeight
			}
		}

		if (document.documentElement.scrollTop) {
			document.documentElement.scrollTop = scrollY
		} else {
			document.body.scrollTop = scrollY // polyfill for Safari
		}
	}

	document.addEventListener('mousewheel', handleMouseWheel)

	return function() {
		if (removed) {
			return
		}

		document.removeEventListener('mousewheel', handleMouseWheel)

		removed = true
	}
}

export default changePageWheelSpeed


// ----- Version for container scroll -----

// function changeWheelSpeed(speedY, container) {
// 	let scrollY = 0
//     let removed = false

// 	const handleScrollReset = () => {
// 		scrollY = container.scrollTop
// 	}

// 	const handleMouseWheel = (e) => {
// 		e.preventDefault()

// 		scrollY += speedY * e.deltaY

// 		if (scrollY < 0) {
// 			scrollY = 0
// 		} else {
// 			let limitY = container.scrollHeight - container.clientHeight

// 			if (scrollY > limitY) {
// 				scrollY = limitY
// 			}
// 		}

// 		container.scrollTop = scrollY
// 	}

// 	container.addEventListener('mouseup', handleScrollReset)
// 	container.addEventListener('mousedown', handleScrollReset)
// 	container.addEventListener('mousewheel', handleMouseWheel)

// 	return function() {
// 		if (removed) {
// 			return
// 		}

// 		container.removeEventListener('mouseup', handleScrollReset)
// 		container.removeEventListener('mousedown', handleScrollReset)
// 		container.removeEventListener('mousewheel', handleMouseWheel)

// 		removed = true
// 	}
// }

