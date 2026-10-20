import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
// Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// import Swiper styles
import 'swiper/css'
import { Autoplay } from 'swiper/modules'
import Item from './Item'

const RelatedProducts = ({product, id}) => {

  const [relatedProducts, setRelatedProducts] = useState([])
  const {products} = useContext(ShopContext)

  useEffect(()=>{
    if(products.length > 0){
      let productsCopy = products.slice()
      productsCopy = productsCopy.filter((item)=>item.category === product.category && id !== item._id)
      setRelatedProducts(productsCopy.slice(0, 6))
    }
  }, [products])

  return (
    <section className='max-padd-container py-16'>
      <Title
        title1={"Related"}
        title2={"Products"}
        titleStyles={"pb-10"}
      />
      {/* Container */}
      {
        <Swiper
          autoplay={{
            delay:2000,
            disableOnInteraction: false
          }}
          breakpoints={{
            400: { slidesPerView: 2, spaceBetween: 10 },
            700: { slidesPerView: 3, spaceBetween: 10 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            1200: { slidesPerView: 5, spaceBetween: 10 },
          }}
          modules={[Autoplay]}
          className='h-[188px] sm:h-[238px]'
        >
          {relatedProducts.map((item) => (
            <SwiperSlide key={item._id}>
              <Item product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      }
    </section>
  )
}

export default RelatedProducts