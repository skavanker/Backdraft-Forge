<script>
  import Tooltip from '../Tooltip.svelte';
  import SelectableChip from './SelectableChip.svelte';

  let {
    groupedProficiencies,
    selectedNonWeapon,
    lockedNonWeapon,
    nonWeaponSlots,
    nonWeaponSlotsRemaining,
    onToggle
  } = $props();
</script>

<div class="section">
  <h3 id="nonweapon-profs-heading">Non-Weapon Proficiencies</h3>
  <p class="section-hint">
    Select skills for your character. Different skill groups cost different amounts.
    {#if nonWeaponSlotsRemaining > 0}
      <span class="meta-text remaining">({nonWeaponSlotsRemaining} slots remaining)</span>
    {/if}
  </p>

  <div class="prof-column-section" role="group" aria-labelledby="nonweapon-profs-heading">
    {#each Object.entries(groupedProficiencies()) as [groupKey, group]}
      {#if group.profs.length > 0}
        {@const costForGroup = group.profs[0]?.cost ?? 1}
        <div class="prof-group">
          <h4 class="group-title">{group.name}</h4>
          <p class="meta-text">{costForGroup} slot{costForGroup !== 1 ? 's' : ''} each</p>
          <div class="flex-column gap-sm">
            {#each group.profs as prof}
              {@const isLocked = lockedNonWeapon.includes(prof.key)}
              {@const selected = selectedNonWeapon.includes(prof.key)}
              {@const disabled = !selected && nonWeaponSlotsRemaining < prof.cost}
              <Tooltip text="{prof.description} (Check: {prof.ability}{prof.modifier >= 0 ? '+' : ''}{prof.modifier})" position="bottom">
                <SelectableChip
                  label={prof.name}
                  metadata={prof.ability}
                  cost={prof.cost}
                  {selected}
                  {disabled}
                  locked={isLocked}
                  onclick={() => onToggle(prof.key)}
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
