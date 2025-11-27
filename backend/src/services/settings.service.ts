import userSettingsRepository from '../repositories/userSettings.repository';
import { UpdateUserSettingsDto } from '../models/user.model';

export class SettingsService {
  async getSettings(userId: string) {
    let settings = await userSettingsRepository.findByUserId(userId);
    
    // Crear settings con valores por defecto si no existen
    if (!settings) {
      settings = await userSettingsRepository.create(userId);
    }
    
    return settings;
  }

  async updateSettings(userId: string, updates: UpdateUserSettingsDto) {
    // Asegurar que settings existan antes de actualizar
    let settings = await userSettingsRepository.findByUserId(userId);
    if (!settings) {
      settings = await userSettingsRepository.create(userId);
    }
    
    return await userSettingsRepository.update(userId, updates);
  }
}

export default new SettingsService();

