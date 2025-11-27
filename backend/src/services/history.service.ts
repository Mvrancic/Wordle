import userGameHistoryRepository from '../repositories/userGameHistory.repository';

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
}

export default new HistoryService();

