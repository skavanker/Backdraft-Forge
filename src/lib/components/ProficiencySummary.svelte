<script>
  import { weapons, nonWeaponProficiencies } from '../../data/proficiencies.js';

  let { selectedWeapons, selectedNonWeapon } = $props();
</script>

{#if selectedWeapons.length > 0 || selectedNonWeapon.length > 0}
  <div class="selection-summary panel-subtle">
    <div class="divider"><span class="ornament">◆</span></div>

    <h3>Selected Proficiencies</h3>

    <div class="summary-columns">
      {#if selectedWeapons.length > 0}
        <div class="summary-section">
          <h4>Weapons</h4>
          <ul class="summary-list">
            {#each selectedWeapons as key}
              {@const w = weapons[key]}
              <li>
                <span class="summary-name">{w.name}</span>
                <span class="summary-detail">{w.damage}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      {#if selectedNonWeapon.length > 0}
        <div class="summary-section">
          <h4>Skills</h4>
          <ul class="summary-list">
            {#each selectedNonWeapon as key}
              {@const p = nonWeaponProficiencies[key]}
              <li>
                <span class="summary-name">{p.name}</span>
                <span class="summary-detail">{p.ability}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
{/if}