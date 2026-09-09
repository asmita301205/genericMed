import { SupportedCurrency, SupportedLanguage, CartItem, PrescriptionRecord, DrugInteractionAlert } from '../types';
import { CURRENCY_CONFIGS, LOCALIZATION_DICTIONARY, DRUG_INTERACTION_RULES } from '../data/genericMedData';

/**
 * Formats an amount specified in base Indian Rupees (INR) into the target currency.
 */
export function formatCurrency(
  amountINR: number,
  currency: SupportedCurrency = 'INR',
  options?: { perUnit?: boolean; unitLabel?: string; compact?: boolean }
): string {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;
  const convertedAmount = amountINR * config.rateAgainstINR;

  let formattedVal: string;
  if (config.code === 'INR') {
    formattedVal = convertedAmount.toLocaleString('en-IN', {
      minimumFractionDigits: options?.perUnit ? 2 : 2,
      maximumFractionDigits: options?.perUnit ? 2 : 2
    });
  } else {
    formattedVal = convertedAmount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const result = `${config.symbol}${formattedVal}`;
  if (options?.perUnit) {
    return `${result} / ${options.unitLabel || 'tablet'}`;
  }
  return result;
}

/**
 * Resolves a localized string from the localization dictionary with fallback to English.
 */
export function t(key: string, lang: SupportedLanguage = 'en'): string {
  const dict = LOCALIZATION_DICTIONARY[lang] || LOCALIZATION_DICTIONARY.en;
  if (dict && dict[key]) {
    return dict[key];
  }
  return LOCALIZATION_DICTIONARY.en[key] || key;
}

/**
 * Autonomous Clinical Drug-Drug Interaction (DDI) Evaluator
 * Cross-references cart items against each other and against active prescriptions.
 */
export function checkDrugInteractions(
  cartItems: CartItem[],
  activePrescriptions: PrescriptionRecord[] = [],
  knownAllergies: string[] = []
): DrugInteractionAlert[] {
  const activeAlerts: DrugInteractionAlert[] = [];

  const saltsInCart = cartItems.map(item => ({
    name: item.canonicalProduct.genericSalt.toLowerCase(),
    canonical: item.canonicalProduct.canonicalName.toLowerCase(),
    id: item.listingId
  }));

  const saltsInPrescriptions = activePrescriptions.flatMap(rx =>
    rx.extractedEntities.prescribedSalts.map(s => s.saltName.toLowerCase())
  );

  const allActiveSalts = [...saltsInCart.map(s => s.name), ...saltsInPrescriptions];

  // 1. Check NSAID + Blood Thinner (Aspirin / Ibuprofen + Clopidogrel)
  const hasNsaid = allActiveSalts.some(s => s.includes('aspirin') || s.includes('ibuprofen') || s.includes('nsaid'));
  const hasBloodThinner = allActiveSalts.some(s => s.includes('clopidogrel') || s.includes('warfarin') || s.includes('heparin'));

  if (hasNsaid && hasBloodThinner) {
    const rule = DRUG_INTERACTION_RULES.find(r => r.id === 'ddi-aspirin-clopidogrel');
    if (rule) activeAlerts.push(rule);
  }

  // 2. Check Statin (Atorvastatin) + Calcium Channel Blocker (Amlodipine)
  const hasStatin = allActiveSalts.some(s => s.includes('atorvastatin') || s.includes('simvastatin'));
  const hasAmlodipine = allActiveSalts.some(s => s.includes('amlodipine'));

  if (hasStatin && hasAmlodipine) {
    const rule = DRUG_INTERACTION_RULES.find(r => r.id === 'ddi-simvastatin-amlodipine');
    if (rule) activeAlerts.push(rule);
  }

  // 3. Check High-Dose Paracetamol
  const paracetamolCount = cartItems
    .filter(item => item.canonicalProduct.genericSalt.toLowerCase().includes('paracetamol'))
    .reduce((acc, curr) => acc + curr.quantity, 0);

  if (paracetamolCount >= 4) {
    const rule = DRUG_INTERACTION_RULES.find(r => r.id === 'ddi-paracetamol-alcohol');
    if (rule) activeAlerts.push(rule);
  }

  // 4. Known Allergy Cross-check
  knownAllergies.forEach(allergy => {
    const allergyLower = allergy.toLowerCase();
    const matchedItem = cartItems.find(item =>
      item.canonicalProduct.genericSalt.toLowerCase().includes(allergyLower) ||
      item.canonicalProduct.canonicalName.toLowerCase().includes(allergyLower)
    );

    if (matchedItem) {
      activeAlerts.push({
        id: `allergy-${allergyLower}`,
        severity: 'critical',
        primaryDrug: matchedItem.canonicalProduct.canonicalName,
        interactingDrug: `Patient Documented Allergy: ${allergy}`,
        mechanism: 'Direct immune hypersensitivity risk leading to severe allergic reaction or anaphylaxis.',
        clinicalAdvisory: `CRITICAL ALLERGY CONFLICT: Patient medical record specifies active hypersensitivity to ${allergy}. Order should not be dispensed without doctor authorization.`,
        requiresPharmacistOverride: true
      });
    }
  });

  return activeAlerts;
}
