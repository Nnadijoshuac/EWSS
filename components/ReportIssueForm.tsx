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

const REPORT_TYPES: Array<{ type: ReportType; label: string; emoji: string }> = [
  { type: 'no_access', label: 'No Water Access', emoji: '' },
  { type: 'dirty_water', label: 'Dirty Water', emoji: '' },
  { type: 'broken_pipe', label: 'Broken Pipe', emoji: '' },
  { type: 'dry_tap', label: 'Dry Tap', emoji: '' },
  { type: 'failed_delivery', label: 'Failed Delivery', emoji: '' },
  { type: 'overpricing', label: 'Overpricing', emoji: '' },
  { type: 'fake_tanker', label: 'Fake Tanker', emoji: '' },
  { type: 'unsafe_borehole', label: 'Unsafe Borehole', emoji: '' },
];

export default function ReportIssueForm({ onSubmit }: ReportIssueFormProps) {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [selectedArea, setSelectedArea] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high'>('medium');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedType || !selectedArea || !description) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit?.({
      type: selectedType,
      area: selectedArea,
      description,
      severity,
    });

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
      <div className="card bg-green-50 border-2 border-green-300 text-center">
        <p className="text-4xl mb-3"></p>
        <h3 className="heading-md text-green-800 m-0 mb-2">Report Submitted</h3>
        <p className="text-green-700 mb-4">
          Thank you for helping Enugu water services improve. We will review this within 24 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-secondary text-green-700 border-green-700 hover:bg-green-100"
        >
          Submit Another Report
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue Type */}
      <div>
        <label className="block text-sm font-bold text-water-900 mb-3">
          What's the issue?
        </label>

        <div className="grid grid-cols-2 gap-2">
          {REPORT_TYPES.map(({ type, label, emoji }) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`p-3 rounded-lg font-medium text-sm transition-all border-2 ${
                selectedType === type
                  ? 'bg-red-100 border-red-500 text-red-900 ring-2 ring-red-300'
                  : 'bg-white border-water-200 text-water-900 hover:border-water-400'
              }`}
            >
              <span className="text-lg block mb-1">{emoji}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-bold text-water-900 mb-2">
          Location
        </label>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="input-field"
          required
        >
          <option value="">Select your area</option>
          {ENUGU_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-bold text-water-900 mb-2">
          How urgent is this?
        </label>
        <div className="flex gap-2">
          {(['low', 'medium', 'high'] as const).map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverity(sev)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all ${
                severity === sev
                  ? 'bg-water-600 text-white'
                  : 'bg-white border-2 border-water-200 text-water-900'
              }`}
            >
              {sev === 'low' && ' Low'}
              {sev === 'medium' && ' Medium'}
              {sev === 'high' && ' High'}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-water-900 mb-2">
          Tell us more
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the issue in detail..."
          className="input-field resize-none"
          rows={4}
          required
        />
      </div>

      {/* Submit */}
      <button type="submit" className="btn-primary w-full">
        Submit Report
      </button>
    </form>
  );
}
