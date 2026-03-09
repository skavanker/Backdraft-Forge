<script>
  import BtnSelect from './BtnSelect.svelte';

  let { options, onchange } = $props();

  const races = ['Human', 'Elf', 'Dwarf', 'Gnome', 'Halfling', 'Half-Elf'];

  const genders = ['Male', 'Female'];

  const geographies = ['Coastal', 'Mountain', 'Forest', 'Plains', 'Swamp', 'Desert'];

  const namingStyles = [
    { value: 'standard',   label: 'Standard',    description: 'Traditional surname' },
    { value: 'patronymic', label: 'Patronymic',  description: 'Son/Daughter of' },
    { value: 'lineage',    label: 'Clan / House', description: "Of Clan X (Dwarf) · Tel'/Quel' prefix (Elf) · Of House X (Human)" }
  ];

  const quantities = [1, 3, 5, 10];

  // Lineage (clan/house) is only meaningful for races that have that tradition
  const lineageRaces = ['dwarf', 'elf', 'human', 'half-elf', 'random'];

  function isStyleAvailable(styleValue) {
    if (styleValue === 'lineage') return lineageRaces.includes(options.race);
    return true;
  }

  /**
   * Handle selection change
   */
  function handleChange(field, value) {
    onchange({ [field]: value });
  }
</script>

<div class="name-generator-form">
  <!-- Race Selection -->
  <div class="form-section">
    <h4 class="form-label">Race</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.race === 'random'}
        onclick={() => handleChange('race', 'random')}
      />
      {#each races as race}
        <BtnSelect
          label={race}
          selected={options.race === race.toLowerCase()}
          onclick={() => handleChange('race', race.toLowerCase())}
        />
      {/each}
    </div>
  </div>

  <!-- Gender Selection -->
  <div class="form-section">
    <h4 class="form-label">Gender</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.gender === 'random'}
        onclick={() => handleChange('gender', 'random')}
      />
      {#each genders as gender}
        <BtnSelect
          label={gender}
          selected={options.gender === gender}
          onclick={() => handleChange('gender', gender)}
        />
      {/each}
    </div>
  </div>

  <!-- Geography — only relevant for humans and half-elves -->
  {#if options.race === 'human' || options.race === 'half-elf' || options.race === 'random'}
  <div class="form-section">
    <h4 class="form-label">Location</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.geography === 'random'}
        onclick={() => handleChange('geography', 'random')}
      />
      {#each geographies as geography}
        <BtnSelect
          label={geography}
          selected={options.geography === geography.toLowerCase()}
          onclick={() => handleChange('geography', geography.toLowerCase())}
        />
      {/each}
    </div>
  </div>
  {/if}

  <!-- Quantity -->
  <div class="form-section">
    <h4 class="form-label">Quantity</h4>
    <div class="grid-compact gap-sm">
      {#each quantities as qty}
        <BtnSelect
          label={qty.toString()}
          selected={options.quantity === qty}
          onclick={() => handleChange('quantity', qty)}
        />
      {/each}
    </div>
  </div>

  <!-- Naming Style -->
  <div class="form-section">
    <h4 class="form-label">Naming Style</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.style === 'random'}
        onclick={() => handleChange('style', 'random')}
      />
      {#each namingStyles as style}
        <BtnSelect
          label={style.label}
          selected={options.style === style.value}
          onclick={() => handleChange('style', style.value)}
          disabled={!isStyleAvailable(style.value)}
        />
      {/each}
    </div>
    <p class="section-hint">
      Standard: Traditional surname • Patronymic: Son/Daughter of • Clan/House: Of Clan X (Dwarf), Tel'/Quel' prefix (Elf), Of House X (Human)
    </p>
  </div>
</div>