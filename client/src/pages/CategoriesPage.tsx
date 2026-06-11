import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '../api/products';
import apiService from '../api/apiService';
import toast from 'react-hot-toast';

const CATEGORY_ICONS = [
  'ti-device-laptop',
  'ti-headphones',
  'ti-package',
  'ti-plug',
  'ti-shirt',
  'ti-tool',
  'ti-bowl',
  'ti-car',
];

const CATEGORY_COLORS = [
  { bg: 'bg-blue-100', text: 'text-blue-600' },
  { bg: 'bg-green-100', text: 'text-green-600' },
  { bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { bg: 'bg-purple-100', text: 'text-purple-600' },
  { bg: 'bg-pink-100', text: 'text-pink-600' },
  { bg: 'bg-orange-100', text: 'text-orange-600' },
  { bg: 'bg-teal-100', text: 'text-teal-600' },
  { bg: 'bg-red-100', text: 'text-red-600' },
];

const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => apiService.post('/categories', { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category added!');
      closeModal();
    },
    onError: () => toast.error('Failed to add category'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiService.patch(`/categories/${id}`, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated!');
      closeModal();
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted!');
    },
    onError: () => toast.error('Failed to delete category'),
  });

  const categories = categoriesData?.data || [];

  const openAdd = () => {
    setEditingId(null);
    setCategoryName('');
    setIsModalOpen(true);
  };

  const openEdit = (id: string, name: string) => {
    setEditingId(id);
    setCategoryName(name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCategoryName('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!categoryName.trim()) return toast.error('Category name is required');
    if (editingId) {
      updateMutation.mutate({ id: editingId, name: categoryName.trim() });
    } else {
      createMutation.mutate(categoryName.trim());
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"? Products in this category will be unassigned.`)) {
      deleteMutation.mutate(id);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) return <div className="p-6 text-gray-400">Loading categories...</div>;

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-gray-400 mt-1">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700"
        >
          <span className="text-lg leading-none">+</span> Add category
        </button>
      </div>

      {/* Category grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat, index) => {
          const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
          const icon = CATEGORY_ICONS[index % CATEGORY_ICONS.length];
          return (
            <div
              key={cat.id}
              className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color.bg}`}>
                <i className={`ti ${icon} text-xl ${color.text}`} aria-hidden="true"></i>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{cat.name}</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => openEdit(cat.id, cat.name)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400"
                  aria-label={`Edit ${cat.name}`}
                >
                  <i className="ti ti-edit text-sm" aria-hidden="true"></i>
                </button>
                <button
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-red-400 hover:text-red-600 hover:border-red-300"
                  aria-label={`Delete ${cat.name}`}
                >
                  <i className="ti ti-trash text-sm" aria-hidden="true"></i>
                </button>
              </div>
            </div>
          );
        })}

        {/* Empty add card */}
        <button
          onClick={openAdd}
          className="bg-white border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600 hover:border-gray-400 min-h-[120px]"
        >
          <i className="ti ti-plus text-2xl" aria-hidden="true"></i>
          <span className="text-sm">Add category</span>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 w-full max-w-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-800">
                {editingId ? 'Edit category' : 'Add new category'}
              </h2>
              <button
                onClick={closeModal}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                <i className="ti ti-x text-sm" aria-hidden="true"></i>
              </button>
            </div>
            <div className="p-5">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Category name
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="e.g. Electronics"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:border-purple-400"
                autoFocus
              />
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : editingId ? 'Save changes' : 'Add category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;