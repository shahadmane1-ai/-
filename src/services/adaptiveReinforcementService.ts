/**
 * Adaptive Reinforcement Router
 * Phase 4 Architecture: Deterministic Graph-Based Next-Best-Action Recommendation
 * Strictly guarantees recommendations come from verified scenarios and active learning state.
 */

import { AdaptiveRecommendation } from '../types/scenarioKnowledge';
import { getLearningState } from './learningStateManager';
import { getProductionScenarios, getScenarioById } from './scenarioVault';
import { getLocalizedConceptLabel } from './scenarioConceptProfiles';

// Comprehensive mapping of learning concept tags to target scenario IDs (SCN_001..SCN_030)
const CONCEPT_TO_SCENARIO_MAP: Record<string, string> = {
  // SCN_001 - Missed First Tashahhud
  'prayer_first_tashahhud_continuation': 'SCN_001',
  'sujud_sahw_timing': 'SCN_001',
  'sujud_sahw_missed_first_tashahhud': 'SCN_001',

  // SCN_002 - Doubt in Rak'ah Count
  'prayer_doubt_build_on_certainty': 'SCN_002',
  'sujud_sahw_doubt': 'SCN_002',

  // SCN_003 - Involuntary Laughter / Speech
  'prayer_invalidation_speech_laughter': 'SCN_003',
  'smile_vs_laughter_distinction': 'SCN_003',

  // SCN_004 - Missed Essential Pillar
  'prayer_missed_essential_pillar': 'SCN_004',
  'rakah_substitution_rule': 'SCN_004',

  // SCN_005 - Khanzab Whispers
  'prayer_khushoo_whisper_remedy': 'SCN_005',
  'dry_spit_left_protection': 'SCN_005',

  // SCN_006 - Cast / Bandage Wiping
  'wudu_wipe_over_splint_bandage': 'SCN_006',
  'medical_bandage_purity': 'SCN_006',

  // SCN_007 - Extreme Cold Concession
  'tahara_concession_extreme_cold': 'SCN_007',
  'minimal_single_wash_concession': 'SCN_007',

  // SCN_008 - Gas / Wind Doubt
  'tahara_doubt_rule_certainty': 'SCN_008',
  'doubt_vs_certainty_purity': 'SCN_008',

  // SCN_009 - Tayammum (Dry Ablution)
  'tayammum_conditions': 'SCN_009',
  'tayammum_action_sequence': 'SCN_009',
  'tayammum_process': 'SCN_009',

  // SCN_010 - Street Mud
  'tahara_street_mud_purity_principle': 'SCN_010',
  'purity_doubt_inspection': 'SCN_010',

  // SCN_011 - Airplane Seated Prayer
  'prayer_in_airplane_constraints': 'SCN_011',
  'seated_nodding_gestures': 'SCN_011',

  // SCN_012 - Transit Train / Bus Prayer
  'prayer_in_transit_vehicle': 'SCN_012',
  'qibla_alignment_in_motion': 'SCN_012',

  // SCN_013 - Public Space & Sutrah
  'prayer_public_space_sutrah': 'SCN_013',
  'entering_prayer_with_imam': 'SCN_013',

  // SCN_014 - Airport Transit Prayer
  'prayer_airport_transit_management': 'SCN_014',
  'quiet_space_selection': 'SCN_014',

  // SCN_015 - Patient / Surgery Combining
  'prayer_patient_hospital_adaptation': 'SCN_015',
  'combining_prayers_for_hardship': 'SCN_015',

  // SCN_016 - Non-Muslim Neighbor Gift
  'muamalat_gift_neighbor_kindness': 'SCN_016',
  'halal_gift_inspection': 'SCN_016',

  // SCN_017 - Bank Riba / Usury
  'financial_riba_disposal_ethics': 'SCN_017',
  'usury_contract_clause_review': 'SCN_017',

  // SCN_018 - Halal Food Verification
  'halal_food_verification_balance': 'SCN_018',
  'ingredient_checking_ethics': 'SCN_018',

  // SCN_019 - Social Dining & Alcohol Boundary
  'workplace_social_alcohol_boundary': 'SCN_019',
  'social_dining_purity': 'SCN_019',

  // SCN_020 - Workplace Halal Earnings
  'workplace_halal_earnings_integrity': 'SCN_020',
  'avoiding_unlawful_trade': 'SCN_020',

  // SCN_021 - Travel Shortening & Family Dining
  'salah_travel_qasr_jam_rules': 'SCN_021',
  'family_social_dining_harmony': 'SCN_021',

  // SCN_022 - Rain Combining & Condolences
  'prayer_jam_concession_rain': 'SCN_022',
  'condolence_vs_ritual_distinction': 'SCN_022',

  // SCN_023 - Identity & Original Name
  'identity_name_change_principles': 'SCN_023',
  'cultural_heritage_after_islam': 'SCN_023',

  // SCN_024 - Qibla Mistake & Peer Support
  'qiblah_ijtihad_mistake_ruling': 'SCN_024',
  'peer_pressure_resilience': 'SCN_024',

  // SCN_025 - Sock Wiping Duration & Privacy
  'wudu_khuffayn_wiping_duration': 'SCN_025',
  'prayer_in_non_muslim_family': 'SCN_025',

  // SCN_026 - Past Sins & Forgiveness
  'spiritual_islam_erases_past_sins': 'SCN_026',
  'converting_burden_to_new_start': 'SCN_026',

  // SCN_027 - Conflicting Sources & Tolerance
  'source_evaluation_credibility': 'SCN_027',
  'fiqh_diversity_tolerance': 'SCN_027',

  // SCN_028 - Seeking Knowledge & Time Schedule
  'learning_seeking_knowledge_without_shame': 'SCN_028',
  'daily_time_organization_prayer': 'SCN_028',

  // SCN_029 - Gradual Fatihah Learning
  'prayer_beginner_quran_recitation_gradualism': 'SCN_029',
  'gradual_learning_bridge': 'SCN_029',

  // SCN_030 - Zakat al-Fitr Calculation
  'zakat_fitr_calculation_distribution': 'SCN_030',
  'zakat_sa_calculation_family': 'SCN_030',
};

/**
 * Normalizes scenario IDs (SCN_001 vs scen_1)
 */
function resolveScenario(idOrTag: string) {
  if (!idOrTag) return null;

  // Exact vault match
  let scen = getScenarioById(idOrTag);
  if (scen) return scen;

  // Numeric SCN_xxx or scen_x resolution
  const numMatch = idOrTag.match(/\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[0], 10);
    const formattedId = `SCN_${num.toString().padStart(3, '0')}`;
    scen = getScenarioById(formattedId);
    if (scen) return scen;

    const altId = `scen_${num}`;
    const vault = getProductionScenarios();
    return vault.find((s) => s.id === altId || s.id === formattedId || s.numeric_id === num) || null;
  }

  return null;
}

/**
 * Returns a deterministic adaptive recommendation grounded in the user's verified learning state.
 * Strictly returns null for new/fresh users with no active errors or reinforcement needs.
 */
export function getAdaptiveRecommendation(): AdaptiveRecommendation | null {
  const state = getLearningState();
  const productionVault = getProductionScenarios();
  const completedSet = new Set(state.completed_scenarios);

  // 1. Primary Strategy: Address immediate items in needs_reinforcement
  if (state.needs_reinforcement && state.needs_reinforcement.length > 0) {
    for (const item of state.needs_reinforcement) {
      // Case A: The item is a scenario ID (e.g., SCN_001, SCN_009, scen_1, scen_9)
      if (item.startsWith('SCN_') || item.startsWith('scen_')) {
        const sourceScenario = resolveScenario(item);
        if (sourceScenario && sourceScenario.is_active) {
          // Check related scenarios in graph that haven't been completed yet
          const relatedIds = sourceScenario.related_scenarios || [];
          for (const relId of relatedIds) {
            const relScenario = resolveScenario(relId);
            if (relScenario && relScenario.is_active && !completedSet.has(relScenario.id)) {
              return {
                target_scenario_id: relScenario.id,
                target_title_ar: relScenario.title_ar,
                reason_ar: `رفيق لاحظ أنك تحتاج إلى تثبيت مفهوم مرتبط بـ "${sourceScenario.title_ar}". هل تريد تجربة هذا الموقف المساعد؟`,
                related_city_experience: relScenario.related_city_experience,
              };
            }
          }

          // If all related are completed or none exist, recommend the source scenario itself for practice
          return {
            target_scenario_id: sourceScenario.id,
            target_title_ar: sourceScenario.title_ar,
            reason_ar: `رفيق لاحظ أنك تحتاج إلى تثبيت هذه النقطة التعليمية. هل تريد تجربة موقف قصير مرتبط بها؟`,
            related_city_experience: sourceScenario.related_city_experience,
          };
        }
      }

      // Case B: The item is a concept tag (e.g. "tayammum_conditions", "prayer_first_tashahhud_continuation")
      const mappedId = CONCEPT_TO_SCENARIO_MAP[item];
      let targetScenario = mappedId ? resolveScenario(mappedId) : null;

      if (!targetScenario) {
        targetScenario = productionVault.find((scen) =>
          scen.learning_criteria?.required_concepts?.includes(item)
        ) || null;
      }

      if (targetScenario) {
        const conceptLabel = getLocalizedConceptLabel(item, 'ar');
        return {
          target_scenario_id: targetScenario.id,
          target_title_ar: targetScenario.title_ar,
          reason_ar: conceptLabel
            ? `رفيق لاحظ أنك تحتاج إلى تثبيت مفهوم «${conceptLabel}». هل تريد تجربة موقف قصير مرتبط بها؟`
            : `رفيق لاحظ أنك تحتاج إلى تثبيت هذه النقطة التعليمية. هل تريد تجربة موقف قصير مرتبط بها؟`,
          related_city_experience: targetScenario.related_city_experience,
        };
      }
    }
  }

  // 2. Secondary Strategy: Address topics with accumulated mistakes
  const sortedMistakes = Object.entries(state.mistakes_by_topic || {}).sort((a, b) => b[1] - a[1]);
  for (const [topic, count] of sortedMistakes) {
    if (count > 0) {
      const topicScenario = productionVault.find(
        (scen) => scen.topic === topic && !completedSet.has(scen.id)
      );

      if (topicScenario) {
        return {
          target_scenario_id: topicScenario.id,
          target_title_ar: topicScenario.title_ar,
          reason_ar: `رفيق لاحظ وجود أخطاء سابقة في هذا المجال. هل تريد تجربة هذا الموقف للتثبيت؟`,
          related_city_experience: topicScenario.related_city_experience,
        };
      }
    }
  }

  // Strictly return null if user is fresh or has no active reinforcement needs or errors
  return null;
}
