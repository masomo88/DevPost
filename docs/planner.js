const DAY = 86400000;

const recipes = [
  { id: 'frittata', title: 'Use-it-up frittata', icon: '🍳', ingredients: ['egg', 'spinach', 'tomato', 'cheese', 'pepper', 'onion', 'potato'], minimum: 2, method: 'Cook vegetables until tender, add beaten eggs and finish until fully set.' },
  { id: 'soup', title: 'Flexible vegetable soup', icon: '🥣', ingredients: ['carrot', 'potato', 'tomato', 'spinach', 'onion', 'zucchini', 'bean', 'broccoli'], minimum: 2, method: 'Simmer chopped vegetables in water or stock until tender; season to taste.' },
  { id: 'pasta', title: 'Last-chance pasta', icon: '🍝', ingredients: ['pasta', 'tomato', 'spinach', 'cheese', 'zucchini', 'onion', 'broccoli'], minimum: 2, method: 'Cook pasta; sauté vegetables and combine with a little cooking water.' },
  { id: 'fried-rice', title: 'Fridge-clear fried rice', icon: '🍚', ingredients: ['rice', 'egg', 'carrot', 'pepper', 'onion', 'spinach', 'pea'], minimum: 2, method: 'Cook vegetables, add chilled cooked rice, heat thoroughly, then add cooked egg if available.' },
  { id: 'toast', title: 'Rescue toast', icon: '🥪', ingredients: ['bread', 'tomato', 'cheese', 'egg', 'spinach', 'mushroom'], minimum: 2, method: 'Toast bread and top with cooked or ready-to-eat ingredients.' },
  { id: 'smoothie', title: 'Ripe-fruit smoothie', icon: '🥤', ingredients: ['banana', 'apple', 'berry', 'yogurt', 'milk', 'pear'], minimum: 2, method: 'Blend washed fruit with yogurt or milk; consume promptly.' }
];

const aliases = {
  uova: 'egg', uovo: 'egg', eggs: 'egg', spinaci: 'spinach', pomodoro: 'tomato', pomodori: 'tomato', tomatoes: 'tomato',
  formaggio: 'cheese', peperone: 'pepper', cipolla: 'onion', patata: 'potato', patate: 'potato', carota: 'carrot',
  zucchina: 'zucchini', zucchine: 'zucchini', fagioli: 'bean', broccoli: 'broccoli', broccolo: 'broccoli',
  riso: 'rice', piselli: 'pea', pane: 'bread', funghi: 'mushroom', fungo: 'mushroom', mela: 'apple',
  banana: 'banana', fragole: 'berry', frutti: 'berry', yogurt: 'yogurt', latte: 'milk', pera: 'pear'
};

function tokenize(name) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z]+/).filter(Boolean).map(word => aliases[word] || word);
}

export function validateItems(value) {
  if (!Array.isArray(value) || value.length > 100) throw new Error('Provide an array of up to 100 items.');
  return value.map((raw, index) => {
    if (!raw || typeof raw !== 'object') throw new Error(`Item ${index + 1} is invalid.`);
    const name = String(raw.name || '').trim();
    if (!name || name.length > 80) throw new Error(`Item ${index + 1} needs a name up to 80 characters.`);
    const grams = Number(raw.grams);
    if (!Number.isInteger(grams) || grams < 1 || grams > 100000) throw new Error(`Item ${index + 1} needs 1–100000 grams.`);
    const date = String(raw.date || '');
    const parsedDate = new Date(date + 'T00:00:00Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) throw new Error(`Item ${index + 1} needs a valid date.`);
    const category = ['produce', 'dairy', 'bakery', 'pantry', 'other'].includes(raw.category) ? raw.category : 'other';
    return { id: String(raw.id || index + 1).slice(0, 60), name, grams, date, category };
  });
}

export function makePlan(input, now = new Date()) {
  const items = validateItems(input);
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const assessed = items.map(item => {
    const days = Math.round((Date.parse(item.date + 'T00:00:00Z') - today) / DAY);
    const urgency = days < 0 ? 'check' : days <= 2 ? 'rescue' : days <= 5 ? 'soon' : 'later';
    const score = days < 0 ? 0 : Math.max(0, 100 - days * 12);
    return { ...item, days, urgency, score, tokens: tokenize(item.name) };
  }).sort((a, b) => a.days - b.days || b.grams - a.grams);
  const usable = assessed.filter(item => item.days >= 0);
  const rescue = usable.filter(item => item.days <= 2);
  const options = recipes.map(recipe => {
    const matches = usable.filter(item => item.tokens.some(t => recipe.ingredients.includes(t)));
    const unique = new Set(matches.flatMap(item => item.tokens.filter(t => recipe.ingredients.includes(t))));
    if (unique.size < recipe.minimum) return null;
    const urgent = matches.filter(item => item.days <= 2);
    const value = urgent.reduce((sum, item) => sum + item.grams, 0);
    return { id: recipe.id, title: recipe.title, icon: recipe.icon, method: recipe.method, ingredients: matches.map(({ id, name, grams, days }) => ({ id, name, grams, days })), priorityGrams: value, score: value * 2 + unique.size * 30 };
  }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 3);
  const nextSteps = rescue.length ? rescue.slice(0, 3).map(item => ({ itemId: item.id, text: `${item.name}: plan to use ${item.grams} g ${item.days === 0 ? 'today' : `within ${item.days} day${item.days === 1 ? '' : 's'}`}.` })) : [{ text: 'No items need immediate attention. Add your next shop to keep the plan current.' }];
  const atRiskGrams = rescue.reduce((sum, item) => sum + item.grams, 0);
  return { generatedAt: now.toISOString(), items: assessed.map(({ tokens, ...item }) => item), summary: { totalItems: items.length, rescueItems: rescue.length, atRiskGrams, totalGrams: items.reduce((sum, item) => sum + item.grams, 0), reviewItems: assessed.filter(item => item.days < 0).length }, recipes: options, nextSteps, note: 'Dates are planning prompts, not food-safety advice. Check storage, label type and condition before eating. “At risk” is inventory weight, not measured waste prevented.' };
}
