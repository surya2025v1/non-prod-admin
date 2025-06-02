import { FiX, FiTrash2 } from 'react-icons/fi';

interface Website {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
}

interface DeleteWebsiteModalProps {
  open: boolean;
  onClose: () => void;
  website: Website | null;
  onDelete: (website: Website) => void;
}

export default function DeleteWebsiteModal({ open, onClose, website, onDelete }: DeleteWebsiteModalProps) {
  if (!open || !website) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX size={20} />
        </button>
        <div className="flex flex-col items-center">
          <FiTrash2 className="text-red-500 text-4xl mb-2" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Website?</h2>
          <p className="text-gray-600 mb-6 text-center">Are you sure you want to delete <b>{website.name}</b>? This action cannot be undone.</p>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              onClick={() => onDelete(website)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 