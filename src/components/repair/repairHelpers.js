// ==========================================
// WARRANTY OPTIONS
// ==========================================

export const WARRANTY_OPTIONS = [
  { value: "IN_WARRANTY", label: "Under Warranty" },
  { value: "OUT_OF_WARRANTY", label: "Out of Warranty" },
  { value: "NOT_SPECIFIED", label: "Not Specified" },
];

// ==========================================
// TRANSFER REASONS
// ==========================================

export const TRANSFER_REASONS = [
  { value: "HALF_DAY", label: "Half Day" },
  { value: "LEAVE", label: "Leave" },
  { value: "PERSONAL", label: "Personal Reason" },
  { value: "OTHER", label: "Other" },
];

export const getReasonLabel = (value) =>
  TRANSFER_REASONS.find((item) => item.value === value)
    ?.label || value || "-";

// ==========================================
// DATE
// ==========================================

export const formatShortDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================
// PERSON NAME (populated object / id / string)
// ==========================================

export const getPersonLabel = (person) => {
  if (!person) return "";

  if (typeof person === "string") {
    return /^[0-9a-fA-F]{24}$/.test(person)
      ? ""
      : person;
  }

  return (
    `${person.firstName || ""} ${
      person.lastName || ""
    }`.trim() ||
    person.name ||
    person.fullName ||
    person.email ||
    ""
  );
};

// ==========================================
// WARRANTY INFO
// ==========================================

export const getWarrantyInfo = (repair = {}) => {
  const status = String(
    repair?.warrantyStatus || "NOT_SPECIFIED"
  ).toUpperCase();

  const rawExpiry = repair?.warrantyExpiryDate
    ? new Date(repair.warrantyExpiryDate)
    : null;

  const expiry =
    rawExpiry && !Number.isNaN(rawExpiry.getTime())
      ? rawExpiry
      : null;

  let daysLeft = null;
  let expired = false;

  if (expiry) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(expiry);
    end.setHours(0, 0, 0, 0);

    daysLeft = Math.round((end - today) / 86400000);
    expired = daysLeft < 0;
  }

  let label = "Warranty Not Specified";
  let tone = "muted";

  if (status === "IN_WARRANTY") {
    if (expired) {
      label = "Warranty Expired";
      tone = "danger";
    } else {
      label = "Under Warranty";
      tone = "success";
    }
  } else if (status === "OUT_OF_WARRANTY") {
    label = "Out of Warranty";
    tone = "muted";
  }

  return {
    status,
    label,
    tone,
    expiry,
    daysLeft,
    expired,
    provider: repair?.warrantyProvider || "",
    details: repair?.warrantyDetails || "",
  };
};