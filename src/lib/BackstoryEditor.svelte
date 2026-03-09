<script>
  import { onMount } from 'svelte';
  import { generateCharacterName, initNameGen } from './generators/nameGenerator.js';
  import { ALIGNMENTS, getAlignmentName, getAlignmentGrid, getAllowedAlignmentsForClass } from '../data/alignment.js';
  import { deities } from '../data/deities.js';
  import Tooltip from './Tooltip.svelte';
  import Collapsible from './components/Collapsible.svelte';
  import BtnSelect from './components/BtnSelect.svelte';
  import { settings, formatHeight as fmtHeight, formatWeight as fmtWeight } from './settings.svelte.js';
  import { pick, randomInt } from './utils/randomUtils.js';
  import { untrack } from 'svelte';

  function rollDice(count, sides) {
    let total = 0;
    for (let i = 0; i < count; i++) total += randomInt(1, sides);
    return total;
  }

  const alignmentDescriptions = [
    'Honorable protectors who uphold law and justice. Think: a holy knight sworn to defend the weak.',
    'Compassionate do-gooders who help others regardless of rules. Think: a wandering healer who aids anyone in need.',
    'Free-spirited champions of liberty and kindness. Think: a rebel fighting to free the oppressed.',
    'Disciplined individuals who value order above all. Think: a judge who follows the letter of the law, regardless of outcome.',
    'Pragmatists who act without strong moral or ethical bias. Think: a druid who serves the balance of nature.',
    'Independent spirits who follow their own whims. Think: a wandering bard who goes wherever the wind takes them.',
    'Tyrants who use rules and systems to dominate others. Think: a cruel warlord who rules through iron law.',
    'Selfish schemers who do whatever benefits themselves. Think: a mercenary who sells their sword to the highest bidder.',
    'Destructive agents of disorder and cruelty. Think: a demon-worshipping cultist who revels in mayhem.',
  ];

  let { character, onComplete } = $props();

  let name = $state(untrack(() => character.name || ''));
  let sex = $state(untrack(() => character.sex || 'Male'));
  let alignment = $state(untrack(() => {
    if (character.alignment !== undefined) return character.alignment;
    const deityAlignment = character.deityKey ? deities[character.deityKey]?.alignment : null;
    let allowed = getAllowedAlignmentsForClass(character.classKey, deityAlignment);
    if (character.kit?.alignments) allowed = allowed.filter(a => character.kit.alignments.includes(a));
    return allowed.includes(ALIGNMENTS.N) ? ALIGNMENTS.N : allowed[0];
  }));
  let backstory = $state(untrack(() => character.backstory || ''));
  let age = $state(untrack(() => character.age || ''));
  let lastAgeRoll = $state(null);  // { base, diceCount, diceSides, rolled, total }
  let lastNameMeta = $state(null); // { race, gender, geography, style } from generator
  // Store height/weight as raw numbers (inches/lbs) for reactive formatting
  let heightInches = $state(untrack(() => character.heightInches || 0));
  let weightLbs = $state(untrack(() => character.weightLbs || 0));
  let eyes = $state(untrack(() => character.eyes || ''));
  let hair = $state(untrack(() => character.hair || ''));

  // Story details — ephemeral, only used to enrich the AI prompt
  let storyDetails = $state({ origin: '', motivation: '', traits: '', secret: '' });

  const ORIGIN_OPTIONS = ['', 'Village commoner', 'City-born', 'Noble family', 'Merchant family', 'Soldier/militia', 'Criminal background', 'Orphan', 'Wilderness/frontier', 'Religious upbringing', 'Scholarly household'];
  const MOTIVATION_OPTIONS = ['', 'Seeking wealth', 'Chasing glory', 'Driven by revenge', 'Bound by duty', 'Pursuing knowledge', 'Seeking redemption', 'Protecting loved ones', 'Fleeing a past', 'Simply restless', 'Following a prophecy'];

  // Name generation settings
  let nameSettings = $state({
    geography: 'random',
    style: 'random'
  });

  const geographies = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert'];
  const namingStyles = [
    { value: 'standard',   label: 'Standard' },
    { value: 'patronymic', label: 'Patronymic' },
    { value: 'lineage',    label: 'Clan / House' }
  ];

  const lineageRaces = ['dwarf', 'elf', 'human', 'halfElf'];

  function isStyleAvailable(styleValue) {
    if (styleValue === 'lineage') return lineageRaces.includes(character.raceKey);
    return true;
  }

  // Reactive formatted display
  let heightDisplay = $derived(heightInches > 0 ? fmtHeight(heightInches) : '');
  let weightDisplay = $derived(weightLbs > 0 ? fmtWeight(weightLbs) : '');
  // deity is now selected in ClassSelector (step 2) — display only here if set
  let deity = $derived(character.deityKey ? (character.deity || '') : '');

  // Tooltip hints showing typical ranges for the selected race
  let raceHints = $derived(() => {
    const r = raceDetails[character.raceKey] || raceDetails.human;
    const raceName = character.race?.name || 'Human';
    const isElven = character.raceKey === 'elf' || character.raceKey === 'halfElf';
    const { ageBase, ageDice: ad } = r;
    const ageMin = ageBase + ad.d;
    const ageMax = ageBase + ad.d * ad.s;
    return {
      age: `${raceName}: ${ageBase} + ${ad.d}d${ad.s} (${ageMin}–${ageMax})`,
      height: `${raceName}: M ${fmtHeight(r.htBaseM)}+${r.htDice.d}d${r.htDice.s}, F ${fmtHeight(r.htBaseF)}+${r.htDice.d}d${r.htDice.s}`,
      weight: `${raceName}: M ${fmtWeight(r.wtBaseM)}+${r.wtDice.d}d${r.wtDice.s}, F ${fmtWeight(r.wtBaseF)}+${r.wtDice.d}d${r.wtDice.s}`,
      eyes: `Common: ${(isElven ? elfEyeColors : eyeColors).join(', ')}`,
      hair: `Common: ${(isElven ? elfHairColors : hairColors).join(', ')}`,
    };
  });

  // Get alignment grid (3x3 array of numbers)
  const alignmentGrid = getAlignmentGrid();

  // Get allowed alignments based on class, deity, and kit restrictions
  const allowedAlignments = $derived(() => {
    const deityAlignment = character.deityKey ? deities[character.deityKey]?.alignment : null;
    let allowed = getAllowedAlignmentsForClass(character.classKey, deityAlignment);
    if (character.kit?.alignments) {
      allowed = allowed.filter(a => character.kit.alignments.includes(a));
    }
    return allowed;
  });

  function alignmentWarning(alignNum) {
    const deityAlignment = character.deityKey ? deities[character.deityKey]?.alignment : null;
    const classAllowed = getAllowedAlignmentsForClass(character.classKey, deityAlignment);
    if (!classAllowed.includes(alignNum)) return 'Not available for your class or deity';
    if (character.kit?.alignments && !character.kit.alignments.includes(alignNum)) {
      return `Not available for the ${character.kit.name} kit`;
    }
    return '';
  }

  // 2E PHB Table 11 (age) + Table 10 (height/weight) — base + dice by race
  const raceDetails = {
    //             age              height (in)                    weight (lbs)
    human:    { ageBase: 15,  ageDice: {d:1, s:4},  htBaseM: 60, htBaseF: 59, htDice: {d:2, s:10}, wtBaseM: 140, wtBaseF: 100, wtDice: {d:6, s:10} },
    dwarf:    { ageBase: 40,  ageDice: {d:5, s:6},  htBaseM: 43, htBaseF: 41, htDice: {d:1, s:10}, wtBaseM: 130, wtBaseF: 105, wtDice: {d:4, s:10} },
    elf:      { ageBase: 100, ageDice: {d:5, s:6},  htBaseM: 55, htBaseF: 50, htDice: {d:1, s:10}, wtBaseM: 90,  wtBaseF: 70,  wtDice: {d:3, s:10} },
    gnome:    { ageBase: 60,  ageDice: {d:3, s:12}, htBaseM: 38, htBaseF: 36, htDice: {d:1, s:6},  wtBaseM: 72,  wtBaseF: 68,  wtDice: {d:5, s:4}  },
    halfElf:  { ageBase: 15,  ageDice: {d:1, s:6},  htBaseM: 60, htBaseF: 58, htDice: {d:2, s:6},  wtBaseM: 110, wtBaseF: 85,  wtDice: {d:3, s:12} },
    halfling: { ageBase: 20,  ageDice: {d:3, s:4},  htBaseM: 32, htBaseF: 30, htDice: {d:2, s:8},  wtBaseM: 52,  wtBaseF: 48,  wtDice: {d:5, s:4}  },
  };

  const eyeColors = ['Brown', 'Hazel', 'Green', 'Blue', 'Grey', 'Amber', 'Black'];
  const hairColors = ['Black', 'Dark Brown', 'Brown', 'Auburn', 'Red', 'Blonde', 'Sandy', 'Grey', 'White'];
  const elfEyeColors = ['Green', 'Blue', 'Violet', 'Gold', 'Silver', 'Amber'];
  const elfHairColors = ['Silver', 'Gold', 'Blonde', 'Black', 'Copper', 'White'];

  function randomizeDetails() {
    const r = raceDetails[character.raceKey] || raceDetails.human;
    const isFemale = sex === 'Female';
    const { ageBase, ageDice: ad } = r;
    const rolled = rollDice(ad.d, ad.s);
    age = String(ageBase + rolled);
    lastAgeRoll = { base: ageBase, diceCount: ad.d, diceSides: ad.s, rolled, total: ageBase + rolled };
    heightInches = (isFemale ? r.htBaseF : r.htBaseM) + rollDice(r.htDice.d, r.htDice.s);
    weightLbs = (isFemale ? r.wtBaseF : r.wtBaseM) + rollDice(r.wtDice.d, r.wtDice.s);
    const isElven = character.raceKey === 'elf' || character.raceKey === 'halfElf';
    eyes = pick(isElven ? elfEyeColors : eyeColors);
    hair = pick(isElven ? elfHairColors : hairColors);
  }

  // Auto-randomize on mount if enabled and fields are empty
  onMount(() => {
    initNameGen();
    if (settings.autoRandomize && !age && heightInches === 0 && weightLbs === 0 && !eyes && !hair) {
      randomizeDetails();
    }
  });

  function confirm() {
    const safeAlignment = allowedAlignments().includes(alignment) ? alignment : allowedAlignments()[0];
    onComplete({
      name: name.trim() || 'Unnamed Hero',
      sex,
      alignment: safeAlignment,
      backstory: backstory.trim(),
      age: age.trim(),
      heightInches: heightInches || null,
      weightLbs: weightLbs || null,
      eyes: eyes.trim(),
      hair: hair.trim(),
      deity: deity,
    });
  }

  function randomizeName() {
    const result = generateCharacterName({
      race: character.raceKey,
      gender: sex,
      geography: nameSettings.geography,
      style: nameSettings.style
    });

    name = result.name;
    lastNameMeta = result.meta;
  }

  function generatePlaceholder() {
    const race = character.race?.name || 'mysterious';
    const cls = character.wizardSchool?.name || character.cls?.name || 'adventurer';
    return `Write your character's backstory here...\n\nWho is this ${race} ${cls}? Where did they come from? What drives them to adventure?`;
  }

  let charCount = $derived(backstory.length);
  let copied = $state(false);

  function copyAiPrompt() {
    const facts = characterInsights().join(' ');
    const extras = [
      storyDetails.origin     && `Background: ${storyDetails.origin}.`,
      storyDetails.motivation && `Motivation: ${storyDetails.motivation}.`,
      storyDetails.traits     && `Personality: ${storyDetails.traits}.`,
      storyDetails.secret     && `A secret or burden: ${storyDetails.secret}.`,
    ].filter(Boolean).join('\n');
    const prompt = [
      `Write a 2-3 paragraph backstory for the following AD&D 2nd Edition character:`,
      ``,
      facts,
      extras ? `\nAdditional details:\n${extras}` : '',
      `\nKeep it grounded in a classic fantasy world. Focus on their origins, what drove them to adventure, and what defines their personality. Do not invent contradictions with the facts above.`,
    ].join('\n');
    navigator.clipboard.writeText(prompt).then(() => {
      copied = true;
      setTimeout(() => copied = false, 2000);
    });
  }

  // PHB Table 11 max base ages for life stage calculation
  const raceMaxAge = { human: 90, dwarf: 250, elf: 350, gnome: 200, halfElf: 125, halfling: 100 };

  const CLASS_FLAVOR = {
    fighter: 'a seasoned warrior trained in the art of combat',
    paladin: 'a holy warrior bound by a strict code of honor and chivalry',
    ranger:  'a skilled hunter and tracker at home in the wilderness',
    mage:    'a student of the arcane arts who has spent years mastering spells',
    cleric:  'a devotee of the divine, channeling holy power through faith',
    druid:   'a servant of nature and guardian of the natural balance',
    thief:   'a cunning operative skilled in stealth, locks, and sleight of hand',
    bard:    'a wandering performer with a gift for music, lore, and subtle magic',
  };

  const ABILITY_HIGH = {
    STR: (p) => `${p.pos} exceptional strength (STR ${p.val}) marks ${p.obj} above most.`,
    DEX: (p) => `${p.subj} is unusually nimble and quick-reflexed (DEX ${p.val}).`,
    CON: (p) => `${p.subj} is remarkably tough and built to endure hardship (CON ${p.val}).`,
    INT: (p) => `${p.subj} has a sharp, quick mind with a gift for learning (INT ${p.val}).`,
    WIS: (p) => `${p.subj} is deeply perceptive and sound in judgment (WIS ${p.val}).`,
    CHA: (p) => `${p.subj} is naturally commanding — people tend to listen (CHA ${p.val}).`,
  };

  const ABILITY_LOW = {
    STR: (p) => `${p.subj} is physically weaker than most (STR ${p.val}).`,
    DEX: (p) => `${p.subj} is clumsy or uncoordinated in movement (DEX ${p.val}).`,
    CON: (p) => `${p.subj} has a frail constitution — not built for punishment (CON ${p.val}).`,
    INT: (p) => `${p.subj} is slow to learn or easily confused (INT ${p.val}).`,
    WIS: (p) => `${p.subj} is impulsive and poor in judgment (WIS ${p.val}).`,
    CHA: (p) => `${p.subj} is difficult to get along with or easy to overlook (CHA ${p.val}).`,
  };

  const ALIGNMENT_FLAVOR = [
    (p) => `${p.subj} upholds law and justice, always striving to do what is right.`,
    (p) => `${p.subj} is compassionate and helpful, guided by conscience over rules.`,
    (p) => `${p.subj} values freedom and kindness, and refuses to be bound by anyone.`,
    (p) => `${p.subj} believes in order and structure, not necessarily for good or ill.`,
    (p) => `${p.subj} seeks to maintain the balance between all forces.`,
    (p) => `${p.subj} is a free spirit who follows ${p.pos.toLowerCase()} own path wherever it leads.`,
    (p) => `${p.subj} uses law and order as tools of dominance and control.`,
    (p) => `${p.subj} is self-serving above all else — ${p.pos.toLowerCase()} loyalties shift with the wind.`,
    (p) => `${p.subj} embraces chaos and cruelty, a destructive force in the world.`,
  ];

  let characterInsights = $derived(() => {
    const insights = [];
    const abs = character.adjustedAbilities || character.abilities;
    const raceName = character.race?.name || '';
    const clsName = character.wizardSchool?.name || character.cls?.name || '';
    const maxAge = raceMaxAge[character.raceKey] || 90;
    const ageNum = parseInt(age);
    const displayName = name.trim();
    const isFemale = sex === 'Female';
    const subj = isFemale ? 'She' : 'He';
    const p = {
      subj,
      obj:  isFemale ? 'her' : 'him',
      pos:  isFemale ? 'Her' : 'His',
      refl: isFemale ? 'herself' : 'himself',
    };

    // Opening: use name here only, pronouns everywhere else
    const opener = displayName || subj;
    const classFlavor = CLASS_FLAVOR[character.classKey] || `a ${clsName}`;
    if (!isNaN(ageNum) && ageNum > 0) {
      const pct = ageNum / maxAge;
      const stage = pct < 0.2 ? 'very young' : pct < 0.4 ? 'young' : pct < 0.6 ? 'middle-aged' : pct < 0.8 ? 'mature' : 'elderly';
      insights.push(`${opener} is a ${stage} ${raceName} ${clsName} — ${classFlavor}.`);
    } else {
      insights.push(`${opener} is a ${raceName} ${clsName} — ${classFlavor}.`);
    }

    // Kit
    if (character.kit) {
      insights.push(`As a ${character.kit.name}, ${p.subj.toLowerCase() === p.subj ? p.subj : p.subj} has taken on a specialized path: ${character.kit.description.toLowerCase().replace(/\.$/, '')}.`);
    }

    // Notable ability scores
    if (abs) {
      for (const [stat, fn] of Object.entries(ABILITY_HIGH)) {
        if (abs[stat] >= 16) insights.push(fn({ ...p, val: abs[stat] }));
      }
      for (const [stat, fn] of Object.entries(ABILITY_LOW)) {
        if (abs[stat] <= 7) insights.push(fn({ ...p, val: abs[stat] }));
      }
    }

    // Alignment
    if (alignment !== undefined && alignment !== null) {
      insights.push(ALIGNMENT_FLAVOR[alignment](p));
    }

    // Deity
    if (deity) insights.push(`${p.subj} worships ${deity}.`);

    // Ranger species enemy
    if (character.speciesEnemy) insights.push(`${p.subj} harbors a deep hatred of ${character.speciesEnemy}.`);

    // Name origin hints (only if name was generated)
    if (lastNameMeta && displayName) {
      const GEO_FLAVOR = {
        coastal:  `${p.pos} name hints at seafaring or coastal roots.`,
        mountain: `${p.pos} name suggests mountain origins.`,
        forest:   `${p.pos} name carries the sounds of deep woodland heritage.`,
        plains:   `${p.pos} name evokes the open plains.`,
        desert:   `${p.pos} name carries the harsh cadence of desert folk.`,
        swamp:    `${p.pos} name has the lilting quality of swampland cultures.`,
      };
      const STYLE_FLAVOR = {
        patronymic: `${p.pos} surname follows the patronymic tradition — derived from a parent's name.`,
        lineage:    `${p.pos} surname carries a clan or house lineage.`,
      };
      if (lastNameMeta.geography && GEO_FLAVOR[lastNameMeta.geography]) {
        insights.push(GEO_FLAVOR[lastNameMeta.geography]);
      }
      if (lastNameMeta.style && STYLE_FLAVOR[lastNameMeta.style]) {
        insights.push(STYLE_FLAVOR[lastNameMeta.style]);
      }
    }

    return insights;
  });
</script>

<div class="flex-column gap-lg backstory-editor">
  <div class="flex-column gap-sm">
    <label for="char-name">Character Name</label>
    <div class="name-row">
      <input
        id="char-name"
        type="text"
        bind:value={name}
        placeholder="Enter your character's name"
        maxlength="50"
      />
      <button class="btn-primary" onclick={randomizeName} title="Generate random name">
        Random Name
      </button>
    </div>
  </div>

  <!-- Name Options (Advanced) -->
  <Collapsible title="Name Options (Advanced)" defaultOpen={false}>
    <!-- Geography (human/half-elf only — shapes surname) -->
    {#if character.raceKey === 'human' || character.raceKey === 'halfElf'}
    <div class="form-section">
      <h4 class="form-label">Geography</h4>
      <div class="grid-chips gap-sm">
        <BtnSelect
          label="Random"
          selected={nameSettings.geography === 'random'}
          onclick={() => nameSettings.geography = 'random'}
        />
        {#each geographies as geography}
          <BtnSelect
            label={geography.charAt(0).toUpperCase() + geography.slice(1)}
            selected={nameSettings.geography === geography}
            onclick={() => nameSettings.geography = geography}
          />
        {/each}
      </div>
    </div>
    {/if}

    <!-- Naming Style -->
    <div class="form-section">
      <h4 class="form-label">Naming Style</h4>
      <div class="grid-chips gap-sm">
        <BtnSelect
          label="Random"
          selected={nameSettings.style === 'random'}
          onclick={() => nameSettings.style = 'random'}
        />
        {#each namingStyles as style}
          <BtnSelect
            label={style.label}
            selected={nameSettings.style === style.value}
            disabled={!isStyleAvailable(style.value)}
            onclick={() => nameSettings.style = style.value}
          />
        {/each}
      </div>
      <p class="section-hint">
        Standard: Traditional surname • Patronymic: Son/Daughter of • Clan/House: Of Clan X (Dwarf), Tel'/Quel' prefix (Elf), Of House X (Human)
      </p>
    </div>
  </Collapsible>

  <div class="flex-column gap-sm">
    <p class="form-label">Sex</p>
    <div class="flex-row gap-sm">
      <BtnSelect
        label="Male"
        selected={sex === 'Male'}
        onclick={() => sex = 'Male'}
      />
      <BtnSelect
        label="Female"
        selected={sex === 'Female'}
        onclick={() => sex = 'Female'}
      />
    </div>
  </div>

  <div class="flex-column gap-sm">
    <p class="form-label">Alignment</p>
    <div class="alignment-grid">
      {#each alignmentGrid as row}
        {#each row as alignNum}
          {@const isAllowed = allowedAlignments().includes(alignNum)}
          <Tooltip text={alignmentDescriptions[alignNum]} warning={!isAllowed ? alignmentWarning(alignNum) : ''}>
            <BtnSelect
              label={getAlignmentName(alignNum)}
              selected={alignment === alignNum}
              disabled={!isAllowed}
              onclick={() => isAllowed && (alignment = alignNum)}
            />
          </Tooltip>
        {/each}
      {/each}
    </div>
  </div>

  <!-- Physical Details -->
  <div class="flex-column gap-sm">
    <div class="details-header">
      <p class="form-label">Physical Details</p>
      <Tooltip text="Rolls random age, height, and weight using PHB Table 10/11 dice, plus a random eye and hair color. You can always edit the results manually.">
        <button class="btn-primary btn-sm" onclick={randomizeDetails}>
          Randomize
        </button>
      </Tooltip>
    </div>
    <div class="details-grid">
      <Tooltip>
        {#snippet tip()}
          {#if lastAgeRoll}
            <span class="tooltip-meta">{lastAgeRoll.base} + rolled {lastAgeRoll.rolled} ({lastAgeRoll.diceCount}d{lastAgeRoll.diceSides}) = {lastAgeRoll.total}</span>
          {/if}
          {raceHints().age}
        {/snippet}
        <div class="detail-field">
          <label for="char-age">Age</label>
          <input id="char-age" type="text" bind:value={age} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().height}>
        <div class="detail-field">
          <label for="char-height">Height</label>
          <input id="char-height" type="text" value={heightDisplay} readonly placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().weight}>
        <div class="detail-field">
          <label for="char-weight">Weight</label>
          <input id="char-weight" type="text" value={weightDisplay} readonly placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().eyes}>
        <div class="detail-field">
          <label for="char-eyes">Eyes</label>
          <input id="char-eyes" type="text" bind:value={eyes} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().hair}>
        <div class="detail-field">
          <label for="char-hair">Hair</label>
          <input id="char-hair" type="text" bind:value={hair} placeholder="—" />
        </div>
      </Tooltip>
      {#if deity}
        <div class="detail-field">
          <p class="form-label">Deity</p>
          <span class="deity-display">{deity}</span>
        </div>
      {/if}
    </div>
  </div>

  <Collapsible title="Story Details (AI Prompt)" defaultOpen={false}>
    <p class="section-hint" style="margin-bottom: var(--space-sm)">Optional — these enrich the AI prompt but are not saved to your character sheet.</p>
    <div class="flex-column gap-sm">
      <div class="detail-field">
        <label for="story-origin">Origin / Background</label>
        <select id="story-origin" bind:value={storyDetails.origin}>
          {#each ORIGIN_OPTIONS as o}
            <option value={o}>{o || '— choose or leave blank —'}</option>
          {/each}
        </select>
      </div>
      <div class="detail-field">
        <label for="story-motivation">Motivation</label>
        <select id="story-motivation" bind:value={storyDetails.motivation}>
          {#each MOTIVATION_OPTIONS as m}
            <option value={m}>{m || '— choose or leave blank —'}</option>
          {/each}
        </select>
      </div>
      <div class="detail-field">
        <label for="story-traits">Personality traits</label>
        <input id="story-traits" type="text" bind:value={storyDetails.traits} placeholder="e.g. Gruff but loyal, dry sense of humor" maxlength="120" />
      </div>
      <div class="detail-field">
        <label for="story-secret">A secret or defining moment</label>
        <input id="story-secret" type="text" bind:value={storyDetails.secret} placeholder="e.g. Witnessed their village burn, carries survivor's guilt" maxlength="200" />
      </div>
    </div>
  </Collapsible>

  {#if characterInsights().length > 0}
    <Collapsible title="What We Know About This Character" defaultOpen={true}>
      <ul class="insights-list">
        {#each characterInsights() as insight}
          <li>{insight}</li>
        {/each}
      </ul>
      <div class="action-bar end" style="margin-top: var(--space-sm)">
        <Tooltip text={backstory.trim() ? 'Clear your backstory first to use this' : 'Paste these facts into the backstory box as a starting point'}>
          <button
            class="btn-secondary btn-sm"
            disabled={!!backstory.trim()}
            onclick={() => backstory = characterInsights().join('\n\n')}
          >
            Use as starting point
          </button>
        </Tooltip>
        <Tooltip text="Copy a ready-to-use prompt to paste into ChatGPT, Claude, or any AI">
          <button class="btn-secondary btn-sm" onclick={copyAiPrompt}>
            {copied ? 'Copied!' : 'Copy AI Prompt'}
          </button>
        </Tooltip>
      </div>
    </Collapsible>
  {/if}

  <div class="flex-column gap-sm">
    <label for="backstory">Backstory</label>
    <textarea
      id="backstory"
      bind:value={backstory}
      placeholder={generatePlaceholder()}
      rows="12"
      maxlength="5000"
    ></textarea>
    <div class="backstory-meta">
      <p class="section-hint">Optional — you can always add this later.</p>
      <span class="meta-text char-count" class:near-limit={charCount > 4500}>{charCount} / 5000</span>
    </div>
  </div>

  <button class="btn-primary" onclick={confirm}>
    {name ? `Continue as ${name}` : 'Continue'} → Character Sheet
  </button>
</div>




