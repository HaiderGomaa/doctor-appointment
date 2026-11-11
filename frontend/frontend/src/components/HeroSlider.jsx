import { useEffect, useState } from "react"
import carousel1 from "../img/hero-carousel-1.jpg"
import carousel2 from "../img/hero-carousel-2.jpg"
import carousel3 from "../img/hero-carousel-3.jpg"

const slides = [
    { image: carousel1, title: "Your Health,Our Priority", text: "we provide advanced medical care with expert doctors modern technology" },
    { image: carousel2, title: "Specialized medical services", text: "from cardiac care to orthopedic surgery, we have you covered" },
    { image: carousel3, title: "Easy Online Appointments", text: "Book your appointment online in just a few clicks" }
]

function HeroSlider() {
    const [activeSlide, setActiveSlide] = useState(0)

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length)
        }, 5000)

        return () => window.clearInterval(timer)
    }, [])

    return (
        <section className="relative w-full h-[80vh] overflow-hidden" aria-label="Featured medical services">
            {slides.map((slide, index) => (
                <div
                    key={slide.title}
                    className={`absolute inset-0 transition-opacity duration-500 ${index === activeSlide ? "opacity-100" : "pointer-events-none opacity-0"}`}
                    aria-hidden={index !== activeSlide}
                >
                    <img src={slide.image} alt={`Slide ${index + 1}`} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-center text-white px-4">
                        <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                        <p className="text-lg">{slide.text}</p>
                        <button className="mt-6 inline-block  text-white font-semibold py-2 px-4 rounded">
                            Read more
                        </button>
                    </div>
                </div>
            ))}

            </section>
    )
}

export default HeroSlider
