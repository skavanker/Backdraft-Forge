<script>
  import { getAvailableNamingStyles } from '../../data/races.js';
  import BtnSelect from './BtnSelect.svelte';

  let { options, onchange } = $props();

  // Available options for Phase 2 (all races + naming styles)
  const races = ['Human', 'Elf', 'Dwarf', 'Gnome', 'Halfling', 'Half-Elf'];

  const genders = ['Male', 'Female'];

  const classes = [
    'Fighter', 'Wizard', 'Cleric', 'Thief',
    'Ranger', 'Paladin', 'Bard', 'Druid'
  ];

  const settlements = ['City', 'Town', 'Village', 'Nomadic'];

  const geographies = ['Coastal', 'Mountain', 'Forest', 'Plains', 'Swamp', 'Desert'];

  const socialClasses = ['Noble', 'Wealthy', 'Common', 'Poor'];

  const namingStyles = [
    { value: 'standard', label: 'Standard', description: 'Traditional surname' },
    { value: 'patronymic', label: 'Patronymic', description: 'Son/Daughter of' },
    { value: 'clan', label: 'Clan', description: 'Of Clan X (Dwarf)' },
    { value: 'house', label: 'House', description: 'Of House X (Elf/Human)' }
  ];

  const quantities = [1, 3, 5, 10];

  /**
   * Check if a naming style is available for the current race
   */
  function isStyleAvailable(styleValue) {
    return getAvailableNamingStyles(options.race).includes(styleValue);
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

  <!-- Class Selection -->
  <div class="form-section">
    <h4 class="form-label">Class</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.class === 'random'}
        onclick={() => handleChange('class', 'random')}
      />
      {#each classes as cls}
        <BtnSelect
          label={cls}
          selected={options.class === cls.toLowerCase()}
          onclick={() => handleChange('class', cls.toLowerCase())}
        />
      {/each}
    </div>
  </div>

  <!-- Settlement Type -->
  <div class="form-section">
    <h4 class="form-label">Settlement Type</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.settlement === 'random'}
        onclick={() => handleChange('settlement', 'random')}
      />
      {#each settlements as settlement}
        <BtnSelect
          label={settlement}
          selected={options.settlement === settlement.toLowerCase()}
          onclick={() => handleChange('settlement', settlement.toLowerCase())}
        />
      {/each}
    </div>
  </div>

  <!-- Geography -->
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

  <!-- Social Class -->
  <div class="form-section">
    <h4 class="form-label">Social Class</h4>
    <div class="grid-compact gap-sm">
      <BtnSelect
        label="Random"
        selected={options.socialClass === 'random'}
        onclick={() => handleChange('socialClass', 'random')}
      />
      {#each socialClasses as social}
        <BtnSelect
          label={social}
          selected={options.socialClass === social.toLowerCase()}
          onclick={() => handleChange('socialClass', social.toLowerCase())}
        />
      {/each}
    </div>
  </div>

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
      Standard: Traditional surname • Patronymic: Son/Daughter of • Clan: Dwarves • House: Elves/Humans
    </p>
  </div>
</div>