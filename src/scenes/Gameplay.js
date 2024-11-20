import { Scene } from "phaser";

import { CreatePlayerSelector } from "./Gameplay/GameplayPlayerSelector.js";

import { CreateTopBar } from "./Gameplay/GameplayTopBar.js";

import { CreateSkillButtons } from "./Gameplay/GameplaySkillButtons.js";

import { CreateGameOver } from "./Gameplay/GameplayGameOver.js";

import { CreateCrosshair } from "./Player/Crosshair.js";
import { ActiveCrosshair } from "./Player/Crosshair.js";

import Map from "./Map/Map.js";
import Enemy from "./Enemy/Enemy.js";
import Player from "./Player/Player.js";

import centerData from "../Data/CenterData.js";

import centerDataBattle from "../Data/DataBattle/CenterDataBattle.js";

import { socketService } from "../socket.js";

export class Gameplay extends Scene {
  constructor() {
    super("Gameplay");

    this.socketInited = false;

    this.currentEnemyIndex = -1;
  }

  preload() {}

  create() {
    // Tạo bản đồ
    this.CreateMap(this);

    //Tạo player
    this.CreatePlayer(this);

    this.GetBattle(this);

    centerData.AddPlayerInfoChange((event) => {
      console.log("Thông tin người chơi đã thay đổi:", event.detail);
    });

    CreateCrosshair(this);

    CreatePlayerSelector(this);

    CreateTopBar(this);

    //CreateSkillButtons(this);
  }

  shakeCamera(camera, duration) {
    camera.shake(duration, 0.01); // Thời gian và cường độ rung
  }

  map = null;
  CreateMap(scene) {
    this.map = new Map(scene, "map_0");
  }

  spawnedPlayerArr = [];
  player = null;
  CreatePlayer(scene) {
    for (let i = 0; i < centerData.selectedPlayer.length; i++) {
      this.spawnedPlayerArr.push(
        new Player(scene, 300, 1920, centerData.selectedPlayer[i])
      );
    }

    this.SetPlayer(scene, centerData.selectedPlayer[0]);
  }

  SetPlayer(scene, playerId) {
    console.log("SetPlayer: ", playerId);

    for (let i = 0; i < this.spawnedPlayerArr.length; i++) {
      let p = this.spawnedPlayerArr[i];

      if (p.pData.playerId === playerId) {
        p.setActive(true);
        this.player = p;
      } else {
        p.setActive(false);
      }
    }
  }

  // Phương thức lấy phần tử từ dictionary theo id
  getSpawnedPlayerById(id) {
    return this.spawnedPlayerArr[id] || null;
  }

  battle = null;

  stageEnemies = 0;

  killedEnemies = 0;

  currentStageIndex = 0;

  GetBattle(scene) {
    this.battle = centerDataBattle.getBattleById(0);

    console.log("GetBattle: ", this.battle);

    this.currentStageIndex = -1;

    this.NextStage(scene);
  }

  NextStage(scene) {
    this.stageEnemies = 0;

    this.killedEnemies = 0;

    this.currentStageIndex += 1;

    if (this.currentStageIndex <= this.battle.length - 1) {
      this.currentStageStepIndex = -1;

      let stage = this.battle[this.currentStageIndex];

      console.log("Next stage: ", stage);

      this.NextStageStep(scene);
    }
  }

  NextStageStep(scene) {
    if (
      this.currentStageStepIndex <=
      this.battle[this.currentStageIndex].steps.length - 1
    ) {
      let steps = this.battle[this.currentStageIndex].steps;

      console.log("Next stage step: ", steps);
      console.log("Next stage step lenght: ", steps.length);

      for (let i = 0; i < steps.length; i++) {
        console.log("stage step: ", i);

        this.stageEnemies++;

        scene.time.delayedCall(steps[i].activeDelayTime * 1000, () => {
          let enemyId = `enemy_stage_${this.currentStageIndex}_step_${i}_${steps[i].enemyType}`;

          this.CreateEnemy(scene, enemyId, steps[i].enemyType, steps[i].health);
        });
      }
    }
  }

  CreateEnemy(scene, enemyId, enemyType, enemyHealth) {
    console.log("create enemy: ", enemyId);

    if (enemyType === "normal") {
      this.CreateNormalEnemy(scene, enemyId, enemyType, enemyHealth);
    } else if (enemyType === "tank") {
      this.CreateTankEnemy(scene, enemyId, enemyType, enemyHealth);
    }

    console.log("stageEnemies: ", this.stageEnemies);
  }

  CreateNormalEnemy(scene, enemyId, enemyType, enemyHealth) {
    let newEnemy = new Enemy(
      scene,
      540,
      1281,
      enemyId,
      enemyType,
      enemyHealth,
      enemyHealth,
      (pointer) => {
        this.OnEnemyHitPointerDown(scene, pointer, newEnemy);
      },
      () => {
        this.OnEnemyDead(newEnemy);
      }
    );
  }

  CreateTankEnemy(scene, enemyId, enemyType, enemyHealth) {
    let newEnemy = new Enemy(
      scene,
      540,
      1281,
      enemyId,
      enemyType,
      enemyHealth,
      enemyHealth,
      (pointer) => {
        this.OnEnemyHitPointerDown(scene, pointer, newEnemy);
      },
      () => {
        this.OnEnemyDead();
      }
    );
  }

  OnEnemyHitPointerDown(scene, pointer, enemy) {
    console.log("enemy hit");
    console.log("enemy: ", enemy);

    if (this.player.isCanAttack) {
      if (this.player.pData.role === "gunner") {
        if (enemy.hp > 0) {
          this.player.takeShoot();

          let caculatedHealth = enemy.hp - this.player.pData.attackDamage;

          // Clamp giá trị để không thấp hơn 0
          caculatedHealth = Phaser.Math.Clamp(caculatedHealth, 0, enemy.hp);

          enemy.setHealth(scene, caculatedHealth);

          ActiveCrosshair(this, pointer.x, pointer.y, this.player.pData.role);
        }
      }
    }
  }

  OnEnemyDead(enemy) {
    this.killedEnemies++;

    console.log("killedEnemies: ", this.killedEnemies);
  }
}
