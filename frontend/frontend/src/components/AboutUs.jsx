import About from "../img/about.jpg"
function AboutUs() {
  return (
    <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4">About Us</h3>
            <p className="text-lg mb-6">Learn more about our company and what we do.</p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className='relative'>
                <img src={About} alt="About Us" className="rounded-lg shadow-md" />
                <a href="https://www.youtube.com/" className="absolute inset-0  flex justify-center items-center"/>
                <div className='bg-white rounded-full shadow-lg p-4 hover:scale-105 transition-transform duration-300 absolute bottom-4 left-1/2 transform -translate-x-1/2'>
                   play
                </div>
            
            </div>
            <div className="md:col-span-2 flex flex-col justify-center hover:scale-105">
                <h4 className="text-2xl font-bold mb-4">We are a team of dedicated healthcare professionals</h4>
                <p className="text-lg text-[#5185bc] mb-6">We are dedicated to providing the best healthcare services to our patients. Our team of experienced professionals is committed to ensuring your well-being and comfort.</p>
                <ul className="list-disc list-inside text-lg mb-6">
                    <li>Experienced and qualified healthcare professionals</li>
                    <li>Compassionate care for every patient</li>
                    <li>State-of-the-art medical facilities</li>
                </ul>
               
            </div>
        </div>
    </section>
  )
}

export default AboutUs
