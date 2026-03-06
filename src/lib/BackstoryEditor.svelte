<script>
  import { onMount } from 'svelte';
  import { generateCharacterName } from './generators/nameGenerator.js';
  import { names } from '../data/names.js';
  import { getAvailableNamingStyles } from '../data/races.js';
  import { ALIGNMENTS, getAlignmentName, getAlignmentGrid, getAllowedAlignmentsForClass } from '../data/alignment.js';
  import { deities } from '../data/deities.js';
  import Tooltip from './Tooltip.svelte';
  import Collapsible from './components/Collapsible.svelte';
  import SelectableChip from './components/SelectableChip.svelte';
  import { settings, formatHeight as fmtHeight, formatWeight as fmtWeight } from './settings.svelte.js';
  import { pick, randomInt } from './utils/randomUtils.js';

  let { character, onComplete } = $props();

  let name = $state(character.name || '');
  let sex = $state(character.sex || 'Male');
  let alignment = $state(character.alignment !== undefined ? character.alignment : ALIGNMENTS.N); // Default to True Neutral
  let backstory = $state(character.backstory || '');
  let age = $state(character.age || '');
  // Store height/weight as raw numbers (inches/lbs) for reactive formatting
  let heightInches = $state(character.heightInches || 0);
  let weightLbs = $state(character.weightLbs || 0);
  let eyes = $state(character.eyes || '');
  let hair = $state(character.hair || '');

  // Name generation settings
  let nameSettings = $state({
    settlement: 'random',
    geography: 'random',
    socialClass: 'random',
    style: 'random'
  });

  // Available options for name settings
  const settlements = ['city', 'town', 'village', 'nomadic'];
  const geographies = ['coastal', 'mountain', 'forest', 'plains', 'swamp', 'desert'];
  const socialClasses = ['noble', 'wealthy', 'common', 'poor'];
  const namingStyles = [
    { value: 'standard', label: 'Standard' },
    { value: 'patronymic', label: 'Patronymic' },
    { value: 'clan', label: 'Clan' },
    { value: 'house', label: 'House' }
  ];

  // Derived: available naming styles for current race
  let availableNamingStyles = $derived(() => {
    return getAvailableNamingStyles(character.raceKey);
  });

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
    return {
      age: `${raceName}: typically ${r.age[0]}–${r.age[1]} years`,
      height: `${raceName}: M ${fmtHeight(r.heightM[0])}–${fmtHeight(r.heightM[1])}, F ${fmtHeight(r.heightF[0])}–${fmtHeight(r.heightF[1])}`,
      weight: `${raceName}: M ${fmtWeight(r.weightM[0])}–${fmtWeight(r.weightM[1])}, F ${fmtWeight(r.weightF[0])}–${fmtWeight(r.weightF[1])}`,
      eyes: `Common: ${(isElven ? elfEyeColors : eyeColors).join(', ')}`,
      hair: `Common: ${(isElven ? elfHairColors : hairColors).join(', ')}`,
    };
  });

  // Get alignment grid (3x3 array of numbers)
  const alignmentGrid = getAlignmentGrid();

  // Get allowed alignments based on class and deity restrictions
  const allowedAlignments = $derived(() => {
    const deityAlignment = character.deityKey ? deities[character.deityKey]?.alignment : null;
    return getAllowedAlignmentsForClass(character.classKey, deityAlignment);
  });

  // 2E PHB-inspired random ranges by race
  const raceDetails = {
    human:    { age: [16, 25], heightM: [60, 78], heightF: [58, 74], weightM: [140, 220], weightF: [100, 170] },
    dwarf:    { age: [40, 100], heightM: [43, 51], heightF: [41, 49], weightM: [130, 170], weightF: [105, 145] },
    elf:      { age: [100, 175], heightM: [55, 65], heightF: [50, 61], weightM: [90, 120], weightF: [70, 100] },
    gnome:    { age: [60, 120], heightM: [38, 44], heightF: [36, 42], weightM: [72, 88], weightF: [68, 82] },
    halfElf:  { age: [22, 65], heightM: [60, 72], heightF: [58, 68], weightM: [110, 175], weightF: [85, 140] },
    halfling: { age: [22, 55], heightM: [32, 38], heightF: [30, 36], weightM: [52, 60], weightF: [48, 56] },
  };

  const eyeColors = ['Brown', 'Hazel', 'Green', 'Blue', 'Grey', 'Amber', 'Black'];
  const hairColors = ['Black', 'Dark Brown', 'Brown', 'Auburn', 'Red', 'Blonde', 'Sandy', 'Grey', 'White'];
  const elfEyeColors = ['Green', 'Blue', 'Violet', 'Gold', 'Silver', 'Amber'];
  const elfHairColors = ['Silver', 'Gold', 'Blonde', 'Black', 'Copper', 'White'];

  function randomizeDetails() {
    const r = raceDetails[character.raceKey] || raceDetails.human;
    const isFemale = sex === 'Female';
    age = String(randomInt(r.age[0], r.age[1]));
    heightInches = randomInt(isFemale ? r.heightF[0] : r.heightM[0], isFemale ? r.heightF[1] : r.heightM[1]);
    weightLbs = randomInt(isFemale ? r.weightF[0] : r.weightM[0], isFemale ? r.weightF[1] : r.weightM[1]);
    const isElven = character.raceKey === 'elf' || character.raceKey === 'halfElf';
    eyes = pick(isElven ? elfEyeColors : eyeColors);
    hair = pick(isElven ? elfHairColors : hairColors);
  }

  // Auto-randomize on mount if enabled and fields are empty
  onMount(() => {
    if (settings.autoRandomize && !age && heightInches === 0 && weightLbs === 0 && !eyes && !hair) {
      randomizeDetails();
    }
  });

  function confirm() {
    onComplete({
      name: name.trim() || 'Unnamed Hero',
      sex,
      alignment,
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
    const raceKey = character.raceKey === 'halfElf' ? 'halfElf' : character.raceKey;

    const result = generateCharacterName(names, {
      race: raceKey,
      gender: sex,
      class: character.classKey || 'random',
      settlement: nameSettings.settlement,
      geography: nameSettings.geography,
      socialClass: nameSettings.socialClass,
      style: nameSettings.style
    });

    name = result.name;
  }

  function generatePlaceholder() {
    const race = character.race?.name || 'mysterious';
    const cls = character.wizardSchool?.name || character.cls?.name || 'adventurer';
    return `Write your character's backstory here...\n\nWho is this ${race} ${cls}? Where did they come from? What drives them to adventure?`;
  }

  let charCount = $derived(backstory.length);
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
    <!-- Settlement Type -->
    <div class="form-section">
      <h4 class="form-label">Settlement Type</h4>
      <div class="grid-chips gap-sm">
        <SelectableChip
          label="Random"
          selected={nameSettings.settlement === 'random'}
          onclick={() => nameSettings.settlement = 'random'}
        />
        {#each settlements as settlement}
          <SelectableChip
            label={settlement.charAt(0).toUpperCase() + settlement.slice(1)}
            selected={nameSettings.settlement === settlement}
            onclick={() => nameSettings.settlement = settlement}
          />
        {/each}
      </div>
    </div>

    <!-- Geography -->
    <div class="form-section">
      <h4 class="form-label">Geography</h4>
      <div class="grid-chips gap-sm">
        <SelectableChip
          label="Random"
          selected={nameSettings.geography === 'random'}
          onclick={() => nameSettings.geography = 'random'}
        />
        {#each geographies as geography}
          <SelectableChip
            label={geography.charAt(0).toUpperCase() + geography.slice(1)}
            selected={nameSettings.geography === geography}
            onclick={() => nameSettings.geography = geography}
          />
        {/each}
      </div>
    </div>

    <!-- Social Class -->
    <div class="form-section">
      <h4 class="form-label">Social Class</h4>
      <div class="grid-chips gap-sm">
        <SelectableChip
          label="Random"
          selected={nameSettings.socialClass === 'random'}
          onclick={() => nameSettings.socialClass = 'random'}
        />
        {#each socialClasses as social}
          <SelectableChip
            label={social.charAt(0).toUpperCase() + social.slice(1)}
            selected={nameSettings.socialClass === social}
            onclick={() => nameSettings.socialClass = social}
          />
        {/each}
      </div>
    </div>

    <!-- Naming Style -->
    <div class="form-section">
      <h4 class="form-label">Naming Style</h4>
      <div class="grid-chips gap-sm">
        <SelectableChip
          label="Random"
          selected={nameSettings.style === 'random'}
          onclick={() => nameSettings.style = 'random'}
        />
        {#each namingStyles as style}
          <SelectableChip
            label={style.label}
            selected={nameSettings.style === style.value}
            disabled={!availableNamingStyles().includes(style.value)}
            onclick={() => nameSettings.style = style.value}
          />
        {/each}
      </div>
      <p class="section-hint">
        Standard: Traditional surname • Patronymic: Son/Daughter of • Clan: Dwarves • House: Elves/Humans
      </p>
    </div>
  </Collapsible>

  <div class="flex-column gap-sm">
    <label>Sex</label>
    <div class="flex-row gap-sm">
      <SelectableChip
        label="Male"
        selected={sex === 'Male'}
        onclick={() => sex = 'Male'}
      />
      <SelectableChip
        label="Female"
        selected={sex === 'Female'}
        onclick={() => sex = 'Female'}
      />
    </div>
  </div>

  <div class="flex-column gap-sm">
    <label>Alignment</label>
    <div class="alignment-grid">
      {#each alignmentGrid as row}
        {#each row as alignNum}
          {@const isAllowed = allowedAlignments().includes(alignNum)}
          <SelectableChip
            label={getAlignmentName(alignNum)}
            selected={alignment === alignNum}
            disabled={!isAllowed}
            onclick={() => isAllowed && (alignment = alignNum)}
          />
        {/each}
      {/each}
    </div>
  </div>

  <!-- Physical Details -->
  <div class="flex-column gap-sm">
    <div class="details-header">
      <label>Physical Details</label>
      <button class="btn-primary btn-sm" onclick={randomizeDetails} title="Randomize all details">
        Randomize
      </button>
    </div>
    <div class="details-grid">
      <Tooltip text={raceHints().age} position="bottom">
        <div class="detail-field">
          <label for="char-age">Age ⓘ</label>
          <input id="char-age" type="text" bind:value={age} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().height} position="bottom">
        <div class="detail-field">
          <label for="char-height">Height ⓘ</label>
          <input id="char-height" type="text" value={heightDisplay} readonly placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().weight} position="bottom">
        <div class="detail-field">
          <label for="char-weight">Weight ⓘ</label>
          <input id="char-weight" type="text" value={weightDisplay} readonly placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().eyes} position="bottom">
        <div class="detail-field">
          <label for="char-eyes">Eyes ⓘ</label>
          <input id="char-eyes" type="text" bind:value={eyes} placeholder="—" />
        </div>
      </Tooltip>
      <Tooltip text={raceHints().hair} position="bottom">
        <div class="detail-field">
          <label for="char-hair">Hair ⓘ</label>
          <input id="char-hair" type="text" bind:value={hair} placeholder="—" />
        </div>
      </Tooltip>
      {#if deity}
        <div class="detail-field">
          <label>Deity</label>
          <span class="deity-display">{deity}</span>
        </div>
      {/if}
    </div>
  </div>

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


<style lang="scss">@import './styles/backstory';</style>

