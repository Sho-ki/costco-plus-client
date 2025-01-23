import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function ImageCarousel({ images, alt, onClick }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">画像がありません</span>
      </div>
    );
  }

  return (
  <div className="relative w-full h-[30vh] md:h-64" onClick={onClick}>
    <AnimatePresence initial={false}>
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        <Image
          src={images[currentIndex]}
          alt={`${alt} - 画像 ${currentIndex + 1}`}
          fill
          style={{ objectFit: "cover" }}
          sizes='(max-width: 640px) 100px, 200px'
        />
      </motion.div>
    </AnimatePresence>

    {images.length > 1 && (
      <>
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
          aria-label="前の画像"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2"
          aria-label="次の画像"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </>
    )}
  </div>
);

}

