import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import { Product } from '../../../types'
import ProductCard from '../ProductCard'

type PropType = {
  products: Product[]
  options?: EmblaOptionsType
  onNotify: (notification: {
    heading: string;
    subtext: string;
    type: "success" | "error";
  }) => void;
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { products, options, onNotify } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-2"> {/* Negative margin to offset padding on slides */}
          {products.map((product, index) => (
            <div 
              className="flex-shrink-0 w-full sm:w-1/2 md:w-1/2 lg:w-1/4 flex items-stretch p-2" 
              key={product.id}
            >
              <ProductCard
                product={product}
                index={index}
                onNotify={onNotify}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-2 pointer-events-none">
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} className="pointer-events-auto" />
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} className="pointer-events-auto" />
      </div>
    </div>
  )
}

export default EmblaCarousel

