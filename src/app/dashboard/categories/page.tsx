'use client';

import React, { useEffect, useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Save,
  X,
  Globe,
  Sparkles,
  Code,
  Tag,
} from 'lucide-react';

interface SubCategory {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
  status: 'active' | 'inactive';
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  status: 'active' | 'inactive';
  subCategories: SubCategory[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  canonicalUrl?: string;
  schemaMarkup?: string;
}

const SITE_URL = 'https://www.businessbulletin.in';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});

  // Category Modal Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formOrder, setFormOrder] = useState('0');
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formMetaKeywords, setFormMetaKeywords] = useState('');
  const [formCanonical, setFormCanonical] = useState('');
  const [formSchema, setFormSchema] = useState('');
  const [categoryActiveTab, setCategoryActiveTab] = useState<'general' | 'seo'>('general');

  // SubCategory Modal Form State
  const [activeCatForSub, setActiveCatForSub] = useState<Category | null>(null);
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);
  const [subName, setSubName] = useState('');
  const [subSlug, setSubSlug] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subOrder, setSubOrder] = useState('0');
  const [subStatus, setSubStatus] = useState<'active' | 'inactive'>('active');
  const [subMetaTitle, setSubMetaTitle] = useState('');
  const [subMetaDesc, setSubMetaDesc] = useState('');
  const [subMetaKeywords, setSubMetaKeywords] = useState('');
  const [subCanonical, setSubCanonical] = useState('');
  const [subSchema, setSubSchema] = useState('');
  const [subActiveTab, setSubActiveTab] = useState<'general' | 'seo'>('general');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        // Expand first 3 by default
        const initExpanded: Record<string, boolean> = {};
        data.categories.forEach((c: Category, i: number) => {
          if (i < 3) initExpanded[c._id] = true;
        });
        setExpandedCats(initExpanded);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedCats((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddCategory = () => {
    setEditingCatId(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setFormOrder('0');
    setFormStatus('active');
    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormMetaKeywords('');
    setFormCanonical('');
    setFormSchema('');
    setCategoryActiveTab('general');
    setIsModalOpen(true);
  };

  const openEditCategory = (cat: Category) => {
    setEditingCatId(cat._id);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || '');
    setFormOrder(cat.order.toString());
    setFormStatus(cat.status);
    setFormMetaTitle(cat.metaTitle || '');
    setFormMetaDesc(cat.metaDescription || '');
    setFormMetaKeywords(cat.metaKeywords || '');
    setFormCanonical(cat.canonicalUrl || `${SITE_URL}/category/${cat.slug}`);
    setFormSchema(cat.schemaMarkup || '');
    setCategoryActiveTab('general');
    setIsModalOpen(true);
  };

  // Helper to auto-generate SEO defaults for Category
  const generateCategorySeoDefaults = () => {
    const slug = formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const name = formName || 'Category';
    const canonical = `${SITE_URL}/category/${slug}`;
    const metaTitle = `${name} News, Market Insights & Updates | BusinessBulletin`;
    const metaDesc = formDesc
      ? `${formDesc.slice(0, 140)} - Latest news & updates at BusinessBulletin.`
      : `Get the latest ${name} news, updates, deep analysis and breaking headlines at BusinessBulletin.`;
    const metaKeywords = `${name.toLowerCase()}, ${name.toLowerCase()} news, market news, business bulletin, stocks, financial news`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${name} News & Analysis`,
      url: canonical,
      description: metaDesc,
      publisher: {
        '@type': 'Organization',
        name: 'BusinessBulletin',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/updatedlogo.svg`,
        },
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name,
            item: canonical,
          },
        ],
      },
    };

    setFormMetaTitle(metaTitle);
    setFormMetaDesc(metaDesc);
    setFormMetaKeywords(metaKeywords);
    setFormCanonical(canonical);
    setFormSchema(JSON.stringify(schema, null, 2));
    setCategoryActiveTab('seo');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formName.trim()) {
      setError('Category Name is required');
      return;
    }

    const finalSlug = formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const payload = {
      name: formName.trim(),
      slug: finalSlug,
      description: formDesc,
      order: Number(formOrder) || 0,
      status: formStatus,
      metaTitle: formMetaTitle.trim(),
      metaDescription: formMetaDesc.trim(),
      metaKeywords: formMetaKeywords.trim(),
      canonicalUrl: formCanonical.trim() || `${SITE_URL}/category/${finalSlug}`,
      schemaMarkup: formSchema.trim(),
    };

    try {
      if (editingCatId) {
        // Update
        const res = await fetch(`/api/categories/${editingCatId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccess('Category updated successfully');
      } else {
        // Create
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            subCategories: [],
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccess('Category created successfully');
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}" and all its subcategories?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('Category deleted successfully');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // SubCategory Handlers (Add & Edit)
  const openAddSubCategory = (cat: Category) => {
    setActiveCatForSub(cat);
    setEditingSubIndex(null);
    setSubName('');
    setSubSlug('');
    setSubDesc('');
    setSubOrder((cat.subCategories?.length || 0).toString());
    setSubStatus('active');
    setSubMetaTitle('');
    setSubMetaDesc('');
    setSubMetaKeywords('');
    setSubCanonical('');
    setSubSchema('');
    setSubActiveTab('general');
  };

  const openEditSubCategory = (cat: Category, sub: SubCategory, index: number) => {
    setActiveCatForSub(cat);
    setEditingSubIndex(index);
    setSubName(sub.name);
    setSubSlug(sub.slug);
    setSubDesc(sub.description || '');
    setSubOrder((sub.order ?? index).toString());
    setSubStatus(sub.status || 'active');
    setSubMetaTitle(sub.metaTitle || '');
    setSubMetaDesc(sub.metaDescription || '');
    setSubMetaKeywords(sub.metaKeywords || '');
    setSubCanonical(sub.canonicalUrl || `${SITE_URL}/category/${cat.slug}/${sub.slug}`);
    setSubSchema(sub.schemaMarkup || '');
    setSubActiveTab('general');
  };

  const generateSubCategorySeoDefaults = () => {
    if (!activeCatForSub) return;
    const catSlug = activeCatForSub.slug;
    const sSlug = subSlug || subName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sName = subName || 'Subcategory';
    const canonical = `${SITE_URL}/category/${catSlug}/${sSlug}`;
    const metaTitle = `${sName} News & Updates - ${activeCatForSub.name} | BusinessBulletin`;
    const metaDesc = subDesc
      ? `${subDesc.slice(0, 140)} - Latest ${sName} reports at BusinessBulletin.`
      : `Explore latest ${sName} updates, news and expert insights under ${activeCatForSub.name} at BusinessBulletin.`;
    const metaKeywords = `${sName.toLowerCase()}, ${activeCatForSub.name.toLowerCase()}, ${sName.toLowerCase()} news, market news, business bulletin`;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${sName} - ${activeCatForSub.name}`,
      url: canonical,
      description: metaDesc,
      publisher: {
        '@type': 'Organization',
        name: 'BusinessBulletin',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_URL}/updatedlogo.svg`,
        },
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: activeCatForSub.name,
            item: `${SITE_URL}/category/${catSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: sName,
            item: canonical,
          },
        ],
      },
    };

    setSubMetaTitle(metaTitle);
    setSubMetaDesc(metaDesc);
    setSubMetaKeywords(metaKeywords);
    setSubCanonical(canonical);
    setSubSchema(JSON.stringify(schema, null, 2));
    setSubActiveTab('seo');
  };

  const handleSaveSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCatForSub || !subName.trim()) return;

    try {
      const finalSubSlug = (subSlug || subName).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
      const canonical = subCanonical.trim() || `${SITE_URL}/category/${activeCatForSub.slug}/${finalSubSlug}`;

      const newSubData: SubCategory = {
        name: subName.trim(),
        slug: finalSubSlug,
        description: subDesc.trim(),
        order: Number(subOrder) || 0,
        status: subStatus,
        metaTitle: subMetaTitle.trim(),
        metaDescription: subMetaDesc.trim(),
        metaKeywords: subMetaKeywords.trim(),
        canonicalUrl: canonical,
        schemaMarkup: subSchema.trim(),
      };

      let updatedSubCategories: SubCategory[];
      if (editingSubIndex !== null && editingSubIndex >= 0) {
        // Edit existing subcategory
        updatedSubCategories = activeCatForSub.subCategories.map((sub, idx) =>
          idx === editingSubIndex ? { ...sub, ...newSubData } : sub
        );
      } else {
        // Add new subcategory
        updatedSubCategories = [...(activeCatForSub.subCategories || []), newSubData];
      }

      const res = await fetch(`/api/categories/${activeCatForSub._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subCategories: updatedSubCategories,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setActiveCatForSub(null);
      setEditingSubIndex(null);
      setSuccess(editingSubIndex !== null ? 'Subcategory updated successfully' : 'Subcategory added successfully');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteSubCategory = async (cat: Category, subIndex: number) => {
    if (!confirm('Remove this subcategory?')) return;
    try {
      const updatedSubCategories = cat.subCategories.filter((_, idx) => idx !== subIndex);
      const res = await fetch(`/api/categories/${cat._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subCategories: updatedSubCategories,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('Subcategory removed');
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-[#01142e] tracking-tight">
            Dynamic Category & Sub-Category Module
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure primary news desks, nested topics, navigation slugs, SEO metadata, and JSON-LD schemas.
          </p>
        </div>
        <button
          onClick={openAddCategory}
          className="inline-flex items-center gap-2 bg-[#01142e] hover:bg-[#0069f7] text-white px-4 py-2.5 rounded-xl font-semibold text-xs tracking-wider uppercase transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Primary Category
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center justify-between p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError('')} className="font-bold hover:underline cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess('')} className="font-bold hover:underline cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Tree / List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-xs">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <Layers className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">No categories found</p>
            <p className="text-xs text-gray-400 mt-1">
              Create your first category or click sync from dashboard.
            </p>
          </div>
        ) : (
          categories.map((cat) => {
            const isExpanded = !!expandedCats[cat._id];
            const hasSeo = Boolean(cat.metaTitle || cat.metaDescription || cat.canonicalUrl);

            return (
              <div
                key={cat._id}
                className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden transition"
              >
                {/* Category Bar */}
                <div className="p-4 flex items-center justify-between gap-4 bg-[#fafcff] border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExpand(cat._id)}
                      className="p-1 rounded hover:bg-gray-200 text-gray-500 transition cursor-pointer"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-sm text-[#01142e]">{cat.name}</span>
                        <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          /{cat.slug}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            cat.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {cat.status}
                        </span>
                        {hasSeo && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                            <Globe className="w-3 h-3" /> SEO Configured
                          </span>
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openAddSubCategory(cat)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#0069f7] bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center gap-1 cursor-pointer"
                      title="Add Sub-Category"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add Sub</span>
                    </button>

                    <button
                      onClick={() => openEditCategory(cat)}
                      className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                      title="Edit Category & SEO"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(cat._id, cat.name)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* SubCategories Drawer */}
                {isExpanded && (
                  <div className="p-4 bg-white space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                      Sub-Categories ({cat.subCategories?.length || 0})
                    </div>

                    {!cat.subCategories || cat.subCategories.length === 0 ? (
                      <p className="text-xs text-gray-400 italic pl-6">
                        No nested subcategories configured yet. Click &quot;Add Sub&quot; to create one with SEO fields.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pl-4">
                        {cat.subCategories.map((sub, idx) => (
                          <div
                            key={sub.slug || idx}
                            className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-[#fbfcfd] hover:border-blue-200 transition"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="text-xs font-bold text-gray-800 truncate">{sub.name}</p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[10px] font-mono text-gray-400">/{sub.slug}</span>
                                {sub.metaTitle && (
                                  <span className="text-[9px] text-blue-600 bg-blue-50 px-1 rounded font-medium">SEO</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => openEditSubCategory(cat, sub, idx)}
                                className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-gray-100 transition cursor-pointer"
                                title="Edit subcategory & SEO"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteSubCategory(cat, idx)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 transition cursor-pointer"
                                title="Delete subcategory"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0069f7]" />
                <h3 className="text-base font-bold text-[#01142e]">
                  {editingCatId ? 'Edit Primary Category' : 'Create Primary Category'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-gray-200 bg-gray-50/60 shrink-0">
              <button
                type="button"
                onClick={() => setCategoryActiveTab('general')}
                className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                  categoryActiveTab === 'general'
                    ? 'border-[#0069f7] text-[#0069f7]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                General Settings
              </button>
              <button
                type="button"
                onClick={() => setCategoryActiveTab('seo')}
                className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  categoryActiveTab === 'seo'
                    ? 'border-[#0069f7] text-[#0069f7]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                SEO & Schema Markup
                {formMetaTitle && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveCategory} className="flex-1 overflow-y-auto p-6 space-y-4">
              {categoryActiveTab === 'general' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        if (!editingCatId) {
                          setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      required
                      placeholder="e.g. Markets"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      URL Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-xs text-gray-500 font-mono">
                        /category/
                      </span>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        required
                        placeholder="markets"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-r-xl text-sm font-mono focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Desk Synopsis / Description
                    </label>
                    <textarea
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      rows={3}
                      placeholder="Brief overview of articles and topics published under this desk"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formOrder}
                        onChange={(e) => setFormOrder(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formStatus}
                        onChange={(e: any) => setFormStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* SEO teaser banner */}
                  <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#01142e]">Configure SEO for this Category</p>
                      <p className="text-[11px] text-gray-500">
                        Customize Meta Title, Description, Canonical URL, and JSON-LD Schema.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCategoryActiveTab('seo')}
                      className="px-3 py-1.5 bg-[#0069f7] hover:bg-[#0058d0] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Open SEO Tab
                    </button>
                  </div>
                </>
              ) : (
                /* SEO TAB */
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#01142e] text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold">1-Click SEO Automation</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateCategorySeoDefaults}
                      className="px-3 py-1 bg-[#0069f7] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-Fill SEO Defaults
                    </button>
                  </div>

                  {/* Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700">
                        SEO Meta Title
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          formMetaTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-gray-400'
                        }`}
                      >
                        {formMetaTitle.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={formMetaTitle}
                      onChange={(e) => setFormMetaTitle(e.target.value)}
                      placeholder="e.g. Markets News, Stock Updates & Sensex Today | BusinessBulletin"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Recommended: 50-60 characters for optimal Google SERP display.
                    </p>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700">
                        SEO Meta Description
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          formMetaDesc.length > 160 ? 'text-amber-600 font-bold' : 'text-gray-400'
                        }`}
                      >
                        {formMetaDesc.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      value={formMetaDesc}
                      onChange={(e) => setFormMetaDesc(e.target.value)}
                      rows={3}
                      placeholder="e.g. Read latest stock market news, share market live updates, NSE/BSE indices and market trends at BusinessBulletin."
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Recommended: 140-160 characters describing the category page content.
                    </p>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400" /> Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={formMetaKeywords}
                      onChange={(e) => setFormMetaKeywords(e.target.value)}
                      placeholder="e.g. stock market, markets news, sensex, nifty, share market today"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Comma separated keywords for search spiders.
                    </p>
                  </div>

                  {/* Canonical URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" /> Canonical URL
                    </label>
                    <input
                      type="url"
                      value={formCanonical}
                      onChange={(e) => setFormCanonical(e.target.value)}
                      placeholder={`${SITE_URL}/category/${formSlug || 'markets'}`}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Defines the authoritative canonical URL preventing duplicate content issues.
                    </p>
                  </div>

                  {/* Schema Markup */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700 flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-gray-400" /> Schema Markup (JSON-LD)
                      </label>
                      <button
                        type="button"
                        onClick={generateCategorySeoDefaults}
                        className="text-[11px] font-semibold text-[#0069f7] hover:underline cursor-pointer"
                      >
                        Reset / Generate Schema
                      </button>
                    </div>
                    <textarea
                      value={formSchema}
                      onChange={(e) => setFormSchema(e.target.value)}
                      rows={6}
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "CollectionPage",\n  "name": "${formName || 'Category'}"\n}`}
                      className="w-full p-3 font-mono text-xs border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0069f7] focus:outline-none leading-relaxed"
                    />
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Structured data schema rendered directly inside &lt;script type=&quot;application/ld+json&quot;&gt;.
                    </p>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                <div className="text-[11px] text-gray-400">
                  {categoryActiveTab === 'general' ? 'Tab 1 of 2: General' : 'Tab 2 of 2: SEO'}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#01142e] hover:bg-[#0069f7] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Category
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit SubCategory Modal */}
      {activeCatForSub && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#0069f7] tracking-wider bg-blue-50 px-2 py-0.5 rounded">
                  Parent: {activeCatForSub.name}
                </span>
                <h3 className="text-base font-bold text-[#01142e] mt-1">
                  {editingSubIndex !== null ? 'Edit Sub-Category & SEO' : 'Add Sub-Category & SEO'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveCatForSub(null);
                  setEditingSubIndex(null);
                }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs inside Modal */}
            <div className="flex items-center gap-2 px-6 pt-3 border-b border-gray-200 bg-gray-50/60 shrink-0">
              <button
                type="button"
                onClick={() => setSubActiveTab('general')}
                className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition cursor-pointer ${
                  subActiveTab === 'general'
                    ? 'border-[#0069f7] text-[#0069f7]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                General Settings
              </button>
              <button
                type="button"
                onClick={() => setSubActiveTab('seo')}
                className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
                  subActiveTab === 'seo'
                    ? 'border-[#0069f7] text-[#0069f7]'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                SEO & Schema Markup
                {subMetaTitle && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveSubCategory} className="flex-1 overflow-y-auto p-6 space-y-4">
              {subActiveTab === 'general' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Sub-Category Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={subName}
                      onChange={(e) => {
                        setSubName(e.target.value);
                        if (editingSubIndex === null) {
                          setSubSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                        }
                      }}
                      required
                      placeholder="e.g. Mutual Funds"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Sub-Category Slug <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                      <span className="px-3 py-2.5 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl text-xs text-gray-500 font-mono">
                        /{activeCatForSub.slug}/
                      </span>
                      <input
                        type="text"
                        value={subSlug}
                        onChange={(e) => setSubSlug(e.target.value)}
                        required
                        placeholder="mutual-funds"
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-r-xl text-sm font-mono focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={subDesc}
                      onChange={(e) => setSubDesc(e.target.value)}
                      placeholder="Optional brief overview"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={subOrder}
                        onChange={(e) => setSubOrder(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={subStatus}
                        onChange={(e: any) => setSubStatus(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                      </select>
                    </div>
                  </div>

                  {/* SEO banner */}
                  <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#01142e]">Configure SEO for this Sub-Category</p>
                      <p className="text-[11px] text-gray-500">
                        Add Meta Title, Description, Canonical URL, and JSON-LD Schema.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubActiveTab('seo')}
                      className="px-3 py-1.5 bg-[#0069f7] hover:bg-[#0058d0] text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      Open SEO Tab
                    </button>
                  </div>
                </>
              ) : (
                /* SubCategory SEO Tab */
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#01142e] text-white">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-semibold">1-Click SEO Automation</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateSubCategorySeoDefaults}
                      className="px-3 py-1 bg-[#0069f7] hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" /> Auto-Fill SEO Defaults
                    </button>
                  </div>

                  {/* SubCategory Meta Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700">
                        SEO Meta Title
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          subMetaTitle.length > 60 ? 'text-amber-600 font-bold' : 'text-gray-400'
                        }`}
                      >
                        {subMetaTitle.length}/60 chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={subMetaTitle}
                      onChange={(e) => setSubMetaTitle(e.target.value)}
                      placeholder={`e.g. ${subName || 'Topic'} News & Latest Reports | BusinessBulletin`}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  {/* SubCategory Meta Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700">
                        SEO Meta Description
                      </label>
                      <span
                        className={`text-[11px] font-mono ${
                          subMetaDesc.length > 160 ? 'text-amber-600 font-bold' : 'text-gray-400'
                        }`}
                      >
                        {subMetaDesc.length}/160 chars
                      </span>
                    </div>
                    <textarea
                      value={subMetaDesc}
                      onChange={(e) => setSubMetaDesc(e.target.value)}
                      rows={3}
                      placeholder={`Read latest ${subName || 'topic'} updates, headlines and expert analysis under ${activeCatForSub.name} at BusinessBulletin.`}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  {/* SubCategory Keywords */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-gray-400" /> Meta Keywords
                    </label>
                    <input
                      type="text"
                      value={subMetaKeywords}
                      onChange={(e) => setSubMetaKeywords(e.target.value)}
                      placeholder="e.g. mutual funds, SIP, equity funds, portfolio, business bulletin"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  {/* SubCategory Canonical */}
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 mb-1 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-gray-400" /> Canonical URL
                    </label>
                    <input
                      type="url"
                      value={subCanonical}
                      onChange={(e) => setSubCanonical(e.target.value)}
                      placeholder={`${SITE_URL}/category/${activeCatForSub.slug}/${subSlug || 'topic'}`}
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-[#0069f7] focus:outline-none"
                    />
                  </div>

                  {/* SubCategory Schema */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase text-gray-700 flex items-center gap-1">
                        <Code className="w-3.5 h-3.5 text-gray-400" /> Schema Markup (JSON-LD)
                      </label>
                      <button
                        type="button"
                        onClick={generateSubCategorySeoDefaults}
                        className="text-[11px] font-semibold text-[#0069f7] hover:underline cursor-pointer"
                      >
                        Reset / Generate Schema
                      </button>
                    </div>
                    <textarea
                      value={subSchema}
                      onChange={(e) => setSubSchema(e.target.value)}
                      rows={6}
                      placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "CollectionPage",\n  "name": "${subName || 'Subcategory'}"\n}`}
                      className="w-full p-3 font-mono text-xs border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0069f7] focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                <div className="text-[11px] text-gray-400">
                  {subActiveTab === 'general' ? 'Tab 1 of 2: General' : 'Tab 2 of 2: SEO'}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCatForSub(null);
                      setEditingSubIndex(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0069f7] hover:bg-[#0058d0] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingSubIndex !== null ? 'Update Sub-Category' : 'Save Sub-Category'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
