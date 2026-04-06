import Map from '../utils/map';

export async function storyMapper(story) {
  if (!story.lat && !story.lon) {
    return story;
  }

  return {
    ...story,
    placeName: await Map.getPlaceNameByCoordinate(story.lat, story.lon),
  };
}
