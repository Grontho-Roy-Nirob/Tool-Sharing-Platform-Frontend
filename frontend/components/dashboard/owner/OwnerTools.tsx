"use client";

import { useEffect, useState } from "react";
import {
  Edit3,
  Hammer,
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
  tool_image?: string;
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

// ================= FORM =================

interface ToolForm {
  tool_name: string;
  description: string;
  brand: string;
  condition: string;
  rental_price_per_day: string;
  location: string;
  category_id: string;
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

  const [form, setForm] = useState<ToolForm>({
    tool_name: "",
    description: "",
    brand: "",
    condition: "",
    rental_price_per_day: "",
    location: "",
    category_id: "",
  });

  const [image, setImage] = useState<File | null>(null);

  // ================= IMAGE URL =================

  const getImageUrl = (toolImage?: string) => {
    if (!toolImage) return null;

    if (toolImage.startsWith("http")) {
      return toolImage;
    }

    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/${toolImage}`;
  };

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
    if (!ownerId) return;

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

  // ================= OPEN CREATE FORM =================

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  // ================= OPEN EDIT FORM =================

  const openEditForm = (tool: Tool) => {
    setEditingTool(tool);

    setForm({
      tool_name: tool.tool_name,
      description: tool.description,
      brand: tool.brand,
      condition: tool.condition,
      rental_price_per_day: String(tool.rental_price_per_day),
      location: tool.location,
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

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Only JPG, JPEG, PNG or WEBP images are allowed.");
      e.target.value = "";
      return;
    }

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

    if (!form.category_id) {
      toast.error("Please select a category");
      return;
    }

    const categoryId = Number(form.category_id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      toast.error("Please select a valid category");
      return;
    }

    if (!editingTool && !image) {
      toast.error("Tool image is required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("tool_name", form.tool_name.trim());
      formData.append("description", form.description.trim());
      formData.append("brand", form.brand.trim());
      formData.append("condition", form.condition.trim());
      formData.append("rental_price_per_day", String(rentalPrice));
      formData.append("location", form.location.trim());
      formData.append("category_id", String(categoryId));

      if (image) {
        // Backend expects the field name "myfile"
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
        <Loader2 className="h-7 w-7 animate-spin text-[#c1502e]" />
      </div>
    );
  }

  // ================= RENDER =================

  return (
    <div className="space-y-5">
      {/* ================= PAGE HEADER ================= */}

      <section className="relative overflow-hidden rounded-[22px] bg-[#292722] px-5 py-6 shadow-[0_12px_32px_rgba(41,39,34,0.12)] sm:px-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#c1502e]/15" />

        <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#e4a15b]/10" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c1502e]">
                <Hammer className="h-3 w-3 text-white" />
              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/65">
                Tool Management
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              My Tools
            </h1>

            <p className="mt-2 text-xs leading-5 text-white/50 sm:text-sm">
              Manage your listed tools, update information and track approval
              status.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-4 py-3 text-sm font-bold text-[#211f1c] shadow-[3px_3px_0_#171612] transition hover:-translate-y-0.5 hover:bg-[#f0b354] hover:shadow-[4px_4px_0_#171612]"
          >
            <Plus className="h-4 w-4" />
            Add Tool
          </button>
        </div>
      </section>

      {/* ================= SUMMARY ================= */}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-[#eee8e1] bg-white px-4 py-3 shadow-[0_6px_22px_rgba(55,45,30,0.04)]">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa39a]">
            Your Collection
          </p>

          <p className="mt-1 text-sm font-semibold text-[#211f1c]">
            {tools.length} {tools.length === 1 ? "tool" : "tools"} listed
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="rounded-full border border-[#f1d39b] bg-[#fff8e8] px-3 py-1.5 text-[#b7791f]">
            {tools.filter((tool) => tool.status === "pending").length} Pending
          </span>

          <span className="rounded-full border border-[#b7e4c7] bg-[#effaf2] px-3 py-1.5 text-[#16803c]">
            {tools.filter((tool) => tool.status === "approved").length} Approved
          </span>

          <span className="rounded-full border border-[#f5c2c7] bg-[#fff3f4] px-3 py-1.5 text-[#c63c4a]">
            {tools.filter((tool) => tool.status === "rejected").length} Rejected
          </span>
        </div>
      </div>

      {/* ================= FORM ================= */}

      {showForm && (
        <section className="overflow-hidden rounded-[22px] border border-[#eee8e1] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.055)]">
          <div className="flex items-start justify-between border-b border-[#eee8e1] bg-[#fcfaf7] px-5 py-4 sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#fff3dd] text-[#c17a28]">
                  {editingTool ? (
                    <Edit3 className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </div>

                <h2 className="text-base font-bold text-[#211f1c]">
                  {editingTool ? "Edit Tool" : "Add New Tool"}
                </h2>
              </div>

              <p className="mt-1.5 text-xs text-[#8c837a]">
                {editingTool
                  ? "Update your tool information."
                  : "Add a new tool to your rental collection."}
              </p>
            </div>

            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="rounded-lg p-2 text-[#aaa39a] transition hover:bg-[#f1ece5] hover:text-[#211f1c] disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {/* TOOL NAME */}

              <FormField label="Tool Name">
                <input
                  name="tool_name"
                  value={form.tool_name}
                  onChange={handleChange}
                  placeholder="e.g. Bosch Professional Drill"
                  className="form-input"
                />
              </FormField>

              {/* BRAND */}

              <FormField label="Brand">
                <input
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="e.g. Bosch"
                  className="form-input"
                />
              </FormField>

              {/* CONDITION */}

              <FormField label="Condition">
                <input
                  name="condition"
                  value={form.condition}
                  onChange={handleChange}
                  placeholder="e.g. Excellent"
                  className="form-input"
                />
              </FormField>

              {/* RENTAL PRICE */}

              <FormField label="Rental Price / Day">
                <input
                  name="rental_price_per_day"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.rental_price_per_day}
                  onChange={handleChange}
                  placeholder="500"
                  className="form-input"
                />
              </FormField>

              {/* LOCATION */}

              <FormField label="Location">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Dhaka"
                  className="form-input"
                />
              </FormField>

              {/* CATEGORY */}

              <FormField label="Category">
                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                  className="form-input bg-white"
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* DESCRIPTION */}

            <FormField label="Description">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the tool, its features and suitable use..."
                className="form-input resize-none leading-6"
              />
            </FormField>

            {/* IMAGE */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#8c837a]">
                Tool Image
              </label>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[16px] border border-dashed border-[#dfd5ca] bg-[#fcfaf7] px-6 py-8 text-center transition hover:border-[#d7a45b] hover:bg-[#fff8ed]">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[13px] bg-[#fff3dd] text-[#c17a28]">
                  <ImageIcon className="h-5 w-5" />
                </div>

                {image ? (
                  <>
                    <p className="text-sm font-semibold text-[#211f1c]">
                      {image.name}
                    </p>

                    <p className="mt-1 text-xs text-[#8c837a]">
                      {(image.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-[#51483f]">
                      Click to upload an image
                    </p>

                    <p className="mt-1 text-xs text-[#aaa39a]">
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

            {/* ACTIONS */}

            <div className="flex flex-col-reverse gap-3 border-t border-[#eee8e1] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-xl border border-[#e5ddd3] px-5 py-2.5 text-sm font-semibold text-[#8c837a] transition hover:bg-[#f7f4ef] hover:text-[#211f1c] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e8a33d] px-5 py-2.5 text-sm font-bold text-[#211f1c] shadow-[2px_2px_0_#211f1c] transition hover:-translate-y-0.5 hover:bg-[#f0b354] hover:shadow-[3px_3px_0_#211f1c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}

                {editingTool ? "Save Changes" : "Add Tool"}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ================= EMPTY STATE ================= */}

      {tools.length === 0 ? (
        <section className="rounded-[22px] border border-dashed border-[#dfd5ca] bg-white px-6 py-16 text-center shadow-[0_6px_22px_rgba(55,45,30,0.04)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[16px] bg-[#fff3dd] text-[#c17a28]">
            <Hammer className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-base font-bold text-[#211f1c]">
            No tools yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8c837a]">
            You have not added any tools yet. Add your first tool to start
            renting through ToolShare.
          </p>

          <button
            type="button"
            onClick={openCreateForm}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#e8a33d] px-5 py-3 text-sm font-bold text-[#211f1c] shadow-[2px_2px_0_#211f1c] transition hover:-translate-y-0.5 hover:bg-[#f0b354]"
          >
            <Plus className="h-4 w-4" />
            Add Tool
          </button>
        </section>
      ) : (
        /* ================= TOOLS GRID ================= */

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              deleting={deletingId === tool.id}
              onEdit={() => openEditForm(tool)}
              onDelete={() => handleDelete(tool)}
              getImageUrl={getImageUrl}
            />
          ))}
        </div>
      )}

      {/* ================= LOCAL STYLES ================= */}

      <style jsx>{`
        .form-input {
          width: 100%;
          border: 1px solid #e5ddd3;
          border-radius: 12px;
          background: #fffdfb;
          padding: 12px 14px;
          font-size: 14px;
          color: #211f1c;
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }

        .form-input::placeholder {
          color: #b7aea4;
        }

        .form-input:focus {
          border-color: #d7a45b;
          box-shadow: 0 0 0 3px rgba(232, 163, 61, 0.14);
        }
      `}</style>
    </div>
  );
}

// ======================================================
// FORM FIELD
// ======================================================

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#8c837a]">
        {label}
      </label>

      {children}
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
  getImageUrl,
}: {
  tool: Tool;
  deleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  getImageUrl: (toolImage?: string) => string | null;
}) {
  const imageUrl = getImageUrl(tool.tool_image);

  return (
    <article className="group overflow-hidden rounded-[22px] border border-[#eee8e1] bg-white shadow-[0_8px_28px_rgba(55,45,30,0.055)] transition-all duration-300 hover:-translate-y-1 hover:border-[#e8cda5] hover:shadow-[0_14px_32px_rgba(55,45,30,0.09)]">
      {/* ================= IMAGE ================= */}

      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f1eb]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={tool.tool_name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#fff3dd] text-[#c17a28]">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

        <div className="absolute left-3 top-3">
          <StatusBadge status={tool.status} />
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1.5 text-[10px] font-bold text-[#211f1c] backdrop-blur-sm">
          <MapPin className="h-3 w-3 text-[#c1502e]" />
          {tool.location}
        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-[#211f1c]">
              {tool.tool_name}
            </h3>

            <p className="mt-1 text-xs font-medium text-[#8c837a]">
              {tool.brand}
            </p>
          </div>

          <div className="shrink-0 text-right">
            <p className="text-base font-extrabold text-[#a96618]">
              ৳{Number(tool.rental_price_per_day).toLocaleString()}
            </p>

            <p className="text-[10px] font-medium text-[#aaa39a]">per day</p>
          </div>
        </div>

        {/* ================= META ================= */}

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#f7f4ef] px-2.5 py-1 text-[10px] font-semibold text-[#8c837a]">
            Condition: {tool.condition}
          </span>

          <span className="rounded-full bg-[#f7f4ef] px-2.5 py-1 text-[10px] font-semibold text-[#8c837a]">
            Category ID: {tool.category_id}
          </span>
        </div>

        {/* ================= DESCRIPTION ================= */}

        <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#8c837a]">
          {tool.description}
        </p>

        {/* ================= ACTIONS ================= */}

        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#eee8e1] pt-4">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#e5ddd3] bg-[#fcfaf7] px-3 py-2.5 text-sm font-semibold text-[#51483f] transition hover:border-[#d7a45b] hover:bg-[#fff3dd] hover:text-[#a96618]"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#f5c2c7] bg-[#fff3f4] px-3 py-2.5 text-sm font-semibold text-[#c63c4a] transition hover:bg-[#ffe5e8] disabled:cursor-not-allowed disabled:opacity-50"
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
    </article>
  );
}

// ======================================================
// STATUS BADGE
// ======================================================

function StatusBadge({ status }: { status: Tool["status"] }) {
  const styles: Record<Tool["status"], string> = {
    pending: "border-[#f1d39b] bg-[#fff8e8] text-[#b7791f]",
    approved: "border-[#b7e4c7] bg-[#effaf2] text-[#16803c]",
    rejected: "border-[#f5c2c7] bg-[#fff3f4] text-[#c63c4a]",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1.5 text-[10px] font-bold capitalize shadow-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}
