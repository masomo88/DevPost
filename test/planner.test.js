import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { makePlan, validateItems } from '../public/planner.js';
import { server } from '../server.js';

const today = new Date('2026-10-15T10:00:00Z');
const pantry = [
  { id: 'tomato', name: 'Pomodori', grams: 300, date: '2026-10-16', category: 'produce' },
  { id: 'spinach', name: 'Spinaci', grams: 200, date: '2026-10-15', category: 'produce' },
  { id: 'egg', name: 'Uova', grams: 240, date: '2026-10-20', category: 'dairy' },
  { id: 'old', name: 'Pane', grams: 100, date: '2026-10-14', category: 'bakery' }
];

test('prioritises near-date food and excludes past-date food from recipes', () => {
  const plan = makePlan(pantry, today);
  assert.equal(plan.summary.rescueItems, 2);
  assert.equal(plan.summary.atRiskGrams, 500);
  assert.equal(plan.summary.reviewItems, 1);
  assert.equal(plan.items[0].urgency, 'check');
  assert.ok(plan.recipes.some(recipe => recipe.id === 'frittata'));
  assert.ok(plan.recipes.every(recipe => recipe.ingredients.every(item => item.id !== 'old')));
});

test('validates names, amounts, dates and inventory size', () => {
  assert.throws(() => validateItems([{ name: '', grams: 10, date: '2026-10-15' }]));
  assert.throws(() => validateItems([{ name: 'Tomato', grams: -1, date: '2026-10-15' }]));
  assert.throws(() => validateItems([{ name: 'Tomato', grams: 10, date: 'not-a-date' }]));
  assert.throws(() => validateItems([{ name: 'Tomato', grams: 10, date: '2026-02-30' }]));
  assert.throws(() => validateItems(Array(101).fill(pantry[0])));
});

test('HTTP API serves app, returns plan and rejects invalid requests', async t => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /ShelfLoop/);
  const response = await fetch(base + '/api/plan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ items: pantry }) });
  assert.equal(response.status, 200);
  const plan = await response.json();
  assert.equal(plan.summary.totalItems, 4);
  const invalid = await fetch(base + '/api/plan', { method: 'POST', body: '{bad' });
  assert.equal(invalid.status, 400);
  const invalidItem = await fetch(base + '/api/plan', { method: 'POST', body: JSON.stringify({ items: [{ name: '', grams: 0, date: '2026-10-15' }] }) });
  assert.equal(invalidItem.status, 400);
  const ai = await fetch(base + '/api/ai-plan', { method: 'POST', body: JSON.stringify({ items: pantry }) });
  assert.equal(ai.status, 503);
});

test('local AI integration parses Ollama JSON contract', async t => {
  const mock = createServer(async (req, res) => {
    assert.equal(req.url, '/api/generate');
    let body = '';
    for await (const chunk of req) body += chunk;
    const request = JSON.parse(body);
    assert.equal(request.model, 'test-local-model');
    assert.match(request.prompt, /Pomodori/);
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify({ response: JSON.stringify({ suggestions: [{ title: 'Tomato toast', steps: 'Cook tomatoes and serve on toast.', uses: ['tomato'], caution: 'Check the food before eating.' }, { title: 'Unknown food', steps: 'Use an unlisted item.', uses: ['invented'], caution: '' }] }) }));
  });
  await new Promise(resolve => mock.listen(0, '127.0.0.1', resolve));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { mock.close(); server.close(); delete process.env.OLLAMA_MODEL; delete process.env.OLLAMA_PORT; });
  process.env.OLLAMA_MODEL = 'test-local-model';
  process.env.OLLAMA_PORT = String(mock.address().port);
  const response = await fetch(`http://127.0.0.1:${server.address().port}/api/ai-plan`, { method: 'POST', body: JSON.stringify({ items: pantry }) });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.provider, 'local Ollama');
  assert.equal(result.suggestions[0].title, 'Tomato toast');
  assert.deepEqual(result.suggestions[0].uses, ['Pomodori']);
  assert.equal(result.suggestions.length, 1);
});
