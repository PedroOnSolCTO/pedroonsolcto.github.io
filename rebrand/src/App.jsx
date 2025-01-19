import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import NewsSection from './components/NewsSection'
import ProCircuit from './components/ProCircuit'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <div className="relative">
        <Navbar />
        <Hero />
        <div className="hidden md:block absolute bottom-0 left-0 right-0 z-30">
          <NewsSection />
        </div>
      </div>
      <div className="md:hidden">
        <NewsSection />
      </div>
      <ProCircuit />
      <Footer />
    </div>
  )
}

export default App
