// client/src/components/products/ProductTable.tsx
import React from 'react';
import type { Product, Category } from '../../types/api';
import {
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatters'; // We'll create this formatter

interface ProductTableProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryFilterChange: (categoryId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalProductsCount: number;
  productsPerPage: number;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  categories,
  onEdit,
  onDelete,
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryFilterChange,
  currentPage,
  totalPages,
  onPageChange,
  totalProductsCount,
  productsPerPage,
}) => {

  const getStatusBadge = (stock_qty: number, low_stock_threshold: number) => {
    let statusText: string;
    let badgeClass: string;

    if (stock_qty === 0) {
      statusText = 'Out of Stock';
      badgeClass = 'bg-red-500';
    } else if (stock_qty <= low_stock_threshold) {
      statusText = 'Low Stock';
      badgeClass = 'bg-yellow-500';
    } else {
      statusText = 'In Stock';
      badgeClass = 'bg-green-500';
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}>{statusText}</span>;
  };

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Max number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md transition-colors duration-200 ${
            i === currentPage ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or SKU"
              className="pl-10 pr-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <select
            className="px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            value={selectedCategory}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">SKU</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {product.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{product.sku}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{product.category_name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">{product.stock_qty}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(product.stock_qty, product.low_stock_threshold)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-400 hover:text-indigo-300 mr-3 p-1 rounded hover:bg-gray-700"
                      title="Edit Product"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-gray-700"
                      title="Delete Product"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-4 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-sm text-gray-400">
            Showing {Math.min((currentPage - 1) * productsPerPage + 1, totalProductsCount)} - {Math.min(currentPage * productsPerPage, totalProductsCount)} of {totalProductsCount} products
          </p>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-700 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {getPaginationButtons()}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-700 bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductTable;