import { makePlan } from './planner.js';

const key = 'shelfloop-items-v1';
const example = [
  { name: 'Cherry tomatoes', grams: 350, days: 1, category: 'produce' },
  { name: 'Baby spinach', grams: 180, days: 0, category: 'produce' },
  { name: 'Eggs', grams: 300, days: 3, category: 'dairy' },
  { name: 'Sourdough bread', grams: 240, days: 2, category: 'bakery' },
  { name: 'Carrots', grams: 450, days: 6, category: 'produce' },
  { name: 'Rice', grams: 800, days: 90, category: 'pantry' }
];
const $ = selector => document.querySelector(selector);
const formatDate = date => new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(date + 'T12:00:00'));
const localDate = days => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const escapeHtml = value => String(value).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const makeExample = () => example.map((item, i) => ({ id: `sample-${i}`, name: item.name, grams: item.grams, date: localDate(item.days), category: item.category, sample: true }));

let saved;
try { saved = JSON.parse(localStorage.getItem(key)); } catch { saved = null; }
let items = Array.isArray(saved) ? saved : makeExample();
let isSample = items.some(item => item.sample);
let journal;
try { journal = JSON.parse(localStorage.getItem('shelfloop-journal-v1')); } catch { journal = []; }
if (!Array.isArray(journal)) journal = [];
let currentPlan = null;
let toastTimer;

function notify(message) { const el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500); }
function save() { localStorage.setItem(key, JSON.stringify(items)); isSample = items.some(item => item.sample); $('#sample-tag').textContent = isSample ? 'Includes example items · replace with yours' : 'Saved privately in this browser'; }
function renderJournal() {
  const real = journal.filter(entry => !entry.sample);
  $('#journal-grams').textContent = `${real.filter(entry => entry.outcome !== 'discarded').reduce((sum, entry) => sum + entry.grams, 0)} g`;
  $('#journal-discarded').textContent = `${real.filter(entry => entry.outcome === 'discarded').reduce((sum, entry) => sum + entry.grams, 0)} g`;
  $('#journal-list').innerHTML = journal.length ? journal.slice(0, 6).map(entry => `<li class="${entry.sample ? 'demo' : ''}">${escapeHtml(entry.name)} · ${entry.grams} g · ${entry.outcome === 'discarded' ? 'discarded' : 'used'} · ${escapeHtml(entry.date)}${entry.sample ? ' · example' : ''}</li>`).join('') : '<li>No outcomes recorded yet.</li>';
}
function label(days) { if (days < 0) return 'Review first'; if (days === 0) return 'Today'; if (days === 1) return 'Tomorrow'; return `${days} days left`; }
function foodIcon(category) { return ({ produce: '🥬', dairy: '🥛', bakery: '🍞', pantry: '🫙', other: '🍽️' })[category] || '🍽️'; }
function statusText(urgency) { return ({ check: 'Check first', rescue: 'Use soon', soon: 'Coming up', later: 'Plenty of time' })[urgency]; }

async function refresh() {
  try {
    const data = makePlan(items, new Date(localDate(0) + 'T12:00:00Z'));
    currentPlan = data;
    render(data);
  } catch (error) { notify(error.message); }
}

function render(plan) {
  $('#metric-rescue').textContent = plan.summary.rescueItems;
  $('#metric-total').textContent = plan.summary.totalItems;
  $('#metric-grams').textContent = `${(plan.summary.atRiskGrams / 1000).toFixed(2)} kg`;
  $('#inventory-count').textContent = `${plan.summary.totalItems} item${plan.summary.totalItems === 1 ? '' : 's'}`;
  $('#sample-tag').textContent = isSample ? 'Includes example items · replace with yours' : 'Saved privately in this browser';
  $('#inventory-rows').innerHTML = plan.items.length ? plan.items.map(item => `<tr><td><div class="item-cell"><span class="food-icon" aria-hidden="true">${foodIcon(item.category)}</span>${escapeHtml(item.name)}</div></td><td class="muted">${item.grams} g</td><td class="muted">${formatDate(item.date)}</td><td><span class="badge ${item.urgency}">${statusText(item.urgency)}</span></td><td><button class="used-button" data-used="${escapeHtml(item.id)}" aria-label="Mark ${escapeHtml(item.name)} used">Used ✓</button><button class="discard-button" data-discard="${escapeHtml(item.id)}" aria-label="Mark ${escapeHtml(item.name)} discarded">Discarded</button><button class="row-remove" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)} without logging an outcome">×</button></td></tr>`).join('') : '<tr><td colspan="5" class="muted">Your inventory is empty. Add food to start planning.</td></tr>';
  $('#next-steps').innerHTML = plan.nextSteps.map((step, i) => `<div class="step"><span class="step-num">${i + 1}</span><div><strong>${step.itemId ? 'Use this first' : 'You are up to date'}</strong><p>${escapeHtml(step.text)}</p></div></div>`).join('');
  $('#recipe-grid').innerHTML = plan.recipes.length ? plan.recipes.map(recipe => `<article class="recipe"><div class="recipe-top"><span class="recipe-icon" aria-hidden="true">${recipe.icon}</span><span class="recipe-priority">${recipe.priorityGrams ? `${recipe.priorityGrams} g to prioritise` : 'Flexible idea'}</span></div><h3>${escapeHtml(recipe.title)}</h3><p>${escapeHtml(recipe.method)}</p><div class="recipe-tags">${recipe.ingredients.slice(0, 4).map(item => `<span>${escapeHtml(item.name)}</span>`).join('')}</div></article>`).join('') : '<div class="empty">Add two or more matching ingredients to see useful combinations. Every suggestion is grounded in your inventory.</div>';
  renderJournal();
}

$('#add-toggle').addEventListener('click', () => { const open = $('#add-form').classList.toggle('hidden'); $('#add-toggle').setAttribute('aria-expanded', String(!open)); if (!open) $('#add-form [name="name"]').focus(); });
$('#cancel-add').addEventListener('click', () => { $('#add-form').classList.add('hidden'); $('#add-toggle').setAttribute('aria-expanded', 'false'); });
$('#add-form [name="date"]').value = localDate(3);
$('#add-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const item = { id: crypto.randomUUID(), name: String(form.get('name')).trim(), grams: Number(form.get('grams')), date: String(form.get('date')), category: String(form.get('category')) };
  if (!item.name || !Number.isInteger(item.grams) || item.grams < 1 || !item.date) return notify('Check the item fields.');
  if (items.length >= 100) return notify('The inventory supports up to 100 items.');
  items.push(item); save(); refresh(); event.currentTarget.reset(); $('#add-form [name="date"]').value = localDate(3); $('#add-form').classList.add('hidden'); $('#add-toggle').setAttribute('aria-expanded', 'false'); notify(`${item.name} added to your kitchen.`);
});
$('#inventory-rows').addEventListener('click', event => {
  const used = event.target.closest('[data-used]');
  const discarded = event.target.closest('[data-discard]');
  const removed = event.target.closest('[data-remove]');
  const id = used?.dataset.used || discarded?.dataset.discard || removed?.dataset.remove;
  if (!id) return;
  const found = items.find(item => item.id === id);
  if (!found) return;
  if (used || discarded) { journal.unshift({ name: found.name, grams: found.grams, date: localDate(0), outcome: discarded ? 'discarded' : 'used', sample: Boolean(found.sample) }); journal = journal.slice(0, 50); localStorage.setItem('shelfloop-journal-v1', JSON.stringify(journal)); }
  items = items.filter(item => item.id !== id);
  save(); refresh(); notify(`${found.name} ${used ? 'recorded as used' : discarded ? 'recorded as discarded' : 'removed'}.`);
});
$('#load-demo').addEventListener('click', () => { items = makeExample(); save(); refresh(); notify('Example inventory loaded.'); });
$('#export-data').addEventListener('click', () => { const csv = ['name,grams,date,category', ...items.map(item => [item.name, item.grams, item.date, item.category].map(value => `"${String(value).replaceAll('"', '""')}"`).join(','))].join('\r\n'); const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'shelfloop-inventory.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 5000); });
$('#ai-button').addEventListener('click', async () => {
  const button = $('#ai-button'); button.disabled = true; button.textContent = 'Thinking locally…';
  try {
    const response = await fetch('/api/ai-plan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items, today: localDate(0) }) });
    const data = await response.json().catch(() => { throw new Error('Local AI requires the downloaded app and a running Ollama model.'); });
    if (!response.ok) throw new Error(data.error || 'Local AI is unavailable.');
    $('#ai-results').classList.remove('hidden');
    $('#ai-results').innerHTML = data.suggestions.map(s => `<article class="ai-card"><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.steps)}</p><p>Uses: ${s.uses.map(escapeHtml).join(', ')}</p><small>${escapeHtml(s.caution)}</small></article>`).join('');
    notify(`Ideas generated with ${data.provider}.`);
  } catch (error) { notify(error.message); }
  finally { button.disabled = false; button.innerHTML = 'Ask local AI <span aria-hidden="true">→</span>'; }
});

refresh();
if (location.hostname.endsWith('github.io')) {
  $('#ai-button').disabled = true;
  $('#ai-button').textContent = 'Available in local app';
}
