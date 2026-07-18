import * as argon2 from 'argon2';

export class CryptoService {
  static async hash(password: string): Promise<string> {
    return argon2.hash(password);
  }

  static async verify(hash: string, plain: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plain);
    } catch (err) {
      return false;
    }
  }
}
