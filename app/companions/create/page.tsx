"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setSuccess } from "@/app/store/modalSlice";

interface CompanionFormData {
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  images?: string[];
  metafields: {
    age: string;
    current_location_in_australia: string;
    available_times_to_take_jobs: string;
    relevant_skills: string;
    other_certificates: string;
    australian_police_check: string;
    blue_card_status: string;
    preferred_age_group_to_work: string;
    school_major_you_re_studying: string;
  };
}

const initialFormData: CompanionFormData = {
  title: "",
  body_html: "",
  vendor: "MiniTeach",
  product_type: "Companion",
  tags: "companion,childcare,education",
  metafields: {
    age: "",
    current_location_in_australia: "",
    available_times_to_take_jobs: "",
    relevant_skills: "",
    other_certificates: "",
    australian_police_check: "",
    blue_card_status: "",
    preferred_age_group_to_work: "",
    school_major_you_re_studying: "",
  },
};


const australianCities = [
  "Sydney",
  "Melbourne",
  "Brisbane",
  "Adelaide",
];

export default function CreateCompanionPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<CompanionFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const currentImageCount = selectedImages.length;
    const maxImages = 250; // Shopify's actual limit
    
    // Check if adding these files would exceed the limit
    if (currentImageCount + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You currently have ${currentImageCount} images.`);
      return;
    }

    const validFiles = fileArray.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 20 * 1024 * 1024; // 20MB limit (Shopify's actual limit)
      const isValidDimensions = true; // We'll let Shopify handle dimension validation
      return isImage && isValidSize && isValidDimensions;
    });

    if (validFiles.length !== fileArray.length) {
      setError('Some files were skipped. Please upload only images under 20MB.');
      return;
    }

    // Clear any previous errors
    if (error && error.includes('images')) {
      setError(null);
    }

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviewUrls(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const changeEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(changeEvent);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("metafields.")) {
      const fieldName = name.replace("metafields.", "");
      setFormData(prev => ({
        ...prev,
        metafields: {
          ...prev.metafields,
          [fieldName]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Create FormData for file upload
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('title', formData.title);
      submitFormData.append('body_html', formData.body_html);
      submitFormData.append('vendor', formData.vendor);
      submitFormData.append('product_type', formData.product_type);
      submitFormData.append('tags', formData.tags);
      submitFormData.append('collection_id', '491355177275');
      
      // Add metafields
      Object.entries(formData.metafields).forEach(([key, value]) => {
        if (key === 'available_times_to_take_jobs' || key === 'relevant_skills') {
          const arrayValue = typeof value === 'string' 
            ? value.split(',').map(s => s.trim()).filter(s => s)
            : value;
          submitFormData.append(`metafields.${key}`, JSON.stringify(arrayValue));
        } else {
          submitFormData.append(`metafields.${key}`, value);
        }
      });
      
      // Add images
      selectedImages.forEach((image) => {
        submitFormData.append(`images`, image);
      });

      const response = await fetch("/api/companions/create", {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        dispatch(setSuccess({ 
          success: true, 
          message: "Companion created successfully! Redirecting to profile..." 
        }));
        setTimeout(() => {
          router.push(`/companion/${result.data.id}`);
        }, 2000);
      } else {
        setError(result.error || "Failed to create companion");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error creating companion:", err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)" }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold hover:opacity-80" style={{ color: "#47709B" }}>
                MiniTeach
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:opacity-80 font-medium">
                Home
              </Link>
              <Link href="/companions" className="text-gray-700 hover:opacity-80 font-medium">
                All Companions
              </Link>
              <Link href="/about" className="text-gray-700 hover:opacity-80 font-medium">
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="text-gray-500 hover:opacity-80">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <Link href="/companions" className="text-gray-500 hover:opacity-80">
                  Companions
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </li>
              <li>
                <span className="text-gray-700 font-medium">Create New Companion</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Companion</h1>
          <p className="text-xl text-gray-600">Add a new child companion to the MiniTeach platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter companion's full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="metafields.age"
                  value={formData.metafields.age}
                  onChange={handleInputChange}
                  required
                  min="18"
                  max="65"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Me *
              </label>
              <textarea
                name="body_html"
                value={formData.body_html}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write a brief introduction about yourself, your experience with children, and what makes you a great companion..."
              />
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Location in Australia
              </label>
              <select
                name="metafields.current_location_in_australia"
                value={formData.metafields.current_location_in_australia}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your city</option>
                {australianCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Availability</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Times
              </label>
              <textarea
                name="metafields.available_times_to_take_jobs"
                value={formData.metafields.available_times_to_take_jobs}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Monday mornings, Tuesday afternoons, Weekends, School holidays"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple times with commas</p>
            </div>
          </div>

          {/* Skills & Experience */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Skills & Experience</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Skills
                </label>
                <textarea
                  name="metafields.relevant_skills"
                  value={formData.metafields.relevant_skills}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Early Childhood Education, Music, Art & Crafts, Mathematics, First Aid"
                />
                <p className="text-sm text-gray-500 mt-1">Separate multiple skills with commas</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Age Group to Work With
                </label>
                <input
                  type="text"
                  name="metafields.preferred_age_group_to_work"
                  value={formData.metafields.preferred_age_group_to_work}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 3-5 years, Primary school, All ages"
                />
                <p className="text-sm text-gray-500 mt-1">Specify the age group you prefer to work with</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Background
                </label>
                <input
                  type="text"
                  name="metafields.school_major_you_re_studying"
                  value={formData.metafields.school_major_you_re_studying}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Bachelor of Education, Early Childhood Studies, etc."
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Images</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Photos
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="text-lg font-medium text-blue-600 hover:text-blue-500">
                          Click to upload photos
                        </span>
                        <span className="text-gray-500"> or drag and drop</span>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      JPG, PNG, GIF, WebP up to 20MB each. Maximum 250 images.
                      {selectedImages.length > 0 && (
                        <span className="block mt-1 font-medium text-blue-600">
                          {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''} selected
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Selected Images ({imagePreviewUrls.length})
                    </h3>
                    {imagePreviewUrls.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImages([]);
                          setImagePreviewUrls([]);
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove All
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Images will be uploaded to Shopify when you create the companion. You can reorder them after creation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Certifications & Checks */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Certifications & Background Checks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Australian Police Check Status
                </label>
                <select
                  name="metafields.australian_police_check"
                  value={formData.metafields.australian_police_check}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="Current">Current (within last 12 months)</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Expired">Expired (need renewal)</option>
                  <option value="Not Obtained">Not Obtained</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blue Card/WWCC Status
                </label>
                <select
                  name="metafields.blue_card_status"
                  value={formData.metafields.blue_card_status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="Current">Current</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Expired">Expired (need renewal)</option>
                  <option value="Not Obtained">Not Obtained</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Certificates
              </label>
              <textarea
                name="metafields.other_certificates"
                value={formData.metafields.other_certificates}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List any other relevant certificates (e.g., First Aid, CPR, Swimming Instructor, etc.)"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error creating companion</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/companions"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 text-white rounded-lg font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#47709B" }}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                  Creating...
                </>
              ) : (
                "Create Companion"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}