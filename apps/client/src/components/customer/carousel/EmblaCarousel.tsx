import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'
import CollectionCard from '../CollectionCard'

export type CollectionItem = {
  name: string
  imageUrl: string
  to: string
}

type PropType = {
  items: CollectionItem[]
  options?: EmblaOptionsType
  /** Heading shown top-left; the prev/next arrows sit on the same row, top-right. */
  header?: React.ReactNode
}

// Plain chevrons, no circle
const arrowClass =
  'flex size-8 items-center justify-center text-[#1c1c1c] transition-opacity duration-300 hover:opacity-60 disabled:opacity-25 disabled:pointer-events-none'

const EmblaCarousel: React.FC<PropType> = ({ items, options, header }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <div className="relative">
      {header && (
        <div className="mb-5 flex items-end justify-between gap-6 md:mb-6">
          <div>{header}</div>
          <div className="flex shrink-0 items-center gap-1">
            <PrevButton
              onClick={onPrevButtonClick}
              disabled={prevBtnDisabled}
              className={arrowClass}
              aria-label="Forrige"
            />
            <NextButton
              onClick={onNextButtonClick}
              disabled={nextBtnDisabled}
              className={arrowClass}
              aria-label="Næste"
            />
          </div>
        </div>
      )}

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-1"> {/* Negative margin to offset padding on slides */}
          {items.map((item) => (
            <div
              className="flex-shrink-0 w-[78%] sm:w-1/2 lg:w-1/4 flex items-stretch p-1"
              key={item.name}
            >
              <CollectionCard name={item.name} imageUrl={item.imageUrl} to={item.to} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel
