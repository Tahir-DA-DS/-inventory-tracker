// client/src/components/products/ProductFormModal.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import Modal from '../common/Modal';
import type { Product, CreateProductInput, Category } from '../../types/api';

// Define form input types
interface ProductFormInputs {
  name: string;
  sku: string;
  category_id: string;
  price: string;
  stock_qty: number;
  low_stock_threshold: number;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null; // Product object if editing
  categories: Category[];
  onSubmit: (data: CreateProductInput | ProductFormInputs) => void; // Uses ProductFormInputs because price is string
  isSubmitting: boolean;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  categories,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormInputs>();

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
        // Pre-fill form for editing
        reset({
          name: productToEdit.name,
          sku: productToEdit.sku,
          category_id: productToEdit.category_id,
          price: productToEdit.price, // Already a string
          stock_qty: productToEdit.stock_qty,
          low_stock_threshold: productToEdit.low_stock_threshold,
        });
      } else {
        // Reset form for creating
        reset({
          name: '',
          sku: '',
          category_id: '',
          price: '0.00',
          stock_qty: 0,
          low_stock_threshold: 0,
        });
      }
    }
  }, [isOpen, productToEdit, reset]);

  const handleFormSubmit: SubmitHandler<ProductFormInputs> = (data) => {
    // Ensure numbers are parsed correctly if they come as strings from input, though 'number' type handles this
    const parsedData = {
      ...data,
      stock_qty: Number(data.stock_qty),
      low_stock_threshold: Number(data.low_stock_threshold),
    };
    onSubmit(parsedData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={productToEdit ? 'Edit Product' : 'Add New Product'} size="lg">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">
            Product Name
          </label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Product name is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-300">
            SKU
          </label>
          <input
            id="sku"
            type="text"
            {...register('sku', { required: 'SKU is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          {errors.sku && <p className="mt-1 text-sm text-red-400">{errors.sku.message}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">
            Category
          </label>
          <select
            id="category_id"
            {...register('category_id', { required: 'Category is required' })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && <p className="mt-1 text-sm text-red-400">{errors.category_id.message}</p>}
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300">
            Price (₦)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0, message: 'Price cannot be negative' },
              valueAsNumber: false // Keep as string for currency precision
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          {errors.price && <p className="mt-1 text-sm text-red-400">{errors.price.message}</p>}
        </div>

        {/* Stock Quantity */}
        <div>
          <label htmlFor="stock_qty" className="block text-sm font-medium text-gray-300">
            Stock Quantity
          </label>
          <input
            id="stock_qty"
            type="number"
            {...register('stock_qty', {
              required: 'Stock quantity is required',
              min: { value: 0, message: 'Stock quantity cannot be negative' },
              valueAsNumber: true,
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          {errors.stock_qty && <p className="mt-1 text-sm text-red-400">{errors.stock_qty.message}</p>}
        </div>

        {/* Low Stock Threshold */}
        <div>
          <label htmlFor="low_stock_threshold" className="block text-sm font-medium text-gray-300">
            Low Stock Threshold
          </label>
          <input
            id="low_stock_threshold"
            type="number"
            {...register('low_stock_threshold', {
              required: 'Low stock threshold is required',
              min: { value: 0, message: 'Threshold cannot be negative' },
              valueAsNumber: true,
            })}
            className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
          {errors.low_stock_threshold && (
            <p className="mt-1 text-sm text-red-400">{errors.low_stock_threshold.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition-colors duration-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {productToEdit ? (isSubmitting ? 'Saving...' : 'Save Changes') : (isSubmitting ? 'Adding...' : 'Add Product')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;