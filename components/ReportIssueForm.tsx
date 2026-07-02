'use client';

import { useState } from 'react';
import { ReportType, WaterReport, VerificationStatus } from '@/lib/types';
import { ENUGU_AREAS } from '@/lib/mock-data';
import { useAuth } from '@/lib/auth-context';

interface ReportIssueFormProps {
  onSubmit?: (report: WaterReport) => void;
}

const reportTypes: Array<{ type: ReportType; label: string }> = [
  { type: 'no_access', label: 'No access' },
  { type: 'dirty_water', label: 'Dirty water' },
  { type: 'broken_pipe', label: 'Broken pipe' },
  { type: 'dry_tap', label: 'Dry tap' },
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
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successData, setSuccessData] = useState<{ points: number; verification: VerificationStatus; confidence: number } | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    updateUser({
      ...user,
      points: user.points + pointsAwarded,
      reportCount: user.reportCount + 1,
      verifiedReportCount: user.verifiedReportCount + (verificationStatus === 'verified' ? 1 : 0),
    });

    setSuccessData({ points: pointsAwarded, verification: verificationStatus, confidence });
    setSubmitted(true);
    setSubmitting(false);

    setTimeout(() => {
      setSelectedType(null);
      setSelectedArea('');
      setDescription('');
      setPhotoUrl('');
      setSeverity('medium');
      setSubmitted(false);
      setSuccessData(null);
    }, 3000);
  };

  if (submitted && successData) {
    return (
      <div className="rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center border border-green-200">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="text-2xl font-bold text-green-900">Report Submitted!</h3>

        <div className="mt-6 space-y-3">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">Points Earned</p>
            <p className="text-3xl font-bold text-green-600">+{successData.points}</p>
          </div>

          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600">AI Verification</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{successData.verification}</p>
            <p className="text-sm text-gray-500">{Math.round(successData.confidence * 100)}% confidence</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-green-700">
          Government team will review and take action
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-secondary mt-5">
          Submit another report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-3 block text-sm font-medium text-black">What happened?</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {reportTypes.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`min-h-14 rounded-lg border px-3 text-sm font-medium transition ${
                selectedType === type
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-[#d8d8d8] bg-white text-[#5e5e5e] hover:border-blue-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-black">Location</span>
        <select value={selectedArea} onChange={(event) => setSelectedArea(event.target.value)} className="input-field" required>
          <option value="">Select your area</option>
          {ENUGU_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </label>

      <div>
        <label className="mb-2 block text-sm font-medium text-black">Urgency</label>
        <div className="grid grid-cols-3 gap-2">
          {(['low', 'medium', 'high'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSeverity(item)}
              className={`h-12 rounded-lg border text-sm font-medium capitalize ${
                severity === item
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-[#d8d8d8] bg-white text-[#5e5e5e]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-black">Details</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the issue clearly..."
          className="input-field min-h-32 resize-none"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-black">Photo (optional)</span>
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="input-field" />
        {photoUrl && <img src={photoUrl} alt="Preview" className="mt-3 h-40 w-full rounded-lg object-cover" />}
      </label>

      <button type="submit" disabled={submitting} className="btn-primary h-12 w-full disabled:opacity-50">
        {submitting ? 'Submitting...' : 'Submit report'}
      </button>
    </form>
  );
}
