<script>
  import { onMount } from 'svelte';

  let { character, onComplete } = $props();

  let name = $state(character.name || '');
  let backstory = $state(character.backstory || '');

  function confirm() {
    onComplete({
      name: name.trim() || 'Unnamed Hero',
      backstory: backstory.trim()
    });
  }

  function generatePlaceholder() {
    const race = character.race?.name || 'mysterious';
    const cls = character.wizardSchool?.name || character.cls?.name || 'adventurer';
    return `Write your character's backstory here...\n\nWho is this ${race} ${cls}? Where did they come from? What drives them to adventure?`;
  }
</script>

<div class="backstory-editor">
  <div class="name-section">
    <label for="char-name">Character Name</label>
    <input
      id="char-name"
      type="text"
      bind:value={name}
      placeholder="Enter your character's name"
      maxlength="50"
    />
  </div>

  <div class="backstory-section">
    <label for="backstory">Backstory</label>
    <textarea
      id="backstory"
      bind:value={backstory}
      placeholder={generatePlaceholder()}
      rows="10"
      maxlength="500"
    ></textarea>
    <p class="hint">Optional - you can always add this later.</p>
  </div>

  <div class="ai-coming-soon">
    <span class="badge">Coming Soon</span>
    <span class="text">AI-generated backstory suggestions</span>
  </div>

  <button class="btn-primary" onclick={confirm}>
    {name ? `Continue as ${name}` : 'Continue'} → Character Sheet
  </button>
</div>

<style lang="scss">
  .backstory-editor {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
    margin: 0 auto;
  }

  .name-section,
  .backstory-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: var(--text-body);
    }
  }

  input[type="text"] {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    font-size: 1.1rem;
    font-family: 'Cinzel', serif;

    &:focus {
      outline: none;
      border-color: var(--gold);
    }
  }

  textarea {
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: var(--bg-input);
    color: var(--text-primary);
    font-size: 0.95rem;
    line-height: 1.6;
    resize: vertical;
    min-height: 150px;

    &:focus {
      outline: none;
      border-color: var(--gold);
    }

    &::placeholder {
      color: var(--text-faint);
    }
  }

  .hint {
    font-size: 0.85rem;
    color: var(--text-muted);
    margin: 0;
  }

  .ai-coming-soon {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    background: var(--bg-panel);
    border-radius: 4px;
    border: 1px dashed var(--border-color);

    .badge {
      padding: 0.2rem 0.5rem;
      background: var(--gold-dark);
      color: white;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      border-radius: 2px;
    }

    .text {
      font-size: 0.9rem;
      color: var(--text-muted);
    }
  }

  .btn-primary {
    align-self: center;
  }
</style>
