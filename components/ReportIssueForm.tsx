'use client';

import { useState } from 'react';
import { ReportType } from '@/lib/types';
import { ENUGU_AREAS } from '@/lib/mock-data';

interface ReportIssueFormProps {
  onSubmit?: (report: {
    type: ReportType;
    area: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
  }) => void;
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

export default function ReportIssueForm({ onSubmit }: ReportIssueFormProps) {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedType || !selectedArea || !description) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit?.({ type: selectedType, area: selectedArea, description, severity });
    setSubmitted(true);

    setTimeout(() => {
      setSelectedType(null);
      setSelectedArea('');
      setDescription('');
      setSeverity('medium');
      setSubmitted(false);
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="rounded-lg bg-[#f6f6f6] p-6 text-center sm:p-8">
        <h3 className="text-2xl font-normal text-black">Report submitted</h3>
        <p className="mt-2 text-sm text-[#5e5e5e]">
          Thanks. We will review this within 24 hours.
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
                  ? 'border-black bg-black text-white'
                  : 'border-[#d8d8d8] bg-white text-[#5e5e5e] hover:border-black'
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
                  ? 'border-black bg-black text-white'
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

      <button type="submit" className="btn-primary h-12 w-full">
        Submit report
      </button>
    </form>
  );
}
