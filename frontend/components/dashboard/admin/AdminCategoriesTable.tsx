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
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top action */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/40">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {/* Create / Edit form */}
      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">
              {editingCategory ? "Edit Category" : "Create Category"}
            </h2>

            <p className="mt-1 text-sm text-white/40">
              {editingCategory
                ? "Update the category name."
                : "Add a new category for tools."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label className="mb-2 block text-sm font-medium text-white/70">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={150}
              placeholder="e.g. Power Tools"
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25"
              autoFocus
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                {editingCategory ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Empty state */}
      {categories.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
            <FolderOpen className="h-5 w-5 text-white/40" />
          </div>

          <h3 className="text-base font-medium text-white">
            No categories yet
          </h3>

          <p className="mt-1 text-sm text-white/40">
            Create your first tool category.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                    ID
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-white/40">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-white/40">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-white/[0.06] last:border-0"
                  >
                    <td className="px-6 py-5 text-sm text-white/40">
                      #{category.id}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                          <FolderOpen className="h-4 w-4 text-white/50" />
                        </div>

                        <span className="font-medium text-white">
                          {category.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-white/50">
                      {new Date(category.created_at).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(category)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.1] hover:text-white"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(category)}
                          disabled={deletingId === category.id}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
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
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.06]">
                      <FolderOpen className="h-5 w-5 text-white/50" />
                    </div>

                    <div>
                      <h3 className="font-medium text-white">
                        {category.name}
                      </h3>

                      <p className="mt-1 text-xs text-white/30">
                        ID #{category.id}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-white/30">
                  Created {new Date(category.created_at).toLocaleDateString()}
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditForm(category)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.1] hover:text-white"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(category)}
                    disabled={deletingId === category.id}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
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
