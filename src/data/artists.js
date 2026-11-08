import content from './generated/content.js';
import {artists as localArtists, artistSlug as localSlug} from './local/artists.js';

export const artists = content.artists ?? localArtists;
// CMS artists carry the address made from their name; local ones derive it.
export const artistSlug = (artist) => artist.slug || localSlug(artist);
