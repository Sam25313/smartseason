import { subDays } from 'date-fns'

const now = new Date()

export const USERS = [
  { id: 1, name: 'Amara Osei',   email: 'admin@smartseason.com',  password: 'admin123',  role: 'admin'  },
  { id: 2, name: 'Kofi Mensah',  email: 'kofi@smartseason.com',   password: 'agent123',  role: 'agent'  },
  { id: 3, name: 'Nia Adeyemi',  email: 'nia@smartseason.com',    password: 'agent123',  role: 'agent'  },
  { id: 4, name: 'Kwame Asante', email: 'kwame@smartseason.com',  password: 'agent123',  role: 'agent'  },
]

export const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']

export const CROPS = ['Maize', 'Tomatoes', 'Cassava', 'Yam', 'Sorghum', 'Groundnuts', 'Rice', 'Cowpeas']

function computeStatus(currentStage, lastUpdateDate) {
  if (currentStage === 'Harvested') return 'completed'
  const daysSince = Math.floor((now - lastUpdateDate) / (1000 * 60 * 60 * 24))
  if (daysSince >= 7) return 'at-risk'
  return 'active'
}

export const INITIAL_FIELDS = [
  {
    id: 1,
    name: 'Aboabo North Plot',
    crop_type: 'Maize',
    planting_date: subDays(now, 60).toISOString(),
    current_stage: 'Growing',
    assigned_agent_id: 2,
    location: 'Kumasi Region',
    area_ha: 3.5,
    lastUpdate: subDays(now, 2),
  },
  {
    id: 2,
    name: 'Tamale East Farm',
    crop_type: 'Sorghum',
    planting_date: subDays(now, 45).toISOString(),
    current_stage: 'Growing',
    assigned_agent_id: 3,
    location: 'Northern Region',
    area_ha: 5.0,
    lastUpdate: subDays(now, 9),
  },
  {
    id: 3,
    name: 'Volta Basin Field',
    crop_type: 'Rice',
    planting_date: subDays(now, 90).toISOString(),
    current_stage: 'Harvested',
    assigned_agent_id: 2,
    location: 'Volta Region',
    area_ha: 2.2,
    lastUpdate: subDays(now, 5),
  },
  {
    id: 4,
    name: 'Brong-Ahafo Plot A',
    crop_type: 'Yam',
    planting_date: subDays(now, 30).toISOString(),
    current_stage: 'Planted',
    assigned_agent_id: 4,
    location: 'Bono Region',
    area_ha: 4.0,
    lastUpdate: subDays(now, 1),
  },
  {
    id: 5,
    name: 'Ashanti Central',
    crop_type: 'Tomatoes',
    planting_date: subDays(now, 50).toISOString(),
    current_stage: 'Ready',
    assigned_agent_id: 3,
    location: 'Ashanti Region',
    area_ha: 1.8,
    lastUpdate: subDays(now, 10),
  },
  {
    id: 6,
    name: 'Upper East Groundnut',
    crop_type: 'Groundnuts',
    planting_date: subDays(now, 20).toISOString(),
    current_stage: 'Planted',
    assigned_agent_id: 4,
    location: 'Upper East Region',
    area_ha: 6.5,
    lastUpdate: subDays(now, 3),
  },
]

INITIAL_FIELDS.forEach(f => {
  f.status = computeStatus(f.current_stage, f.lastUpdate)
})

export const INITIAL_UPDATES = [
  { id: 1, field_id: 1, agent_id: 2, stage: 'Growing',    notes: 'Cobs filling out well. Expect harvest in 2 weeks.', created_at: subDays(now, 2).toISOString() },
  { id: 2, field_id: 1, agent_id: 2, stage: 'Growing',   notes: 'Good pollination observed across 80% of plants.', created_at: subDays(now, 14).toISOString() },
  { id: 3, field_id: 2, agent_id: 3, stage: 'Growing',  notes: 'Slight nitrogen deficiency signs on lower leaves. Applying foliar feed.', created_at: subDays(now, 9).toISOString() },
  { id: 4, field_id: 3, agent_id: 2, stage: 'Harvested',   notes: 'Harvest complete. Yield: approximately 4.8 t/ha. Excellent season.', created_at: subDays(now, 5).toISOString() },
  { id: 5, field_id: 4, agent_id: 4, stage: 'Planted',    notes: 'Seeds planted successfully. Soil moisture good.', created_at: subDays(now, 1).toISOString() },
  { id: 6, field_id: 5, agent_id: 3, stage: 'Ready',     notes: 'Fruits ripening. Ready for harvest next week.', created_at: subDays(now, 10).toISOString() },
]

export { computeStatus }
