/**
 * Pure calculation helpers for the planning tools. No UI, no side effects — easy to unit test.
 * All money is THB. Rates are decimals (0.04 = 4%).
 */

export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Future value of a series of monthly contributions at an annual rate. */
export function fvMonthly(monthly: number, annualRate: number, months: number): number {
  if (months <= 0) return 0;
  const r = annualRate / 12;
  if (Math.abs(r) < 1e-9) return monthly * months;
  return monthly * ((Math.pow(1 + r, months) - 1) / r);
}

/** Future value of a lump sum. */
export function fvLump(present: number, annualRate: number, years: number): number {
  return present * Math.pow(1 + annualRate, years);
}

/** Monthly payment needed to reach a target in n months at an annual rate. */
export function pmtForTarget(target: number, annualRate: number, months: number): number {
  if (months <= 0) return target;
  const r = annualRate / 12;
  if (Math.abs(r) < 1e-9) return target / months;
  return (target * r) / (Math.pow(1 + r, months) - 1);
}

/**
 * Capital needed at retirement to fund an inflation-adjusted withdrawal for `years`,
 * assuming the pot keeps growing at `postRate` (growing annuity, paid monthly, first payment immediately).
 * `monthlyAtRetirement` is already in retirement-year money.
 */
export function capitalForIncome(monthlyAtRetirement: number, years: number, postRate: number, inflation: number): number {
  const n = Math.max(0, Math.round(years * 12));
  const r = postRate / 12;
  const g = inflation / 12;
  if (n === 0) return 0;
  if (Math.abs(r - g) < 1e-9) return monthlyAtRetirement * n;
  // PV of growing annuity-due
  const ratio = (1 + g) / (1 + r);
  return monthlyAtRetirement * ((1 - Math.pow(ratio, n)) / (1 - ratio));
}

export interface RetirementInput {
  currentAge: number;
  retireAge: number;
  planUntilAge: number;
  monthlySpendingToday: number;
  currentSavings: number;
  monthlySaving: number;
  inflation: number;
  preRate: number;
  postRate: number;
}

export interface RetirementResult {
  yearsToRetire: number;
  yearsInRetirement: number;
  monthlyAtRetirement: number;
  nestEggNeeded: number;
  projected: number;
  gap: number;
  extraMonthlyNeeded: number;
  /** Year-by-year projection for the chart: age → projected and needed (needed shown flat at retirement). */
  series: { age: number; projected: number }[];
}

export function retirement(i: RetirementInput): RetirementResult {
  const yearsToRetire = Math.max(0, i.retireAge - i.currentAge);
  const yearsInRetirement = Math.max(1, i.planUntilAge - i.retireAge);
  const monthlyAtRetirement = i.monthlySpendingToday * Math.pow(1 + i.inflation, yearsToRetire);
  const nestEggNeeded = capitalForIncome(monthlyAtRetirement, yearsInRetirement, i.postRate, i.inflation);
  const projected = fvLump(i.currentSavings, i.preRate, yearsToRetire) + fvMonthly(i.monthlySaving, i.preRate, yearsToRetire * 12);
  const gap = Math.max(0, nestEggNeeded - projected);
  const extraMonthlyNeeded = gap > 0 ? pmtForTarget(gap, i.preRate, yearsToRetire * 12) : 0;
  const series: { age: number; projected: number }[] = [];
  for (let y = 0; y <= yearsToRetire; y++) {
    series.push({ age: i.currentAge + y, projected: fvLump(i.currentSavings, i.preRate, y) + fvMonthly(i.monthlySaving, i.preRate, y * 12) });
  }
  return { yearsToRetire, yearsInRetirement, monthlyAtRetirement, nestEggNeeded, projected, gap, extraMonthlyNeeded, series };
}

export interface CoverageInput {
  monthlyIncome: number;
  yearsToReplace: number;
  debts: number;
  education: number;
  finalExpenses: number;
  existingCover: number;
  savings: number;
}

export function coverage(i: CoverageInput) {
  const incomeNeed = i.monthlyIncome * 12 * i.yearsToReplace;
  const needs = incomeNeed + i.debts + i.education + i.finalExpenses;
  const has = i.existingCover + i.savings;
  const recommended = Math.max(0, needs - has);
  return { incomeNeed, needs, has, recommended };
}

export interface EducationInput {
  childAge: number;
  startAge: number;
  yearlyCostToday: number;
  studyYears: number;
  educationInflation: number;
  currentSavings: number;
  returnRate: number;
}

export function education(i: EducationInput) {
  const yearsUntil = Math.max(0, i.startAge - i.childAge);
  // Sum each study year's cost inflated to that year.
  let futureCost = 0;
  for (let y = 0; y < i.studyYears; y++) futureCost += i.yearlyCostToday * Math.pow(1 + i.educationInflation, yearsUntil + y);
  const savingsAtStart = fvLump(i.currentSavings, i.returnRate, yearsUntil);
  const gap = Math.max(0, futureCost - savingsAtStart);
  const monthlyNow = pmtForTarget(gap, i.returnRate, yearsUntil * 12);
  const monthsLater = Math.max(0, (yearsUntil - 3) * 12);
  const monthlyIn3Years = monthsLater > 0 ? pmtForTarget(Math.max(0, futureCost - fvLump(i.currentSavings, i.returnRate, yearsUntil)), i.returnRate, monthsLater) : gap;
  return { yearsUntil, futureCost, savingsAtStart, gap, monthlyNow, monthlyIn3Years };
}

/* ------------------------------------------------------------------ */
/* Thai personal income tax (tax year 2026) — simplified but faithful  */
/* ------------------------------------------------------------------ */

export const THAI_BRACKETS: Array<[number, number]> = [
  // [upper bound of bracket, rate]
  [150_000, 0],
  [300_000, 0.05],
  [500_000, 0.1],
  [750_000, 0.15],
  [1_000_000, 0.2],
  [2_000_000, 0.25],
  [5_000_000, 0.3],
  [Infinity, 0.35],
];

export function thaiTax(taxable: number): number {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of THAI_BRACKETS) {
    if (taxable <= lower) break;
    const slice = Math.min(taxable, upper) - lower;
    tax += slice * rate;
    lower = upper;
  }
  return tax;
}

export function marginalRate(taxable: number): number {
  let lower = 0;
  for (const [upper, rate] of THAI_BRACKETS) {
    if (taxable <= upper) return taxable <= lower ? 0 : rate;
    lower = upper;
  }
  return 0.35;
}

export const TAX_LIMITS = {
  lifeHealthBucket: 100_000,
  healthSelf: 25_000,
  parentsHealth: 15_000,
  spouseLife: 10_000,
  pensionPctOfIncome: 0.15,
  pensionMax: 200_000,
  retirementCombinedCap: 500_000,
  personalAllowance: 60_000,
  spouseAllowance: 60_000,
  childAllowance: 30_000,
  parentAllowance: 30_000,
  expenseRate: 0.5,
  expenseMax: 100_000,
  socialSecurityMax: 10_500,
  homeLoanInterestMax: 100_000,
};

export interface TaxInput {
  income: number;
  employee: boolean;
  spouseNoIncome: boolean;
  children: number;
  parentsSupported: number;
  pvd: number;
  rmf: number;
  homeLoanInterest: number;
  existingLife: number;
  existingHealth: number;
  existingParentsHealth: number;
  existingPension: number;
}

export interface TaxBucket {
  key: "lifeHealth" | "parentsHealth" | "pension";
  cap: number;
  used: number;
  room: number;
}

export interface TaxResult {
  taxableBefore: number;
  taxBefore: number;
  marginal: number;
  buckets: TaxBucket[];
  /** Deduction gained if all unused room were filled (respecting the combined caps). */
  extraDeduction: number;
  taxableAfter: number;
  taxAfter: number;
  saving: number;
}

export function taxRoom(i: TaxInput): TaxResult {
  const L = TAX_LIMITS;
  const expense = i.employee ? Math.min(L.expenseMax, i.income * L.expenseRate) : Math.min(L.expenseMax, i.income * L.expenseRate);
  const allowances =
    L.personalAllowance +
    (i.spouseNoIncome ? L.spouseAllowance : 0) +
    i.children * L.childAllowance +
    Math.min(4, i.parentsSupported) * L.parentAllowance +
    (i.employee ? L.socialSecurityMax : 0) +
    Math.min(L.homeLoanInterestMax, i.homeLoanInterest);

  // Existing insurance usage, applying the real rules.
  const healthCounted = Math.min(L.healthSelf, i.existingHealth);
  const lifeHealthUsed = Math.min(L.lifeHealthBucket, i.existingLife + healthCounted);
  // Pension premiums first fill any unused part of the life bucket.
  const lifeRoomForPension = Math.max(0, L.lifeHealthBucket - lifeHealthUsed);
  const pensionIntoLife = Math.min(lifeRoomForPension, i.existingPension);
  const pensionRemaining = i.existingPension - pensionIntoLife;
  const pensionCap = Math.min(L.pensionMax, i.income * L.pensionPctOfIncome);
  const retirementOthers = i.pvd + i.rmf;
  const combinedRoom = Math.max(0, L.retirementCombinedCap - retirementOthers);
  const pensionUsed = Math.min(pensionCap, combinedRoom, pensionRemaining);
  const parentsUsed = Math.min(L.parentsHealth, i.existingParentsHealth);

  const lifeBucketUsedTotal = lifeHealthUsed + pensionIntoLife;
  const deductionsBefore = lifeBucketUsedTotal + pensionUsed + parentsUsed + Math.min(L.retirementCombinedCap, retirementOthers);
  const taxableBefore = Math.max(0, i.income - expense - allowances - deductionsBefore);
  const taxBefore = thaiTax(taxableBefore);

  const buckets: TaxBucket[] = [
    { key: "lifeHealth", cap: L.lifeHealthBucket, used: lifeBucketUsedTotal, room: Math.max(0, L.lifeHealthBucket - lifeBucketUsedTotal) },
    { key: "parentsHealth", cap: L.parentsHealth, used: parentsUsed, room: Math.max(0, L.parentsHealth - parentsUsed) },
    {
      key: "pension",
      cap: Math.min(pensionCap, combinedRoom),
      used: pensionUsed,
      room: Math.max(0, Math.min(pensionCap, combinedRoom) - pensionUsed),
    },
  ];
  const extraDeduction = buckets.reduce((s, b) => s + b.room, 0);
  const taxableAfter = Math.max(0, taxableBefore - extraDeduction);
  const taxAfter = thaiTax(taxableAfter);
  return {
    taxableBefore,
    taxBefore,
    marginal: marginalRate(taxableBefore),
    buckets,
    extraDeduction,
    taxableAfter,
    taxAfter,
    saving: Math.max(0, taxBefore - taxAfter),
  };
}

/* ---------------- formatting ---------------- */

export function fmtTHB(v: number, locale: "th" | "en" = "th", opts?: { compact?: boolean; decimals?: number }): string {
  const n = Math.round(v);
  if (opts?.compact && Math.abs(n) >= 1_000_000) {
    const m = n / 1_000_000;
    return `฿${m.toLocaleString(locale === "th" ? "th-TH" : "en-US", { maximumFractionDigits: m < 10 ? 2 : 1 })}${locale === "th" ? " ล้าน" : "M"}`;
  }
  return `฿${n.toLocaleString(locale === "th" ? "th-TH" : "en-US", { maximumFractionDigits: opts?.decimals ?? 0 })}`;
}

export function fmtPct(v: number): string {
  return `${(v * 100).toFixed(v * 100 % 1 === 0 ? 0 : 1)}%`;
}
