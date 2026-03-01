/**
 * Syllable-based name generation for AD&D 2nd Edition races.
 *
 * Each race/gender has prefix + suffix arrays (and optional middles).
 * Combining them yields hundreds of unique names from small lists.
 */

const names = {
  human: {
    // Shared surnames for all genders
    surname: {
      prefix: [
        { syl: 'Black', class: ['rogue'], geo: ['neutral'], social: ['noble'], weight: 1 },
        { syl: 'Ash', class: ['neutral'], geo: ['forest'], social: ['common'], weight: 1 },
        { syl: 'Iron', class: ['warrior'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Stone', class: ['warrior'], geo: ['mountain'], social: ['common'], weight: 1 },
        { syl: 'Hawk', class: ['warrior'], geo: ['plains'], social: ['wealthy'], weight: 1 },
        { syl: 'Red', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'North', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Storm', class: ['warrior'], geo: ['coastal'], social: ['noble'], weight: 1 },
        { syl: 'Grey', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Thorn', class: ['neutral'], geo: ['forest'], social: ['common'], weight: 1 },
        { syl: 'Oak', class: ['neutral'], geo: ['forest'], social: ['common'], weight: 1 },
        { syl: 'Bright', class: ['scholar'], geo: ['neutral'], social: ['noble'], weight: 1 },
        { syl: 'Cold', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'High', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'Swift', class: ['rogue'], geo: ['neutral'], social: ['wealthy'], weight: 1 }
      ],
      suffix: [
        { syl: 'wood', class: ['neutral'], geo: ['forest'], social: ['poor'], weight: 1 },
        { syl: 'ford', class: ['neutral'], geo: ['neutral'], social: ['common'], weight: 1 },
        { syl: 'bridge', class: ['neutral'], geo: ['neutral'], social: ['common'], weight: 1 },
        { syl: 'field', class: ['neutral'], geo: ['plains'], social: ['common'], weight: 1 },
        { syl: 'well', class: ['neutral'], geo: ['neutral'], social: ['common'], weight: 1 },
        { syl: 'vale', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'borne', class: ['warrior'], geo: ['neutral'], social: ['noble'], weight: 1 },
        { syl: 'crest', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'hill', class: ['neutral'], geo: ['neutral'], social: ['common'], weight: 1 },
        { syl: 'ton', class: ['neutral'], geo: ['neutral'], social: ['common'], weight: 1 },
        { syl: 'moor', class: ['neutral'], geo: ['swamp'], social: ['poor'], weight: 1 },
        { syl: 'haven', class: ['neutral'], geo: ['coastal'], social: ['wealthy'], weight: 1 },
        { syl: 'gate', class: ['warrior'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'water', class: ['neutral'], geo: ['coastal'], social: ['poor'], weight: 1 },
        { syl: 'shield', class: ['warrior'], geo: ['neutral'], social: ['noble'], weight: 1 }
      ]
    },

    Male: {
      first: {
        prefix: [
          { syl: 'Ald', class: ['warrior'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Ed', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'God', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Wil', class: ['neutral'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'Gar', class: ['warrior'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'Rod', class: ['warrior'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'Os', class: ['neutral'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'Bran', class: ['warrior'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'Ced', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Hal', class: ['neutral'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'Mor', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Ren', class: ['rogue'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Sig', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Tor', class: ['warrior'], origin: ['rural'], social: ['poor'], weight: 1 },
          { syl: 'Ulf', class: ['warrior'], origin: ['rural'], social: ['poor'], weight: 1 }
        ],
        suffix: [
          { syl: 'ric', class: ['warrior', 'neutral'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'mund', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'win', class: ['neutral'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'fred', class: ['scholar'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'bert', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ard', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wald', class: ['neutral'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'wen', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'stan', class: ['warrior'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'gar', class: ['warrior'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'dan', class: ['rogue'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'ald', class: ['neutral'], origin: ['neutral'], social: ['poor'], weight: 1 },
          { syl: 'mar', class: ['scholar'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'ton', class: ['neutral'], origin: ['rural'], social: ['poor'], weight: 1 },
          { syl: 'helm', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
      // surname moved to shared race level above
    },
    Female: {
      first: {
        prefix: [
          { syl: 'Ael', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Bri', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'El', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Gwen', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'Is', class: ['neutral'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'Math', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Ros', class: ['neutral'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'Syl', class: ['scholar'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'Mor', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Ald', class: ['warrior'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'Hed', class: ['neutral'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'Leof', class: ['neutral'], origin: ['rural'], social: ['poor'], weight: 1 },
          { syl: 'Mil', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'Win', class: ['neutral'], origin: ['rural'], social: ['common'], weight: 1 },
          { syl: 'Cyn', class: ['warrior'], origin: ['neutral'], social: ['wealthy'], weight: 1 }
        ],
        suffix: [
          { syl: 'wyn', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'da', class: ['neutral'], origin: ['rural'], social: ['poor'], weight: 1 },
          { syl: 'dith', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'ild', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'abeth', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'ina', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'mund', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'rid', class: ['warrior'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'wen', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'ith', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'gard', class: ['warrior'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'burg', class: ['neutral'], origin: ['urban'], social: ['wealthy'], weight: 1 },
          { syl: 'lind', class: ['neutral'], origin: ['neutral'], social: ['common'], weight: 1 },
          { syl: 'thea', class: ['scholar'], origin: ['urban'], social: ['noble'], weight: 1 },
          { syl: 'ria', class: ['rogue'], origin: ['urban'], social: ['noble'], weight: 1 }
        ]
      }
    }
  },

  elf: {
    // Shared surnames for all genders
    surname: {
      prefix: [
        { syl: 'Elen', class: ['scholar'], geo: ['neutral'], social: ['noble'], weight: 1 }, // star
        { syl: 'Ithil', class: ['scholar'], geo: ['neutral'], social: ['noble'], weight: 1 }, // moon
        { syl: 'Mith', class: ['neutral'], geo: ['neutral'], social: ['wealthy'], weight: 1 }, // grey/silver
        { syl: 'Gwaer', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // wind
        { syl: 'Anor', class: ['warrior'], geo: ['neutral'], social: ['noble'], weight: 1 }, // sun
        { syl: 'Mor', class: ['rogue'], geo: ['forest'], social: ['neutral'], weight: 1 }, // shadow
        { syl: 'Olor', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 }, // dream
        { syl: 'Aur', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // dawn
        { syl: 'Nim', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 }, // white/pale
        { syl: 'Galadh', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 }, // tree
        { syl: 'Dû', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // night
        { syl: 'Menel', class: ['neutral'], geo: ['mountain'], social: ['neutral'], weight: 1 }, // sky/heaven
        { syl: 'Calen', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 }, // green
        { syl: 'Hîth', class: ['neutral'], geo: ['coastal'], social: ['neutral'], weight: 1 }, // mist
        { syl: 'Laure', class: ['warrior'], geo: ['neutral'], social: ['wealthy'], weight: 1 } // gold
      ],
      suffix: [
        { syl: 'ion', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 }, // son of
        { syl: 'wen', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // maiden
        { syl: 'dor', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 }, // land
        { syl: 'las', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // leaf
        { syl: 'orn', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // tree
        { syl: 'iel', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // daughter
        { syl: 'rim', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 }, // host/people
        { syl: 'nen', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 }, // water
        { syl: 'dil', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 }, // friend/devotion
        { syl: 'riel', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // crowned maiden
        { syl: 'ben', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // according to
        { syl: 'thir', class: ['rogue'], geo: ['neutral'], social: ['neutral'], weight: 1 }, // watcher
        { syl: 'dan', class: ['warrior'], geo: ['forest'], social: ['neutral'], weight: 1 }, // back/against
        { syl: 'reth', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 }, // climber
        { syl: 'rond', class: ['rogue'], geo: ['forest'], social: ['neutral'], weight: 1 } // vaulted/roof
      ]
    },

    Male: {
      first: {
        prefix: [
          { syl: 'Ael', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Cel', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Thal', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gal', class: ['warrior'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'Nim', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Fin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lor', class: ['scholar'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'Eil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Var', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Eld', class: ['scholar'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'Ara', class: ['warrior'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'Fael', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ith', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Quel', class: ['scholar'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'Rael', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        middle: [
          { syl: 'an', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ar', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'el', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'en', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ir', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'or', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'indor', class: ['warrior'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'ion', class: ['scholar'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'orn', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'iel', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ath', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ias', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'anor', class: ['neutral'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'ith', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ael', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ond', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'oth', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'uin', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wyn', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'aran', class: ['warrior'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'endil', class: ['scholar'], origin: ['neutral'], social: ['noble'], weight: 1 }
        ]
      }
    },
    Female: {
      first: {
        prefix: [
          { syl: 'Ael', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Nim', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Cel', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lir', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Syl', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Thal', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gal', class: ['warrior'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'Aer', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Eil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Fae', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lor', class: ['scholar'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'Mith', class: ['scholar'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'Quel', class: ['scholar'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'Var', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ara', class: ['warrior'], origin: ['neutral'], social: ['noble'], weight: 1 }
        ],
        middle: [
          { syl: 'an', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'el', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ir', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ia', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ae', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'en', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'wen', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'iel', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ara', class: ['warrior'], origin: ['neutral'], social: ['noble'], weight: 1 },
          { syl: 'ith', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'nia', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'eth', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ael', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ora', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ira', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wyn', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'essa', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ath', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'aris', class: ['scholar'], origin: ['neutral'], social: ['wealthy'], weight: 1 },
          { syl: 'ana', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ina', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    }
  },

  dwarf: {
    surname: {
      prefix: [
        { syl: 'Iron', class: ['warrior'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Stone', class: ['neutral'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Granite', class: ['warrior'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Forge', class: ['scholar'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'Anvil', class: ['scholar'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'Hammer', class: ['warrior'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Deep', class: ['neutral'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Dark', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Rock', class: ['neutral'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Steel', class: ['warrior'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'Flint', class: ['neutral'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Gold', class: ['scholar'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'Copper', class: ['scholar'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Ember', class: ['scholar'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Thunder', class: ['warrior'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'Ancient', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'True', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'First', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'High', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'Royal', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'Rust', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Dull', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Ash', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Broken', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Cracked', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Worn', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 },
        { syl: 'Tarnished', class: ['neutral'], geo: ['mountain'], social: ['poor'], weight: 1 }
      ],
      suffix: [
        { syl: 'forge', class: ['scholar'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'fist', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'hammer', class: ['warrior'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'axe', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'shield', class: ['warrior'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'delve', class: ['neutral'], geo: ['mountain'], social: ['wealthy'], weight: 1 },
        { syl: 'breaker', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'beard', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'helm', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'born', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'brand', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'heart', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'jaw', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'brow', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'grip', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'throne', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'crown', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'vault', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'hall', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'hold', class: ['neutral'], geo: ['mountain'], social: ['noble'], weight: 1 },
        { syl: 'shard', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'chip', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'dust', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'scrap', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'ruin', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 }
      ]
    },
    Male: {
      first: {
        prefix: [
          { syl: 'Thor', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Grum', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Bor', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dor', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Krag', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dum', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Bal', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Brun', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gim', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Oin', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dwal', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Nor', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Thror', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gror', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Kil', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'in', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'bar', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ak', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ok', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'im', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ur', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'gar', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ek', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'li', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'din', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'grim', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'mund', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'rik', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'dur', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'gun', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    },
    Female: {
      first: {
        prefix: [
          { syl: 'Hel', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Kath', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Brun', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dis', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gerd', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Thor', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Aud', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dag', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Frey', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Hild', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Sig', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Vor', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ket', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Runa', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gun', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'ga', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ra', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'a', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ild', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'rid', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'dis', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'la', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'rin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'na', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'li', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'da', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wyn', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'bel', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'dra', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ma', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    }
  },

  gnome: {
    surname: {
      prefix: [
        { syl: 'Sparkle', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Fiddle', class: ['scholar'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Cog', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Tinker', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Wrench', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Bobble', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Gizmo', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Spring', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Copper', class: ['scholar'], geo: ['mountain'], social: ['neutral'], weight: 1 },
        { syl: 'Nimble', class: ['rogue'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Rattle', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Tangle', class: ['neutral'], geo: ['forest'], social: ['poor'], weight: 1 },
        { syl: 'Wobble', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Crank', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Pickle', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 }
      ],
      suffix: [
        { syl: 'gear', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'sprocket', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'widget', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'top', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'fuse', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'spring', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'bottom', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'works', class: ['scholar'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'turn', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'snap', class: ['rogue'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'knob', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'bolt', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'click', class: ['scholar'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'fizz', class: ['scholar'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'pop', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 }
      ]
    },
    Male: {
      first: {
        prefix: [
          { syl: 'Bod', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Fim', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Wig', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Nim', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Zook', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Pip', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Bim', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dob', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gar', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Jeb', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Nak', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Rin', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Seb', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Tik', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Wob', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        middle: [
          { syl: 'ble', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'dy', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'dle', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ri', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'bi', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ti', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'nock', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ble', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wort', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'nik', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ber', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wick', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ton', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'pen', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'lin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'kin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'gle', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'dak', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'pos', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ren', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ster', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    },
    Female: {
      first: {
        prefix: [
          { syl: 'Bim', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ella', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Loo', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Nim', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Pip', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Zel', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Daf', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Fiz', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Gil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ivy', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Mab', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ori', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Tib', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Wren', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        middle: [
          { syl: 'ble', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'na', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'li', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ri', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'sy', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'da', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'na', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ble', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'iss', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wyn', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ora', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ette', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'kin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'da', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ry', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'la', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'phin', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wen', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ina', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'nyx', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'zel', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    }
  },

  halfling: {
    surname: {
      prefix: [
        { syl: 'Good', class: ['neutral'], geo: ['plains'], social: ['wealthy'], weight: 1 },
        { syl: 'Under', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Thorn', class: ['neutral'], geo: ['forest'], social: ['poor'], weight: 1 },
        { syl: 'Green', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'High', class: ['neutral'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Bramble', class: ['neutral'], geo: ['forest'], social: ['poor'], weight: 1 },
        { syl: 'Copper', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Old', class: ['neutral'], geo: ['neutral'], social: ['wealthy'], weight: 1 },
        { syl: 'Stout', class: ['warrior'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Brown', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'Meadow', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'Hill', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Honey', class: ['neutral'], geo: ['plains'], social: ['wealthy'], weight: 1 },
        { syl: 'Kettle', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'Plough', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'Dusty', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Worn', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Tattered', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Bare', class: ['neutral'], geo: ['plains'], social: ['poor'], weight: 1 },
        { syl: 'Thin', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'Weary', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 }
      ],
      suffix: [
        { syl: 'barrel', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'hill', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'bush', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 },
        { syl: 'bottle', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'field', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'burrow', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'kettle', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'buck', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 },
        { syl: 'bridge', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'brook', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'leaf', class: ['neutral'], geo: ['forest'], social: ['neutral'], weight: 1 },
        { syl: 'top', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'dale', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'worth', class: ['neutral'], geo: ['neutral'], social: ['neutral'], weight: 1 },
        { syl: 'bee', class: ['neutral'], geo: ['plains'], social: ['neutral'], weight: 1 },
        { syl: 'rags', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'scraps', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 },
        { syl: 'patch', class: ['neutral'], geo: ['neutral'], social: ['poor'], weight: 1 }
      ]
    },
    Male: {
      first: {
        prefix: [
          { syl: 'Cor', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Mer', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Per', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Bil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Sam', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Fro', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Pip', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ald', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dro', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Fin', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ham', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lar', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Odo', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Rol', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Wil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'bin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ry', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'rin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'bo', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wise', class: ['scholar'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'do', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'pin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ric', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'go', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ley', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'fast', class: ['rogue'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'kin', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'bert', class: ['warrior'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'and', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'lam', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    },
    Female: {
      first: {
        prefix: [
          { syl: 'Rose', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Mar', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Prim', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lav', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Daisy', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Cam', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Bell', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ama', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Pop', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Clem', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Dahl', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Ivy', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Lily', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'May', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'Wil', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ],
        suffix: [
          { syl: 'mary', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'igold', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'rose', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ula', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'bell', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'lia', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ina', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ryl', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'py', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ine', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ia', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'wyn', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'ette', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'lee', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 },
          { syl: 'low', class: ['neutral'], origin: ['neutral'], social: ['neutral'], weight: 1 }
        ]
      }
    }
  }
};

function pick(arr) {
  const item = arr[Math.floor(Math.random() * arr.length)];
  return typeof item === 'string' ? item : item.syl;
}

function generateFirst(parts) {
  const prefix = pick(parts.prefix);
  const middle = parts.middle && Math.random() < 0.3 ? pick(parts.middle) : '';
  const suffix = pick(parts.suffix);
  return prefix + middle + suffix;
}

function generateSurname(parts) {
  return pick(parts.prefix) + pick(parts.suffix);
}

// Export names data for weighted generation
export { names };
