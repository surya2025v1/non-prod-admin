import { useState, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { FiChevronLeft, FiChevronRight, FiCheckCircle, FiUpload, FiTrash2, FiUser, FiMail, FiPhone, FiMapPin, FiTag, FiImage, FiVideo, FiGlobe } from 'react-icons/fi';
import { createOrUpdateWebsite, type WebsiteRequest, getCachedWebsites } from '../../utils/api';

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
  const [websiteId, setWebsiteId] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const initialFormRef = useRef<any>(null);

  // Helper to compare form states (shallow for primitives, deep for objects/arrays)
  function isFormDirty(current: any, initial: any) {
    return JSON.stringify(current) !== JSON.stringify(initial);
  }

  useEffect(() => {
    if (open) {
      setStep(stepIndex);
      setErrors({});
      if (editMode && website) {
        setWebsiteId(typeof website.id === 'number' ? website.id : 0);
        setForm({ ...defaultForm, ...website });
        initialFormRef.current = { ...defaultForm, ...website };
      } else {
        setWebsiteId(0);
        setForm(defaultForm);
        initialFormRef.current = defaultForm;
      }
    }
  }, [open, stepIndex, editMode, website]);

  if (!open) return null;

  // Validation function for step 0 (Organization Info)
  const validateStep0 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!form.organizationType.trim()) {
      newErrors.organizationType = 'Organization type is required';
    }
    
    if (!form.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    if (!form.contactPhone.trim()) {
      newErrors.contactPhone = 'Contact phone is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(form.contactPhone)) {
      newErrors.contactPhone = 'Please enter a valid phone number';
    }
    
    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function for step 2 (Hero & Banner)
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.introText.trim()) {
      newErrors.introText = 'Intro text is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function for step 4 (About & Contact)
  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.about.trim()) {
      newErrors.about = 'About section is required';
    }
    
    if (!form.mission.trim()) {
      newErrors.mission = 'Mission statement is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Convert form data to API format
  const getApiPayload = (): WebsiteRequest => {
    // On first step of create, always use id: 0
    let idToUse = websiteId;
    let domainToUse = form.domain;
    if (!editMode && step === 0) {
      idToUse = 0;
      // If organizationName is empty, use the same logic as UI for default name
      let orgName = form.organizationName && form.organizationName.trim();
      if (!orgName) {
        // Use the same logic as Dashboard: 'Website N'
        const cached = getCachedWebsites() || [];
        orgName = `Website ${cached.length + 1}`;
      }
      domainToUse = orgName.replace(/\s+/g, '').toLowerCase();
    }
    return {
      id: idToUse,
      name: form.organizationName || undefined,
      organization_name: form.organizationName || undefined,
      organization_type: form.organizationType || undefined,
      tagline: form.tagline || undefined,
      contact_email: form.contactEmail || undefined,
      contact_phone: form.contactPhone || undefined,
      address: form.address || undefined,
      primary_color: form.primaryColor || undefined,
      secondary_color: form.secondaryColor || undefined,
      font: form.font || undefined,
      intro_text: form.introText || undefined,
      video_youtube_link: form.video || undefined,
      about: form.about || undefined,
      mission: form.mission || undefined,
      history: form.history || undefined,
      domain: domainToUse || undefined,
      services_offerings: form.services.length > 0 ? form.services.map(service => ({
        name: service.name,
        description: service.description,
        price: service.price
      })) : undefined,
      team_members: form.team.length > 0 ? form.team.map(member => ({
        name: member.name,
        role: member.role
      })) : undefined,
      social_media_links: (form.social.facebook || form.social.instagram || form.social.twitter || form.social.youtube || form.social.website) ? form.social : undefined,
      page_no: 1
    };
  };

  // Handle step progression with API calls
  const handleNextStep = async () => {
    setLoading(true);
    
    try {
      // Validate required steps before proceeding
      if (step === 0 && !validateStep0()) {
        setLoading(false);
        return;
      }
      
      if (step === 2 && !validateStep2()) {
        setLoading(false);
        return;
      }
      
      if (step === 4 && !validateStep4()) {
        setLoading(false);
        return;
      }
      
      // Call API with current form data
      const payload = getApiPayload();
      // Update page number based on current step
      payload.page_no = step + 1;
      
      console.log('Calling API with payload:', payload);
      console.log('Edit mode:', editMode, 'Website ID:', websiteId);
      
      const response = await createOrUpdateWebsite(payload);
      console.log('API response:', response);
      
      if (response.success) {
        // Store website ID for subsequent API calls (only for create mode)
        if (!editMode && websiteId === 0) {
          setWebsiteId(response.website_id);
          console.log('New website created with ID:', response.website_id);
        }
        
        const nextStep = step + 1;
        setStep(nextStep);
        
        // Trigger callback for external handling
        if (onStepChange) {
          try {
            await onStepChange(nextStep);
          } catch (error) {
            console.error('Step change callback failed:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to call API:', error);
      // Show error to user
      setErrors({ api: 'Failed to save website data. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Handle final submit
  const handleSubmit = async () => {
    setLoading(true);
    setSubmitted(true);
    
    try {
      // Final API call with all data
      const payload = getApiPayload();
      // Set page_no to 8 for publish (completion)
      payload.page_no = 8;
      
      const response = await createOrUpdateWebsite(payload);
      
      if (response.success) {
        setTimeout(() => {
          setSubmitted(false);
          setLoading(false);
          onClose();
          onComplete?.();
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to submit website:', error);
      setErrors({ api: 'Failed to publish website. Please try again.' });
      setLoading(false);
      setSubmitted(false);
    }
  };

  // Handlers for file/image upload
  const handleFile = (e: ChangeEvent<HTMLInputElement>, key: keyof typeof form) => {
    const file = e.target.files?.[0] || null;
    setForm(f => ({ ...f, [key]: file }));
  };
  const handleMultipleFiles = (e: ChangeEvent<HTMLInputElement>, key: keyof typeof form) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setForm(f => ({ ...f, [key]: files }));
  };

  // Close handler with confirmation
  const handleClose = () => {
    if (isFormDirty(form, initialFormRef.current)) {
      setShowConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-2 md:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl relative animate-fadeIn overflow-hidden border border-gray-200/50 max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 px-4 md:px-8 py-4 md:py-6 flex-shrink-0">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-10 text-white hover:text-gray-200 text-xl font-bold focus:outline-none"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-16 h-16 md:w-32 md:h-32 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 md:w-16 md:h-16 bg-white rounded-full animate-bounce"></div>
          </div>
          
          <div className="relative">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-2">
              {editMode ? 'Edit Website' : 'Create New Website'}
            </h2>
            <p className="text-blue-100 text-sm md:text-base">{steps[step].name}</p>
            {websiteId > 0 && (
              <p className="text-blue-200 text-xs md:text-sm">Website ID: {websiteId}</p>
            )}
          </div>
        </div>

        {/* Step Indicator */}
        <div className="px-4 md:px-8 py-4 md:py-6 bg-gray-50 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((s, idx) => (
              <div key={s.name} className="flex items-center flex-shrink-0">
                <div className={`relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full transition-all duration-300 ${
                  idx < step ? 'bg-green-500 text-white' :
                  idx === step ? 'bg-primary-600 text-white' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  {idx < step ? <FiCheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : s.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-6 md:w-12 h-1 mx-1 md:mx-2 rounded transition-colors ${
                    idx < step ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 md:mt-4">
            <div className="text-xs md:text-sm text-gray-600">Step {step + 1} of {steps.length}</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-1.5 md:h-2 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errors.api && (
          <div className="mx-4 md:mx-8 mt-4 p-3 md:p-4 bg-red-50 border border-red-200 rounded-xl flex-shrink-0">
            <p className="text-red-600 text-xs md:text-sm">{errors.api}</p>
          </div>
        )}

        {/* Form Content - Scrollable */}
        <div className="px-4 md:px-8 py-4 md:py-6 overflow-y-auto flex-1">
          <form
            onSubmit={e => {
              e.preventDefault();
              if (step === steps.length - 1) handleSubmit();
              else handleNextStep();
            }}
          >
            {/* Step 0: Organization Info */}
            {step === 0 && (
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input 
                        className={`block w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                          errors.organizationName ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="e.g. Charan's Organization" 
                        value={form.organizationName} 
                        onChange={e => {
                          setForm(f => ({ ...f, organizationName: e.target.value }));
                          if (errors.organizationName) {
                            setErrors(prev => ({ ...prev, organizationName: '' }));
                          }
                        }}
                      />
                    </div>
                    {errors.organizationName && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">{errors.organizationName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                      Organization Type <span className="text-red-500">*</span>
                    </label>
                    <input 
                      className={`block w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.organizationType ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g. Nonprofit, Portfolio, Agency" 
                      value={form.organizationType} 
                      onChange={e => {
                        setForm(f => ({ ...f, organizationType: e.target.value }));
                        if (errors.organizationType) {
                          setErrors(prev => ({ ...prev, organizationType: '' }));
                        }
                      }}
                    />
                    {errors.organizationType && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">{errors.organizationType}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Tagline</label>
                  <input 
                    className="block w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white" 
                    placeholder="A short description of your organization" 
                    value={form.tagline} 
                    onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input 
                        type="email"
                        className={`block w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                          errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="contact@example.com" 
                        value={form.contactEmail} 
                        onChange={e => {
                          setForm(f => ({ ...f, contactEmail: e.target.value }));
                          if (errors.contactEmail) {
                            setErrors(prev => ({ ...prev, contactEmail: '' }));
                          }
                        }}
                      />
                    </div>
                    {errors.contactEmail && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                      <input 
                        className={`block w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white ${
                          errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="+1 (555) 123-4567" 
                        value={form.contactPhone} 
                        onChange={e => {
                          setForm(f => ({ ...f, contactPhone: e.target.value }));
                          if (errors.contactPhone) {
                            setErrors(prev => ({ ...prev, contactPhone: '' }));
                          }
                        }}
                      />
                    </div>
                    {errors.contactPhone && (
                      <p className="text-red-500 text-xs md:text-sm mt-1">{errors.contactPhone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                    <textarea 
                      rows={3}
                      className={`block w-full pl-8 md:pl-10 pr-4 py-2 md:py-3 border rounded-lg md:rounded-xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${
                        errors.address ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="123 Main St, City, State 12345" 
                      value={form.address} 
                      onChange={e => {
                        setForm(f => ({ ...f, address: e.target.value }));
                        if (errors.address) {
                          setErrors(prev => ({ ...prev, address: '' }));
                        }
                      }} 
                    />
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-xs md:text-sm mt-1">{errors.address}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Branding & Visuals */}
            {step === 1 && (
              <div className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Logo Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl p-4 md:p-6 text-center hover:border-primary-500 transition-colors">
                      <FiUpload className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFile(e, 'logo')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <span className="text-primary-600 font-semibold text-sm md:text-base">Upload Logo</span>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">PNG, JPG up to 10MB</p>
                      </label>
                      {form.logo && (
                        <div className="mt-3 md:mt-4">
                          <img src={fileToUrl(form.logo)} alt="Logo preview" className="h-16 md:h-20 mx-auto rounded" />
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, logo: null }))}
                            className="mt-2 text-red-500 text-xs md:text-sm hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Favicon Upload</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg md:rounded-xl p-4 md:p-6 text-center hover:border-primary-500 transition-colors">
                      <FiUpload className="mx-auto h-8 w-8 md:h-12 md:w-12 text-gray-400 mb-2 md:mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFile(e, 'favicon')}
                        className="hidden"
                        id="favicon-upload"
                      />
                      <label htmlFor="favicon-upload" className="cursor-pointer">
                        <span className="text-primary-600 font-semibold text-sm md:text-base">Upload Favicon</span>
                        <p className="text-gray-500 text-xs md:text-sm mt-1">ICO, PNG 32x32</p>
                      </label>
                      {form.favicon && (
                        <div className="mt-3 md:mt-4">
                          <img src={fileToUrl(form.favicon)} alt="Favicon preview" className="h-6 md:h-8 mx-auto rounded" />
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, favicon: null }))}
                            className="mt-2 text-red-500 text-xs md:text-sm hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center gap-2 md:gap-3">
                      <input
                        type="color"
                        value={form.primaryColor}
                        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.primaryColor}
                        onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                        className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base"
                        placeholder="#0ea5e9"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center gap-2 md:gap-3">
                      <input
                        type="color"
                        value={form.secondaryColor}
                        onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={form.secondaryColor}
                        onChange={e => setForm(f => ({ ...f, secondaryColor: e.target.value }))}
                        className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm md:text-base"
                        placeholder="#f0f9ff"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">Font</label>
                  <select
                    value={form.font}
                    onChange={e => setForm(f => ({ ...f, font: e.target.value }))}
                    className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm md:text-base"
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
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFile(e, 'heroImage')}
                      className="hidden"
                      id="hero-upload"
                    />
                    <label htmlFor="hero-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-semibold">Upload Hero Image</span>
                      <p className="text-gray-500 text-sm mt-1">Large banner image for your homepage</p>
                    </label>
                    {form.heroImage && (
                      <div className="mt-4">
                        <img src={fileToUrl(form.heroImage)} alt="Hero preview" className="max-h-40 mx-auto rounded-xl" />
                        <button
                          type="button"
                          onClick={() => setForm(f => ({ ...f, heroImage: null }))}
                          className="mt-2 text-red-500 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Banner Images</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleMultipleFiles(e, 'bannerImages')}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label htmlFor="banner-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-semibold">Upload Banner Images</span>
                      <p className="text-gray-500 text-sm mt-1">Multiple images for banners and sections</p>
                    </label>
                    {form.bannerImages.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {form.bannerImages.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={fileToUrl(img)} alt={`Banner ${idx + 1}`} className="h-20 w-full object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, bannerImages: f.bannerImages.filter((_, i) => i !== idx) }))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Intro Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all duration-200 ${
                      errors.introText ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Write a compelling introduction for your website..."
                    value={form.introText}
                    onChange={e => {
                      setForm(f => ({ ...f, introText: e.target.value }));
                      if (errors.introText) {
                        setErrors(prev => ({ ...prev, introText: '' }));
                      }
                    }}
                  />
                  {errors.introText && (
                    <p className="text-red-500 text-sm mt-1">{errors.introText}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Gallery & Media */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Photo Gallery</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary-500 transition-colors">
                    <FiImage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={e => handleMultipleFiles(e, 'gallery')}
                      className="hidden"
                      id="gallery-upload"
                    />
                    <label htmlFor="gallery-upload" className="cursor-pointer">
                      <span className="text-primary-600 font-semibold">Upload Gallery Images</span>
                      <p className="text-gray-500 text-sm mt-1">Multiple images for your photo gallery</p>
                    </label>
                    {form.gallery.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {form.gallery.map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={fileToUrl(img)} alt={`Gallery ${idx + 1}`} className="h-20 w-full object-cover rounded" />
                            <button
                              type="button"
                              onClick={() => setForm(f => ({ ...f, gallery: f.gallery.filter((_, i) => i !== idx) }))}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">YouTube Video Link</label>
                  <div className="relative">
                    <FiVideo className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://youtube.com/watch?v=..."
                      value={form.video}
                      onChange={e => setForm(f => ({ ...f, video: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: About & Content */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    About <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all duration-200 ${
                      errors.about ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Tell people about your organization..."
                    value={form.about}
                    onChange={e => {
                      setForm(f => ({ ...f, about: e.target.value }));
                      if (errors.about) {
                        setErrors(prev => ({ ...prev, about: '' }));
                      }
                    }}
                  />
                  {errors.about && (
                    <p className="text-red-500 text-sm mt-1">{errors.about}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mission <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none transition-all duration-200 ${
                      errors.mission ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="What is your organization's mission?"
                    value={form.mission}
                    onChange={e => {
                      setForm(f => ({ ...f, mission: e.target.value }));
                      if (errors.mission) {
                        setErrors(prev => ({ ...prev, mission: '' }));
                      }
                    }}
                  />
                  {errors.mission && (
                    <p className="text-red-500 text-sm mt-1">{errors.mission}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">History</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    placeholder="Share your organization's history and background..."
                    value={form.history}
                    onChange={e => setForm(f => ({ ...f, history: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Team Members</label>
                  {form.team.map((member, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Member Name"
                          value={member.name}
                          onChange={e => {
                            const newTeam = [...form.team];
                            newTeam[idx].name = e.target.value;
                            setForm(f => ({ ...f, team: newTeam }));
                          }}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Role/Position"
                          value={member.role}
                          onChange={e => {
                            const newTeam = [...form.team];
                            newTeam[idx].role = e.target.value;
                            setForm(f => ({ ...f, team: newTeam }));
                          }}
                        />
                      </div>
                      <div className="mt-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            const newTeam = [...form.team];
                            newTeam[idx].photo = file;
                            setForm(f => ({ ...f, team: newTeam }));
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        {member.photo && (
                          <img src={fileToUrl(member.photo)} alt="Team member" className="w-20 h-20 rounded-full object-cover mt-2" />
                        )}
                        {form.team.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, team: f.team.filter((_, i) => i !== idx) }))}
                            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                          >
                            Remove Member
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Services/Offerings</label>
                  {form.services.map((service, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-4 mb-4">
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Service Name"
                          value={service.name}
                          onChange={e => {
                            const newServices = [...form.services];
                            newServices[idx].name = e.target.value;
                            setForm(f => ({ ...f, services: newServices }));
                          }}
                        />
                        <textarea
                          rows={3}
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                          placeholder="Service Description"
                          value={service.description}
                          onChange={e => {
                            const newServices = [...form.services];
                            newServices[idx].description = e.target.value;
                            setForm(f => ({ ...f, services: newServices }));
                          }}
                        />
                        <input
                          className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Price (optional)"
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
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 md:px-8 py-4 md:py-6 bg-gray-50 border-t border-gray-100 space-y-3 sm:space-y-0 flex-shrink-0">
          <button
            type="button"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200 text-sm md:text-base"
            onClick={step === 0 ? onClose : () => setStep(s => s - 1)}
            disabled={loading}
          >
            {step === 0 ? 'Cancel' : <><FiChevronLeft className="w-3 h-3 md:w-4 md:h-4" /> Back</>}
          </button>
          
          {step < steps.length - 1 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:transform-none text-sm md:text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Next <FiChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 text-sm md:text-base"
              disabled={submitted || loading}
            >
              {submitted ? (
                <>
                  <svg className="animate-spin w-3 h-3 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                  Publish
                </>
              )}
            </button>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-gray-900/60">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-xs w-full">
              <h3 className="font-bold text-lg mb-2">Unsaved Changes</h3>
              <p className="text-gray-700 mb-4">You have unsaved changes. Are you sure you want to close?</p>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  onClick={() => { setShowConfirm(false); onClose(); }}
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 