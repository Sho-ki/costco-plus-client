import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ProductForUsers } from '../types/product';
import ImageCarousel from './ImageCarousel';
import ChatAgent from './ChatAgent';
import { formatDate, getDateStatus } from '../utils/dateUtils';
import AvailabilityHistory from './AvailabilityHistory';
import { DateTime } from 'luxon';

interface ProductModalProps {
  product: ProductForUsers;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

 const lastCheckedDate = product.availabilityRecords.length > 0 ? product.availabilityRecords.sort((a, b) => DateTime.fromISO(b.date).toMillis() - DateTime.fromISO(a.date).toMillis()).filter(record => record.value === 'IN_STOCK')[0]?.date : null;
 const dateStatus = getDateStatus(lastCheckedDate ? lastCheckedDate: null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <div className="relative">
              {/* <ImageCarousel images={product.images.map(img => img.url)} alt={product.name} /> */}
              {product.images.length > 0 ? (
              <ImageCarousel
                images={product.images.map((img) => img.url)}
                alt={product.name}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            ) : product?.altImageUrl ? (
              <div
                className="relative w-full h-0 pb-[90%] overflow-hidden cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={product.altImageUrl}
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="bg-gray-200 h-40 flex items-center justify-center">
                <span className="text-gray-500">画像がありません</span>
              </div>
            )}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
                aria-label="閉じる"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <div className="flex items-center mb-4">
                {product.discount && (
                  <span className="bg-red-100 text-red-800 text-lg font-semibold px-4 py-2 rounded">
                    ¥{product.discount.toLocaleString()}引き
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-4xl font-bold text-red-600">
                    ¥{(product.price - (product.discount || 0)).toLocaleString()}
                  </span>
                  {product.discount && (
                    <span className="text-xl text-gray-500 line-through ml-4">
                      ¥{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                
              </div>
              {(product?.saleStartDate || product?.saleEndDate) && (
                <p className="text-lg text-gray-600 mb-6">
                  セール期間: 
                  {/* {product.saleStartDate && ` ${DateTime.fromISO(product.saleStartDate).toISODate()}`} */}
                  {product.saleStartDate && product.saleEndDate && ' ~ '}
                  {product.saleEndDate && ` ${DateTime.fromISO(product.saleEndDate).toISODate()?.split('-').slice(1).join('/')} `}
                </p>
              )}
              {lastCheckedDate && (
                <div className={`mt-4 p-4 rounded-md ${dateStatus === 'today' ? 'bg-green-100' : dateStatus === 'past' ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  <p className="text-sm font-semibold">
                    {product.warehouse.name}店: 最後に確認された日 {formatDate(lastCheckedDate)}
                    {dateStatus === 'today' && <span className="inline-block w-4 h-4 bg-green-500 rounded-full ml-1"></span>}
                    {dateStatus === 'past' && <span className="inline-block w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-8 border-b-yellow-500 ml-1"></span>}
                  </p>
                </div>
              )}
              <AvailabilityHistory histories={product.availabilityRecords.map(record => ({
                date: record.date,
                value: record.value === 'IN_STOCK' ? 'InStock' : record.value === 'OUT_OF_STOCK' ? 'OutOfStock' : 'Unknown'
              }))} />
              {/* Hide for now */}
              {/* <ChatAgent productName={product.name} /> */}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

