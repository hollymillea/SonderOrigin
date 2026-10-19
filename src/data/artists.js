import content from './generated/content.js';
import {artists as localArtists, artistSlug as localSlug} from './local/artists.js';

export const artists = content.artists ?? localArtists;
// Stored slugs keep page addresses stable when an artist is renamed.
export const artistSlug = (artist) => artist.slug || localSlug(artist);
