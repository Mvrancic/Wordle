import userStatsRepository from '../repositories/userStats.repository';
import userGameHistoryRepository from '../repositories/userGameHistory.repository';
import { UpdateUserStatsDto, CreateGameHistoryDto } from '../models/user.model';

export class StatsService {
  async getStats(userId: string) {
    let stats = await userStatsRepository.findByUserId(userId);
    
    // Crear stats si no existen
    if (!stats) {
      stats = await userStatsRepository.create(userId);
    }
    
    return stats;
  }

  async recordGame(data: CreateGameHistoryDto & UpdateUserStatsDto) {
    // Crear historial de partida
    await userGameHistoryRepository.create(
      data.userId,
      data.mode,
      data.targetWord,
      data.won,
      data.attemptsUsed
    );

    // Actualizar estadísticas
    const updatedStats = await userStatsRepository.updateAfterGame(
      data.userId,
      data.won,
      data.attemptsUsed
    );

    return updatedStats;
  }
}

export default new StatsService();

