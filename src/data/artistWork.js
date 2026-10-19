import content from './generated/content.js';
import {getArtistWork as localArtistWork} from './local/artistWork.js';

export function getArtistWork(index) {
  return content.artists ? content.artists[index].chapters : localArtistWork(index);
}
