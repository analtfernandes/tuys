import * as rankingRepository from "../repositories/ranking.repository";
import { formatStories } from "./story.services";

async function getRanking(userId: number) {
  const today = new Date();
  const dayIndex = today.getDay();
  const dayDiff = today.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
  const from = new Date(today.setDate(dayDiff)).toISOString();
  const ranking = await rankingRepository.findStories({ from, userId });

  return formatStories(ranking, userId);
}

export { getRanking };
