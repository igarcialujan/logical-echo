import { gsap } from "gsap"
import { Draggable } from "gsap/Draggable"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CustomEase } from "gsap/CustomEase"

gsap.registerPlugin(Draggable, ScrollTrigger, CustomEase)

export * from "gsap"
export { Draggable, ScrollTrigger, CustomEase }