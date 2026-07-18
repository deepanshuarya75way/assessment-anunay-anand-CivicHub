import { PreferencesModel } from '../models/preferences.model';
import { PreferencesUpdateInput } from '@civichub/shared';
import { NotFoundError } from '../../../core/exceptions';

export class PreferencesService {
  static async getPreferences(userId: string) {
    const prefs = await PreferencesModel.findOne({ userId });
    if (!prefs) throw new NotFoundError('Preferences not found');
    return prefs;
  }

  static async updatePreferences(userId: string, data: PreferencesUpdateInput) {
    const prefs = await PreferencesModel.findOneAndUpdate(
      { userId },
      { $set: data },
      { new: true }
    );
    if (!prefs) throw new NotFoundError('Preferences not found');
    return prefs;
  }
}
