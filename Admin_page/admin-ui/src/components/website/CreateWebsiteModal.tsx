import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiUpload, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiTag, FiImage, FiVideo, FiGlobe } from 'react-icons/fi';

const steps = [
  { name: 'Organization Info', icon: <FiUser className="w-4 h-4" /> },
  { name: 'Branding & Visuals', icon: <FiTag className="w-4 h-4" /> },
  { name: 'Hero & Banner Images', icon: <FiImage className="w-4 h-4" /> },
  { name: 'Gallery & Media', icon: <FiVideo className="w-4 h-4" /> },
  { name: 'About & Content', icon: <FiUser className="w-4 h-4" /> },
  { name: 'Services/Offerings', icon: <FiTag className="w-4 h-4" /> },
  { name: 'Social Links', icon: <FiGlobe className="w-4 h-4" /> },
  { name: 'Review & Publish', icon: <FiCheckCircle className="w-4 h-4" /> },
];

const defaultForm = {
  organizationName: '',
  organizationType: '',
  tagline: '',
  contactEmail: '',
  contactPhone: '',
  address: '',
  logo: null as File | null,
  favicon: null as File | null,
  primaryColor: '#0ea5e9',
  secondaryColor: '#f0f9ff',
  font: 'Inter',
  heroImage: null as File | null,
  bannerImages: [] as File[],
  introText: '',
  gallery: [] as File[],
  video: '',
  about: '',
  mission: '',
  history: '',
  team: [{ name: '', role: '', photo: null as File | null }],
  services: [{ name: '', description: '', image: null as File | null, price: '' }],
  social: { facebook: '', instagram: '', twitter: '', youtube: '', website: '' },
  domain: '',
};

const fonts = ['Inter', 'Roboto', 'Montserrat', 'Lato', 'Poppins'];

function fileToUrl(file: File | null) {
  return file ? URL.createObjectURL(file) : '';
}

interface Website {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
  // Add more fields as needed for editing
}

interface CreateWebsiteModalProps {
  open: boolean;
  onClose: () => void;
  onComplete?: () => void | Promise<void>;
  onStepChange?: (step: number) => void | Promise<void>;
  stepIndex?: number;
  website?: Partial<typeof defaultForm & Website>;
  editMode?: boolean;
}

export default function CreateWebsiteModal({ open, onClose, onComplete, onStepChange, stepIndex = 0, website, editMode }: CreateWebsiteModalProps) {
  const [step, setStep] = useState(stepIndex);
  const [form, setForm] = useState(defaultForm);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(stepIndex);
      if (editMode && website) {
        setForm(f => ({ ...f, ...website }));
      } else {
        setForm(defaultForm);
      }
    }
  }, [open, stepIndex, editMode, website]);

  if (!open) return null;

  // Handlers for file/image upload
  const handleFile = (e: ChangeEvent<HTMLInputElement>, key: keyof typeof form) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({ ...f, [key]: file }));
  };
  const handleMultipleFiles = (e: ChangeEvent<HTMLInputElement>, key: keyof typeof form) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm(f => ({ ...f, [key]: files }));
  };

  // Handle step progression with API refresh in edit mode
  const handleNextStep = async () => {
    const nextStep = step + 1;
    setStep(nextStep);
    
    // Trigger API refresh on every step in edit mode
    if (editMode && onStepChange) {
      try {
        await onStepChange(nextStep);
      } catch (error) {
        console.error('Step change callback failed:', error);
      }
    }
  };

  // Handle submit
  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      onComplete?.();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-4xl relative animate-fadeIn overflow-hidden border border-gray-200/50">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 px-8 py-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full animate-bounce"></div>
          </div>
          
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-2">
              {editMode ? 'Edit Website' : 'Create New Website'}
            </h2>
            <p className="text-blue-100">{steps[step].name}</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-8 py-6 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => (
              <div key={s.name} className="flex items-center">
                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  idx < step ? 'bg-green-500 text-white' :
                  idx === step ? 'bg-primary-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {idx < step ? <FiCheckCircle className="w-5 h-5" /> : s.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 rounded transition-colors ${
                    idx < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600">Step {step + 1} of {steps.length}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (step === steps.length - 1) handleSubmit();
              else handleNextStep();
            }}
          >
            {/* Step 0: Organization Info */}
            {step === 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="e.g. Charan's Organization" 
                        value={form.organizationName} 
                        onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Type</label>
                    <input 
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="e.g. Nonprofit, Portfolio, Agency" 
                      value={form.organizationType} 
                      onChange={e => setForm(f => ({ ...f, organizationType: e.target.value }))} 
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                  <div className="relative">
                    <FiTag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="e.g. Inspiring Devotion" 
                      value={form.tagline} 
                      onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="e.g. info@temple.com" 
                        value={form.contactEmail} 
                        onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value }))} 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input 
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                        placeholder="e.g. +91 12345 67890" 
                        value={form.contactPhone} 
                        onChange={e => setForm(f => ({ ...f, contactPhone: e.target.value }))} 
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                      placeholder="e.g. 123 Temple St, Hyderabad" 
                      value={form.address} 
                      onChange={e => setForm(f => ({ ...f, address: e.target.value }))} 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Branding & Visuals */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Logo Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFile(e, 'logo')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <span className="text-primary-600 font-semibold">Upload Logo</span>
                        <p className="text-gray-500 text-sm">PNG, JPG up to 2MB</p>
                      </label>
                      {form.logo && (
                        <div className="mt-3">
                          <img src={fileToUrl(form.logo)} alt="Logo" className="w-20 h-20 mx-auto rounded object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Favicon Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                      <FiUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFile(e, 'favicon')}
                        className="hidden"
                        id="favicon-upload"
                      />
                      <label htmlFor="favicon-upload" className="cursor-pointer">
                        <span className="text-primary-600 font-semibold">Upload Favicon</span>
                        <p className="text-gray-500 text-sm">ICO, PNG 32x32px</p>
                      </label>
                      {form.favicon && (
                        <div className="mt-3">
                          <img src={fileToUrl(form.favicon)} alt="Favicon" className="w-8 h-8 mx-auto rounded" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                        className="w-12 h-12 rounded-xl border border-gray-300"
                      />
                      <input
                        type="text"
                        value={form.primaryColor}
                        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="#0ea5e9"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={form.secondaryColor}
                        onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                        className="w-12 h-12 rounded-xl border border-gray-300"
                      />
                      <input
                        type="text"
                        value={form.secondaryColor}
                        onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="#f0f9ff"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
                  <select
                    value={form.font}
                    onChange={e => setForm(f => ({ ...f, font: e.target.value }))}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Hero & Banner Images */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hero Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFile(e, 'heroImage')}
                      className="hidden"
                      id="hero-upload"
                    />
                    <label htmlFor="hero-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-semibold text-lg">Upload Hero Image</span>
                      <p className="text-gray-500">Main banner image for your homepage</p>
                      <p className="text-gray-400 text-sm">Recommended: 1920x1080px, JPG/PNG up to 5MB</p>
                    </label>
                    {form.heroImage && (
                      <div className="mt-4">
                        <img src={fileToUrl(form.heroImage)} alt="Hero" className="w-full max-w-md mx-auto rounded-xl object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleMultipleFiles(e, 'bannerImages')}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-semibold text-lg">Upload Banner Images</span>
                      <p className="text-gray-500">Additional banner images for carousel</p>
                      <p className="text-gray-400 text-sm">Multiple images supported</p>
                    </label>
                    {form.bannerImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {form.bannerImages.map((file, idx) => (
                          <img key={idx} src={fileToUrl(file)} alt={`Banner ${idx + 1}`} className="w-full h-24 rounded-xl object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Intro Text</label>
                  <textarea
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={4}
                    placeholder="Write a compelling introduction for your homepage..."
                    value={form.introText}
                    onChange={e => setForm(f => ({ ...f, introText: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Gallery & Media */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Photo Gallery</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleMultipleFiles(e, 'gallery')}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label htmlFor="gallery-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-semibold text-lg">Upload Gallery Images</span>
                      <p className="text-gray-500">Showcase your work or organization</p>
                      <p className="text-gray-400 text-sm">Multiple images supported, up to 20 images</p>
                    </label>
                    {form.gallery.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {form.gallery.map((file, idx) => (
                          <div key={idx} className="relative">
                            <img src={fileToUrl(file)} alt={`Gallery ${idx + 1}`} className="w-full h-24 rounded-xl object-cover" />
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }))}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Video URL (Optional)</label>
                  <div className="relative">
                    <FiVideo className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://youtube.com/watch?v=..."
                      value={form.video}
                      onChange={e => setForm(f => ({ ...f, video: e.target.value }))}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">YouTube, Vimeo, or direct video URL</p>
                </div>
              </div>
            )}

            {/* Step 4: About & Content */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">About Us</label>
                  <textarea
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={5}
                    placeholder="Tell your story, what you do, your values..."
                    value={form.about}
                    onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mission Statement</label>
                  <textarea
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={3}
                    placeholder="Your mission and goals..."
                    value={form.mission}
                    onChange={e => setForm(f => ({ ...f, mission: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">History/Background</label>
                  <textarea
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    rows={4}
                    placeholder="Your organization's history and background..."
                    value={form.history}
                    onChange={e => setForm(f => ({ ...f, history: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Team Members</label>
                  {form.team.map((member, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-xl">
                      <input
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Name"
                        value={member.name}
                        onChange={e => {
                          const newTeam = [...form.team];
                          newTeam[idx].name = e.target.value;
                          setForm(f => ({ ...f, team: newTeam }));
                        }}
                      />
                      <input
                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Role/Title"
                        value={member.role}
                        onChange={e => {
                          const newTeam = [...form.team];
                          newTeam[idx].role = e.target.value;
                          setForm(f => ({ ...f, team: newTeam }));
                        }}
                      />
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            const newTeam = [...form.team];
                            newTeam[idx].photo = file;
                            setForm(f => ({ ...f, team: newTeam }));
                          }}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {form.team.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, team: f.team.filter((_, i) => i !== idx) }))}
                            className="px-3 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, team: [...f.team, { name: '', role: '', photo: null }] }))}
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                  >
                    Add Team Member
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Services/Offerings */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">Services/Offerings</label>
                  {form.services.map((service, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 border border-gray-200 rounded-xl">
                      <div className="space-y-4">
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Service Name"
                          value={service.name}
                          onChange={e => {
                            const newServices = [...form.services];
                            newServices[idx].name = e.target.value;
                            setForm(f => ({ ...f, services: newServices }));
                          }}
                        />
                        <textarea
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          rows={3}
                          placeholder="Service Description"
                          value={service.description}
                          onChange={e => {
                            const newServices = [...form.services];
                            newServices[idx].description = e.target.value;
                            setForm(f => ({ ...f, services: newServices }));
                          }}
                        />
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Price (Optional)"
                          value={service.price}
                          onChange={e => {
                            const newServices = [...form.services];
                            newServices[idx].price = e.target.value;
                            setForm(f => ({ ...f, services: newServices }));
                          }}
                        />
                      </div>
                      <div className="space-y-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            const newServices = [...form.services];
                            newServices[idx].image = file;
                            setForm(f => ({ ...f, services: newServices }));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {service.image && (
                          <img src={fileToUrl(service.image)} alt="Service" className="w-full h-32 rounded-xl object-cover" />
                        )}
                        {form.services.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, services: f.services.filter((_, i) => i !== idx) }))}
                            className="w-full px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          >
                            Remove Service
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, services: [...f.services, { name: '', description: '', image: null, price: '' }] }))}
                    className="px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700"
                  >
                    Add Service
                  </button>
                </div>
              </div>
            )}

            {/* Step 6: Social Links */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Facebook URL</label>
                    <input
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://facebook.com/yourpage"
                      value={form.social.facebook}
                      onChange={e => setForm(f => ({ ...f, social: { ...f.social, facebook: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Instagram URL</label>
                    <input
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://instagram.com/youraccount"
                      value={form.social.instagram}
                      onChange={e => setForm(f => ({ ...f, social: { ...f.social, instagram: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Twitter URL</label>
                    <input
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://twitter.com/youraccount"
                      value={form.social.twitter}
                      onChange={e => setForm(f => ({ ...f, social: { ...f.social, twitter: e.target.value } }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube URL</label>
                    <input
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://youtube.com/yourchannel"
                      value={form.social.youtube}
                      onChange={e => setForm(f => ({ ...f, social: { ...f.social, youtube: e.target.value } }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
                    <input
                      className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://yourwebsite.com"
                      value={form.social.website}
                      onChange={e => setForm(f => ({ ...f, social: { ...f.social, website: e.target.value } }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Review & Publish */}
            {step === 7 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Domain Name</label>
                  <div className="flex items-center gap-2">
                    <input
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="yoursite"
                      value={form.domain}
                      onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                    />
                    <span className="text-gray-500 font-medium">.websitebuilder.com</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Choose a unique domain for your website</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Review Your Website</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Organization:</strong> {form.organizationName || 'Not set'}
                    </div>
                    <div>
                      <strong>Type:</strong> {form.organizationType || 'Not set'}
                    </div>
                    <div>
                      <strong>Email:</strong> {form.contactEmail || 'Not set'}
                    </div>
                    <div>
                      <strong>Phone:</strong> {form.contactPhone || 'Not set'}
                    </div>
                    <div>
                      <strong>Logo:</strong> {form.logo ? '✓ Uploaded' : 'Not uploaded'}
                    </div>
                    <div>
                      <strong>Hero Image:</strong> {form.heroImage ? '✓ Uploaded' : 'Not uploaded'}
                    </div>
                    <div>
                      <strong>Gallery:</strong> {form.gallery.length} images
                    </div>
                    <div>
                      <strong>Services:</strong> {form.services.length} services
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Ready to Publish?</h4>
                  <p className="text-blue-700 text-sm">Your website will be live at: <strong>{form.domain || 'yoursite'}.websitebuilder.com</strong></p>
                  <p className="text-blue-600 text-sm mt-2">You can make changes anytime after publishing.</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center px-8 py-6 bg-gray-50 border-t border-gray-100">
          <button
            type="button"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
          >
            {step === 0 ? 'Cancel' : <><FiChevronLeft className="w-4 h-4" /> Back</>}
          </button>
          
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Next <FiChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50"
              disabled={submitted}
            >
              {submitted ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-4 h-4" />
                  Publish
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 