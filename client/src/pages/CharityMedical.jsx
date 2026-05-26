import {
  Accessibility,
  Activity,
  BedDouble,
  HeartHandshake,
  HeartPulse,
  PhoneCall,
  Send,
  ShieldAlert
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { equipment as demoEquipment } from '../data/demoData';
import { api } from '../lib/api';

const equipmentIcons = {
  'medical-bed': BedDouble,
  wheelchair: Accessibility,
  nebulizer: Activity,
  'oxygen-concentrator': HeartPulse,
  other: HeartHandshake
};

export default function CharityMedical() {
  const { token, isAuthenticated } = useAuth();
  const [equipment, setEquipment] = useState(demoEquipment);
  const [selected, setSelected] = useState(demoEquipment[0]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    patientName: '',
    phone: '',
    address: '',
    reason: '',
    urgency: 'normal'
  });

  useEffect(() => {
    api
      .get('/equipment')
      .then((result) => {
        setEquipment(result.equipment);
        setSelected(result.equipment[0] || null);
      })
      .catch(() => {
        setEquipment(demoEquipment);
        setSelected(demoEquipment[0]);
      });
  }, []);

  const emergencyReady = useMemo(
    () => equipment.filter((item) => item.isEmergencyReady && item.availableUnits > 0),
    [equipment]
  );

  const submitRequest = async (event) => {
    event.preventDefault();

    if (!selected) return;
    if (!isAuthenticated) {
      setMessage('Please login as a member to submit a support request.');
      return;
    }

    try {
      await api.post(`/equipment/${selected._id}/request`, form, { token });
      setMessage(`${selected.name} request submitted for admin review.`);
      setForm({ patientName: '', phone: '', address: '', reason: '', urgency: 'normal' });
    } catch (error) {
      setMessage(error.message || 'Request could not be submitted.');
    }
  };

  return (
    <PageShell
      eyebrow="Charity & Medical Support"
      title="Medical equipment availability, requests, and emergency coordination"
      description="Members can request medical beds, wheelchairs, nebulizers, oxygen concentrators, and urgent support through a transparent admin-managed workflow."
    >
      <section className="container-shell pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 dark:border-rose-400/20 dark:bg-rose-400/10">
                <ShieldAlert className="text-rose-700 dark:text-rose-200" size={24} />
                <p className="mt-3 text-2xl font-black text-rose-900 dark:text-rose-100">
                  {emergencyReady.length}
                </p>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-200/80">
                  Emergency-ready items
                </p>
              </div>
              <div className="rounded-lg border border-teal-200 bg-teal-50 p-5 dark:border-teal-400/20 dark:bg-teal-400/10">
                <HeartHandshake className="text-teal-700 dark:text-teal-200" size={24} />
                <p className="mt-3 text-2xl font-black text-teal-900 dark:text-teal-100">
                  {equipment.reduce((sum, item) => sum + item.availableUnits, 0)}
                </p>
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-200/80">
                  Units available
                </p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 dark:border-amber-400/20 dark:bg-amber-400/10">
                <PhoneCall className="text-amber-700 dark:text-amber-200" size={24} />
                <p className="mt-3 text-2xl font-black text-amber-900 dark:text-amber-100">24/7</p>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-200/80">
                  Emergency contact
                </p>
              </div>
            </div>

            {message && (
              <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-200">
                {message}
              </div>
            )}

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {equipment.map((item) => {
                const Icon = equipmentIcons[item.type] || HeartHandshake;
                const isActive = selected?._id === item._id;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className={`surface-card text-left ${
                      isActive ? 'ring-4 ring-teal-200 dark:ring-teal-500/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
                        <Icon size={23} />
                      </div>
                      <StatusBadge tone={item.availableUnits > 0 ? 'success' : 'danger'}>
                        {item.availableUnits}/{item.totalUnits}
                      </StatusBadge>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-slate-950 dark:text-white">{item.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge tone="neutral">{item.condition}</StatusBadge>
                      {item.isEmergencyReady && <StatusBadge tone="danger">Emergency ready</StatusBadge>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
            <form onSubmit={submitRequest} className="surface-card">
              <SectionHeader
                eyebrow="Request support"
                title={selected ? selected.name : 'Select equipment'}
                description="Requests go to the admin dashboard for verification, issue tracking, and return updates."
              />
              <div className="mt-5 grid gap-3">
                <input
                  className="input-field"
                  placeholder="Patient name"
                  value={form.patientName}
                  onChange={(event) => setForm({ ...form, patientName: event.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Contact phone"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
                <textarea
                  className="input-field min-h-24"
                  placeholder="Address"
                  value={form.address}
                  onChange={(event) => setForm({ ...form, address: event.target.value })}
                />
                <textarea
                  className="input-field min-h-24"
                  placeholder="Reason"
                  value={form.reason}
                  onChange={(event) => setForm({ ...form, reason: event.target.value })}
                />
                <select
                  className="input-field"
                  value={form.urgency}
                  onChange={(event) => setForm({ ...form, urgency: event.target.value })}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
                <button type="submit" className="btn-primary" disabled={!selected}>
                  <Send size={18} />
                  Submit Request
                </button>
              </div>
            </form>

            <div className="rounded-lg border border-rose-200 bg-rose-50 p-5 dark:border-rose-400/20 dark:bg-rose-400/10">
              <div className="flex items-center gap-3 text-rose-800 dark:text-rose-200">
                <ShieldAlert size={22} />
                <h2 className="font-black">Emergency desk</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-rose-700 dark:text-rose-200/80">
                For immediate medical support, call +91 98765 43210 and submit an emergency request
                for tracking.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
