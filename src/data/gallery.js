import content from './generated/content.js';
import {gallery as localGallery} from './local/gallery.js';

export const gallery = content.gallery ?? localGallery;
