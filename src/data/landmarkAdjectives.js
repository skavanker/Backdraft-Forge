/**
 * Adjectives for landmark name generation
 * Each adjective has:
 * - category: Type of adjective (mood, color, weather, etc.)
 * - exclude: Landmark types this adjective doesn't fit
 * - location: Geographies where this adjective makes sense (empty = works anywhere)
 */

export const landmarkAdjectives = [
  // Mood/Atmosphere
  { adj: 'Ancient', category: 'mood', exclude: [], location: [] },
  { adj: 'Silent', category: 'mood', exclude: ['river'], location: [] },
  { adj: 'Lonely', category: 'mood', exclude: ['river'], location: [] },
  { adj: 'Misty', category: 'mood', exclude: [], location: [] },
  { adj: 'Grim', category: 'mood', exclude: ['river'], location: [] },
  { adj: 'Hidden', category: 'mood', exclude: [], location: [] },
  { adj: 'Lost', category: 'mood', exclude: [], location: [] },
  { adj: 'Forgotten', category: 'mood', exclude: ['river'], location: [] },
  { adj: 'Shadow', category: 'mood', exclude: [], location: [] },
  { adj: 'Cursed', category: 'mood', exclude: [], location: [] },
  { adj: 'Eerie', category: 'mood', exclude: [], location: [] },
  { adj: 'Desolate', category: 'mood', exclude: ['river'], location: [] },
  { adj: 'Sacred', category: 'mood', exclude: [], location: [] },
  { adj: 'Haunted', category: 'mood', exclude: ['mountain', 'river', 'lake'], location: [] },

  // Colors
  { adj: 'Black', category: 'color', exclude: [], location: [] },
  { adj: 'White', category: 'color', exclude: [], location: [] },
  { adj: 'Grey', category: 'color', exclude: [], location: [] },
  { adj: 'Red', category: 'color', exclude: [], location: [] },
  { adj: 'Golden', category: 'color', exclude: [], location: [] },
  { adj: 'Silver', category: 'color', exclude: [], location: [] },
  { adj: 'Crimson', category: 'color', exclude: [], location: [] },
  { adj: 'Pale', category: 'color', exclude: [], location: [] },
  { adj: 'Dark', category: 'color', exclude: [], location: [] },
  { adj: 'Bleak', category: 'color', exclude: [], location: [] },

  // Weather/Temperature
  { adj: 'Stormy', category: 'weather', exclude: ['cave', 'graveyard'], location: ['coastal', 'mountain'] },
  { adj: 'Windy', category: 'weather', exclude: ['cave', 'graveyard'], location: ['coastal', 'mountain', 'plains'] },
  { adj: 'Icy', category: 'weather', exclude: ['graveyard'], location: ['mountain'] },
  { adj: 'Frosty', category: 'weather', exclude: ['graveyard'], location: ['mountain'] },
  { adj: 'Frozen', category: 'weather', exclude: ['graveyard'], location: ['mountain'] },

  // Size/Scale
  { adj: 'Great', category: 'size', exclude: [], location: [] },
  { adj: 'Grand', category: 'size', exclude: [], location: [] },
  { adj: 'Mighty', category: 'size', exclude: ['bridge', 'road'], location: [] },
  { adj: 'Vast', category: 'size', exclude: ['bridge', 'road', 'cave'], location: [] },
  { adj: 'Endless', category: 'size', exclude: ['bridge', 'graveyard'], location: [] },

  // Age
  { adj: 'Old', category: 'age', exclude: [], location: [] },
  { adj: 'Elder', category: 'age', exclude: [], location: [] },
  { adj: 'Timeless', category: 'age', exclude: ['river'], location: [] },

  // Condition
  { adj: 'Broken', category: 'condition', exclude: ['mountain', 'forest', 'river', 'lake'], location: [] },
  { adj: 'Crumbling', category: 'condition', exclude: ['mountain', 'forest', 'river', 'lake'], location: [] },
  { adj: 'Shattered', category: 'condition', exclude: ['mountain', 'forest', 'river', 'lake'], location: [] },

  // Nature/Quality
  { adj: 'Wild', category: 'nature', exclude: ['graveyard'], location: [] },
  { adj: 'Swift', category: 'nature', exclude: ['mountain', 'cave', 'graveyard'], location: [] },
  { adj: 'Verdant', category: 'nature', exclude: ['mountain', 'cave'], location: ['forest', 'plains'] },
  { adj: 'Barren', category: 'nature', exclude: ['forest', 'river', 'lake'], location: ['desert', 'mountain'] },
  { adj: 'Withered', category: 'nature', exclude: ['river', 'lake'], location: ['swamp', 'desert'] },
  { adj: 'Whispering', category: 'nature', exclude: ['mountain', 'bridge', 'road'], location: [] },

  // Mystical
  { adj: 'Enchanted', category: 'mystical', exclude: [], location: [] },
  { adj: 'Mystic', category: 'mystical', exclude: [], location: [] },
  { adj: 'Arcane', category: 'mystical', exclude: ['mountain'], location: [] },

  // Additional Colors
  { adj: 'Blue', category: 'color', exclude: [], location: [] },
  { adj: 'Green', category: 'color', exclude: [], location: [] },
  { adj: 'Amber', category: 'color', exclude: [], location: [] },

  // Additional Mood
  { adj: 'Quiet', category: 'mood', exclude: ['river'], location: [] },
  { adj: 'Solemn', category: 'mood', exclude: [], location: [] },
  { adj: 'Dire', category: 'mood', exclude: [], location: [] },
  { adj: 'Hallowed', category: 'mood', exclude: [], location: [] },

  // Additional Condition
  { adj: 'Fallen', category: 'condition', exclude: ['river', 'lake'], location: [] },
  { adj: 'Ruined', category: 'condition', exclude: ['mountain', 'forest', 'river', 'lake'], location: [] },

  // Additional Nature
  { adj: 'Raging', category: 'nature', exclude: ['graveyard'], location: [] },
  { adj: 'Serpent', category: 'nature', exclude: ['graveyard'], location: [] },

  // From Dungeon Descriptors - Depth/Darkness
  { adj: 'Deep', category: 'size', exclude: [], location: [] },
  { adj: 'Sunless', category: 'mood', exclude: [], location: ['underground'] },
  { adj: 'Abyssal', category: 'mood', exclude: [], location: ['underground'] },

  // From Dungeon Descriptors - Condition/Decay
  { adj: 'Abandoned', category: 'condition', exclude: [], location: [] },
  { adj: 'Sealed', category: 'condition', exclude: [], location: [] },
  { adj: 'Overgrown', category: 'condition', exclude: [], location: ['forest', 'swamp'] },
  { adj: 'Tangled', category: 'condition', exclude: [], location: ['forest', 'swamp'] },
  { adj: 'Rotting', category: 'condition', exclude: ['mountain', 'river', 'lake'], location: ['swamp', 'forest'] },
  { adj: 'Drowned', category: 'condition', exclude: ['mountain'], location: ['swamp', 'coastal'] },
  { adj: 'Sunken', category: 'condition', exclude: ['mountain'], location: ['swamp', 'coastal'] },
  { adj: 'Fetid', category: 'condition', exclude: ['mountain', 'river', 'lake', 'bridge', 'road'], location: ['swamp'] },
  { adj: 'Decaying', category: 'condition', exclude: ['mountain', 'river', 'lake'], location: ['swamp', 'forest'] },
  { adj: 'Flooded', category: 'condition', exclude: ['mountain'], location: ['swamp', 'coastal'] },
  { adj: 'Soggy', category: 'condition', exclude: ['mountain'], location: ['swamp'] },
  { adj: 'Buried', category: 'condition', exclude: ['river', 'lake', 'mountain'], location: ['desert', 'underground'] },
  { adj: 'Sand-covered', category: 'condition', exclude: ['river', 'lake', 'forest', 'mountain', 'graveyard'], location: ['desert'] },
  { adj: 'Doomed', category: 'condition', exclude: [], location: [] },
  { adj: 'Damned', category: 'condition', exclude: [], location: [] },

  // From Dungeon Descriptors - Nature/Quality
  { adj: 'Thorny', category: 'nature', exclude: ['mountain', 'river', 'lake'], location: ['forest', 'swamp'] },
  { adj: 'Shadowed', category: 'mood', exclude: [], location: [] },
  { adj: 'Murky', category: 'nature', exclude: ['mountain'], location: ['swamp'] },
  { adj: 'Reeking', category: 'nature', exclude: ['mountain', 'river', 'lake', 'bridge', 'road'], location: ['swamp'] },

  // Coastal
  { adj: 'Salty', category: 'weather', exclude: ['mountain', 'forest'], location: ['coastal'] },
  { adj: 'Salt-stained', category: 'condition', exclude: ['mountain', 'forest', 'tower', 'castle', 'library', 'graveyard', 'road'], location: ['coastal'] },
  { adj: 'Windblown', category: 'weather', exclude: ['cave'], location: ['coastal'] },
  { adj: 'Barnacled', category: 'condition', exclude: ['mountain', 'forest', 'tower', 'castle', 'library', 'graveyard', 'road'], location: ['coastal'] },
  { adj: 'Exposed', category: 'condition', exclude: [], location: ['coastal', 'mountain'] },
  { adj: 'Tranquil', category: 'mood', exclude: [], location: ['coastal'] },
  { adj: 'Forlorn', category: 'mood', exclude: [], location: ['coastal', 'swamp'] },
  { adj: 'Kelp-stained', category: 'condition', exclude: ['mountain', 'forest', 'tower', 'castle', 'library', 'graveyard', 'road'], location: ['coastal'] },
  { adj: "Leviathan's", category: 'ownership', exclude: [], location: ['coastal'] },

  // Plains
  { adj: 'Arid', category: 'weather', exclude: ['river', 'lake'], location: ['plains', 'desert'] },
  { adj: 'Serene', category: 'mood', exclude: [], location: ['plains'] },
  { adj: 'Lush', category: 'nature', exclude: [], location: ['plains', 'forest'] },
  { adj: 'Flowering', category: 'nature', exclude: [], location: ['plains', 'forest'] },

  // From Dungeon Descriptors - Weather/Environment
  { adj: 'Scorched', category: 'weather', exclude: ['river', 'lake'], location: ['desert'] },
  { adj: 'Windswept', category: 'weather', exclude: [], location: ['coastal', 'mountain', 'plains', 'desert'] },
  { adj: 'Sun-bleached', category: 'weather', exclude: ['river', 'lake', 'forest'], location: ['desert'] },
  { adj: 'Dry', category: 'weather', exclude: ['river', 'lake'], location: ['desert', 'plains'] },
  { adj: 'Dusty', category: 'weather', exclude: ['river', 'lake'], location: ['desert', 'plains'] },

  // From Dungeon Descriptors - Mood
  { adj: 'Secret', category: 'mood', exclude: [], location: [] },

  // From Tavern/Building Patterns - Material
  { adj: 'Crystal', category: 'material', exclude: [], location: [] },
  { adj: 'Ivory', category: 'material', exclude: [], location: [] },
  { adj: 'Obsidian', category: 'material', exclude: [], location: [] },
  { adj: 'Bone', category: 'material', exclude: [], location: [] },
  { adj: 'Stone', category: 'material', exclude: [], location: [] },
  { adj: 'Iron', category: 'material', exclude: [], location: [] },
  { adj: 'Bronze', category: 'material', exclude: [], location: [] },
  { adj: 'Copper', category: 'material', exclude: [], location: [] },

  // From Tavern Patterns - Action/Verb
  { adj: 'Prancing', category: 'action', exclude: [], location: [] },
  { adj: 'Dancing', category: 'action', exclude: [], location: [] },
  { adj: 'Laughing', category: 'action', exclude: [], location: [] },
  { adj: 'Weeping', category: 'action', exclude: [], location: [] },
  { adj: 'Howling', category: 'action', exclude: [], location: [] },
  { adj: 'Singing', category: 'action', exclude: [], location: [] },
  { adj: 'Slumbering', category: 'action', exclude: [], location: [] },
  { adj: 'Roaring', category: 'action', exclude: [], location: [] },
  { adj: 'Sleeping', category: 'action', exclude: [], location: [] },
  { adj: 'Wandering', category: 'action', exclude: [], location: [] },

  // From Shop Patterns - Quality
  { adj: 'Fine', category: 'quality', exclude: [], location: [] },
  { adj: 'Rare', category: 'quality', exclude: [], location: [] },
  { adj: 'Common', category: 'quality', exclude: [], location: [] },
  { adj: 'Exotic', category: 'quality', exclude: [], location: [] },
  { adj: 'Strange', category: 'quality', exclude: [], location: [] },
  { adj: 'Mundane', category: 'quality', exclude: [], location: [] },
  { adj: 'Curious', category: 'quality', exclude: [], location: [] },
  { adj: 'Mysterious', category: 'quality', exclude: [], location: [] },
  { adj: 'Rich', category: 'quality', exclude: [], location: [] },
  { adj: 'Poor', category: 'quality', exclude: [], location: [] },
  { adj: 'Noble', category: 'quality', exclude: [], location: [] },
  { adj: 'Humble', category: 'quality', exclude: [], location: [] },
  { adj: 'Modern', category: 'quality', exclude: [], location: [] },
  { adj: 'Antique', category: 'quality', exclude: [], location: [] },

  // From Building/Road Patterns - Ownership/Possessive
  { adj: "King's", category: 'ownership', exclude: [], location: [] },
  { adj: "Queen's", category: 'ownership', exclude: [], location: [] },
  { adj: "Wizard's", category: 'ownership', exclude: [], location: [] },
  { adj: "Mage's", category: 'ownership', exclude: [], location: [] },
  { adj: "Sorcerer's", category: 'ownership', exclude: [], location: [] },
  { adj: "Witch's", category: 'ownership', exclude: [], location: [] },
  { adj: "Warlock's", category: 'ownership', exclude: [], location: [] },
  { adj: 'Royal', category: 'ownership', exclude: [], location: [] },

  // From Tavern Patterns - Additional Mood
  { adj: 'Jolly', category: 'mood', exclude: [], location: [] },
  { adj: 'Merry', category: 'mood', exclude: [], location: [] },
  { adj: 'Lucky', category: 'mood', exclude: [], location: [] },
  { adj: 'Unlucky', category: 'mood', exclude: [], location: [] },
  { adj: 'Blessed', category: 'mood', exclude: [], location: [] },
  { adj: 'Drunken', category: 'mood', exclude: [], location: [] },
  { adj: 'Wayward', category: 'mood', exclude: [], location: [] },

  // From Building Patterns - Position/Order
  { adj: 'First', category: 'order', exclude: [], location: [] },
  { adj: 'Last', category: 'order', exclude: [], location: [] },
  { adj: 'High', category: 'position', exclude: [], location: [] },
  { adj: 'Tall', category: 'position', exclude: [], location: [] },
  { adj: 'Young', category: 'age', exclude: [], location: [] },
  { adj: 'Open', category: 'condition', exclude: [], location: [] },
  { adj: 'Closed', category: 'condition', exclude: [], location: [] },
  { adj: 'Found', category: 'mood', exclude: [], location: [] },

  // From Building/Shop Patterns - Additional
  { adj: 'Dusty', category: 'condition', exclude: [], location: [] },
  { adj: 'Forbidden', category: 'mood', exclude: [], location: [] },
  { adj: 'Rusty', category: 'condition', exclude: [], location: [] },

  // From Road Patterns - Purpose
  { adj: 'Trade', category: 'purpose', exclude: [], location: [] },
  { adj: 'Merchant', category: 'purpose', exclude: [], location: [] },
  { adj: 'Pilgrim', category: 'purpose', exclude: [], location: [] }
];

/**
 * Get available adjectives for a landmark type
 *
 * @param {string} landmarkType - The type of landmark (mountain, river, etc.)
 * @param {string} geography - Optional geography filter (coastal, mountain, forest, etc.)
 * @returns {Object[]} Array of adjective objects that fit this landmark type
 */
export function getAdjectivesForLandmark(landmarkType, geography = null) {
  return landmarkAdjectives.filter(item => {
    // Must not be excluded for this landmark type
    if (item.exclude.includes(landmarkType)) return false;

    // If location is specified and geography provided, must match
    if (geography && item.location.length > 0 && !item.location.includes(geography)) {
      return false;
    }

    return true;
  });
}
