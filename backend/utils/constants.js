export function computeStatus(currentStage, lastUpdateDate) {
  if (currentStage === 'Harvested') return 'completed'
  const daysSince = Math.floor((new Date() - new Date(lastUpdateDate)) / (1000 * 60 * 60 * 24))
  if (daysSince >= 7) return 'at-risk'
  return 'active'
}

export const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']
export const CROPS = ['Maize', 'Tomatoes', 'Cassava', 'Yam', 'Sorghum', 'Groundnuts', 'Rice', 'Cowpeas']
export const REGIONS = [
  'Ashanti Region', 'Greater Accra', 'Northern Region', 'Volta Region',
  'Bono Region', 'Eastern Region', 'Western Region', 'Upper East Region',
  'Upper West Region', 'Savannah Region', 'Kumasi Region',
]