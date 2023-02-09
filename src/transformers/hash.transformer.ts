import * as bcrypt from 'bcryptjs';

export class HashTransformer {
  /**
   * Create hash from string
   * @param {string} plainText
   */
  static make(plainText) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(plainText, salt);
  }

  /**
   * Compare hash with string
   * @param {string} plainText
   * @param {string} hash
   */
  static compare(plainText, hash) {
    return bcrypt.compareSync(plainText, hash);
  }
}
