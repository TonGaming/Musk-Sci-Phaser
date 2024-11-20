import { Scene } from "phaser";

import { CreateTopBarBG } from "./Home/HomeTopBarPlayer.js";
import { CreateCurrencyBar } from "./Home/HomeTopBarPlayer.js";

import { CreatePlayerBar } from "./Home/HomeTopBarPlayer.js";

import { CreateBottomBar } from "./Home/HomeBottomBar.js";

import { CreateLobby } from "./Home/HomeLobby.js";

import { CreatePlayerInfo } from "./Home/HomePlayerInfo.js";

import centerData from "../Data/CenterData.js";

export class Home extends Scene {
  constructor() {
    super("Home");

    this.socketInited = false;

    this.currentEnemyIndex = -1;
  }

  preload() {}

  create() {
    CreateTopBarBG(this);
    CreateCurrencyBar(this);
    CreatePlayerInfo(this);

    CreatePlayerBar(this);
    CreateBottomBar(this);

    CreateLobby(this);

    this.UpdateUserInfo();
  }

  UpdateUserInfo() {
    centerData.RequestUserInfo();
  }
}
