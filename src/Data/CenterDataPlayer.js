import DataPlayer from "./DataPlayer.js";

export class CenterDataPlayer {
  constructor() {
    this.dataPlayerDictionary = {};

    console.log("CenterDataPlayer");

    // Gọi hàm tạo dữ liệu ngay khi khởi tạo
    this.CreateDataPlayer();
  }

  // Phương thức lấy phần tử từ dictionary theo id
  getPlayerById(id) {
    //console.log("Looking for player with id:", id);
    //console.log("Current dictionary:", this.dataPlayerDictionary);
    return this.dataPlayerDictionary[id] || null;
  }

  CreateDataPlayer() {
    this.Create_Player_0();

    this.Create_Player_1();

    this.Create_Player_2();

    this.Create_Player_3();

    this.Create_Player_4();

    this.Create_Player_5();

    this.Create_Player_6();
  }

  Create_Player_0() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_0";
    newDataPlayer.name = "player_0_name";
    newDataPlayer.rank = "c";
    newDataPlayer.role = "gunner";
    newDataPlayer.spineUIKey = "player_0_ui";
    newDataPlayer.spineGameplayKey = "player_0_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    newDataPlayer.attackDelay = 0;

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }

  Create_Player_1() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_1";
    newDataPlayer.name = "player_1_name";
    newDataPlayer.rank = "b";
    newDataPlayer.role = "sniper";
    newDataPlayer.spineUIKey = "player_0_ui";
    newDataPlayer.spineGameplayKey = "player_0_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }

  Create_Player_2() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_2";
    newDataPlayer.name = "player_2_name";
    newDataPlayer.rank = "a";
    newDataPlayer.role = "sniper";
    newDataPlayer.spineUIKey = "player_2_ui";
    newDataPlayer.spineGameplayKey = "player_2_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    newDataPlayer.attackDelay = 2.5;

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }

  Create_Player_3() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_3";
    newDataPlayer.name = "player_3_name";
    newDataPlayer.rank = "s";
    newDataPlayer.role = "rocket";
    newDataPlayer.spineUIKey = "player_3_ui";
    newDataPlayer.spineGameplayKey = "player_3_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    newDataPlayer.attackDelay = 5;

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }

  Create_Player_4() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_4";
    newDataPlayer.name = "player_4_name";
    newDataPlayer.rank = "ss";
    newDataPlayer.role = "rocket";
    newDataPlayer.spineUIKey = "player_0_ui";
    newDataPlayer.spineGameplayKey = "player_0_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }

  Create_Player_5() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_5";
    newDataPlayer.name = "player_5_name";
    newDataPlayer.rank = "ssr";
    newDataPlayer.role = "rocket";
    newDataPlayer.spineUIKey = "player_0_ui";
    newDataPlayer.spineGameplayKey = "player_0_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }

  Create_Player_6() {
    let newDataPlayer = new DataPlayer();

    newDataPlayer.playerId = "player_6";
    newDataPlayer.name = "player_6_name";
    newDataPlayer.rank = "ssr";
    newDataPlayer.role = "rocket";
    newDataPlayer.spineUIKey = "player_0_ui";
    newDataPlayer.spineGameplayKey = "player_0_gameplay";
    newDataPlayer.cardImgKey = "home_character_temp";

    // Đẩy vào dictionary với khóa là id
    this.dataPlayerDictionary[newDataPlayer.playerId] = newDataPlayer;
  }
}

const centerDataPlayer = new CenterDataPlayer();
export default centerDataPlayer;
