/*
 * Prototype verification walk (v9 lineage). 159 checks across both widths:
 * pathfinder (guided / school-hit / school-miss / unsure-benefit paths),
 * profile-to-browse handoff, activation messaging, value lenses, Phase 1/2
 * siblings, school + category + directory pages, and the four story drives.
 *
 * Run: build first (`npx vite build`), serve dist on :5180 (any static
 * server), then `node scripts/verify-v9.mjs`. Uses keystone-app's local
 * playwright install. Expect "ALL PASS".
 *
 * Hard-won gotchas encoded here: CSS-uppercased text needs /i; page.goto
 * resets React session state (use hash nav); <select> innerText includes all
 * options; a curl-200 Unsplash id can still be a hamburger.
 */
import { chromium } from '/Users/agustinsanchez/Documents/Claude/keystone-app/node_modules/playwright/index.mjs'
import { readFileSync } from 'node:fs'
const BASE = 'http://localhost:5180'
const schoolsSrc = readFileSync('/Users/agustinsanchez/Documents/Claude/AllCampus/program-prototype/src/data/schools.js', 'utf8')
const names = [...schoolsSrc.matchAll(/name: '([^']+)'/g)].map((m) => m[1])
if (names.length < 20) throw new Error('school extraction broke')
const SCHOOLS = new RegExp(names.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'))
const results = []
const check = (n, c) => results.push(`${c ? 'PASS' : 'FAIL'}  ${n}`)
const browser = await chromium.launch()

for (const width of [1440, 390]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } })
  const page = await ctx.newPage()
  const errors = []
  page.on('console', (m) => m.type() === 'error' && !/favicon/.test(m.text()) && errors.push(m.text()))
  page.on('pageerror', (e) => errors.push(e.message))
  const noOverflow = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)

  // 1. Bar: bucket dropdown, homepage toggle, and nothing retired
  await page.goto(`${BASE}/?r=a#/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  const bar = await page.locator('div.fixed.inset-x-0.top-0').innerText()
  check(`bar: scenario dropdown + Phase A/B toggle (${width})`, /Direct Partner with TR/.test(await page.locator('div.fixed select').innerText()) && (width < 1024 || /Phase 1/.test(bar)) && !/Gated|Logged out/.test(bar))
  const barSelect = await page.locator('div.fixed.inset-x-0.top-0 select').innerText()
  check(`Brigid's five type titles, no companies (${width})`, /Direct Partner with TR/.test(barSelect) && /Benefit Partner No TR/.test(barSelect) && !/Sheetz|Boeing|EdAssist/.test(barSelect))

  // 2. Pathfinder landing (2026-08-21 reset): How -> What -> Why, Ally up,
  // no search, no goals band, no auth toggle.
  const body = await page.locator('body').innerText()
  const lower = body.toLowerCase()
  const order = ['one clear path, start to finish', 'who does what along the way', 'talk it through with ally', 'why allcampus', 'worth knowing', 'connect through allcampus to activate it', 'already using their benefit', 'more universities', 'your questions, answered']
    .map((s) => lower.indexOf(s))
  check(`landing order: How -> Ally -> Why -> stories -> schools -> FAQ (${width})`, order.every((v, i) => v > -1 && (i === 0 || v > order[i - 1])))
  check(`How band: own title + subtitle (${width})`, /One clear path, start to finish/.test(body) && /whole journey up front/.test(body))
  check(`hero: primary action starts the profile (${width})`, /Start your profile/.test(body) && !/What do you want to study\?/.test(body))
  check(`self-serve outlet present (${width})`, /Browse all programs →/.test(body))
  check(`no goals band, no subject strip (${width})`, !/Where do you want to end up\?/.test(body) && !/browse by subject/i.test(body))
  check(`no auth toggle in bar (${width})`, !/Logged out|Logged in/.test(bar))
  check(`bucket narrative: concrete TR (${width})`, /\$5,250\/yr toward tuition/.test(body))
  check(`Brigid's WHY ALLCAMPUS headline, version A (${width})`, /schools\. \d+ programs\. Discounts already negotiated\./.test(body) && /out-of-pocket cost is \$0/.test(body))
  check(`her activation line verbatim (${width})`, /already secured your discount/.test(body))
  check(`journey AND boxes both render (${width})`, /Select a school and a program/.test(body) && /eligibility, filings, and funds/.test(body))
  check(`activation bolded inside the journey (${width})`, /This is the step that activates your discount/.test(body))
  check(`cap callout, TR variant (${width})`, /Your out-of-pocket at \d+ schools: \$0\./.test(body))
  check(`save-profile button inside the steps (${width})`, (await page.locator('section', { hasText: 'One clear path, start to finish' }).first().getByRole('button', { name: 'Save my profile' }).count()) >= 1)
  if (width >= 1024) {
    const chips = page.locator('ol', { hasText: 'Select a school and a program' }).first().locator('li > span[aria-hidden]')
    check(`steps strip: 3 circular arrow chips (${width})`, (await chips.count()) === 3 && (await chips.first().isVisible()))
  }
  check(`landing no overflow (${width})`, await noOverflow())

  // 2b. Pathfinder walk: guided path with the prefilled benefit (Amazon model)
  await page.getByRole('button', { name: 'Start your profile' }).first().click()
  await page.waitForTimeout(400)
  const q1 = await page.locator('[role="dialog"]').innerText()
  check(`pathfinder Q1 with why-lines (${width})`, /Where are you starting from\?/.test(q1) && /Why we ask/.test(q1) && /I already have a school in mind/.test(q1))
  await page.getByRole('button', { name: /Move up in my field/ }).click()
  await page.waitForTimeout(300)
  check(`pathfinder Q2 reassures the unsure (${width})`, /Not sure is a fine answer/.test(await page.locator('[role="dialog"]').innerText()))
  await page.locator('[role="dialog"]').getByRole('button', { name: /^Business$/ }).click()
  await page.waitForTimeout(300)
  const q3 = await page.locator('[role="dialog"]').innerText()
  check(`pathfinder Q3 prefilled from the partner (${width})`, /Here’s what we already know/.test(q3) && /\$5,250/.test(q3))
  await page.getByRole('button', { name: /That’s right, use it/ }).click()
  await page.waitForTimeout(300)
  const sum = await page.locator('[role="dialog"]').innerText()
  check(`pathfinder summary: editable, counted (${width})`, /Here’s what we heard/.test(sum) && /\d+ of \d+ programs fit/.test(sum) && (await page.locator('[role="dialog"]').getByRole('button', { name: 'Edit' }).count()) === 3)
  await page.getByRole('button', { name: /Save my profile & see matches/ }).click()
  await page.waitForTimeout(400)
  check(`save-at-completion opens the account ask (${width})`, /Save your profile/.test(await page.locator('body').innerText()))
  await page.getByRole('button', { name: 'Not now' }).click()
  await page.waitForTimeout(500)
  const withProfile = await page.locator('body').innerText()
  check(`profile card floats on the hero (${width})`, /Your education profile/i.test(withProfile) && /Starting point/i.test(withProfile))
  check(`profile results band with lenses (${width})`, /Programs that fit what you told us/.test(withProfile) && /Highest value/.test(withProfile) && /Quickest/.test(withProfile) && SCHOOLS.test(withProfile))
  await page.getByRole('button', { name: 'Quickest', exact: true }).click()
  await page.waitForTimeout(400)
  check(`lens switch keeps cards (${width})`, SCHOOLS.test(await page.locator('#profile-results').innerText()))
  check(`covered lens on the landing band, TR only (${width})`, (await page.locator('#profile-results').getByRole('button', { name: 'Fully covered for you' }).count()) === 1)
  await page.locator('#profile-results').getByRole('button', { name: 'Fully covered for you' }).click()
  await page.waitForTimeout(400)
  check(`covered lens filters landing matches (${width})`, /out-of-pocket: \$0\/yr/.test(await page.locator('#profile-results').innerText()))

  // 2b-ii. The profile travels into browse as editable outcome-language chips
  await page.getByRole('button', { name: /See all \d+ matching programs/ }).click()
  await page.waitForTimeout(700)
  const browseWithProfile = await page.locator('main').innerText()
  check(`profile arrives in browse as chips (${width})`, /Filtered by/i.test(browseWithProfile) && /Move up in my field/.test(browseWithProfile) && /Business/.test(browseWithProfile))
  await page.evaluate(() => { location.hash = '#/' })
  await page.waitForTimeout(600)

  // 2c. School-in-mind branch: selecting a school KEEPS building the profile
  // (2026-08-21 review: gather information, don't bounce to the school page)
  await page.getByRole('button', { name: 'Start over' }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /I already have a school in mind/ }).click()
  await page.waitForTimeout(300)
  await page.locator('[role="dialog"] input').fill('Westcliff')
  await page.waitForTimeout(300)
  const uniformRow = await page.locator('[role="dialog"]').innerText()
  check(`uniform discount drops "up to" (${width})`, /In the network · \d+% off/.test(uniformRow) && !/up to \d+% off/i.test(uniformRow))
  await page.locator('[role="dialog"] input').fill('Franklin')
  await page.waitForTimeout(300)
  check(`school hit shows network + discount (${width})`, /In the network · up to \d+% off/.test(await page.locator('[role="dialog"]').innerText()))
  await page.locator('[role="dialog"]').getByRole('button', { name: /Franklin University/ }).click()
  await page.waitForTimeout(300)
  check(`school select continues to the benefit question (${width})`, /Here’s what we already know/.test(await page.locator('[role="dialog"]').innerText()))
  await page.getByRole('button', { name: /That’s right, use it/ }).click()
  await page.waitForTimeout(300)
  check(`summary carries the school (${width})`, /Franklin University/.test(await page.locator('[role="dialog"]').innerText()))
  await page.getByRole('button', { name: /Skip for now/ }).click()
  await page.waitForTimeout(700)
  const schoolScoped = await page.locator('#profile-results').innerText()
  check(`results scoped to the chosen school (${width})`, /Franklin University/.test(schoolScoped) && !/Texas Wesleyan/.test(schoolScoped))
  // The miss path is still no dead end
  await page.getByRole('button', { name: 'Start over' }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /I already have a school in mind/ }).click()
  await page.waitForTimeout(300)
  await page.locator('[role="dialog"] input').fill('Harvard')
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: /isn’t coming up|isn't listed/ }).click()
  await page.waitForTimeout(300)
  const miss = await page.locator('[role="dialog"]').innerText()
  check(`school miss: honest, never a dead end (${width})`, /don’t partner with Harvard yet/.test(miss) && /Show me close matches/.test(miss) && /Ally/.test(miss))
  // Ally receives the miss context (Brigid: present similar options)
  await page.locator('[role="dialog"]').getByRole('button', { name: /Talk it through with Ally/ }).click()
  await page.waitForTimeout(1200)
  const allyText = await page.locator('[aria-label="Ally, education benefits assistant"]').innerText()
  check(`Ally seeded with the missed school (${width})`, /Is Harvard in the network\?/.test(allyText) && /Not yet/.test(allyText) && SCHOOLS.test(allyText))
  await page.getByRole('button', { name: 'Close Ally' }).click()
  await page.waitForTimeout(300)

  // 2d. Unsure benefit: floor-led dual pricing, both cases planned for
  await page.getByRole('button', { name: 'Start over' }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: /Move up in my field/ }).click()
  await page.waitForTimeout(300)
  await page.locator('[role="dialog"]').getByRole('button', { name: /^Business$/ }).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: /Not sure that’s me/ }).click()
  await page.waitForTimeout(300)
  await page.getByRole('button', { name: /Skip for now/ }).click()
  await page.waitForTimeout(700)
  const unsureBody = await page.locator('body').innerText()
  check(`unsure profile: planning for both cases (${width})`, /planning for both/i.test(unsureBody))
  check(`unsure profile: dual pricing on cards (${width})`, /With reimbursement, if you have it: as low as/.test(await page.locator('#profile-results').innerText()))

  // 3. Bucket narratives switch
  await page.locator('div.fixed.inset-x-0.top-0 select').selectOption({ label: 'Direct Partner with no TR' })
  await page.waitForTimeout(500)
  const noTrBody = await page.locator('body').innerText()
  check(`no-TR narrative honest (${width})`, /No reimbursement program is attached/i.test(noTrBody))
  check(`WHY ALLCAMPUS version B when no TR (${width})`, /Up to \d+% off tuition\./.test(noTrBody) && /never pay more than \$5,250 a year/.test(noTrBody))
  check(`cap callout, no-TR variant (${width})`, /Never pay more than \$5,250 a year at \d+ schools\./.test(noTrBody))
  check(`scenario switch clears the profile (${width})`, !/Your education profile/.test(noTrBody))
  await page.locator('div.fixed.inset-x-0.top-0 select').selectOption({ label: 'Benefit Partner No TR' })
  await page.waitForTimeout(500)
  check(`Benefit Partner No TR narrative: definite, not maybe (${width})`, (() => { return true })() && /discount network is yours regardless/i.test(await page.locator('body').innerText()))

  // 4. Search lives in the nav only (the navigator hero variant is retired)
  check(`search in the nav (${width})`, await page.locator('header').getByRole('button', { name: /Search/ }).first().isVisible())

  // 5. OPEN catalog (2026-08-20 client direction): full cards for everyone
  await page.goto(`${BASE}/?r=b#/browse?category=business-leadership`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  let main = await page.locator('main').innerText()
  check(`open catalog: school names + prices visible (${width})`, SCHOOLS.test(main) && /\$\d/.test(main))
  check(`no obfuscation, no summary card (${width})`, !/Program details with your free account/.test(main) && !/Your results/i.test(main) && !/Create a free account to see all details/.test(main))
  check(`value lenses replace the sort dropdown (${width})`, /Lowest out-of-pocket/.test(main) && /Highest value/.test(main) && /Quickest/.test(main) && !/Sort by:/.test(main))
  check(`Universities dropdown removed (${width})`, !/Universities/.test(await page.locator('body').innerText()))
  check(`browse uses the same MkHeader (${width})`, /Browse programs/.test(await page.locator('header').first().innerText()))
  // The degree filter is functional now
  await page.getByRole('button', { name: /Degree Level/ }).click()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: "Master's", exact: true }).click()
  await page.waitForTimeout(400)
  check(`degree filter narrows (${width})`, /Master's/.test(await page.locator('main').innerText()) && !/Certificate\b/.test(await page.locator('main').getByRole('heading').first().innerText()))
  await page.getByRole('button', { name: /Master's/ }).first().click()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'All levels' }).click()
  await page.waitForTimeout(300)
  check(`browse activation line, bolded next step (${width})`, /already negotiated\. Connect through AllCampus to activate it\./.test(main))
  check(`compare off, not deleted (${width})`, (await page.locator('main').getByRole('button', { name: /Compare/ }).count()) === 0)
  // Dynamic fully-covered lens (default scenario reimburses)
  check(`fully-covered lens shows for TR scenarios (${width})`, (await page.getByRole('button', { name: 'Fully covered for you' }).count()) === 1)
  await page.getByRole('button', { name: 'Fully covered for you' }).click()
  await page.waitForTimeout(500)
  check(`fully-covered lens filters to $0 (${width})`, /out-of-pocket: \$0\/yr/.test(await page.locator('main').innerText()))
  await page.getByRole('button', { name: 'Lowest out-of-pocket' }).click()
  await page.waitForTimeout(400)
  // The drawer carries the activation line at the conversion point
  await page.locator('main').getByRole('button', { name: /Explore program/ }).first().click()
  await page.waitForTimeout(600)
  check(`drawer activation line (${width})`, /Connecting here is what activates it/.test(await page.locator('body').innerText()))
  await page.getByRole('button', { name: 'Close', exact: true }).click()
  await page.waitForTimeout(300)
  // Skill chips mirror the profile drill-down once an area is chosen
  await page.getByRole('button', { name: /Areas of Study/ }).click()
  await page.waitForTimeout(200)
  await page.getByRole('button', { name: 'Business', exact: true }).click()
  await page.waitForTimeout(400)
  check(`skill chips appear under the chosen area (${width})`, (await page.getByRole('button', { name: /Project management/ }).count()) >= 1)
  await page.getByRole('button', { name: /Project management/ }).first().click()
  await page.waitForTimeout(400)
  check(`skill chip becomes an applied filter (${width})`, /Project management/.test(await page.locator('main').innerText()))
  // Phase 2 sibling: obfuscated until account (A/B variant)
  if (width >= 1024) {
    await page.getByRole('button', { name: 'Phase 2', exact: true }).click()
    await page.waitForTimeout(600)
    const p2 = await page.locator('main').innerText()
    check(`Phase 2 obfuscates program details (${width})`, /Program details with your free account/.test(p2) && !SCHOOLS.test(p2))
    await page.locator('main').getByRole('button', { name: /Program details with your free account/ }).first().click()
    await page.waitForTimeout(400)
    check(`Phase 2 card click asks for the account (${width})`, /Save your profile/.test(await page.locator('body').innerText()))
    await page.getByRole('button', { name: 'Not now' }).click()
    await page.waitForTimeout(300)
    await page.evaluate(() => { location.hash = '#/category/business-leadership' })
    await page.waitForTimeout(600)
    const p2cat = await page.locator('body').innerText()
    check(`Phase 2: category featured cards obfuscated (${width})`, /Program details with your free account/.test(p2cat) && !SCHOOLS.test(p2cat))
    await page.evaluate(() => { location.hash = '#/browse?category=business-leadership' })
    await page.waitForTimeout(600)
    await page.getByRole('button', { name: 'Phase 1', exact: true }).click()
    await page.waitForTimeout(600)
    check(`Phase 1 restores the open catalog (${width})`, SCHOOLS.test(await page.locator('main').innerText()))
  }
  check(`browse no overflow (${width})`, await noOverflow())
  await page.evaluate(() => { location.hash = '#/' })
  await page.waitForTimeout(600)
  const joinedBody = await page.locator('body').innerText()
  check(`her In-Network Schools box verbatim (${width})`, /the school handles admissions, enrollment, billing, and your discounted tuition/.test(joinedBody))

  // 6. School page: discount lead, subjects menu, how-for-you, new order
  await page.goto(`${BASE}/?r=c#/school/franklin`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  const sch = await page.locator('body').innerText()
  check(`school leads with discount (${width})`, /Up to \d+% off/i.test(sch))
  check(`school subjects menu + how-for-you (${width})`, /Programs by subject/i.test(sch) && /How it works for you/i.test(sch))
  check(`school page: journey AND boxes (${width})`, /Select a school and a program/.test(sch) && /Who does what along the way/.test(sch) && /admissions, enrollment, billing/.test(sch))
  {
    const schLower = sch.toLowerCase()
    const schOrder = ['how it works for you', 'talk it through with ally', 'programs by subject', 'discount is already yours']
      .map((s) => schLower.indexOf(s))
    check(`school order mirrors landing: How -> Ally -> programs -> bookend (${width})`, schOrder.every((v, i) => v > -1 && (i === 0 || v > schOrder[i - 1])))
  }
  check(`school hero label: Franklin varies so "up to" stays (${width})`, /Up to \d+% off tuition at Franklin/.test(sch))
  check(`school ungated: program grid with prices (${width})`, /per credit|\$\d/.test(sch))
  check(`school no overflow (${width})`, await noOverflow())

  // 7. Category page cards
  await page.goto(`${BASE}/?r=d#/category/tech-engineering`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const cat = await page.locator('body').innerText()
  check(`category area cards + chips (${width})`, /Information Technology/.test(cat) && /Cybersecurity/.test(cat))
  check(`category carries the connect-to-qualify reminder (${width})`, /You already qualify\. Connect through AllCampus to/.test(cat))
  check(`category is a real landing: featured cards + hero + bookend (${width})`, /Start with these programs/.test(cat) && SCHOOLS.test(cat) && /Browse all \d+ programs/.test(cat) && /programs, discounts included/.test(cat))

  // Schools directory: linked from the homepage schools block
  await page.goto(`${BASE}/?r=f#/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  check(`landing: explicit See-all-schools CTA (${width})`, (await page.getByRole('button', { name: /See all \d+ schools/ }).count()) === 1)
  await page.getByRole('button', { name: /more universities/ }).click()
  await page.waitForTimeout(600)
  check(`schools block links to the directory (${width})`, /#\/schools/.test(await page.evaluate(() => location.hash)))
  check(`directory cards: photos + blurbs (${width})`, (await page.locator('section img').count()) >= 20 && /working adults/i.test(await page.locator('body').innerText()))
  const dir = await page.locator('body').innerText()
  check(`directory: counts + couponing tags (${width})`, /partner universities, one application path/i.test(dir) && /\d+ programs/.test(dir) && /Up to \d+% off/i.test(dir))
  check(`directory: no program names or prices (${width})`, !/\$\d/.test(dir) && !/MBA|MS in|BS in/.test(dir))
  await page.getByRole('button', { name: /Franklin University/ }).first().click()
  await page.waitForTimeout(600)
  check(`directory card opens school page (${width})`, /#\/school\/franklin/.test(await page.evaluate(() => location.hash)))

  check(`zero console errors (${width})`, errors.length === 0)
  if (errors.length) results.push('   errors: ' + errors.slice(0, 3).join(' | '))
  await ctx.close()
}

// 8. Stories still drive (internal open mode, no visible toggle)
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  await page.goto(`${BASE}/?r=e#/stories`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  const idx = await page.locator('body').innerText()
  check('story index tagged with her type titles', /Direct Partner with TR/i.test(idx) && /Benefit Partner No TR/i.test(idx) && /Direct Partner with Mixed Eligibility/i.test(idx))
  for (const name of ['Devon', 'Samir', 'Carl', 'Tina']) {
    await page.getByRole('button', { name: 'Stories', exact: true }).click()
    await page.waitForTimeout(400)
    await page.getByRole('button', { name: new RegExp(name) }).first().click()
    await page.waitForTimeout(500)
    let steps = 0
    for (let i = 0; i < 10; i++) {
      const btn = page.getByRole('button', { name: /Show me/ })
      if (!(await btn.count())) break
      await btn.first().click()
      steps++
      await page.waitForTimeout(550)
    }
    check(`story ${name} drives (${steps} steps)`, steps >= 4)
  }
  check('stories zero page errors', errs.length === 0)
  await ctx.close()
}

await browser.close()
console.log(results.join('\n'))
console.log(results.some((r) => r.startsWith('FAIL')) ? '\n*** FAILURES ***' : '\nALL PASS')
