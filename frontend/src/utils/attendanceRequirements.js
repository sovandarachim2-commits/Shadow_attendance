export const DEFAULT_ATTENDANCE_REQUIREMENTS = {
  attendance_type: 'office',
  require_gps: true,
  require_photo: false,
  save_selfie: true,
}

/** Client-side fallback until /attendance/today requirements are loaded. */
export function requirementsFromEmployee(employee) {
  const attendanceType = employee?.employment_type === 'outdoor_sales' ? 'outdoor' : 'office'

  return {
    attendance_type: attendanceType,
    require_gps: Boolean(employee?.require_gps) || true,
    require_photo: Boolean(employee?.require_face_verification),
    save_selfie: true,
  }
}

export function mergeRequirements(apiRequirements, employee) {
  if (apiRequirements && typeof apiRequirements.require_gps === 'boolean') {
    return { ...DEFAULT_ATTENDANCE_REQUIREMENTS, ...apiRequirements }
  }

  return { ...DEFAULT_ATTENDANCE_REQUIREMENTS, ...requirementsFromEmployee(employee) }
}
