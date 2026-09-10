export interface Voice {
  id: string;
  label: string;
}

const names = [
  'alexis', 'bree', 'brittany', 'brooke', 'bruce', 'cliff', 'cole', 'colin',
  'conor', 'donovan', 'drew', 'elise', 'gemma', 'haley', 'hannah', 'heather',
  'jack', 'kai', 'kelsey', 'kit', 'maeve', 'marcelo', 'marcus', 'meena',
  'meghan', 'miles', 'naveen', 'paige', 'priya', 'rufus', 'sean', 'sharon',
  'sienna', 'tanner', 'wade', 'wes'
];

export const allVoices: Voice[] = names.map((n) => ({
  id: `flux-${n}-en`,
  label: n.charAt(0).toUpperCase() + n.slice(1)
}));

/** Tiga suara yang tampil di homepage. */
export const homeVoices: Voice[] = [
  { id: 'flux-alexis-en', label: 'Alexis' },
  { id: 'flux-bree-en', label: 'Bree' },
  { id: 'flux-marcus-en', label: 'Marcus' }
];
