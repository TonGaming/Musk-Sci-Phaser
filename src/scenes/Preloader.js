import { Scene } from "phaser";

// //Load assets use if in an other js file
// import { LoadLogin } from "./Preloader.js";
// import { LoadHome } from "./Preloader.js";
// import { LoadMap } from "./Preloader.js";
// import { LoadMapObstaclePlayer } from "./Preloader.js";
// import { LoadPlayer } from "./Preloader.js";
// import { LoadEnemy } from "./Preloader.js";

import { CreateAudioBackground } from "./Manager/ManagerAudio.js";
import centerData from "../Data/CenterData.js";
import { socketService } from "../socket.js";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    // //  We loaded this image in our Boot Scene, so we can display it here

    this.add.image(0, 0, "load_bg").setOrigin(0);

    // Đặt thời gian tối thiểu là 3 giây
    this.minLoadTime = 1000;
    this.startTime = this.time.now;

    this.loadingText = this.add
      .text(originWidth / 2, 1529, "Loading...", {
        fontFamily: "RussoOne",
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    // Mảng các trạng thái của chữ "loading" với dấu chấm tăng dần
    const loadingStates = ["loading.", "loading..", "loading..."];
    let currentState = 0;

    // Tạo sự kiện lặp lại mỗi 500ms để thay đổi văn bản
    this.time.addEvent({
      delay: 250, // Khoảng thời gian giữa mỗi lần cập nhật (500ms)
      loop: true,
      callback: () => {
        // Cập nhật văn bản theo trạng thái hiện tại
        this.loadingText.setText(loadingStates[currentState]);

        // Chuyển sang trạng thái tiếp theo, quay lại trạng thái đầu tiên nếu hết
        currentState = (currentState + 1) % loadingStates.length;
      },
    });

    // // Vị trí của progress bar
    // const progressBarX = originWidth / 2; // Tính toán vị trí X ở giữa màn hình
    // const progressBarY = originHeight - 250; // Vị trí Y

    // this.processBarContainer = this.add.container(
    //   progressBarX - 300,
    //   progressBarY
    // );

    // // Hình nền cho progress bar
    // const barBg = this.add.image(0, 0, "load_slider_bg").setOrigin(0, 0.5);
    // this.processBarContainer.add(barBg);

    // // Thanh tiến trình
    // this.fillBar = this.add.image(0, 0, "load_slider_fill").setOrigin(0, 0.5);
    // this.processBarContainer.add(this.fillBar);

    // // const star = this.add.image(width / 2 - 450, height - 250, "star");

    // Thiết lập progress listener
    this.load.on("progress", (progress) => {
      // // //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      // // star.setX(width / 2 - 450 + 895 * progress);
      // this.fillBar.setScale(1 * progress, 1);
    });

    this.anims.create({
      key: "load_loading_circle_animation",
      frames: this.anims.generateFrameNumbers("load_loading_circle", {
        start: 0,
        end: 209,
      }), // 0 đến 11 vì có 12 khung hình
      frameRate: 30, // Tốc độ phát animation
      repeat: -1, // Lặp lại vô hạn
    });

    const effect = this.add
      .sprite(originWidth / 2, 1386, "load_loading_circle")
      .play("load_loading_circle_animation");
    effect.setOrigin(0.5, 0.5).setScale(2, 2); // Đặt gốc giữa sprite

    console.log("Preloader");
  }

  preload() {
    //  Load the assets for the game - Replace with your own assets

    LoadShare(this);
    LoadHome(this);
    LoadGameplay(this);
  }

  create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.

    CreateAudioBackground(this);

    // Tính toán thời gian đã tải
    const loadTime = this.time.now - this.startTime;
    const waitTime = Math.max(this.minLoadTime - loadTime, 0); // Tính thời gian chờ còn lại

    this.time.delayedCall(waitTime, () => {
      //this.scene.start("Gameplay");

      LoginTelegram(this);
    });
  }
}

function LoginTelegram(scene) {
  centerData.RequestLogin(
    (result) => {
      console.log("Đăng nhập thành công:", result);
      // Thực hiện các hành động khi đăng nhập thành công

      GetPlayerInfo(scene);

      InitSocket();
    },
    (error) => {
      console.log("Đăng nhập thất bại:", error);
      // Thực hiện các hành động khi đăng nhập thất bại
    }
  );
}

function GetPlayerInfo(scene) {
  centerData.RequestUserInfo(
    (result) => {
      console.log("lấy thông tin thành công:", result);

      scene.scene.start("Home");
    },
    (error) => {
      console.log("lấy thông tin thất bại:", error);
    }
  );
}

function InitSocket() {
  socketService.connectSocket();
}

export function LoadPreloader(scene) {
  scene.load.image("load_bg", "assets/load/load_bg.webp");
  scene.load.image("load_slider_bg", "assets/load/load_slider_bg.webp");
  scene.load.image("load_slider_fill", "assets/load/load_slider_fill.webp");

  //load enemy hit fx
  // Tải sprite sheet
  scene.load.spritesheet(
    "load_loading_circle",
    "assets/load/load_loading_circle.webp",
    {
      frameWidth: 150, // Kích thước từng khung hình (2000 / 4)
      frameHeight: 150, // Kích thước từng khung hình (1500 / 3)
    }
  );

  //Load audio

  //load background music
  scene.load.audio(
    "audio_background",
    "assets/audio/audio_background/audio_background.mp3"
  );

  //load player sfx
  scene.load.audio(
    "audio_gun_shot",
    "assets/audio/audio_gun/audio_gun_shot.wav"
  );

  //load enemy sfx
  scene.load.audio(
    "audio_enemy_sfx_explosion",
    "assets/audio/audio_enemy/audio_enemy_sfx/audio_enemy_sfx_explosion.mp3"
  );

  //load player voice
  scene.load.audio(
    "player_0_voice",
    "assets/audio/audio_player/audio_player_0/player_0_voice.mp3"
  );
}

export function LoadShare(scene) {
  scene.load.image("share_btn_close", "assets/share/share_btn_close.webp");

  scene.load.image(
    "share_btn_next_left",
    "assets/share/share_btn_next_left.webp"
  );

  scene.load.image(
    "share_btn_next_right",
    "assets/share/share_btn_next_right.webp"
  );
}

export function LoadHome(scene) {
  scene.load.image("home_top_bar_bg", "assets/home/home_top_bar_bg.webp");

  LoadPlayerBar(scene);

  LoadPlayerInfo(scene);

  LoadPlayerCurrency(scene);

  LoadQuest(scene);

  LoadInviteFriends(scene);

  LoadRank(scene);

  LoadGacha(scene);

  LoadMarketInventory(scene);

  LoadCharacterInventory(scene);

  LoadLobby(scene);

  LoadBottomBar(scene);
}

export function LoadGameplay(scene) {
  LoadGameplayTopBar(scene);
  LoadGameplaySkills(scene);
  LoadGameplayGameOver(scene);

  LoadMap(scene);
  LoadPlayer(scene);
  LoadEnemy(scene);
}

export function LoadPlayerBar(scene) {
  //Load player bar
  scene.load.image(
    "home_top_bar_player_bg",
    "assets/home/home_top_bar_player/home_top_bar_player_bg.webp"
  );
  scene.load.image(
    "home_top_bar_player_level_bar_bg",
    "assets/home/home_top_bar_player/home_top_bar_player_level_bar_bg.webp"
  );
  scene.load.image(
    "home_top_bar_player_level_bar_fill",
    "assets/home/home_top_bar_player/home_top_bar_player_level_bar_fill.webp"
  );
  scene.load.image(
    "home_top_bar_player_level_bg",
    "assets/home/home_top_bar_player/home_top_bar_player_level_bg.webp"
  );
  scene.load.image(
    "home_top_bar_player_avatar",
    "assets/home/home_top_bar_player/home_top_bar_player_avatar.webp"
  );
  scene.load.image(
    "home_top_bar_player_avatar_glow",
    "assets/home/home_top_bar_player/home_top_bar_player_avatar_glow.webp"
  );
}

export function LoadPlayerInfo(scene) {
  //Load player info
  scene.load.image(
    "home_player_info_bg_1",
    "assets/home/home_player_info/home_player_info_bg_1.webp"
  );
  scene.load.image(
    "home_player_info_bg_2",
    "assets/home/home_player_info/home_player_info_bg_2.webp"
  );
}

export function LoadPlayerCurrency(scene) {
  //Load player currency

  scene.load.image(
    "btn_connect_wallet",
    "assets/home/home_top_currency/btn_connect_wallet.png"
  );

  scene.load.image(
    "home_top_currency_bg",
    "assets/home/home_top_currency/home_top_currency_bg.webp"
  );
  scene.load.image(
    "home_top_currency_chip_1",
    "assets/home/home_top_currency/home_top_currency_chip_1.webp"
  );
  scene.load.image(
    "home_top_currency_chip_2",
    "assets/home/home_top_currency/home_top_currency_chip_2.webp"
  );
}

export function LoadQuest(scene) {
  //Load quest renew

  scene.load.image(
    "home_quest_arrow",
    "assets/home/home_quest_2/home_quest_arrow.webp"
  );

  scene.load.image(
    "home_quest_character",
    "assets/home/home_quest_2/home_quest_character.webp"
  );

  scene.load.image(
    "home_quest_claim_btn",
    "assets/home/home_quest_2/home_quest_claim_btn.webp"
  );

  scene.load.image(
    "home_quest_element_bg",
    "assets/home/home_quest_2/home_quest_element_bg.webp"
  );

  scene.load.image(
    "home_quest_footer_bg",
    "assets/home/home_quest_2/home_quest_footer_bg.webp"
  );

  scene.load.image(
    "home_quest_go_btn",
    "assets/home/home_quest_2/home_quest_go_btn.webp"
  );

  scene.load.image(
    "home_quest_item_bg",
    "assets/home/home_quest_2/home_quest_item_bg.webp"
  );

  scene.load.image(
    "home_quest_mission_btn",
    "assets/home/home_quest_2/home_quest_mission_btn.webp"
  );

  scene.load.image(
    "home_quest_mission_selected",
    "assets/home/home_quest_2/home_quest_mission_selected.webp"
  );

  scene.load.image(
    "home_quest_popup_bg",
    "assets/home/home_quest_2/home_quest_popup_bg.webp"
  );

  scene.load.image(
    "home_quest_popup_bg_1",
    "assets/home/home_quest_2/home_quest_popup_bg_1.webp"
  );

  scene.load.image(
    "home_quest_task_btn",
    "assets/home/home_quest_2/home_quest_task_btn.webp"
  );

  scene.load.image(
    "home_quest_task_selected",
    "assets/home/home_quest_2/home_quest_task_selected.webp"
  );
}

export function LoadInviteFriends(scene) {
  //Load invite friends renew
  scene.load.image(
    "home_invite_friends_bg",
    "assets/home/home_invite_friends_2/home_invite_friends_bg.webp"
  );
  scene.load.image(
    "home_invite_friends_copy_button",
    "assets/home/home_invite_friends_2/home_invite_friends_copy_button.webp"
  );
  scene.load.image(
    "home_invite_friends_footer_bg",
    "assets/home/home_invite_friends_2/home_invite_friends_footer_bg.webp"
  );
  scene.load.image(
    "home_invite_friends_share_button",
    "assets/home/home_invite_friends_2/home_invite_friends_share_button.webp"
  );
}

export function LoadRank(scene) {
  //load rank ui renew
  scene.load.image(
    "home_rank_avatar_bg",
    "assets/home/home_rank_2/home_rank_avatar_bg.webp"
  );

  scene.load.image("home_rank_bg", "assets/home/home_rank_2/home_rank_bg.webp");

  scene.load.image(
    "home_rank_footer_bg",
    "assets/home/home_rank_2/home_rank_footer_bg.webp"
  );

  scene.load.image(
    "home_rank_my_rank_bg",
    "assets/home/home_rank_2/home_rank_my_rank_bg.webp"
  );

  scene.load.image(
    "home_rank_top_bg",
    "assets/home/home_rank_2/home_rank_top_bg.webp"
  );

  scene.load.image(
    "home_rank_top1",
    "assets/home/home_rank_2/home_rank_top1.webp"
  );

  scene.load.image(
    "home_rank_top2",
    "assets/home/home_rank_2/home_rank_top2.webp"
  );

  scene.load.image(
    "home_rank_top3",
    "assets/home/home_rank_2/home_rank_top3.webp"
  );
}

export function LoadGacha(scene) {
  // Load gacha
  scene.load.image(
    "home_gacha_bg",
    "assets/home/home_gacha/home_gacha_bg.webp"
  );

  scene.load.image(
    "home_gacha_btn_mode_selected",
    "assets/home/home_gacha/home_gacha_btn_mode_selected.webp"
  );

  scene.load.image(
    "home_gacha_btn_mode",
    "assets/home/home_gacha/home_gacha_btn_mode.webp"
  );

  scene.load.image(
    "home_gacha_btn_spin_x10",
    "assets/home/home_gacha/home_gacha_btn_spin_x10.webp"
  );

  scene.load.image(
    "home_gacha_btn_spin_x50",
    "assets/home/home_gacha/home_gacha_btn_spin_x50.webp"
  );

  scene.load.image(
    "home_gacha_btn_spin_x100",
    "assets/home/home_gacha/home_gacha_btn_spin_x100.webp"
  );

  scene.load.image(
    "home_gacha_btn_spin",
    "assets/home/home_gacha/home_gacha_btn_spin.webp"
  );

  scene.load.image(
    "home_gacha_item_bg_overlay",
    "assets/home/home_gacha/home_gacha_item_bg_overlay.webp"
  );

  scene.load.image(
    "home_gacha_item_mask",
    "assets/home/home_gacha/home_gacha_item_mask.webp"
  );

  scene.load.image(
    "home_gacha_rewarded_light",
    "assets/home/home_gacha/home_gacha_rewarded_light.webp"
  );

  //item icon
  scene.load.image(
    "home_gacha_item_bom",
    "assets/home/home_gacha/home_gacha_item_bom.webp"
  );

  scene.load.image(
    "home_gacha_item_chip",
    "assets/home/home_gacha/home_gacha_item_chip.webp"
  );

  scene.load.image(
    "home_gacha_item_musk",
    "assets/home/home_gacha/home_gacha_item_musk.webp"
  );

  scene.load.image(
    "home_gacha_item_nft",
    "assets/home/home_gacha/home_gacha_item_nft.webp"
  );

  //load reward popup
  scene.load.image(
    "home_gacha_reward_list_bg",
    "assets/home/home_gacha/home_gacha_reward_list_bg.webp"
  );

  scene.load.image(
    "home_gacha_reward_list_btn_claim",
    "assets/home/home_gacha/home_gacha_reward_list_btn_claim.webp"
  );

  scene.load.image(
    "home_gacha_reward_list_item_bg",
    "assets/home/home_gacha/home_gacha_reward_list_item_bg.webp"
  );
}

export function LoadMarketInventory(scene) {
  scene.load.image(
    "home_inventory_shop_bg",
    "assets/home/home_inventory_shop/home_inventory_shop_bg.webp"
  );

  scene.load.image(
    "home_inventory_shop_footer_bg",
    "assets/home/home_inventory_shop/home_inventory_shop_footer_bg.webp"
  );

  scene.load.image(
    "home_inventory_shop_item_bg",
    "assets/home/home_inventory_shop/home_inventory_shop_item_bg.webp"
  );

  scene.load.image(
    "home_inventory_shop_item_footer_bg",
    "assets/home/home_inventory_shop/home_inventory_shop_item_footer_bg.webp"
  );

  scene.load.image(
    "home_inventory_shop_item_price_bg",
    "assets/home/home_inventory_shop/home_inventory_shop_item_price_bg.webp"
  );

  scene.load.image(
    "home_inventory_shop_item",
    "assets/home/home_inventory_shop/home_inventory_shop_item.webp"
  );
}

export function LoadCharacterInventory(scene) {
  scene.load.image(
    "home_character_bg",
    "assets/home/home_character/home_character_bg.webp"
  );

  scene.load.image(
    "home_character_btn_close",
    "assets/home/home_character/home_character_btn_close.webp"
  );

  scene.load.image(
    "home_character_card_a_bg",
    "assets/home/home_character/home_character_card_a_bg.webp"
  );

  scene.load.image(
    "home_character_card_a_bg",
    "assets/home/home_character/home_character_card_a_bg.webp"
  );

  scene.load.image(
    "home_character_card_a_frame",
    "assets/home/home_character/home_character_card_a_frame.webp"
  );

  scene.load.image(
    "home_character_card_b_bg",
    "assets/home/home_character/home_character_card_b_bg.webp"
  );

  scene.load.image(
    "home_character_card_b_frame",
    "assets/home/home_character/home_character_card_b_frame.webp"
  );

  scene.load.image(
    "home_character_card_c_bg",
    "assets/home/home_character/home_character_card_c_bg.webp"
  );

  scene.load.image(
    "home_character_card_c_frame",
    "assets/home/home_character/home_character_card_c_frame.webp"
  );

  scene.load.image(
    "home_character_card_s_bg",
    "assets/home/home_character/home_character_card_s_bg.webp"
  );

  scene.load.image(
    "home_character_card_s_frame",
    "assets/home/home_character/home_character_card_s_frame.webp"
  );

  scene.load.image(
    "home_character_card_ss_bg",
    "assets/home/home_character/home_character_card_ss_bg.webp"
  );

  scene.load.image(
    "home_character_card_ss_frame",
    "assets/home/home_character/home_character_card_ss_frame.webp"
  );

  scene.load.image(
    "home_character_card_ssr_bg",
    "assets/home/home_character/home_character_card_ssr_bg.webp"
  );

  scene.load.image(
    "home_character_card_ssr_frame",
    "assets/home/home_character/home_character_card_ssr_frame.webp"
  );

  scene.load.image(
    "home_character_footer_bg",
    "assets/home/home_character/home_character_footer_bg.webp"
  );

  scene.load.image(
    "home_character_role_0",
    "assets/home/home_character/home_character_role_0.webp"
  );

  scene.load.image(
    "home_character_star",
    "assets/home/home_character/home_character_star.webp"
  );

  scene.load.image(
    "home_character_title",
    "assets/home/home_character/home_character_title.webp"
  );

  scene.load.image(
    "home_character_temp",
    "assets/home/home_character/home_character_temp.webp"
  );
}

export function LoadLobby(scene) {
  // load lobby

  scene.load.image(
    "home_lobby_bg",
    "assets/home/home_lobby/home_lobby_bg.webp"
  );

  scene.load.image(
    "home_lobby_btn_battle",
    "assets/home/home_lobby/home_lobby_btn_battle.webp"
  );

  scene.load.image(
    "home_lobby_btn_character",
    "assets/home/home_lobby/home_lobby_btn_character.webp"
  );

  scene.load.image(
    "home_lobby_btn_gacha",
    "assets/home/home_lobby/home_lobby_btn_gacha.webp"
  );

  scene.load.image(
    "home_lobby_btn_invite",
    "assets/home/home_lobby/home_lobby_btn_invite.webp"
  );

  scene.load.image(
    "home_lobby_btn_quest",
    "assets/home/home_lobby/home_lobby_btn_quest.webp"
  );

  scene.load.image(
    "home_lobby_btn_rank",
    "assets/home/home_lobby/home_lobby_btn_rank.webp"
  );
}

export function LoadBottomBar(scene) {
  // load bottom bar
  scene.load.image(
    "home_bottom_bar_bg",
    "assets/home/home_bottom_bar/home_bottom_bar_bg.webp"
  );

  scene.load.image(
    "home_bottom_bar_btn_inventory",
    "assets/home/home_bottom_bar/home_bottom_bar_btn_inventory.webp"
  );

  scene.load.image(
    "home_bottom_bar_btn_market",
    "assets/home/home_bottom_bar/home_bottom_bar_btn_market.webp"
  );
}

export function LoadGameplayTopBar(scene) {
  //Load skill buttons
  scene.load.image(
    "gameplay_top_bar_bg",
    "assets/gameplay/gameplay_top_bar/gameplay_top_bar_bg.webp"
  );

  scene.load.image(
    "gameplay_top_bar_btn_home",
    "assets/gameplay/gameplay_top_bar/gameplay_top_bar_btn_home.webp"
  );

  scene.load.image(
    "gameplay_top_bar_health_bar_0",
    "assets/gameplay/gameplay_top_bar/gameplay_top_bar_health_bar_0.webp"
  );

  scene.load.image(
    "gameplay_top_bar_health_bar_1",
    "assets/gameplay/gameplay_top_bar/gameplay_top_bar_health_bar_1.webp"
  );

  scene.load.image(
    "gameplay_top_bar_health_bar_2",
    "assets/gameplay/gameplay_top_bar/gameplay_top_bar_health_bar_2.webp"
  );

  scene.load.image(
    "gameplay_top_bar_health_bar_3",
    "assets/gameplay/gameplay_top_bar/gameplay_top_bar_health_bar_3.webp"
  );
}

export function LoadGameplaySkills(scene) {
  //Load skill buttons
  scene.load.image(
    "gameplay_skill_buttons_1",
    "assets/gameplay/gameplay_skill_buttons/gameplay_skill_buttons_1.webp"
  );

  scene.load.image(
    "gameplay_skill_buttons_2",
    "assets/gameplay/gameplay_skill_buttons/gameplay_skill_buttons_2.webp"
  );

  scene.load.image(
    "gameplay_skill_buttons_3",
    "assets/gameplay/gameplay_skill_buttons/gameplay_skill_buttons_3.webp"
  );

  scene.load.image(
    "gameplay_skill_buttons_4",
    "assets/gameplay/gameplay_skill_buttons/gameplay_skill_buttons_4.webp"
  );
}

export function LoadGameplayGameOver(scene) {
  //Load skill buttons
  scene.load.image(
    "gameplay_game_over_text",
    "assets/gameplay/gameplay_game_over/gameplay_game_over_text.webp"
  );
}

export function LoadMap(scene) {
  //Load map 0
  scene.load.image("map_0_bg", "assets/gameplay/map/map_0/map_0_bg.webp");

  //load map 0 obstacles
  scene.load.image(
    "map_0_obstacle_0_wall",
    "assets/gameplay/map/map_0/map_0_obstacle_0_wall.webp"
  );
}

export function LoadPlayer(scene) {
  console.log(scene.spine);

  scene.load.image(
    "player_crosshair_gunner",
    "assets/gameplay/player/player_crosshair_gunner.webp"
  );

  scene.load.image(
    "player_crosshair_rocket",
    "assets/gameplay/player/player_crosshair_rocket.webp"
  );

  scene.load.image(
    "player_crosshair_sniper",
    "assets/gameplay/player/player_crosshair_sniper.webp"
  );

  //Load player 0
  scene.load.spine(
    "player_0_gameplay",
    "assets/gameplay/player/player_0/player_0_gameplay.json",
    "assets/gameplay/player/player_0/player_0_gameplay.atlas",
    true
  );

  //Load player 0 ui
  scene.load.spine(
    "player_0_ui",
    "assets/gameplay/player/player_0/player_0_ui.json",
    "assets/gameplay/player/player_0/player_0_ui.atlas",
    true
  );

  //Load player 2
  scene.load.spine(
    "player_2_gameplay",
    "assets/gameplay/player/player_2/player_2_gameplay.json",
    "assets/gameplay/player/player_2/player_2_gameplay.atlas",
    true
  );

  //Load player 2 ui
  scene.load.spine(
    "player_2_ui",
    "assets/gameplay/player/player_2/player_2_ui.json",
    "assets/gameplay/player/player_2/player_2_ui.atlas",
    true
  );

  //Load player 3
  scene.load.spine(
    "player_3_gameplay",
    "assets/gameplay/player/player_3/player_3_gameplay.json",
    "assets/gameplay/player/player_3/player_3_gameplay.atlas",
    true
  );

  //Load player 3 ui
  scene.load.spine(
    "player_3_ui",
    "assets/gameplay/player/player_3/player_3_ui.json",
    "assets/gameplay/player/player_3/player_3_ui.atlas",
    true
  );
}

export function LoadEnemy(scene) {
  // load normal enemy
  scene.load.image(
    "gameplay_enemy_0",
    "assets/gameplay/enemy/enemy_0/gameplay_enemy_0.webp"
  );

  scene.load.image(
    "gameplay_enemy_1",
    "assets/gameplay/enemy/enemy_1/gameplay_enemy_1.webp"
  );

  // load boss enemy
  scene.load.image(
    "gameplay_enemy_boss_0",
    "assets/gameplay/enemy/enemy_boss_0/gameplay_enemy_boss_0.webp"
  );

  scene.load.image(
    "gameplay_enemy_boss_1",
    "assets/gameplay/enemy/enemy_boss_1/gameplay_enemy_boss_1.webp"
  );

  scene.load.image(
    "gameplay_enemy_boss_2",
    "assets/gameplay/enemy/enemy_boss_2/gameplay_enemy_boss_2.webp"
  );

  //load elite enemy

  scene.load.spine(
    "gameplay_enemy_elite_0",
    "assets/gameplay/enemy/enemy_elite_0/enemy_elite_0.json",
    "assets/gameplay/enemy/enemy_elite_0/enemy_elite_0.atlas",
    true
  );

  scene.load.spine(
    "gameplay_enemy_elite_0_explode",
    "assets/gameplay/enemy/enemy_elite_0/explode.json",
    "assets/gameplay/enemy/enemy_elite_0/explode.atlas",
    true
  );

  scene.load.image(
    "gameplay_enemy_elite_1",
    "assets/gameplay/enemy/enemy_elite_1/gameplay_enemy_elite_1.webp"
  );

  scene.load.image(
    "gameplay_enemy_elite_2",
    "assets/gameplay/enemy/enemy_elite_2/gameplay_enemy_elite_2.webp"
  );

  //load enemy hit fx
  // Tải sprite sheet
  scene.load.spritesheet(
    "enemy_fx_strike_anim",
    "assets/gameplay/enemy/enemy_fx/enemy_fx_strike_anim.webp",
    {
      frameWidth: 500, // Kích thước từng khung hình (2000 / 4)
      frameHeight: 500, // Kích thước từng khung hình (1500 / 3)
    }
  );

  //load enemy hit fx
  // Tải sprite sheet
  scene.load.spritesheet(
    "enemy_fx_explosion",
    "assets/gameplay/enemy/enemy_fx/enemy_fx_explosion.webp",
    {
      frameWidth: 140, // Kích thước từng khung hình (700 / 5)
      frameHeight: 180, // Kích thước từng khung hình (360 / 2)
    }
  );
}
