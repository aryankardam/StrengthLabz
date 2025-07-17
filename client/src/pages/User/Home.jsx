import { Button } from '@headlessui/react'
import React from 'react'
import CategoryCards from '../../components/CategoryCards'
import Banner from '../../components/Banner'
import BrandHighlightCards from '../../components/BrandHighlightCards'
import InfoBanner from '../../components/InfoBanner'
import Testimonials from '../../components/Testimonials'
import AboutStrengthLabz from './AboutStrengthLabz'

const Home = () => {
  return (
    <div className='m-4'>
      <div className=" flex justify-center">
        <CategoryCards/>
      </div>
      <div>
        <Banner />
      </div>
      <div>
        <BrandHighlightCards />
      </div>
      <div className='mb-10'>
        <InfoBanner />
      </div>
      <div>
        <Testimonials/>
      </div>
      <div className='mt-11'>
        <AboutStrengthLabz/>
      </div>
    </div>
  )
}

export default Home
