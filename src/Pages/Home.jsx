import React from 'react'
import Hero from '../Components/LandingPageComp/Hero'
import HowtoSection from '../Elements/HowToSection'
import FAQ from '../Components/LandingPageComp/FAQ'

const Home = () => {
  return (
    <div className="w-full min-h-screen">
      <Hero />
      <FAQ />
      <HowtoSection />
    </div>
  )
}

export default Home