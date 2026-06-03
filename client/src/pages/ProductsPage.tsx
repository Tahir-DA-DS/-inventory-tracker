// client/src/pages/ProductsPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api/products';
import type { Product, CreateProductInput, UpdateProductInput, Category } from '../types/api';
import ProductTable from '../components/products/ProductTable';
import ProductFormModal from '../components/products/ProductFormModal';
import DeleteConfirmationModal from '../components/common/DeleteConfirmationModal';
import { toast } from 'react-hot-toast'; // Optional: for notifications, you'll need to install react-hot-toast

const PRODUCTS_PER_PAGE = 10; // Define how many products per page

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // State for modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);

  // State for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  // TanStack Query Mutations
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refetch products after creation
      setIsFormModalOpen(false);
      toast.success('Product added successfully!');
    },
    onError: (err) => {
      toast.error(`Error adding product: ${err.message || 'Unknown error'}`);
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refetch products after update
      setIsFormModalOpen(false);
      setProductToEdit(null);
      toast.success('Product updated successfully!');
    },
    onError: (err) => {
      toast.error(`Error updating product: ${err.message || 'Unknown error'}`);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Refetch products after deletion
      setIsDeleteModalOpen(false);
      setProductToDeleteId(null);
      toast.success('Product deleted successfully!');
    },
    onError: (err) => {
      toast.error(`Error deleting product: ${err.message || 'Unknown error'}`);
    },
  });

  // Filter and paginate products
  const filteredAndPaginatedProducts = useMemo(() => {
    let filteredProducts = productsData?.data || [];

    // Apply category filter
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category_id === selectedCategory
      );
    }

    // Apply search term filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          p.sku.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Pagination
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const paginated = filteredProducts.slice(startIndex, endIndex);

    return {
      products: paginated,
      totalCount: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
    };
  }, [productsData, selectedCategory, searchTerm, currentPage]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  const handleAddProductClick = () => {
    setProductToEdit(null); // Clear any product being edited
    setIsFormModalOpen(true);
  };

  const handleEditProductClick = (product: Product) => {
    setProductToEdit(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProductClick = (productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDeleteId) {
      deleteProductMutation.mutate(productToDeleteId);
    }
  };

  const handleFormSubmit = (data: CreateProductInput | UpdateProductInput) => {
    if (productToEdit) {
      // Update existing product
      updateProductMutation.mutate({ id: productToEdit.id, data: data as UpdateProductInput });
    } else {
      // Create new product
      createProductMutation.mutate(data as CreateProductInput);
    }
  };

  if (isLoadingProducts || isLoadingCategories) return <div className="text-white">Loading products...</div>;
  if (productsError) return <div className="text-red-500">Error loading products: {productsError.message}</div>;
  if (categoriesError) return <div className="text-red-500">Error loading categories: {categoriesError.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <button
          onClick={handleAddProductClick}
          className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Product
        </button>
      </div>

      <ProductTable
        products={filteredAndPaginatedProducts.products}
        categories={categoriesData?.data || []}
        onEdit={handleEditProductClick}
        onDelete={handleDeleteProductClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryFilterChange={setSelectedCategory}
        currentPage={currentPage}
        totalPages={filteredAndPaginatedProducts.totalPages}
        onPageChange={setCurrentPage}
        totalProductsCount={filteredAndPaginatedProducts.totalCount}
        productsPerPage={PRODUCTS_PER_PAGE}
      />

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        productToEdit={productToEdit}
        categories={categoriesData?.data || []}
        onSubmit={handleFormSubmit}
        isSubmitting={createProductMutation.isPending || updateProductMutation.isPending}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isConfirming={deleteProductMutation.isPending}
      />
    </div>
  );
};

export default ProductsPage;