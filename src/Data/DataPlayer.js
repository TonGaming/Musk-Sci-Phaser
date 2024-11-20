class DataPlayer {
  /**
   * Tạo một đối tượng DataPlayer.
   *
   * @param {number} playerId - ID của nhân vật.
   * @param {string} name - Tên của người chơi.
   * @param {'c' | 'b' | 'a' | 's' | 'ss' | 'ssr'} rank - Xếp hạng của người chơi.
   *   - `c`: Rank thấp nhất
   *   - `b`: Rank trung bình
   *   - `a`: Rank tốt
   *   - `s`: Rank cao
   *   - `ss`: Rank rất cao
   *   - `ssr`: Rank cao nhất, cực kỳ hiếm
   * @param {'gunner' | 'rocket' | 'sniper'} role - Vai trò của người chơi trong trận đấu.
   * @param {string} spineUIKey - Khóa spine UI.
   * @param {string} spineGameplayKey - Khóa spine gameplay.
   * @param {string} cardImgKey - Khóa hình ảnh của thẻ.
   * @param {float} attackDelay - Độ trễ đến lần bắn tiếp theo.
   * @param {float} attackDamage - Độ trễ đến lần bắn tiếp theo.
   */
  constructor(
    playerId,
    name,
    rank,
    role,
    spineUIKey,
    spineGameplayKey,
    cardImgKey,
    attackDelay = 0,
    attackDamage = 100
  ) {
    this.playerId = playerId;
    this.name = name;
    this.rank = rank;
    this.role = role;
    this.spineUIKey = spineUIKey;
    this.spineGameplayKey = spineGameplayKey;
    this.cardImgKey = cardImgKey;
    this.attackDelay = attackDelay;
    this.attackDamage = attackDamage;
  }
}

export default DataPlayer;
