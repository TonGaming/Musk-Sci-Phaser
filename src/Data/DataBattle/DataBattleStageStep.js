class DataBattleStageStep {
  constructor(id, activeDelayTime, enemyType, health) {
    this.id = id;
    this.activeDelayTime = activeDelayTime;
    this.enemyType = enemyType; // Loại quái (normal, tank, drone)
    this.health = health;
  }
}

export default DataBattleStageStep;
