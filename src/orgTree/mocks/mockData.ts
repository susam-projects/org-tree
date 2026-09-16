import type { OrgNode } from '@/orgTree/types/types'

type Tier = 'division' | 'department' | 'team'

interface NodeSeed {
  id: string
  name: string
  parentId: string | null
  tier: Tier
}

const seeds: NodeSeed[] = [
  { id: 'd1', name: 'Технологии', parentId: null, tier: 'division' },
  { id: 'd2', name: 'Продажи', parentId: null, tier: 'division' },
  { id: 'd3', name: 'Маркетинг', parentId: null, tier: 'division' },
  { id: 'd4', name: 'Операции', parentId: null, tier: 'division' },

  { id: 'dep1', name: 'Разработка', parentId: 'd1', tier: 'department' },
  { id: 'dep2', name: 'QA', parentId: 'd1', tier: 'department' },
  { id: 'dep3', name: 'DevOps', parentId: 'd1', tier: 'department' },
  { id: 'dep4', name: 'Корпоративные продажи', parentId: 'd2', tier: 'department' },
  { id: 'dep5', name: 'Розничные продажи', parentId: 'd2', tier: 'department' },
  { id: 'dep6', name: 'Партнёрские продажи', parentId: 'd2', tier: 'department' },
  { id: 'dep7', name: 'Бренд-маркетинг', parentId: 'd3', tier: 'department' },
  { id: 'dep8', name: 'Digital-маркетинг', parentId: 'd3', tier: 'department' },
  { id: 'dep9', name: 'Контент', parentId: 'd3', tier: 'department' },
  { id: 'dep10', name: 'HR', parentId: 'd4', tier: 'department' },
  { id: 'dep11', name: 'Финансы', parentId: 'd4', tier: 'department' },
  { id: 'dep12', name: 'Юридический отдел', parentId: 'd4', tier: 'department' },

  { id: 't1', name: 'Frontend', parentId: 'dep1', tier: 'team' },
  { id: 't2', name: 'Backend', parentId: 'dep1', tier: 'team' },
  { id: 't3', name: 'Mobile', parentId: 'dep1', tier: 'team' },
  { id: 't4', name: 'Мануальное тестирование', parentId: 'dep2', tier: 'team' },
  { id: 't5', name: 'Автотесты', parentId: 'dep2', tier: 'team' },
  { id: 't6', name: 'Инфраструктура', parentId: 'dep3', tier: 'team' },
  { id: 't7', name: 'SRE', parentId: 'dep3', tier: 'team' },
  { id: 't8', name: 'Крупные клиенты', parentId: 'dep4', tier: 'team' },
  { id: 't9', name: 'Средний бизнес', parentId: 'dep4', tier: 'team' },
  { id: 't10', name: 'Онлайн-продажи', parentId: 'dep5', tier: 'team' },
  { id: 't11', name: 'Офлайн-продажи', parentId: 'dep5', tier: 'team' },
  { id: 't12', name: 'Партнёрская сеть', parentId: 'dep6', tier: 'team' },
  { id: 't13', name: 'Дистрибуция', parentId: 'dep6', tier: 'team' },
  { id: 't14', name: 'Бренд-стратегия', parentId: 'dep7', tier: 'team' },
  { id: 't15', name: 'PR', parentId: 'dep7', tier: 'team' },
  { id: 't16', name: 'SEO/SEM', parentId: 'dep8', tier: 'team' },
  { id: 't17', name: 'SMM', parentId: 'dep8', tier: 'team' },
  { id: 't18', name: 'Веб-аналитика', parentId: 'dep8', tier: 'team' },
  { id: 't19', name: 'Копирайтинг', parentId: 'dep9', tier: 'team' },
  { id: 't20', name: 'Видео-продакшн', parentId: 'dep9', tier: 'team' },
  { id: 't21', name: 'Рекрутинг', parentId: 'dep10', tier: 'team' },
  { id: 't22', name: 'Обучение и развитие', parentId: 'dep10', tier: 'team' },
  { id: 't23', name: 'Кадровое администрирование', parentId: 'dep10', tier: 'team' },
  { id: 't24', name: 'Бухгалтерия', parentId: 'dep11', tier: 'team' },
  { id: 't25', name: 'Казначейство', parentId: 'dep11', tier: 'team' },
  { id: 't26', name: 'Договорной отдел', parentId: 'dep12', tier: 'team' },
  { id: 't27', name: 'Комплаенс', parentId: 'dep12', tier: 'team' },
]

const HEADCOUNT_RANGE: Record<Tier, [number, number]> = {
  division: [3, 8],
  department: [2, 6],
  team: [4, 32],
}

const BUDGET_RANGE: Record<Tier, [number, number]> = {
  division: [5_000_000, 15_000_000],
  department: [1_000_000, 5_000_000],
  team: [200_000, 2_000_000],
}

const DAYS_AGO_RANGE: [number, number] = [0, 30]

function hashSeed(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function createSeededRandom(seed: number): () => number {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0xffffffff
  }
}

function randomInRange(random: () => number, [min, max]: [number, number]): number {
  return Math.round(min + random() * (max - min))
}

const now = Date.now()

export const mockOrgNodes: OrgNode[] = seeds.map((seed) => {
  const random = createSeededRandom(hashSeed(seed.id))
  const daysAgo = randomInRange(random, DAYS_AGO_RANGE)

  return {
    id: seed.id,
    name: seed.name,
    parentId: seed.parentId,
    headcount: randomInRange(random, HEADCOUNT_RANGE[seed.tier]),
    budget: randomInRange(random, BUDGET_RANGE[seed.tier]),
    performance: randomInRange(random, [30, 99]),
    updatedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  }
})
