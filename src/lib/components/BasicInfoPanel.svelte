<script>
  import EditableInput from './EditableInput.svelte';
  import { deities } from '../../data/deities.js';
  import { speciesEnemies } from '../../data/speciesEnemies.js';
  import { getAlignmentName } from '../../data/alignment.js';

  let {
    character,
    portraitFilename,
    currentHP,
    maxHP,
    hpColor,
    baseAC,
    baseTHAC0,
    totalWeight,
    strMods,
    onUpdateHP
  } = $props();

  let isEncumbered = $derived(totalWeight > strMods.weightAllow);
</script>

<style lang="scss">@import '../styles/sheet';</style>

<div class="top-section">
  <div class="portrait">
    <img
      src="/portraits/{portraitFilename}"
      alt="{character.name}"
      onerror={(e) => e.target.src = '/portraits/DefaultPortrait.webp'}
    />
  </div>
  <div class="basic-info">
    <div class="info-grid">
      <div class="info-item"><span class="label">Race:</span> {character.race.name}</div>
      <div class="info-item"><span class="label">Class:</span> {character.wizardSchool?.name || character.cls.name}</div>
      <div class="info-item"><span class="label">Sex:</span> {character.sex || 'Male'}</div>
      <div class="info-item"><span class="label">Alignment:</span> {getAlignmentName(character.alignment !== undefined ? character.alignment : 4)}</div>
      {#if character.age}<div class="info-item"><span class="label">Age:</span> {character.age}</div>{/if}
      {#if character.height}<div class="info-item"><span class="label">Height:</span> {character.height}</div>{/if}
      {#if character.weight}<div class="info-item"><span class="label">Weight:</span> {character.weight}</div>{/if}
      {#if character.eyes}<div class="info-item"><span class="label">Eyes:</span> {character.eyes}</div>{/if}
      {#if character.hair}<div class="info-item"><span class="label">Hair:</span> {character.hair}</div>{/if}
      {#if character.deityKey || character.deity}<div class="info-item"><span class="label">Deity:</span> {character.deityKey ? (deities[character.deityKey]?.name || character.deity) : character.deity}</div>{/if}
      {#if character.speciesEnemy}<div class="info-item"><span class="label">Species Enemy:</span> {speciesEnemies[character.speciesEnemy]?.name ?? character.speciesEnemy}</div>{/if}
      <div class="info-item">
        <span class="label">HP:</span>
        <EditableInput
          value={currentHP}
          displayFormat={(v) => `${v} / ${maxHP}`}
          min={0}
          max={maxHP}
          onUpdate={onUpdateHP}
          title="Click to edit current HP"
          buttonClass="hp-display {hpColor}"
          inputClass="hp-input-field"
        />
      </div>
      <div class="info-item"><span class="label">AC:</span> {baseAC}</div>
      <div class="info-item"><span class="label">THAC0:</span> {baseTHAC0}</div>
      <div class="info-item"><span class="label">Movement:</span> {character.race.movement || 12}</div>
      <div class="info-item" class:encumbered={isEncumbered}><span class="label">Encumbrance:</span> {totalWeight} / {strMods.weightAllow} lbs</div>
      {#if isEncumbered}
        <div class="info-item encumbered"><span class="label">⚠ Encumbered!</span></div>
      {/if}
    </div>
  </div>
</div>
