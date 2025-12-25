import { calculateCreditsNeeded } from '../services/creditsService';

/**
 * Check if user has sufficient credits for a feature
 * @param {number} currentBalance - User's current credit balance
 * @param {string} feature - Feature name
 * @param {string} mode - 'single', 'folder', 'multi_folder'
 * @param {number} inputCount - Number of inputs
 * @returns {Object} Validation result
 */
export function validateCredits(currentBalance, feature, mode, inputCount = 1) {
  const creditsNeeded = calculateCreditsNeeded(feature, mode, inputCount);
  
  return {
    hasSufficientCredits: currentBalance >= creditsNeeded,
    creditsNeeded,
    currentBalance,
    shortfall: Math.max(0, creditsNeeded - currentBalance),
  };
}

/**
 * Get feature display name
 */
export function getFeatureDisplayName(feature) {
  const names = {
    background_remover: 'Background Remover',
    image_enhancer: 'Image Enhancer',
    wrinkle_remover: 'Wrinkle Remover',
    centralized_image: 'Centralized Image',
    ai_model_tryon: 'AI Model Try-On',
    tryon_gear: 'Try-On Gear',
    image_to_video: 'Image to Video',
  };
  return names[feature] || feature;
}

/**
 * Format credits for display
 */
export function formatCredits(credits) {
  return credits === 1 ? '1 credit' : `${credits} credits`;
}



