'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import TopNav from '@/components/TopNav';

type ResidentSettings = {
  name: string;
  phone: string;
  area: string;
  preferredQuantity: string;
  deliveryUpdates: boolean;
  communityAlerts: boolean;
  applySubsidy: boolean;
  savedPlaces: string[];
};

const SETTINGS_KEY = 'vale:resident-settings';
const defaultSettings: ResidentSettings = {
  name: 'Joshua Nnadi',
  phone: '+234 803 555 0142',
  area: 'New Haven',
  preferredQuantity: '5000',
  deliveryUpdates: true,
  communityAlerts: true,
  applySubsidy: true,
  savedPlaces: ['Home · 12 Chime Avenue', 'Office · Independence Layout'],
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<ResidentSettings>(defaultSettings);
  const [newPlace, setNewPlace] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const value = window.localStorage.getItem(SETTINGS_KEY);
      if (value) setSettings({ ...defaultSettings, ...(JSON.parse(value) as ResidentSettings) });
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const saveSettings = () => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const addPlace = () => {
    const place = newPlace.trim();
    if (!place) return;
    setSettings((current) => ({ ...current, savedPlaces: [...current.savedPlaces, place] }));
    setNewPlace('');
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav currentRole="resident" onRoleChange={() => {}} showRoleSwitcher={false} />

      <main className="mx-auto w-full max-w-[1200px] px-3 pb-28 pt-24 sm:px-6 sm:pt-28 lg:px-8">
        <header className="border-b border-[#d8d8d8] pb-10">
          <p className="text-sm text-[#5e5e5e]">Your Vale account</p>
          <h1 className="mt-2 text-4xl font-normal leading-[1.1] tracking-[-0.035em] sm:text-[52px]">Profile and settings</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[#5e5e5e] sm:text-base">Set your defaults once so future water orders take fewer taps.</p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-lg border border-[#d8d8d8] p-5 sm:p-7">
              <div className="mb-6">
                <p className="text-sm text-[#5e5e5e]">Identity</p>
                <h2 className="mt-1 text-2xl font-normal tracking-[-0.02em]">Profile</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={settings.name} onChange={(name) => setSettings({ ...settings, name })} />
                <Field label="Phone number" value={settings.phone} onChange={(phone) => setSettings({ ...settings, phone })} />
                <Field label="Primary area" value={settings.area} onChange={(area) => setSettings({ ...settings, area })} />
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Usual order size</span>
                  <select
                    value={settings.preferredQuantity}
                    onChange={(event) => setSettings({ ...settings, preferredQuantity: event.target.value })}
                    className="input-field"
                  >
                    <option value="2500">2,500 litres</option>
                    <option value="5000">5,000 litres</option>
                    <option value="10000">10,000 litres</option>
                  </select>
                </label>
              </div>
            </section>

            <section className="rounded-lg border border-[#d8d8d8] p-5 sm:p-7">
              <div className="mb-5">
                <p className="text-sm text-[#5e5e5e]">Fewer decisions</p>
                <h2 className="mt-1 text-2xl font-normal tracking-[-0.02em]">Order preferences</h2>
              </div>
              <div className="divide-y divide-[#d8d8d8]">
                <ToggleRow
                  label="Delivery updates"
                  description="Receive status changes and arrival alerts."
                  checked={settings.deliveryUpdates}
                  onChange={(deliveryUpdates) => setSettings({ ...settings, deliveryUpdates })}
                />
                <ToggleRow
                  label="Community water alerts"
                  description="Hear about verified outages and access issues nearby."
                  checked={settings.communityAlerts}
                  onChange={(communityAlerts) => setSettings({ ...settings, communityAlerts })}
                />
                <ToggleRow
                  label="Apply eligible subsidy automatically"
                  description="Use available support before calculating your final price."
                  checked={settings.applySubsidy}
                  onChange={(applySubsidy) => setSettings({ ...settings, applySubsidy })}
                />
              </div>
            </section>

            <section className="rounded-lg border border-[#d8d8d8] p-5 sm:p-7">
              <div className="mb-5">
                <p className="text-sm text-[#5e5e5e]">One-tap destinations</p>
                <h2 className="mt-1 text-2xl font-normal tracking-[-0.02em]">Saved places</h2>
              </div>
              <div className="space-y-2">
                {settings.savedPlaces.map((place) => (
                  <div key={place} className="flex items-center justify-between gap-4 rounded-lg bg-[#f6f6f6] p-4">
                    <p className="min-w-0 truncate text-sm font-medium">{place}</p>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, savedPlaces: settings.savedPlaces.filter((item) => item !== place) })}
                      className="shrink-0 text-xs underline underline-offset-4"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  value={newPlace}
                  onChange={(event) => setNewPlace(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && addPlace()}
                  placeholder="Label · Street or landmark"
                  className="input-field min-w-0 flex-1"
                />
                <button type="button" onClick={addPlace} className="btn-secondary shrink-0">Add place</button>
              </div>
            </section>

            <button type="button" onClick={saveSettings} className="btn-primary w-full sm:w-auto">
              {saved ? 'Settings saved' : 'Save settings'}
            </button>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-lg bg-black p-6 text-white">
              <p className="text-sm text-[#afafaf]">Water reliability profile</p>
              <div className="mt-4 flex items-end justify-between gap-4">
                <p className="text-5xl font-normal tracking-[-0.04em]">82</p>
                <p className="pb-1 text-sm text-[#afafaf]">Strong standing</p>
              </div>
              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#333333]">
                <div className="h-full w-[82%] rounded-full bg-white" />
              </div>
              <p className="mt-4 text-sm leading-6 text-[#afafaf]">Built from completed deliveries, timely confirmations, and useful issue reports—not spending.</p>
            </section>

            <section className="rounded-lg bg-[#f6f6f6] p-6">
              <p className="text-sm text-[#5e5e5e]">Your impact</p>
              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-[#d8d8d8]">
                <ImpactMetric value="12" label="Deliveries" />
                <ImpactMetric value="₦18K" label="Subsidy saved" />
                <ImpactMetric value="4" label="Reports resolved" />
                <ImpactMetric value="3" label="Reliable months" />
              </div>
              <p className="mt-5 text-sm leading-6 text-[#5e5e5e]">Two more completed deliveries move your profile into the Excellent reliability tier.</p>
            </section>

            <section className="rounded-lg border border-[#d8d8d8] p-6">
              <p className="font-medium">Work with Vale</p>
              <p className="mt-2 text-sm leading-6 text-[#5e5e5e]">Manage a tanker or review water operations through the professional portals.</p>
              <div className="mt-4 flex gap-4 text-sm font-medium">
                <Link href="/supplier" className="underline underline-offset-4">Supplier</Link>
                <Link href="/admin" className="underline underline-offset-4">Admin</Link>
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="input-field" />
    </label>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 py-4 first:pt-0 last:pb-0">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[#5e5e5e]">{description}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 shrink-0 accent-black" />
    </label>
  );
}

function ImpactMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white p-4">
      <p className="text-2xl font-normal tracking-[-0.03em]">{value}</p>
      <p className="mt-1 text-xs text-[#5e5e5e]">{label}</p>
    </div>
  );
}

