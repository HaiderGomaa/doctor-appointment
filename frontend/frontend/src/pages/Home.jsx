import HeroSlider from "../components/HeroSlider"
import CallToAction from "../components/CallToAction"
import AboutUs from "../components/AboutUs"
import States from "../components/States"
import Depertments from "../components/Depertments"
import Doctors from "../components/Doctors"
import Services from "../components/Services"
function Home() {
  return (
    <div>
        <HeroSlider />
        <CallToAction />
        <AboutUs />
        <Services />
        <States />
        <Depertments />
        <Doctors />
    </div>
  )
}

export default Home
