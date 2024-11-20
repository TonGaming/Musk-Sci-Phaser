import DataBattleStageStep from "./DataBattleStageStep.js";

import DataBattleStage from "./DataBattleStage.js";

export class CenterDataBattle {
  constructor() {
    this.dataBattleDictionary = {};

    console.log("CenterDataBattle");

    // Gọi hàm tạo dữ liệu ngay khi khởi tạo
    this.CreateDataBattle();
  }

  // Phương thức lấy phần tử từ dictionary theo id
  getBattleById(id) {
    //console.log("Current dictionary:", this.dataBattleDictionary);
    return this.dataBattleDictionary[id] || null;
  }

  CreateDataBattle() {
    this.Create_Battle_0();
  }

  Create_Battle_0() {
    console.log("Create_Battle_0");

    let newBattle = [];

    //Create stage
    let stage_0 = new DataBattleStage();
    stage_0.stageId = 0;
    stage_0.timeLimit = 30;

    let stage_0_step_0 = new DataBattleStageStep();
    stage_0_step_0.id = 0;
    stage_0_step_0.activeDelayTime = 0;
    stage_0_step_0.enemyType = "normal";
    stage_0_step_0.health = 1000;
    stage_0.addStep(stage_0_step_0);

    let stage_0_step_1 = new DataBattleStageStep();
    stage_0_step_1.id = 1;
    stage_0_step_1.activeDelayTime = 5;
    stage_0_step_1.enemyType = "tank";
    stage_0_step_1.health = 1000;
    stage_0.addStep(stage_0_step_1);

    newBattle.push(stage_0);

    //Create stage
    let stage_1 = new DataBattleStage();
    stage_1.stageId = 0;
    stage_1.timeLimit = 30;

    let stage_1_step_0 = new DataBattleStageStep();
    stage_1_step_0.id = 0;
    stage_1_step_0.activeDelayTime = 0;
    stage_1_step_0.enemyType = "normal";
    stage_1_step_0.health = 1000;
    stage_1.addStep(stage_0_step_0);

    let stage_1_step_1 = new DataBattleStageStep();
    stage_1_step_1.id = 1;
    stage_1_step_1.activeDelayTime = 5;
    stage_1_step_1.enemyType = "tank";
    stage_1_step_1.health = 1000;
    stage_1.addStep(stage_1_step_1);

    newBattle.push(stage_1);

    console.log("newBattle: ", newBattle);

    // Đẩy vào dictionary với khóa là id
    this.dataBattleDictionary[0] = newBattle;
  }
}

const centerDataBattle = new CenterDataBattle();
export default centerDataBattle;
