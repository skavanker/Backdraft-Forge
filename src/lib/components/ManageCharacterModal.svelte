<script>
  import StepModal from './StepModal.svelte';
  import XPAdjustPanel from './panels/XPAdjustPanel.svelte';
  import GoldAdjustPanel from './panels/GoldAdjustPanel.svelte';
  import HPAdjustPanel from './panels/HPAdjustPanel.svelte';
  import SpellSlotPanel from './panels/SpellSlotPanel.svelte';
  import RestRecoveryPanel from './panels/RestRecoveryPanel.svelte';

  let {
    character,
    isOpen = $bindable(false),
    initialPanel = 'xp',
    onComplete,
  } = $props();

  let currentStepIndex = $state(0);

  // Set initial panel when modal opens
  $effect(() => {
    if (isOpen) {
      const panelIndex = panels.findIndex(p => p.id === initialPanel);
      if (panelIndex >= 0) {
        currentStepIndex = panelIndex;
      } else {
        currentStepIndex = 0; // Fallback to first panel
      }
    }
  });

  // Define all management panels (no menu panel)
  let panels = [
    {
      id: 'xp',
      label: 'XP',
      icon: '⭐',
      description: 'Adjust experience points',
      component: XPAdjustPanel,
      props: {
        get character() { return character; },
      },
      condition: true,
    },
    {
      id: 'gold',
      label: 'Gold',
      icon: '💰',
      description: 'Manage currency (gp/sp/cp)',
      component: GoldAdjustPanel,
      props: {
        get character() { return character; },
      },
      condition: true,
    },
    {
      id: 'hp',
      label: 'HP',
      icon: '❤️',
      description: 'Heal or take damage',
      component: HPAdjustPanel,
      props: {
        get character() { return character; },
      },
      condition: true,
    },
    {
      id: 'spells',
      label: 'Spell Slots',
      icon: '✨',
      description: 'Track used spell slots',
      component: SpellSlotPanel,
      props: {
        get character() { return character; },
      },
      condition: character.spellSlots && character.spellSlots.length > 0,
    },
    {
      id: 'rest',
      label: 'Rest',
      icon: '🛡️',
      description: 'Take a short or long rest',
      component: RestRecoveryPanel,
      props: {
        get character() { return character; },
      },
      condition: true,
    },
  ];

  function handleComplete(updates) {
    onComplete(updates);
    isOpen = false;
  }

  function handleClose() {
    isOpen = false;
  }
</script>

<StepModal
  bind:isOpen
  bind:currentStepIndex
  title="Manage Character"
  subtitle={character.name}
  mode="menu"
  steps={panels}
  onClose={handleClose}
  onComplete={handleComplete}
  maxWidth="640px"
  showProgress={true}
/>

<style lang="scss">
  @import '../styles/modal';
  @import '../styles/manage';
</style>
