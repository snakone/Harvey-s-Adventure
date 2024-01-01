import { AUDIO_LIBRARY } from "../lib/audio.lib";
export let clicked = false;

/**
 * Play the Map Audio only the first time.
 * @see {handleKeyDown}
 * @returns {void}
 */
export function playFirstAudio(): void {
  // START FIRST AUDIO
  if(clicked) { return; }
  // AUDIO_LIBRARY.map.play();
  clicked = true;
}