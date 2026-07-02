'use client';

import { useState, useRef } from 'react';
import { ReportType, WaterReport, VerificationStatus } from '@/lib/types';
import { ENUGU_AREAS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';
import { checkBadges } from '@/lib/badges';

interface ReportIssueFormProps {
  onSubmit?: (report: WaterReport) => void;
}

const reportTypes: Array<{ type: ReportType; label: string }> = [
  { type: 'broken_pipe', label: 'Broken pipe' },
  { type: 'dry_tap', label: 'Dry tap' },
  { type: 'dirty_water', label: 'Dirty water' },
  { type: 'no_access', label: 'No access' },
  { type: 'failed_delivery', label: 'Failed delivery' },
  { type: 'overpricing', label: 'Overpricing' },
  { type: 'fake_tanker', label: 'Fake tanker' },
  { type: 'unsafe_borehole', label: 'Unsafe borehole' },
];

const aiVerify = (type: ReportType): { status: VerificationStatus; confidence: number } => {
  const confidenceMap: Record<ReportType, number> = {
    broken_pipe: 0.96,
    dry_tap: 0.89,
    dirty_water: 0.92,
    no_access: 0.85,
    failed_delivery: 0.78,
    overpricing: 0.65,
    fake_tanker: 0.88,
    unsafe_borehole: 0.91,
  };
  const confidence = confidenceMap[type];
  const status = confidence > 0.8 ? 'verified' : 'pending';
  return { status, confidence };
};

export default function ReportIssueForm({ onSubmit }: ReportIssueFormProps) {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('high');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successData, setSuccessData] = useState<{ points: number } | null>(null);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedType || !selectedArea || !description) {
      alert('Please fill in all fields');
      return;
    }

    if (!user) {
      alert('You must be logged in to submit a report');
      return;
    }

    setSubmitting(true);

    const { status: verificationStatus, confidence } = aiVerify(selectedType);
    const pointsAwarded = verificationStatus === 'verified' ? 10 : 5;

    const report: WaterReport = {
      id: `report-${Date.now()}`,
      reporterId: user.id,
      type: selectedType,
      area: selectedArea,
      description,
      severity,
      status: 'reported',
      createdAt: new Date().toISOString(),
      photoUrl: photoUrl || undefined,
      aiVerificationStatus: verificationStatus,
      aiConfidence: confidence,
      pointsAwarded,
    };

    onSubmit?.(report);

    const updatedUser = {
      ...user,
      points: user.points + pointsAwarded,
      reportCount: user.reportCount + 1,
      verifiedReportCount: user.verifiedReportCount + (verificationStatus === 'verified' ? 1 : 0),
    };

    checkBadges(updatedUser);
    updateUser(updatedUser);

    setSuccessData({ points: pointsAwarded });
    setSubmitted(true);
    setSubmitting(false);

    setTimeout(() => {
      setSelectedType(null);
      setSelectedArea('');
      setDescription('');
      setPhotoUrl('');
      setSeverity('high');
      setSubmitted(false);
      setSuccessData(null);
    }, 2500);
  };

  if (submitted && successData) {
    return (
      <div className="text-center">
        <div className="text-6xl mb-4">✓</div>
        <h3 className="text-2xl font-normal text-black mb-2">Report submitted</h3>
        <p className="text-sm text-[#5e5e5e] mb-6">+{successData.points} points earned</p>
        <button onClick={() => setSubmitted(false)} className="text-sm font-medium text-[#FF7B68] hover:text-[#ff6a52] transition">
          Submit another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Camera First - Hero Action */}
      <div>
        <label className="block mb-3">
          <div
            className="border-2 border-dashed border-[#d8d8d8] rounded-lg p-8 text-center cursor-pointer hover:border-[#FF7B68] transition"
            onClick={() => cameraInputRef.current?.click()}
          >
            {photoUrl ? (
              <>
                <img src={photoUrl} alt="Report" className="w-full h-40 object-cover rounded mb-3" />
                <p className="text-sm text-[#5e5e5e]">Tap to retake photo</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">📷</div>
                <p className="font-medium text-black">Take a photo</p>
                <p className="text-xs text-[#5e5e5e] mt-1">or tap to open camera</p>
              </>
            )}
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />
        </label>
      </div>

      {/* Issue Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-black">What happened?</label>
        <div className="grid grid-cols-2 gap-2">
          {reportTypes.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`min-h-12 rounded border px-3 text-sm font-medium transition ${
                selectedType === type
                  ? 'border-[#FF7B68] bg-[#FF7B68] text-white'
                  : 'border-[#d8d8d8] bg-white text-black hover:border-[#FF7B68]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-black">Location</span>
        <select
          value={selectedArea}
          onChange={(event) => setSelectedArea(event.target.value)}
          className="input-field"
          required
        >
          <option value="">Select your area</option>
          {ENUGU_AREAS.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </label>


      {/* Description */}
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-black">Details</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What's the problem?"
          className="input-field min-h-24 resize-none"
          required
        />
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#FF7B68] text-white h-12 rounded font-medium hover:bg-[#ff6a52] transition disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit report'}
      </button>
    </form>
  );
}
