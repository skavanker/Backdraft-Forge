<script>
  let {
    character,
    onClose,
    onComplete,
  } = $props();

  // Initialize from existing equipment object or defaults
  let gpWorking = $state(character.equipment?.gp ?? 0);
  let spWorking = $state(character.equipment?.sp ?? 0);
  let cpWorking = $state(character.equipment?.cp ?? 0);

  // Custom adjustment state
  let customAmount = $state(10);
  let customCurrency = $state('gp');

  // Derived total value in gp (for display)
  let totalGoldValue = $derived(gpWorking + (spWorking / 10) + (cpWorking / 100));

  // Convert smaller denominations to larger ones
  function convertToLargerCoins() {
    // Convert 10+ cp to sp
    const extraSp = Math.floor(cpWorking / 10);
    cpWorking = cpWorking % 10;
    spWorking += extraSp;

    // Convert 10+ sp to gp
    const extraGp = Math.floor(spWorking / 10);
    spWorking = spWorking % 10;
    gpWorking += extraGp;
  }

  // Quick adjustment functions
  function adjustGold(amount) {
    gpWorking = Math.max(0, gpWorking + amount);
  }

  function adjustCustom(amount) {
    if (customCurrency === 'gp') {
      gpWorking = Math.max(0, gpWorking + amount);
    } else if (customCurrency === 'sp') {
      spWorking = Math.max(0, spWorking + amount);
    } else if (customCurrency === 'cp') {
      cpWorking = Math.max(0, cpWorking + amount);
    }
  }

  function save() {
    const updates = {
      equipment: {
        ...character.equipment,
        gp: gpWorking,
        sp: spWorking,
        cp: cpWorking,
        remaining: totalGoldValue, // For backwards compatibility (if needed)
      },
    };
    onComplete(updates);
  }

  function cancel() {
    onClose(); // Close modal
  }
</script>

<div class="manage-panel">
  <h3>Currency Management</h3>

  <div class="currency-display">
    <div class="currency-row">
      <span class="label">Total Value</span>
      <span class="value">{totalGoldValue.toFixed(2)} gp</span>
    </div>
  </div>

  <div class="currency-breakdown">
    <div class="currency-item">
      <label for="gp-input">Gold Pieces (gp)</label>
      <input
        id="gp-input"
        type="number"
        bind:value={gpWorking}
        min="0"
        step="1"
        class="currency-input"
      />
    </div>
    <div class="currency-item">
      <label for="sp-input">Silver Pieces (sp)</label>
      <input
        id="sp-input"
        type="number"
        bind:value={spWorking}
        min="0"
        step="1"
        class="currency-input"
      />
    </div>
    <div class="currency-item">
      <label for="cp-input">Copper Pieces (cp)</label>
      <input
        id="cp-input"
        type="number"
        bind:value={cpWorking}
        min="0"
        step="1"
        class="currency-input"
      />
    </div>
  </div>

  <div class="convert-section">
    <button class="btn-secondary" onclick={convertToLargerCoins}>
      Convert to Larger Coins
    </button>
    <p class="meta-text">Automatically converts 10 cp → 1 sp, 10 sp → 1 gp</p>
  </div>

  <div class="quick-buttons">
    <div class="button-group">
      <span class="group-label">Add Gold</span>
      <button class="btn-secondary" onclick={() => adjustGold(10)}>+10 gp</button>
      <button class="btn-secondary" onclick={() => adjustGold(50)}>+50 gp</button>
      <button class="btn-secondary" onclick={() => adjustGold(100)}>+100 gp</button>
    </div>

    <div class="button-group">
      <span class="group-label">Remove Gold</span>
      <button class="btn-secondary" onclick={() => adjustGold(-10)}>-10 gp</button>
      <button class="btn-secondary" onclick={() => adjustGold(-50)}>-50 gp</button>
      <button class="btn-secondary" onclick={() => adjustGold(-100)}>-100 gp</button>
    </div>
  </div>

  <div class="custom-adjust">
    <span class="label">Custom Amount</span>
    <div class="custom-inputs">
      <input
        type="number"
        bind:value={customAmount}
        min="0"
        step="1"
        class="custom-input"
      />
      <select bind:value={customCurrency} class="custom-select">
        <option value="gp">gp</option>
        <option value="sp">sp</option>
        <option value="cp">cp</option>
      </select>
      <button class="btn-secondary" onclick={() => adjustCustom(customAmount)}>Add</button>
      <button class="btn-secondary" onclick={() => adjustCustom(-customAmount)}>Remove</button>
    </div>
  </div>

  <div class="panel-actions">
    <button class="btn-secondary" onclick={cancel}>Cancel</button>
    <button class="btn-primary" onclick={save}>Save Changes</button>
  </div>
</div>
