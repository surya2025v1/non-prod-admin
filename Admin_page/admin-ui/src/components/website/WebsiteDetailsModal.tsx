import { FiX } from 'react-icons/fi';

interface Website {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
  organizationName?: string;
  organizationType?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  primaryColor?: string;
  secondaryColor?: string;
  font?: string;
  introText?: string;
  about?: string;
  mission?: string;
  history?: string;
  team?: { name: string; role: string }[];
  services?: { name: string; description: string; price: string }[];
  domain?: string;
}

interface WebsiteDetailsModalProps {
  open: boolean;
  onClose: () => void;
  website: Website | null;
}

export default function WebsiteDetailsModal({ open, onClose, website }: WebsiteDetailsModalProps) {
  if (!open || !website) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative animate-fadeIn overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Website Details</h2>
        <div className="divide-y divide-gray-200">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 py-2 text-black">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <dt className="font-semibold w-48">Name:</dt>
              <dd className="font-normal flex-1">{website.name}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <dt className="font-semibold w-48">Status:</dt>
              <dd className="font-normal flex-1">{website.status}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <dt className="font-semibold w-48">Last Updated:</dt>
              <dd className="font-normal flex-1">{website.lastUpdated}</dd>
            </div>
            {website.organizationName && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Organization Name:</dt>
                <dd className="font-normal flex-1">{website.organizationName}</dd>
              </div>
            )}
            {website.organizationType && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Organization Type:</dt>
                <dd className="font-normal flex-1">{website.organizationType}</dd>
              </div>
            )}
            {website.tagline && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Tagline:</dt>
                <dd className="font-normal flex-1">{website.tagline}</dd>
              </div>
            )}
            {website.contactEmail && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Contact Email:</dt>
                <dd className="font-normal flex-1">{website.contactEmail}</dd>
              </div>
            )}
            {website.contactPhone && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Contact Phone:</dt>
                <dd className="font-normal flex-1">{website.contactPhone}</dd>
              </div>
            )}
            {website.address && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Address:</dt>
                <dd className="font-normal flex-1">{website.address}</dd>
              </div>
            )}
            {website.primaryColor && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Primary Color:</dt>
                <dd className="font-normal flex-1 flex items-center gap-2"><span className="inline-block w-6 h-6 rounded-full border border-gray-300 align-middle" style={{ background: website.primaryColor }}></span> {website.primaryColor}</dd>
              </div>
            )}
            {website.secondaryColor && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Secondary Color:</dt>
                <dd className="font-normal flex-1 flex items-center gap-2"><span className="inline-block w-6 h-6 rounded-full border border-gray-300 align-middle" style={{ background: website.secondaryColor }}></span> {website.secondaryColor}</dd>
              </div>
            )}
            {website.font && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Font:</dt>
                <dd className="font-normal flex-1">{website.font}</dd>
              </div>
            )}
            {website.introText && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Intro Text:</dt>
                <dd className="font-normal flex-1">{website.introText}</dd>
              </div>
            )}
            {website.about && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">About:</dt>
                <dd className="font-normal flex-1">{website.about}</dd>
              </div>
            )}
            {website.mission && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Mission:</dt>
                <dd className="font-normal flex-1">{website.mission}</dd>
              </div>
            )}
            {website.history && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">History:</dt>
                <dd className="font-normal flex-1">{website.history}</dd>
              </div>
            )}
            {website.team && website.team.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <dt className="font-semibold w-48">Team:</dt>
                <dd className="font-normal flex-1">
                  <ul className="list-disc ml-6">
                    {website.team.map((m, i) => <li key={i}>{m.name} ({m.role})</li>)}
                  </ul>
                </dd>
              </div>
            )}
            {website.services && website.services.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <dt className="font-semibold w-48">Services:</dt>
                <dd className="font-normal flex-1">
                  <ul className="list-disc ml-6">
                    {website.services.map((s, i) => <li key={i}>{s.name} - {s.description} ({s.price})</li>)}
                  </ul>
                </dd>
              </div>
            )}
            {website.domain && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <dt className="font-semibold w-48">Domain:</dt>
                <dd className="font-normal flex-1">{website.domain}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
} 