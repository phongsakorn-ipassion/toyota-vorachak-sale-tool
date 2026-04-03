import { supabase, hasSupabase } from './supabase';

// ============================================================================
// Generic bidirectional sync: timestamp-wins merge strategy
// ============================================================================

export async function syncTable({ tableName, localData, mapToRemote, mapToLocal, idField = 'id' }) {
  if (!hasSupabase) return { data: localData, pushed: 0, pulled: 0 };

  try {
    // 1. Fetch all remote records
    const { data: remoteData, error } = await supabase
      .from(tableName)
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;

    // 2. Build lookup maps
    const remoteMap = new Map();
    (remoteData || []).forEach(r => remoteMap.set(r[idField] || r.id, r));

    const localMap = new Map();
    localData.forEach(l => localMap.set(l[idField] || l.id, l));

    // 3. Merge: newer timestamp wins
    const merged = [];
    const toPush = []; // local records newer than remote (or not in remote)
    let pulled = 0;

    // Process all local records
    for (const local of localData) {
      const localId = local[idField] || local.id;
      const remote = remoteMap.get(localId);

      if (!remote) {
        // Local only — push to Supabase
        merged.push(local);
        toPush.push(local);
      } else {
        const localTs = local._updatedAt || 0;
        const remoteTs = new Date(remote.updated_at || 0).getTime();

        if (localTs >= remoteTs) {
          // Local is newer or same — keep local, push to Supabase
          merged.push(local);
          if (localTs > remoteTs) toPush.push(local);
        } else {
          // Remote is newer — use remote
          merged.push(mapToLocal(remote));
          pulled++;
        }
      }
      remoteMap.delete(localId);
    }

    // Process remote-only records (not in local)
    for (const [, remote] of remoteMap) {
      merged.push(mapToLocal(remote));
      pulled++;
    }

    // 4. Push local-newer records to Supabase
    if (toPush.length > 0) {
      const remoteRecords = toPush.map(mapToRemote).filter(Boolean);
      if (remoteRecords.length > 0) {
        const { error: upsertError } = await supabase
          .from(tableName)
          .upsert(remoteRecords, { onConflict: idField || 'id' });
        if (upsertError) console.warn(`Sync push ${tableName} error:`, upsertError);
      }
    }

    return { data: merged, pushed: toPush.length, pulled };
  } catch (e) {
    console.warn(`Sync ${tableName} failed:`, e);
    return { data: localData, pushed: 0, pulled: 0 };
  }
}

// ============================================================================
// Push a single record to Supabase
// ============================================================================

export async function pushRecord(tableName, record, mapToRemote) {
  if (!hasSupabase || !record) return false;
  try {
    const remoteRecord = mapToRemote(record);
    const { error } = await supabase
      .from(tableName)
      .upsert(remoteRecord, { onConflict: 'id' });
    if (error) {
      console.warn(`Push ${tableName} error:`, error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`Push ${tableName} failed:`, e);
    return false;
  }
}

// ============================================================================
// Delete a record from Supabase
// ============================================================================

export async function deleteRecord(tableName, id) {
  if (!hasSupabase || !id) return false;
  try {
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    return !error;
  } catch { return false; }
}

// ============================================================================
// LEAD MAPPERS
// ============================================================================

export function leadToRemote(lead) {
  return {
    id: lead.id,
    name: lead.name || '',
    phone: lead.phone || '',
    email: lead.email || '',
    initial: lead.init || (lead.name ? lead.name[0] : ''),
    avatar_color: lead.color || '#1B7A3F',
    level: lead.stage || lead.level || 'new_lead', // backward compat: write stage value to level column too
    stage: lead.stage || 'new_lead',
    source: lead.source || '',
    car_id: lead.car || null,
    branch_id: lead.branchId || null,
    assigned_to: lead.assignedTo || null,
    created_by: lead.createdBy || null,
    notes: lead.notes || '',
    lead_type: lead.leadType || 'purchase',
    selected_color: lead.selectedColor || null,
    service_center: lead.serviceCenter || null,
    province: lead.province || null,
    service_date: lead.serviceDate || null,
    service_time: lead.serviceTime || null,
    line_id: lead.lineId || null,
    test_drive_date: lead.testDriveDate || null,
    test_drive_time: lead.testDriveTime || null,
    test_drive_status: lead.testDriveStatus || null,
    selected_grade: lead.selectedGrade || null,
    activities: JSON.stringify(lead.activities || []),
    updated_at: new Date(lead._updatedAt || Date.now()).toISOString(),
    created_at: lead.createdAt || new Date().toISOString(),
  };
}

export function remoteToLead(remote) {
  let activities = [];
  try {
    activities = typeof remote.activities === 'string'
      ? JSON.parse(remote.activities)
      : (remote.activities || []);
  } catch { /* ignore parse errors */ }

  return {
    id: remote.id,
    name: remote.name || '',
    init: remote.initial || (remote.name ? remote.name[0] : ''),
    color: remote.avatar_color || '#1B7A3F',
    stage: remote.stage || remote.level || 'new_lead', // prefer stage column, fallback to level for backward compat
    source: remote.source || '',
    car: remote.car_id || null,
    phone: remote.phone || '',
    email: remote.email || '',
    notes: remote.notes || '',
    branchId: remote.branch_id || null,
    assignedTo: remote.assigned_to || null,
    createdBy: remote.created_by || null,
    leadType: remote.lead_type || 'purchase',
    selectedColor: remote.selected_color || null,
    serviceCenter: remote.service_center || null,
    province: remote.province || null,
    serviceDate: remote.service_date || null,
    serviceTime: remote.service_time || null,
    lineId: remote.line_id || null,
    testDriveDate: remote.test_drive_date || null,
    testDriveTime: remote.test_drive_time || null,
    testDriveStatus: remote.test_drive_status || null,
    selectedGrade: remote.selected_grade || null,
    activities,
    createdAt: remote.created_at || new Date().toISOString(),
    _updatedAt: new Date(remote.updated_at || 0).getTime(),
  };
}

// ============================================================================
// BOOKING MAPPERS
// ============================================================================

export function bookingToRemote(booking) {
  return {
    id: booking.id,
    reference_number: booking.ref || '',
    lead_id: booking.leadId || null,
    car_id: booking.carId || null,
    branch_id: booking.branchId || null,
    salesperson_id: booking.salespersonId || null,
    booking_date: booking.createdAt || new Date().toISOString(),
    down_payment: booking.downPayment || 0,
    loan_amount: booking.loanAmount || 0,
    loan_term_months: booking.loanTermMonths || booking.loanTerm || 60,
    interest_rate: booking.interestRate || 2.49,
    monthly_amount: booking.monthlyPayment || 0,
    payment_method: booking.paymentMethod || 'installment',
    status: booking.status || 'pending',
    customer_name: booking.customerName || '',
    customer_phone: booking.customerPhone || '',
    customer_email: booking.customerEmail || '',
    color: booking.selectedColor || booking.color || 'Pearl White',
    selected_grade: booking.selectedGrade || booking.gradeId || null,
    grade_name: booking.gradeName || null,
    delivery_date: booking.deliveryDate || null,
    car_name: booking.carName || '',
    car_price: booking.carPrice || 0,
    down_payment_pct: booking.downPaymentPct || 15,
    customer_info: JSON.stringify(booking.customerInfo || {}),
    updated_at: new Date(booking._updatedAt || Date.now()).toISOString(),
    created_at: booking.createdAt || new Date().toISOString(),
  };
}

export function remoteToBooking(remote) {
  let customerInfo = {};
  try {
    customerInfo = typeof remote.customer_info === 'string'
      ? JSON.parse(remote.customer_info)
      : (remote.customer_info || {});
  } catch { /* ignore parse errors */ }

  return {
    id: remote.id,
    ref: remote.reference_number || '',
    leadId: remote.lead_id || null,
    carId: remote.car_id || null,
    carName: remote.car_name || '',
    carPrice: remote.car_price || 0,
    branchId: remote.branch_id || null,
    salespersonId: remote.salesperson_id || null,
    customerName: remote.customer_name || '',
    customerPhone: remote.customer_phone || '',
    customerEmail: remote.customer_email || '',
    customerInfo,
    paymentMethod: remote.payment_method || 'installment',
    downPayment: remote.down_payment || 0,
    downPaymentPct: remote.down_payment_pct || 15,
    loanAmount: remote.loan_amount || 0,
    loanTerm: remote.loan_term_months || 60,
    loanTermMonths: remote.loan_term_months || 60,
    interestRate: remote.interest_rate || 2.49,
    monthlyPayment: remote.monthly_amount || 0,
    totalInterest: 0, // Computed client-side, not stored
    selectedColor: remote.color || 'Pearl White',
    color: remote.color || 'Pearl White',
    selectedGrade: remote.selected_grade || null,
    gradeName: remote.grade_name || null,
    deliveryDate: remote.delivery_date || null,
    status: remote.status || 'pending',
    createdAt: remote.created_at || new Date().toISOString(),
    _updatedAt: new Date(remote.updated_at || 0).getTime(),
  };
}

// ============================================================================
// NOTIFICATION MAPPERS
// ============================================================================

function safeTimestamp(val) {
  if (!val) return new Date().toISOString();
  // If it's already a valid ISO string, use it
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d.toISOString();
  // Thai relative time or other non-parseable — use current time
  return new Date().toISOString();
}

export function notificationToRemote(notif) {
  return {
    id: notif.id,
    user_id: notif.userId || null,
    title: notif.title || '',
    body: notif.body || '',
    type: notif.type || 'info',
    read: notif.read || false,
    created_at: safeTimestamp(notif.time || notif.createdAt),
    updated_at: safeTimestamp(notif._updatedAt ? new Date(notif._updatedAt).toISOString() : null),
  };
}

export function remoteToNotification(remote) {
  return {
    id: remote.id,
    userId: remote.user_id || null,
    title: remote.title || '',
    body: remote.body || '',
    type: remote.type || 'info',
    read: remote.read || false,
    time: remote.created_at || new Date().toISOString(),
    _updatedAt: new Date(remote.updated_at || remote.created_at || 0).getTime(),
  };
}

// ============================================================================
// CONVENIENCE WRAPPERS (backward-compatible with old API)
// ============================================================================

export async function syncLeads(localLeads) {
  const result = await syncTable({
    tableName: 'leads',
    localData: localLeads,
    mapToRemote: leadToRemote,
    mapToLocal: remoteToLead,
  });
  return result.data;
}

export async function pushLead(lead) {
  return pushRecord('leads', lead, leadToRemote);
}

export async function syncBookings(localBookings) {
  const result = await syncTable({
    tableName: 'bookings',
    localData: localBookings,
    mapToRemote: bookingToRemote,
    mapToLocal: remoteToBooking,
  });
  return result.data;
}

export async function pushBooking(booking) {
  return pushRecord('bookings', booking, bookingToRemote);
}
