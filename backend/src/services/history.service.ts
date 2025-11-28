import userGameHistoryRepository from '../repositories/userGameHistory.repository';
import { CreateGameHistoryDto } from '../models/user.model';

export class HistoryService {
  async getHistory(userId: string, page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;
    const history = await userGameHistoryRepository.findByUserId(userId, limit, offset);
    const total = await userGameHistoryRepository.countByUserId(userId);

    return {
      history,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createHistory(data: CreateGameHistoryDto) {
    return await userGameHistoryRepository.create(
      data.userId,
      data.mode,
      data.targetWord,
      data.won,
      data.attemptsUsed
    );
  }
}

export default new HistoryService();

