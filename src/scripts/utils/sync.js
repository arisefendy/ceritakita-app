import { StoryAPI } from '../data/api';
import Database from '../data/database';
import { showToast } from './alert';

export async function syncPendingStories() {
  try {
    const pendingStories = await Database.getAllPendingStories();

    if (!pendingStories.length) return;

    let successCount = 0;
    for (const story of pendingStories) {
      try {
        const { id, ...data } = story;
        const response = await StoryAPI.addStory(data);

        if (response.ok) {
          await Database.removePendingStory(id);
          successCount++;
        } else {
          console.warn('Gagal sync:', id, response.message);
        }
      } catch (error) {
        console.error('Gagal sync (network):', error);

        if (error instanceof TypeError) {
          break;
        }
      }
    }

    if (successCount > 0) {
      showToast(`${successCount} data berhasil disinkronkan`, 'success');
      window.dispatchEvent(new Event('data-synced'));
    }
  } catch (error) {
    console.error('syncPendingStories: error:', error);
  }
}
