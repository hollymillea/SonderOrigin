// An artist's page address comes from their name: "Olivia Dean" → olivia-dean.
export const artistSlug = (artist) =>
  (artist?.name || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
