"use client";

import { useEffect, useState } from "react";
import { Edit3, FolderOpen, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import adminApi from "@/lib/adminAxios";

interface Category {
  id: number;
  name: string;
  created_at: string;
}

export default function AdminCategoriesTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await adminApi.get<Category[]>("/admin/categories");

      setCategories(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateForm = () => {
    setEditingCategory(null);
    setName("");
    setShowForm(true);
  };

  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    setEditingCategory(null);
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      toast.error("Category name is required");
      return;
    }

    if (trimmedName.length > 150) {
      toast.error("Category name cannot exceed 150 characters");
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        const response = await adminApi.put<Category>(
          `/admin/categories/${editingCategory.id}`,
          {
            name: trimmedName,
          },
        );

        setCategories((current) =>
          current.map((category) =>
            category.id === editingCategory.id ? response.data : category,
          ),
        );

        toast.success("Category updated successfully");
      } else {
        const response = await adminApi.post<Category>("/admin/categories", {
          name: trimmedName,
        });

        setCategories((current) => [response.data, ...current]);

        toast.success("Category created successfully");
      }

      closeForm();
    } catch (error: any) {
      console.error(error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Something went wrong");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(`Delete "${category.name}"?`);

    if (!confirmed) return;

    try {
      setDeletingId(category.id);

      await adminApi.delete(`/admin/categories/${category.id}`);

      setCategories((current) =>
        current.filter((item) => item.id !== category.id),
      );

      toast.success("Category deleted successfully");
    } catch (error: any) {
      console.error(error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Failed to delete category");
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-[#ebe4da] bg-white shadow-[0_10px_40px_rgba(33,31,28,0.035)]">
        <div className="flex items-center gap-3 text-sm text-[#8b8177]">
          <Loader2 className="h-5 w-5 animate-spin text-[#e8a33d]" />
          Loading categories...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Top action */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#ebe4da] bg-white p-5 shadow-[0_8px_30px_rgba(33,31,28,0.035)] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8a33d]/12">
              <FolderOpen className="h-4 w-4 text-[#b5761b]" />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#211f1c]">
                Tool Categories
              </p>

              <p className="mt-0.5 text-xs text-[#9a9188]">
                Organize your tool listings
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[#e8a33d]/20 bg-[#e8a33d]/8 px-3 py-1.5 text-xs font-medium text-[#9a5b13]">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </span>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-2.5 text-sm font-semibold text-[#211f1c] shadow-[0_5px_14px_rgba(232,163,61,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#d9932f] hover:shadow-[0_7px_18px_rgba(232,163,61,0.24)] active:translate-y-0"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="overflow-hidden rounded-3xl border border-[#e8dfd4] bg-white shadow-[0_12px_40px_rgba(33,31,28,0.06)]">
          <div className="border-b border-[#eee8df] bg-[#fcfaf7] px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8a33d]/12">
                <FolderOpen className="h-4 w-4 text-[#b5761b]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-[#211f1c]">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h2>

                <p className="mt-0.5 text-sm text-[#8b8177]">
                  {editingCategory
                    ? "Update the category name below."
                    : "Add a new category for your tool listings."}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <form onSubmit={handleSubmit}>
              <label className="mb-2.5 block text-sm font-semibold text-[#514c47]">
                Category Name
              </label>

              <div className="relative">
                <FolderOpen className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#aaa096]" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={150}
                  placeholder="e.g. Power Tools"
                  className="w-full rounded-xl border border-[#e5ddd2] bg-[#fcfaf7] py-3.5 pl-11 pr-4 text-sm text-[#211f1c] outline-none placeholder:text-[#aaa096] transition duration-200 focus:border-[#e8a33d] focus:bg-white focus:ring-4 focus:ring-[#e8a33d]/8"
                  autoFocus
                />
              </div>

              <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-[#e5ddd2] bg-white px-5 py-2.5 text-sm font-medium text-[#706961] transition hover:bg-[#faf8f4] hover:text-[#514c47] disabled:opacity-40"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-5 py-2.5 text-sm font-semibold text-[#211f1c] shadow-sm transition hover:bg-[#d9932f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty state */}
      {categories.length === 0 ? (
        <div className="rounded-3xl border border-[#ebe4da] bg-white px-6 py-20 text-center shadow-[0_10px_40px_rgba(33,31,28,0.04)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f0e9]">
            <FolderOpen className="h-6 w-6 text-[#9a9188]" />
          </div>

          <h3 className="mt-5 text-base font-semibold text-[#211f1c]">
            No categories yet
          </h3>

          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-6 text-[#8b8177]">
            Create your first tool category to start organizing your listings.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-5 py-2.5 text-sm font-semibold text-[#211f1c] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#d9932f] hover:shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-3xl border border-[#ebe4da] bg-white shadow-[0_10px_40px_rgba(33,31,28,0.045)] lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e9e2d9] bg-[#fcfaf7] text-left">
                  <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#938a80]">
                    ID
                  </th>

                  <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#938a80]">
                    Category
                  </th>

                  <th className="px-6 py-4.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#938a80]">
                    Created
                  </th>

                  <th className="px-6 py-4.5 text-right text-[11px] font-bold uppercase tracking-[0.12em] text-[#938a80]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="group border-b border-[#f0ebe5] last:border-0 transition-colors duration-200 hover:bg-[#fdfbf8]"
                  >
                    <td className="px-6 py-5">
                      <span className="rounded-lg bg-[#f7f3ee] px-2.5 py-1.5 text-xs font-semibold text-[#8b8177]">
                        #{category.id}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8a33d]/15 bg-[#e8a33d]/10 transition duration-200 group-hover:bg-[#e8a33d]/15">
                          <FolderOpen className="h-[17px] w-[17px] text-[#b5761b]" />
                        </div>

                        <div>
                          <span className="font-semibold text-[#211f1c]">
                            {category.name}
                          </span>

                          <p className="mt-0.5 text-xs text-[#a29a91]">
                            Tool category
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <span className="text-sm text-[#706961]">
                        {new Date(category.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e7dfd4] bg-white px-3.5 py-2 text-xs font-semibold text-[#625b54] shadow-sm transition duration-200 hover:border-[#e8a33d]/40 hover:bg-[#fffaf1] hover:text-[#9a5b13]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#c1502e]/15 bg-[#fff8f6] px-3.5 py-2 text-xs font-semibold text-[#b54c2c] transition duration-200 hover:border-[#c1502e]/25 hover:bg-[#fff1ed] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingId === category.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="grid gap-4 lg:hidden">
            {categories.map((category) => (
              <div
                key={category.id}
                className="group rounded-3xl border border-[#ebe4da] bg-white p-5 shadow-[0_8px_30px_rgba(33,31,28,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-[#e3d9cd] hover:shadow-[0_12px_35px_rgba(33,31,28,0.07)]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#e8a33d]/15 bg-[#e8a33d]/10">
                    <FolderOpen className="h-5 w-5 text-[#b5761b]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-[#211f1c]">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-xs text-[#9a9188]">
                      ID #{category.id}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#f0ebe5] pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#a29a91]">
                      Created
                    </p>

                    <p className="mt-1 text-xs font-medium text-[#706961]">
                      {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => openEditForm(category)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#e7dfd4] bg-white px-4 py-2.5 text-sm font-semibold text-[#625b54] shadow-sm transition hover:border-[#e8a33d]/40 hover:bg-[#fffaf1] hover:text-[#9a5b13]"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#c1502e]/15 bg-[#fff8f6] px-4 py-2.5 text-sm font-semibold text-[#b54c2c] transition hover:bg-[#fff1ed] disabled:opacity-40"
                  >
                    {deletingId === category.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
