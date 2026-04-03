import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,

  STORY_LIST: `${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_NEW_STORY: `${CONFIG.BASE_URL}/stories`,
};

export class StoryAPI {
  static async register({ name, email, password }) {
    const data = JSON.stringify({ name, email, password });

    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });

    const result = await response.json();

    return {
      ...result,
      ok: response.ok,
    };
  }

  static async login({ email, password }) {
    const data = JSON.stringify({ email, password });

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });

    const result = await response.json();

    return {
      ...result,
      ok: response.ok,
    };
  }

  static async getAllStories() {
    const accessToken = getAccessToken();

    const response = await fetch(ENDPOINTS.STORY_LIST, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const result = await response.json();

    return {
      ...result,
      ok: response.ok,
    };
  }

  static async getStoryDetail(id) {
    const accessToken = getAccessToken();

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const result = await response.json();

    return {
      ...result,
      ok: response.ok,
    };
  }

  static async addStory({ description, photo, latitude, longitude }) {
    const accessToken = getAccessToken();

    const formData = new FormData();
    formData.set('description', description);
    formData.set('photo', photo[0]);
    if (latitude) formData.set('lat', latitude);
    if (longitude) formData.set('lon', longitude);

    const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: formData,
    });

    const result = await response.json();

    return {
      ...result,
      ok: response.ok,
    };
  }
}
