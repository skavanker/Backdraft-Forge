<script>
  import { getConstitutionModifiers } from '../../data/mechanics.js';
  import { isPastNameLevel, getPostNameHP } from '../../data/levelTables.js';

  let {
    character,
    newLevel,
    classKey,
    classGroup,
    hitDie,
    dieMax,
    dieSvgType,
    dieSvgMax,
    hpRolled = $bindable(false),
    hpRoll = $bindable(0),
    hpConMod = $bindable(0),
    hpTotal = $bindable(0),
    onNext,
    onPrev
  } = $props();

  let diceAnimating = $state(false);
  let animDieFace = $state(1);
  let isPostName = $state(false);

  // Dice animation constants
  const ANIM_TOTAL_FRAMES = 16;
  const ANIM_BASE_DELAY = 80;
  const ANIM_MAX_EXTRA_DELAY = 420;

  function rollHP() {
    isPostName = isPastNameLevel(classKey, newLevel);
    const conMods = getConstitutionModifiers(character.adjustedAbilities.CON, classGroup);

    if (isPostName) {
      // Post name level (9+ for most classes): Fixed HP gain, no CON bonus
      // AD&D 2E rule: After reaching "name level" (when you get a stronghold),
      // you gain a fixed small HP amount per level instead of rolling dice.
      hpRoll = getPostNameHP(classKey);
      hpConMod = 0;
      hpTotal = hpRoll;
    } else {
      // Normal leveling: Roll hit die + CON modifier
      hpConMod = conMods.hpAdj;
      diceAnimating = true;

      let frame = 0;

      // DICE TUMBLING ANIMATION:
      // Creates a "dice rolling" effect by showing random faces and values,
      // then slowing down to a final result. This gives visual feedback and
      // builds anticipation for the HP roll result.
      function tick() {
        // Update displayed die face and preview value each frame
        animDieFace = Math.floor(Math.random() * dieSvgMax) + 1;
        hpRoll = Math.floor(Math.random() * dieMax) + 1;
        frame++;

        if (frame >= ANIM_TOTAL_FRAMES) {
          // Final frame: settle on actual result
          hpRoll = Math.floor(Math.random() * dieMax) + 1;
          hpTotal = Math.max(1, hpRoll + hpConMod); // Minimum 1 HP per level
          hpRolled = true;
          diceAnimating = false;
          return;
        }

        // EASE-OUT ANIMATION: Start fast, slow down at the end
        // Uses power curve (1.8 exponent) to create natural "settling" effect
        // like a real die tumbling and coming to rest.
        const progress = frame / ANIM_TOTAL_FRAMES; // 0.0 to 1.0
        const delay = ANIM_BASE_DELAY + Math.pow(progress, 1.8) * ANIM_MAX_EXTRA_DELAY;
        setTimeout(tick, delay);
      }

      setTimeout(tick, ANIM_BASE_DELAY);
      return;
    }

    hpRolled = true;
  }
</script>

<div class="levelup-step">
  {#if isPastNameLevel(classKey, newLevel)}
    <h3>Hit Points</h3>
    <p class="meta-text">Past name level — you gain a fixed +{getPostNameHP(classKey)} HP (no CON bonus).</p>
    <div class="hp-roll-area">
      <div class="hp-fixed-result">+{getPostNameHP(classKey)} HP</div>
    </div>
  {:else}
    <h3>Roll Hit Points</h3>
    <p class="meta-text">Roll {hitDie} + CON modifier ({getConstitutionModifiers(character.adjustedAbilities.CON, classGroup).hpAdj >= 0 ? '+' : ''}{getConstitutionModifiers(character.adjustedAbilities.CON, classGroup).hpAdj})</p>

    <div class="hp-roll-area">
      {#if !hpRolled && !diceAnimating}
        <button class="btn-primary" style="display: flex; align-items: center; gap: 0.5rem; border: 2px solid var(--gold);" onclick={rollHP}>
          <img class="roll-die-icon" src="/dice/{dieSvgType}-{Math.floor(Math.random() * dieSvgMax) + 1}.svg" alt="die" />
          Roll {hitDie}
        </button>
      {:else}
        <div class="dice-result" class:animating={diceAnimating}>
          {#if diceAnimating}
            <div class="die-graphic">
              <img src="/dice/{dieSvgType}-{animDieFace}.svg" alt="rolling..." />
            </div>
            <div class="die-value-preview">{hpRoll}</div>
          {:else}
            <div class="die-graphic landed">
              <img src="/dice/{dieSvgType}-{Math.min(hpRoll, dieSvgMax)}.svg" alt="{hpRoll}" />
            </div>
            <div class="die-value-final">{hpRoll}</div>
          {/if}
        </div>
        {#if hpRolled}
          <div class="hp-breakdown panel">
            <span class="hp-part"><span class="hp-label">Roll</span> {hpRoll}</span>
            {#if hpConMod !== 0}
              <span class="hp-part"><span class="hp-label">CON</span> {hpConMod >= 0 ? '+' : ''}{hpConMod}</span>
            {/if}
            <span class="hp-total">+{hpTotal} HP</span>
          </div>
        {/if}
      {/if}
    </div>
  {/if}

  <div class="step-nav">
    <button class="btn-secondary" onclick={onPrev}>Back</button>
    <button class="btn-primary" onclick={onNext} disabled={!isPastNameLevel(classKey, newLevel) && !hpRolled}>Continue</button>
  </div>
</div>
