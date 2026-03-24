

import React from 'react'
import { PricingTable } from '@clerk/react'
import { dark } from '@clerk/themes'

const Plan = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0c] py-32 px-6 overflow-hidden">
      
     
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        
        {/* --- Header --- */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Choose Your <span className="text-primary italic">Plan</span>
          </h2>
          <p className="mt-6 text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            Start for free and scale up as you grow. Find the perfect plan for 
            your content creation needs with Genify AI.
          </p>
        </div>

        {/* --- Pricing Table Wrapper --- */}
        <div className="mt-14 glass-container rounded-3xl border border-white/5 bg-white/[0.02] p-4 sm:p-10 backdrop-blur-md shadow-2xl">
          <div className="clerk-pricing-dark-mode">
<PricingTable
  appearance={{
    baseTheme: dark,
    variables: {
      colorTextSecondary: "#ffffff",
    },
  }}
/>
          </div>
        </div>

        {/* --- Trust Badge --- */}
        <p className="mt-12 text-center text-sm text-slate-500">
          All plans include 128-bit SSL encryption and 24/7 priority support.
        </p>
      </div>
    </div>
  )
}

export default Plan