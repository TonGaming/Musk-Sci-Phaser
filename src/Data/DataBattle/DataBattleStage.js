import DataBattleStageStep from "./DataBattleStageStep.js";

class DataBattleStage {
  constructor(stageId, timeLimit = null) {
    this.stageId = stageId;
    this.timeLimit = timeLimit; // Giới hạn thời gian cho Elite
    this.steps = [];
  }

  // Thêm bước vào Stage
  addStep(step) {
    this.steps.push(step);
  }
}

export default DataBattleStage;
