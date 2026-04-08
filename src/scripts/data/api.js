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

    const json = await response.json();
    return { ...json, ok: response.ok };
  }

  static async login({ email, password }) {
    const data = JSON.stringify({ email, password });

    const response = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data,
    });

    const json = await response.json();
    return { ...json, ok: response.ok };
  }

  static async getStories() {
    const token = getAccessToken();

    const response = await fetch(ENDPOINTS.STORY_LIST, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await response.json();
    return { ...json, ok: response.ok };
  }

  static async getStoryById(id) {
    const token = getAccessToken();

    const response = await fetch(ENDPOINTS.STORY_DETAIL(id), {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const json = await response.json();
    return { ...json, ok: response.ok };
  }

  static async addStory({ description, photo, lat, lon }) {
    const token = getAccessToken();
    const formData = new FormData();

    formData.set('description', description);
    if (photo) formData.set('photo', photo);
    if (lat != null) formData.set('lat', lat);
    if (lon != null) formData.set('lon', lon);

    const response = await fetch(ENDPOINTS.ADD_NEW_STORY, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const json = await response.json();
    return { ...json, ok: response.ok };
  }
}
