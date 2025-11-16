/**
 * AuthorForge Tempering Module - Asset Binding Panel
 *
 * Manages image uploads and role assignments for export profiles.
 * Features drag-and-drop upload, image preview, role assignment, and chapter/page binding.
 */

import { Show, For, createSignal } from "solid-js";
import type { ExportProfile, ImageBinding, ImageRole } from "~/lib/types/tempering";

// ============================================================================
// Types
// ============================================================================

interface AssetBindingPanelProps {
  profile: ExportProfile | null;
  onUpdateProfile: (id: string, updates: { imageBindings: ImageBinding[] }) => Promise<void>;
}

// ============================================================================
// Main Component
// ============================================================================

export function AssetBindingPanel(props: AssetBindingPanelProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [selectedImageId, setSelectedImageId] = createSignal<string | null>(null);

  const images = () => props.profile?.imageBindings || [];
  const selectedImage = () => images().find((img) => img.id === selectedImageId());

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !props.profile) return;

    const newBindings: ImageBinding[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      // Create a temporary URL for preview
      const filePath = URL.createObjectURL(file);

      // Get image dimensions
      const { width, height } = await getImageDimensions(file);

      const binding: ImageBinding = {
        id: crypto.randomUUID(),
        filePath,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        role: "figure", // Default role
        width,
        height,
        uploadedAt: new Date().toISOString(),
      };

      newBindings.push(binding);
    }

    // Update profile with new bindings
    const updatedBindings = [...images(), ...newBindings];
    await props.onUpdateProfile(props.profile.id, { imageBindings: updatedBindings });

    // Select the first newly uploaded image
    if (newBindings.length > 0) {
      setSelectedImageId(newBindings[0].id);
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    await handleFileUpload(e.dataTransfer?.files || null);
  };

  // Handle file input change
  const handleFileInputChange = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    await handleFileUpload(input.files);
  };

  // Delete an image
  const handleDeleteImage = async (imageId: string) => {
    if (!props.profile) return;
    const updatedBindings = images().filter((img) => img.id !== imageId);
    await props.onUpdateProfile(props.profile.id, { imageBindings: updatedBindings });
    if (selectedImageId() === imageId) {
      setSelectedImageId(null);
    }
  };

  // Update image properties
  const handleUpdateImage = async (imageId: string, updates: Partial<ImageBinding>) => {
    if (!props.profile) return;
    const updatedBindings = images().map((img) =>
      img.id === imageId ? { ...img, ...updates } : img
    );
    await props.onUpdateProfile(props.profile.id, { imageBindings: updatedBindings });
  };

  return (
    <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      {/* Header */}
      <div class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-700 px-6 py-4">
        <h2 class="text-xl font-semibold text-purple-400">🖼️ Asset Binding</h2>
      </div>

      <div class="p-6 space-y-6">
        {/* Upload Area */}
        <div
          class={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging()
              ? "border-purple-400 bg-purple-500/10"
              : "border-slate-600 hover:border-slate-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div class="text-4xl mb-3">📤</div>
          <div class="text-slate-300 font-medium mb-2">
            Drag and drop images here
          </div>
          <div class="text-sm text-slate-400 mb-4">or</div>
          <label class="inline-block px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg cursor-pointer transition-colors">
            Browse Files
            <input
              type="file"
              multiple
              accept="image/*"
              class="hidden"
              onChange={handleFileInputChange}
            />
          </label>
        </div>

        {/* Image Grid */}
        <Show when={images().length > 0}>
          <div>
            <h3 class="text-sm font-semibold text-slate-300 mb-3">
              Uploaded Images ({images().length})
            </h3>
            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <For each={images()}>
                {(image) => (
                  <ImageCard
                    image={image}
                    isSelected={selectedImageId() === image.id}
                    onSelect={() => setSelectedImageId(image.id)}
                    onDelete={() => handleDeleteImage(image.id)}
                  />
                )}
              </For>
            </div>
          </div>
        </Show>

        {/* Image Details */}
        <Show when={selectedImage()}>
          {(image) => (
            <ImageDetailsPanel
              image={image()}
              onUpdate={(updates) => handleUpdateImage(image().id, updates)}
            />
          )}
        </Show>

        {/* Empty State */}
        <Show when={images().length === 0}>
          <div class="text-center py-8 text-slate-400">
            <div class="text-5xl mb-3">🖼️</div>
            <div class="text-sm">No images uploaded yet</div>
            <div class="text-xs mt-1">Upload images to bind them to your export</div>
          </div>
        </Show>
      </div>
    </div>
  );
}

// ============================================================================
// Image Card Component
// ============================================================================

interface ImageCardProps {
  image: ImageBinding;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

function ImageCard(props: ImageCardProps) {
  const roleIcon = () => {
    const icons: Record<ImageRole, string> = {
      cover: "📕",
      figure: "🖼️",
      hero: "🎨",
      "author-photo": "👤",
      map: "🗺️",
      decorative: "✨",
    };
    return icons[props.image.role];
  };

  return (
    <div
      class={`relative group rounded-lg overflow-hidden cursor-pointer transition-all ${
        props.isSelected
          ? "ring-2 ring-purple-400 shadow-lg"
          : "hover:ring-2 hover:ring-slate-500"
      }`}
      onClick={props.onSelect}
    >
      {/* Image Preview */}
      <div class="aspect-square bg-slate-700 flex items-center justify-center overflow-hidden">
        <img
          src={props.image.filePath}
          alt={props.image.altText || props.image.fileName}
          class="w-full h-full object-cover"
        />
      </div>

      {/* Role Badge */}
      <div class="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm px-2 py-1 rounded text-xs flex items-center gap-1">
        <span>{roleIcon()}</span>
        <span class="text-slate-300 capitalize">{props.image.role}</span>
      </div>

      {/* Delete Button */}
      <button
        class="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 backdrop-blur-sm p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          props.onDelete();
        }}
      >
        <span class="text-white text-sm">🗑️</span>
      </button>

      {/* File Name */}
      <div class="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm px-2 py-1">
        <div class="text-xs text-slate-300 truncate">{props.image.fileName}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Image Details Panel Component
// ============================================================================

interface ImageDetailsPanelProps {
  image: ImageBinding;
  onUpdate: (updates: Partial<ImageBinding>) => void;
}

function ImageDetailsPanel(props: ImageDetailsPanelProps) {
  const roleOptions: { value: ImageRole; label: string; icon: string }[] = [
    { value: "cover", label: "Cover Image", icon: "📕" },
    { value: "figure", label: "Figure/Illustration", icon: "🖼️" },
    { value: "hero", label: "Hero Image", icon: "🎨" },
    { value: "author-photo", label: "Author Photo", icon: "👤" },
    { value: "map", label: "Map/Diagram", icon: "🗺️" },
    { value: "decorative", label: "Decorative", icon: "✨" },
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div class="bg-slate-700/50 rounded-lg p-4 space-y-4">
      <h3 class="text-sm font-semibold text-purple-400">Image Details</h3>

      {/* Image Preview */}
      <div class="flex gap-4">
        <div class="w-32 h-32 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={props.image.filePath}
            alt={props.image.altText || props.image.fileName}
            class="w-full h-full object-cover"
          />
        </div>

        <div class="flex-1 space-y-2 text-sm">
          <div>
            <span class="text-slate-400">File:</span>{" "}
            <span class="text-slate-200">{props.image.fileName}</span>
          </div>
          <div>
            <span class="text-slate-400">Size:</span>{" "}
            <span class="text-slate-200">{formatFileSize(props.image.fileSize)}</span>
          </div>
          <div>
            <span class="text-slate-400">Dimensions:</span>{" "}
            <span class="text-slate-200">
              {props.image.width} × {props.image.height}
            </span>
          </div>
          <div>
            <span class="text-slate-400">Type:</span>{" "}
            <span class="text-slate-200">{props.image.mimeType}</span>
          </div>
        </div>
      </div>

      {/* Role Selection */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">Image Role</label>
        <select
          class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
          value={props.image.role}
          onChange={(e) => props.onUpdate({ role: e.currentTarget.value as ImageRole })}
        >
          <For each={roleOptions}>
            {(option) => (
              <option value={option.value}>
                {option.icon} {option.label}
              </option>
            )}
          </For>
        </select>
      </div>

      {/* Alt Text */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">
          Alt Text (Accessibility)
        </label>
        <input
          type="text"
          class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
          placeholder="Describe the image for screen readers"
          value={props.image.altText || ""}
          onBlur={(e) => props.onUpdate({ altText: e.currentTarget.value })}
        />
      </div>

      {/* Caption */}
      <div>
        <label class="block text-sm font-medium text-slate-300 mb-2">Caption (Optional)</label>
        <textarea
          class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 resize-none"
          rows={2}
          placeholder="Add a caption for this image"
          value={props.image.caption || ""}
          onBlur={(e) => props.onUpdate({ caption: e.currentTarget.value })}
        />
      </div>

      {/* Chapter Binding */}
      <Show when={props.image.role === "figure" || props.image.role === "map"}>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Chapter Binding (Optional)
          </label>
          <input
            type="text"
            class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
            placeholder="Chapter ID or name"
            value={props.image.chapterBinding || ""}
            onBlur={(e) => props.onUpdate({ chapterBinding: e.currentTarget.value })}
          />
        </div>
      </Show>

      {/* Page Binding */}
      <Show when={props.image.role === "figure" || props.image.role === "map"}>
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">
            Page Number (Optional)
          </label>
          <input
            type="number"
            class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-slate-200"
            placeholder="Target page number"
            value={props.image.pageBinding || ""}
            onBlur={(e) =>
              props.onUpdate({
                pageBinding: e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined,
              })
            }
          />
        </div>
      </Show>
    </div>
  );
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the dimensions of an image file.
 */
async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
  });
}



