<script>
  import { copyToClipboard } from '../shareCharacter.js';
  import SelectableChip from './SelectableChip.svelte';
  import { useToast } from '../utils/stateUtils.svelte.js';

  let { treasure, onSave = null, onDelete = null, showActions = true } = $props();
  const toast = useToast();

  const hasCoin = $derived(
    treasure.coins.copper > 0 ||
    treasure.coins.silver > 0 ||
    treasure.coins.electrum > 0 ||
    treasure.coins.gold > 0 ||
    treasure.coins.platinum > 0
  );

  const hasGems = $derived(treasure.gems?.length > 0);
  const hasArt = $derived(treasure.artObjects?.length > 0);
  const hasMagic = $derived(treasure.magicItems?.length > 0);

  // Selection state
  let selectedCoins = $state({
    copper: false,
    silver: false,
    electrum: false,
    gold: false,
    platinum: false
  });
  let selectedGems = $state([]);
  let selectedArt = $state([]);
  let selectedMagic = $state([]);

  function formatNumber(num) {
    return num.toLocaleString();
  }

  function toggleCoin(type) {
    selectedCoins[type] = !selectedCoins[type];
  }

  function toggleGem(index) {
    if (selectedGems.includes(index)) {
      selectedGems = selectedGems.filter(i => i !== index);
    } else {
      selectedGems = [...selectedGems, index];
    }
  }

  function toggleArt(index) {
    if (selectedArt.includes(index)) {
      selectedArt = selectedArt.filter(i => i !== index);
    } else {
      selectedArt = [...selectedArt, index];
    }
  }

  function toggleMagic(index) {
    if (selectedMagic.includes(index)) {
      selectedMagic = selectedMagic.filter(i => i !== index);
    } else {
      selectedMagic = [...selectedMagic, index];
    }
  }

  const hasSelection = $derived(
    Object.values(selectedCoins).some(v => v) ||
    selectedGems.length > 0 ||
    selectedArt.length > 0 ||
    selectedMagic.length > 0
  );

  async function handleCopySelected() {
    const selected = {
      coins: {},
      gems: [],
      artObjects: [],
      magicItems: []
    };

    // Collect selected coins
    if (selectedCoins.copper && treasure.coins.copper > 0) selected.coins.copper = treasure.coins.copper;
    if (selectedCoins.silver && treasure.coins.silver > 0) selected.coins.silver = treasure.coins.silver;
    if (selectedCoins.electrum && treasure.coins.electrum > 0) selected.coins.electrum = treasure.coins.electrum;
    if (selectedCoins.gold && treasure.coins.gold > 0) selected.coins.gold = treasure.coins.gold;
    if (selectedCoins.platinum && treasure.coins.platinum > 0) selected.coins.platinum = treasure.coins.platinum;

    // Collect selected gems
    selectedGems.forEach(index => {
      if (treasure.gems[index]) selected.gems.push(treasure.gems[index]);
    });

    // Collect selected art
    selectedArt.forEach(index => {
      if (treasure.artObjects[index]) selected.artObjects.push(treasure.artObjects[index]);
    });

    // Collect selected magic items
    selectedMagic.forEach(index => {
      if (treasure.magicItems[index]) selected.magicItems.push(treasure.magicItems[index]);
    });

    const json = JSON.stringify(selected, null, 2);
    const success = await copyToClipboard(json);
    toast.flash(success ? 'Selected items copied to clipboard as JSON!' : 'Failed to copy to clipboard. Please try again.');
  }

  async function handleCopyJSON() {
    const json = JSON.stringify(treasure, null, 2);
    const success = await copyToClipboard(json);
    toast.flash(success ? 'Treasure JSON copied to clipboard!' : 'Failed to copy to clipboard. Please try again.');
  }

  async function handleCopyText() {
    let text = `TREASURE HOARD - Type ${treasure.type}\n`;
    text += `${treasure.source}\n`;
    text += `Total Value: ${formatNumber(treasure.totalValue)} gp\n`;
    text += `Total Weight: ${formatNumber(treasure.totalWeight)} lbs\n\n`;

    if (hasCoin) {
      text += `COINS:\n`;
      if (treasure.coins.copper > 0) text += `  ${formatNumber(treasure.coins.copper)} Copper (${formatNumber(treasure.coins.copper / 10)} lbs)\n`;
      if (treasure.coins.silver > 0) text += `  ${formatNumber(treasure.coins.silver)} Silver (${formatNumber(treasure.coins.silver / 10)} lbs)\n`;
      if (treasure.coins.electrum > 0) text += `  ${formatNumber(treasure.coins.electrum)} Electrum (${formatNumber(treasure.coins.electrum / 10)} lbs)\n`;
      if (treasure.coins.gold > 0) text += `  ${formatNumber(treasure.coins.gold)} Gold (${formatNumber(treasure.coins.gold / 10)} lbs)\n`;
      if (treasure.coins.platinum > 0) text += `  ${formatNumber(treasure.coins.platinum)} Platinum (${formatNumber(treasure.coins.platinum / 10)} lbs)\n`;
      text += `\n`;
    }

    if (hasGems) {
      text += `GEMS (${treasure.gems.length}):\n`;
      treasure.gems.forEach(gem => {
        text += `  ${gem.description} (${gem.value} gp, 0.01 lbs)\n`;
      });
      text += `\n`;
    }

    if (hasArt) {
      text += `ART OBJECTS (${treasure.artObjects.length}):\n`;
      treasure.artObjects.forEach(art => {
        text += `  ${art.description} (${formatNumber(art.value)} gp, ${art.weight} lbs)\n`;
      });
      text += `\n`;
    }

    if (hasMagic) {
      text += `MAGIC ITEMS (${treasure.magicItems.length}):\n`;
      treasure.magicItems.forEach(item => {
        text += `  ${item} (~1,000 gp est., 2 lbs)\n`;
      });
      text += `\n`;
    }

    const success = await copyToClipboard(text);
    toast.flash(success ? 'Treasure text copied to clipboard!' : 'Failed to copy to clipboard. Please try again.');
  }
</script>

<div class="treasure-hoard panel-secondary flex-column gap-md">
  {#if toast.visible}
    <div class="save-toast alert alert-info">{toast.message}</div>
  {/if}
  <!-- Header -->
  <header class="treasure-header">
    <div class="treasure-title">
      <h4>Treasure Hoard</h4>
      <span class="badge badge-primary">Type {treasure.type}</span>
    </div>
    <p class="treasure-subtitle">{treasure.source}</p>
    <div class="treasure-stats">
      <div class="treasure-value">
        <span class="label">Total Value:</span>
        <span class="value">{formatNumber(treasure.totalValue)} gp</span>
      </div>
      <div class="treasure-weight">
        <span class="label">Total Weight:</span>
        <span class="value">{formatNumber(treasure.totalWeight)} lbs</span>
      </div>
    </div>
  </header>

  <!-- Coins -->
  {#if hasCoin}
    <div class="treasure-section">
      <h5>Coins</h5>
      <div class="grid-md">
        {#if treasure.coins.copper > 0}
          <SelectableChip
            label={`${formatNumber(treasure.coins.copper)} Copper (${formatNumber(treasure.coins.copper / 10)} lbs)`}
            selected={selectedCoins.copper}
            onclick={() => toggleCoin('copper')}
          />
        {/if}
        {#if treasure.coins.silver > 0}
          <SelectableChip
            label={`${formatNumber(treasure.coins.silver)} Silver (${formatNumber(treasure.coins.silver / 10)} lbs)`}
            selected={selectedCoins.silver}
            onclick={() => toggleCoin('silver')}
          />
        {/if}
        {#if treasure.coins.electrum > 0}
          <SelectableChip
            label={`${formatNumber(treasure.coins.electrum)} Electrum (${formatNumber(treasure.coins.electrum / 10)} lbs)`}
            selected={selectedCoins.electrum}
            onclick={() => toggleCoin('electrum')}
          />
        {/if}
        {#if treasure.coins.gold > 0}
          <SelectableChip
            label={`${formatNumber(treasure.coins.gold)} Gold (${formatNumber(treasure.coins.gold / 10)} lbs)`}
            selected={selectedCoins.gold}
            onclick={() => toggleCoin('gold')}
          />
        {/if}
        {#if treasure.coins.platinum > 0}
          <SelectableChip
            label={`${formatNumber(treasure.coins.platinum)} Platinum (${formatNumber(treasure.coins.platinum / 10)} lbs)`}
            selected={selectedCoins.platinum}
            onclick={() => toggleCoin('platinum')}
          />
        {/if}
      </div>
    </div>
  {/if}

  <!-- Gems -->
  {#if hasGems}
    <div class="treasure-section">
      <h5>Gems ({treasure.gems.length})</h5>
      <div class="grid-md">
        {#each treasure.gems as gem, i}
          <SelectableChip
            label={`${gem.description} (${gem.value} gp, 0.01 lbs)`}
            selected={selectedGems.includes(i)}
            onclick={() => toggleGem(i)}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Art Objects -->
  {#if hasArt}
    <div class="treasure-section">
      <h5>Art Objects ({treasure.artObjects.length})</h5>
      <div class="grid-md">
        {#each treasure.artObjects as art, i}
          <SelectableChip
            label={`${art.description} (${formatNumber(art.value)} gp, ${art.weight} lbs)`}
            selected={selectedArt.includes(i)}
            onclick={() => toggleArt(i)}
          />
        {/each}
      </div>
    </div>
  {/if}

  <!-- Magic Items -->
  {#if hasMagic}
    <div class="treasure-section">
      <h5>Magic Items ({treasure.magicItems.length})</h5>
      <div class="grid-md">
        {#each treasure.magicItems as item, i}
          <SelectableChip
            label={`${item} (~1,000 gp est., 2 lbs)`}
            selected={selectedMagic.includes(i)}
            onclick={() => toggleMagic(i)}
          />
        {/each}
      </div>
      <p class="magic-note-text">
        <em>Note: Magic items have no fixed market value in AD&D 2E. Values shown are rough estimates for treasure calculation only.</em>
      </p>
    </div>
  {/if}

  <!-- Empty State -->
  {#if !hasCoin && !hasGems && !hasArt && !hasMagic}
    <div class="empty-treasure">
      <p>This hoard contains no treasure.</p>
    </div>
  {/if}

  <!-- Actions -->
  {#if showActions}
    <div class="action-bar wrap">
      {#if hasSelection}
        <button class="btn-sm btn-primary" onclick={handleCopySelected}>
          Copy Selected
        </button>
      {/if}
      <button class="btn-sm btn-secondary" onclick={handleCopyJSON}>
        Copy All (JSON)
      </button>
      <button class="btn-sm btn-secondary" onclick={handleCopyText}>
        Copy All (Text)
      </button>
      {#if onSave}
        <button class="btn-sm btn-primary" onclick={() => onSave(treasure)}>
          Save Hoard
        </button>
      {/if}
      {#if onDelete}
        <button class="btn-sm btn-danger" onclick={() => onDelete(treasure.id)}>
          Delete
        </button>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">@import '../styles/dm-tools';</style>
