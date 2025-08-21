import { useDisplayMode } from '../hooks/useDisplayMode';

// This component doesn't render anything.
// It's just a host for the display mode logic hook.
export default function DisplayModeHandler() {
  useDisplayMode();
  return null;
}
