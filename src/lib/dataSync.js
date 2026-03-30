import { supabase, hasSupabase } from './supabase'

export async function syncLeads(localLeads) {
  if (!hasSupabase) return localLeads;
  try {
    const { data } = await supabase.from('leads').select('*');
    if (!data) return localLeads;
    // Merge: keep local leads that don't exist in Supabase,
    // for matching IDs use the one with newer _updatedAt
    const merged = [...localLeads];
    data.forEach(remote => {
      const idx = merged.findIndex(l => l.id === remote.id);
      if (idx >= 0) {
        if ((remote.updated_at || 0) > (merged[idx]._updatedAt || 0)) {
          merged[idx] = { ...remote, _updatedAt: new Date(remote.updated_at).getTime() };
        }
      } else {
        merged.push({ ...remote, _updatedAt: new Date(remote.updated_at).getTime() });
      }
    });
    return merged;
  } catch (e) {
    console.warn('Lead sync failed:', e);
    return localLeads;
  }
}

export async function pushLead(lead) {
  if (!hasSupabase) return;
  try {
    await supabase.from('leads').upsert({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      level: lead.level,
      source: lead.source,
      car_id: lead.car,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (e) {
    console.warn('Push lead failed:', e);
  }
}

export async function syncBookings(localBookings) {
  if (!hasSupabase) return localBookings;
  try {
    const { data } = await supabase.from('bookings').select('*');
    if (!data) return localBookings;
    const merged = [...localBookings];
    data.forEach(remote => {
      const idx = merged.findIndex(b => b.id === remote.id || b.ref === remote.reference_number);
      if (idx < 0) {
        merged.push({ ...remote, ref: remote.reference_number });
      }
    });
    return merged;
  } catch (e) {
    console.warn('Booking sync failed:', e);
    return localBookings;
  }
}

export async function pushBooking(booking) {
  if (!hasSupabase) return;
  try {
    await supabase.from('bookings').upsert({
      id: booking.id,
      reference_number: booking.ref,
      car_id: booking.carId,
      status: booking.status || 'pending',
      down_payment: booking.downPayment,
      monthly_amount: booking.monthlyPayment,
      loan_term_months: booking.loanTermMonths || booking.loanTerm,
      interest_rate: booking.interestRate,
      created_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  } catch (e) {
    console.warn('Push booking failed:', e);
  }
}
