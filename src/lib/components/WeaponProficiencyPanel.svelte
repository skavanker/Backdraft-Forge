<script>
  import Tooltip from '../Tooltip.svelte';
  import SelectableChip from './SelectableChip.svelte';
  import { formatWeaponTooltip } from '../../data/weapons.js';

  let {
    groupedWeapons,
    selectedWeapons,
    lockedWeapons,
    weaponSlots,
    weaponSlotsRemaining,
    onToggle
  } = $props();
</script>

<div class="section">
  <h3 id="weapon-profs-heading">Weapon Proficiencies</h3>
  <p class="section-hint">
    Select {weaponSlots} weapon{weaponSlots !== 1 ? 's' : ''} your character is trained with.
    {#if weaponSlotsRemaining > 0}
      <span class="meta-text remaining">({weaponSlotsRemaining} remaining)</span>
    {/if}
  </p>

  <div class="prof-column-section" role="group" aria-labelledby="weapon-profs-heading">
    {#each Object.entries(groupedWeapons()) as [groupKey, group]}
      {#if group.weapons.length > 0}
        <div class="prof-group">
          <h4 class="group-title">{group.name}</h4>
          <div class="flex-column gap-sm">
            {#each group.weapons as weapon}
              {@const isLocked = lockedWeapons.includes(weapon.key)}
              {@const selected = selectedWeapons.includes(weapon.key)}
              {@const disabled = !selected && weaponSlotsRemaining === 0}
              <Tooltip text={formatWeaponTooltip(weapon)} position="bottom">
                <SelectableChip
                  label={weapon.name}
                  metadata={weapon.damage}
                  {selected}
                  {disabled}
                  locked={isLocked}
                  onclick={() => onToggle(weapon.key)}
                />
              </Tooltip>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>

<style lang="scss">
  @import '../styles/proficiency';
  @import '../styles/widgets';
</style>
