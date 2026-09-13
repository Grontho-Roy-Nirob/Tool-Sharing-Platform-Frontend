"use client";

import { useEffect, useState } from "react";
import {
  Edit3,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import api from "@/lib/axios";

// ================= TOOL =================

interface Tool {
  id: number;
  tool_name: string;
  description: string;
  brand: string;
  condition: string;
  rental_price_per_day: string | number;
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  status: "pending" | "approved" | "rejected";
  tool_image: string;
  category_id: number;
}

// ================= CATEGORY =================

interface Category {
  id: number;
  name: string;
}

// ================= PROPS =================

interface OwnerToolsProps {
  ownerId: number;
}

// ================= COMPONENT =================

export default function OwnerTools({ ownerId }: OwnerToolsProps) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ================= FORM =================

  const [form, setForm] = useState({
    tool_name: "",
    description: "",
    brand: "",
    condition: "",
    rental_price_per_day: "",
    location: "",
    category_id: "",
  });

  const [image, setImage] = useState<File | null>(null);

  // ================= FETCH TOOLS =================

  const fetchTools = async () => {
    try {
      setLoading(true);

      const response = await api.get<Tool[]>(`/owner/tools/${ownerId}`);

      setTools(response.data || []);
    } catch (error) {
      console.error("Failed to load tools:", error);
      toast.error("Failed to load your tools");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH CATEGORIES =================

  const fetchCategories = async () => {
    try {
      const response = await api.get<Category[]>("/owner/category-name");

      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    }
  };

  // ================= INITIAL LOAD =================

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, [ownerId]);

  // ================= RESET FORM =================

  const resetForm = () => {
    setForm({
      tool_name: "",
      description: "",
      brand: "",
      condition: "",
      rental_price_per_day: "",
      location: "",
      category_id: "",
    });

    setImage(null);
    setEditingTool(null);
  };

  // ================= CREATE FORM =================

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // ================= EDIT FORM =================

  const openEditForm = (tool: Tool) => {
    setEditingTool(tool);

    setForm({
      tool_name: tool.tool_name,
      description: tool.description,
      brand: tool.brand,
      condition: tool.condition,
      rental_price_per_day: String(tool.rental_price_per_day),
      location: tool.location,

      // Make sure category_id is stored as a string
      // for the HTML select value.
      category_id: String(tool.category_id),
    });

    setImage(null);
    setShowForm(true);
  };

  // ================= CLOSE FORM =================

  const closeForm = () => {
    if (saving) return;

    setShowForm(false);
    resetForm();
  };

  // ================= INPUT CHANGE =================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ================= IMAGE CHANGE =================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setImage(null);
      return;
    }

    // Validate image type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, JPEG, PNG or WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    // Validate 2MB
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      e.target.value = "";
      return;
    }

    setImage(selectedFile);
  };

  // ================= SUBMIT =================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ================= VALIDATION =================

    if (!form.tool_name.trim()) {
      toast.error("Tool name is required");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Description is required");
      return;
    }

    if (!form.brand.trim()) {
      toast.error("Brand is required");
      return;
    }

    if (!form.condition.trim()) {
      toast.error("Condition is required");
      return;
    }

    if (!form.rental_price_per_day) {
      toast.error("Rental price is required");
      return;
    }

    const rentalPrice = Number(form.rental_price_per_day);

    if (!Number.isFinite(rentalPrice) || rentalPrice <= 0) {
      toast.error("Rental price must be greater than 0");
      return;
    }

    if (!form.location.trim()) {
      toast.error("Location is required");
      return;
    }

    // ================= CATEGORY VALIDATION =================

    if (!form.category_id) {
      toast.error("Please select a category");
      return;
    }

    const categoryId = Number(form.category_id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      toast.error("Please select a valid category");
      return;
    }

    // ================= IMAGE VALIDATION =================

    if (!editingTool && !image) {
      toast.error("Tool image is required");
      return;
    }

    try {
      setSaving(true);

      // ================= FORM DATA =================

      const formData = new FormData();

      formData.append("tool_name", form.tool_name.trim());

      formData.append("description", form.description.trim());

      formData.append("brand", form.brand.trim());

      formData.append("condition", form.condition.trim());

      formData.append("rental_price_per_day", String(rentalPrice));

      formData.append("location", form.location.trim());

      // IMPORTANT:
      // Always send the CATEGORY ID, never the category name.
      //
      // Example:
      // "Super Power Tools" -> 1
      //
      // Backend receives:
      // category_id = "1"
      //
      // NOT:
      // category_id = "Super Power Tools"

      formData.append("category_id", String(categoryId));

      // ================= IMAGE =================

      if (image) {
        // Backend expects "myfile"
        formData.append("myfile", image);
      }

      // ================= UPDATE =================

      if (editingTool) {
        const response = await api.put<Tool>(
          `/owner/updatetool/${editingTool.id}`,
          formData,
        );

        setTools((current) =>
          current.map((tool) =>
            tool.id === editingTool.id ? response.data : tool,
          ),
        );

        toast.success("Tool updated successfully");
      }

      // ================= CREATE =================
      else {
        const response = await api.post<Tool>(
          `/owner/createtool/${ownerId}`,
          formData,
        );

        setTools((current) => [response.data, ...current]);

        toast.success("Tool added successfully. Waiting for admin approval.");
      }

      // ================= CLOSE =================

      setShowForm(false);
      resetForm();
    } catch (error: any) {
      console.error("Tool save error:", error);

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

  // ================= DELETE =================

  const handleDelete = async (tool: Tool) => {
    const confirmed = window.confirm(`Delete "${tool.tool_name}"?`);

    if (!confirmed) return;

    try {
      setDeletingId(tool.id);

      await api.delete(`/owner/deletetool/${tool.id}`);

      setTools((current) => current.filter((item) => item.id !== tool.id));

      toast.success("Tool deleted successfully");
    } catch (error: any) {
      console.error("Delete tool error:", error);

      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || "Failed to delete tool");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/50" />
      </div>
    );
  }

  // ================= RENDER =================

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">My Tools</h2>

          <p className="mt-1 text-sm text-white/40">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} in your
            collection
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          Add Tool
        </button>
      </div>

      {/* ================= FORM ================= */}

      {showForm && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          {/* FORM HEADER */}

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {editingTool ? "Edit Tool" : "Add New Tool"}
              </h2>

              <p className="mt-1 text-sm text-white/40">
                {editingTool
                  ? "Update your tool information."
                  : "Add a tool to your rental collection."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg p-2 text-white/40 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FORM */}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              {/* TOOL NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Tool Name
                </label>

                <input
                  name="tool_name"
                  value={form.tool_name}
                  onChange={handleChange}
                  placeholder="e.g. Bosch Professional Drill"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
                />
              </div>

              {/* BRAND */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Brand
                </label>

                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Bosch"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
                />
              </div>

              {/* CONDITION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Condition
                </label>

                <input
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  placeholder="e.g. Excellent"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
                />
              </div>

              {/* RENTAL PRICE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Rental Price / Day
                </label>

                <input
                  name="rental_price_per_day"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.rental_price_per_day}
                  onChange={handleChange}
                  placeholder="500"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
                />
              </div>

              {/* LOCATION */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/30"
                />
              </div>

              {/* ================= CATEGORY ================= */}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">
                  Category
                </label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={(e) => {
                    // HTML select gives us a string.
                    // Convert it to a valid numeric ID,
                    // then store it back as a string
                    // because the select value is string-based.

                    const selectedId = e.target.value;

                    setForm((current) => ({
                      ...current,
                      category_id: selectedId,
                    }));
                  }}
                  className="w-full rounded-xl border border-white/10 bg-[#111214] px-4 py-3 text-sm text-white outline-none focus:border-white/30"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {/* Optional debugging/help text */}

                {form.category_id && (
                  <p className="mt-2 text-xs text-white/30">
                    Category ID: {form.category_id}
                  </p>
                )}
              </div>
            </div>

            {/* ================= DESCRIPTION ================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the tool, its features and suitable use..."
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-white/30"
              />
            </div>

            {/* ================= IMAGE ================= */}

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Tool Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/20 px-6 py-8 text-center transition hover:border-white/30 hover:bg-white/[0.03]">
                <ImageIcon className="mb-3 h-6 w-6 text-white/30" />

                {image ? (
                  <>
                    <p className="text-sm text-white">{image.name}</p>

                    <p className="mt-1 text-xs text-white/30">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-white/60">
                      Click to upload an image
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      JPG, JPEG, PNG or WEBP • Max 2MB
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            {/* ================= ACTIONS ================= */}

            <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                {editingTool ? "Save Changes" : "Add Tool"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {tools.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.06]">
            <ImageIcon className="h-5 w-5 text-white/30" />
          </div>

          <h3 className="text-base font-medium text-white">No tools yet</h3>

          <p className="mt-1 text-sm text-white/40">
            Add your first tool to start renting it out.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black"
          >
            <Plus className="h-4 w-4" />
            Add Tool
          </button>
        </div>
      ) : (
        /* ================= TOOLS ================= */

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              deleting={deletingId === tool.id}
              onEdit={() => openEditForm(tool)}
              onDelete={() => handleDelete(tool)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ======================================================
// TOOL CARD
// ======================================================

function ToolCard({
  tool,
  deleting,
  onEdit,
  onDelete,
}: {
  tool: Tool;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const imageUrl = tool.tool_image
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${tool.tool_image}`
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-white/15">
      {/* ================= IMAGE ================= */}

      <div className="relative aspect-[16/10] bg-white/[0.04]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tool.tool_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-white/20" />
          </div>
        )}

        {/* STATUS */}

        <div className="absolute right-3 top-3">
          <StatusBadge status={tool.status} />
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-white">
              {tool.tool_name}
            </h3>

            <p className="mt-1 text-sm text-white/40">{tool.brand}</p>
          </div>

          <p className="shrink-0 text-sm font-medium text-white">
            ৳{Number(tool.rental_price_per_day).toLocaleString()}
            <span className="text-xs font-normal text-white/30">/day</span>
          </p>
        </div>

        {/* DESCRIPTION */}

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/45">
          {tool.description}
        </p>

        {/* LOCATION */}

        <div className="mt-4 flex items-center gap-1.5 text-sm text-white/40">
          <MapPin className="h-3.5 w-3.5" />
          {tool.location}
        </div>

        {/* ACTIONS */}

        <div className="mt-5 flex gap-2 border-t border-white/[0.06] pt-4">
          {/* EDIT */}

          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.1] hover:text-white"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }: { status: Tool["status"] }) {
  const styles: Record<Tool["status"], string> = {
    pending: "bg-yellow-500/10 text-yellow-400",
    approved: "bg-green-500/10 text-green-400",
    rejected: "bg-red-500/10 text-red-400",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}
