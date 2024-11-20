import { OpenPlayerInfo } from "../Home/HomePlayerInfo.js";

import { IsOpen as CheckMarketOpen } from "../Home/HomeMarket.js";
import { IsOpen as CheckInventoryOpen } from "../Home/HomeInventory.js";
import { IsOpen as CheckCharacterInventoryOpen } from "../Home/HomeCharacterInventory.js";

import centerData from "../../Data/CenterData.js";

//tạo top bar bg
let top_bar_bg = null;
const top_bar_bg_defaultPosition = { x: 540, y: 131 };
const top_bar_bg_hidePosition = { x: 540, y: -180 };

export function CreateTopBarBG(scene) {
  top_bar_bg = scene.add
    .image(
      top_bar_bg_defaultPosition.x,
      top_bar_bg_defaultPosition.y,
      "home_top_bar_bg"
    )
    .setDepth(200);
}

export function OpenTopBarBG(scene) {
  scene.tweens.add({
    targets: top_bar_bg,
    x: top_bar_bg_defaultPosition.x,
    y: top_bar_bg_defaultPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function HideTopBarBG(scene) {
  scene.tweens.add({
    targets: top_bar_bg,
    x: top_bar_bg_hidePosition.x,
    y: top_bar_bg_hidePosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

//kết thúc tạo top bar bg

//tạo player currency
let currency_container = null;
const currency_container_defaultPosition = { x: 0, y: 0 };
const currency_container_hidePosition = { x: 540, y: 0 };

let btn_currency_chip_1 = null;
let curency_1_container = null;

let btn_currency_chip_2 = null;
let curency_2_container = null;

let currency_event_listener = null;

export function CreateCurrencyBar(scene) {
  // currency_container
  currency_container = scene.add.container(
    currency_container_defaultPosition.x,
    currency_container_defaultPosition.y
  );
  currency_container.setDepth(200);

  // curency_1
  curency_1_container = scene.add.container(697, 93);
  currency_container.add(curency_1_container);

  // chip_bg_1
  btn_currency_chip_1 = CreateCurrencyButton(
    scene,
    curency_1_container,
    "home_top_currency_bg",
    0,
    0
  );

  // const chip_bg_1 = scene.add.image(0, 0, "home_top_currency_bg");
  // chip_bg_1.setOrigin(0, 0.5);
  // curency_1_container.add(chip_bg_1);

  // chip_icon_1
  const chip_icon_1 = scene.add.image(264, 0, "home_top_currency_chip_1");
  chip_icon_1.setOrigin(0, 0.5);
  curency_1_container.add(chip_icon_1);

  // text_chip_1
  const text_chip_1 = scene.add.text(280, 1, "", {});
  text_chip_1.setOrigin(1, 0.5);
  text_chip_1.text = centerData.userInfo.Chip.toLocaleString("en-US");
  text_chip_1.setStyle({ fontFamily: "RussoOne", fontSize: "24px" });
  curency_1_container.add(text_chip_1);

  // curency_2
  curency_2_container = scene.add.container(697, 167);
  currency_container.add(curency_2_container);

  // chip_bg_2
  btn_currency_chip_2 = CreateCurrencyButton(
    scene,
    curency_2_container,
    "home_top_currency_bg",
    0,
    0
  );

  // // chip_bg_2
  // const chip_bg_2 = scene.add.image(0, 0, "home_top_currency_bg");
  // chip_bg_2.setOrigin(0, 0.5);
  // curency_2_container.add(chip_bg_2);

  // chip_icon_2
  const chip_icon_2 = scene.add.image(264, 0, "home_top_currency_chip_2");
  chip_icon_2.setOrigin(0, 0.5);
  curency_2_container.add(chip_icon_2);

  // text_chip_2
  const text_chip_2 = scene.add.text(280, 1, "", {});
  text_chip_2.setOrigin(1, 0.5);
  text_chip_2.text = centerData.userInfo.Musk.toLocaleString("en-US");
  text_chip_2.setStyle({ fontFamily: "RussoOne", fontSize: "24px" });
  curency_2_container.add(text_chip_2);

  // Kiểm tra và xóa listener cũ trước khi gán mới
  if (currency_event_listener) {
    centerData.RemovePlayerInfoChange(currency_event_listener);
  }

  // Thêm sự kiện cập nhật văn bản mới
  currency_event_listener = () => {
    if (text_chip_1 && text_chip_2) {
      text_chip_1.text = (centerData.userInfo?.Chip ?? 0).toLocaleString(
        "en-US"
      );
      text_chip_2.text = (centerData.userInfo?.Musk ?? 0).toLocaleString(
        "en-US"
      );
    }
  };

  centerData.AddPlayerInfoChange(currency_event_listener);
}

function CreateCurrencyButton(scene, container, btnImg, posX, posY) {
  // Tạo button với RexUI

  let btnBg = scene.add.image(0, 0, btnImg);

  let button = scene.rexUI.add
    .label({
      x: posX, // Vị trí x (giữa màn hình ngang)
      y: posY, // Vị trí y (giữa màn hình dọc)
      width: btnBg.displayWidth, // Chiều rộng của nút
      height: btnBg.displayHeight, // Chiều cao của nút
      background: btnBg,
      space: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    })
    .setOrigin(0, 0.5)
    .layout()
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("Open currency clicked");
    })
    .on("pointerover", function () {
      console.log("Open currency over");

      container.each(function (child) {
        if (child.setTint) {
          child.setTint(0x646464); // Màu tint bạn muốn áp dụng
        }
      });
    })
    .on("pointerout", function () {
      console.log("Open currency out");

      container.each(function (child) {
        if (child.clearTint) {
          child.clearTint(); // Xóa tint
        }
      });
    });

  container.add(button);
  container.setPos;

  return button;
}

export function OpenCurrencyBar(scene) {
  scene.tweens.add({
    targets: currency_container,
    x: currency_container_defaultPosition.x,
    y: currency_container_defaultPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

function HideCurrencyBar(scene) {
  scene.tweens.add({
    targets: currency_container,
    x: currency_container_hidePosition.x,
    y: currency_container_hidePosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

//kết thúc tạo player currency

//tạo player bar

let player_bar_Container = null;
const player_bar_defaultPosition = { x: -7, y: 129 };
const player_bar_infoPosition = { x: -7, y: 423 };

let btn_Open_Player_Info = null;

export function CreatePlayerBar(scene) {
  let container = scene.add.container(
    player_bar_defaultPosition.x,
    player_bar_defaultPosition.y
  ); // Tọa độ của container

  container.setDepth(200);

  btn_Open_Player_Info = CreatOpenInfoButton(
    scene,
    container,
    "home_top_bar_player_bg",
    0,
    0
  );

  container.add(btn_Open_Player_Info);

  player_bar_Container = container;

  let avatar = scene.add
    .image(140, 0, "home_top_bar_player_avatar")
    .setOrigin(0.5, 0.5);

  container.add(avatar);

  let avatar_glow = scene.add
    .image(140, 0, "home_top_bar_player_avatar_glow")
    .setOrigin(0.5, 0.5);

  container.add(avatar_glow);

  let text_user_name = scene.add
    .text(248, -28, centerData.userInfo.Username || "No user loaded", {
      fontFamily: "RussoOne",
      fontSize: "35px",
      color: "#ffffff",
      shadow: {
        offsetX: 2,
        offsetY: 2,
        color: "#FF9D00",
        blur: 7,
        stroke: true,
        fill: true,
      },
    })
    .setOrigin(0, 0.5);

  container.add(text_user_name);

  let text_user_id = scene.add
    .text(255, 2, "ID: " + centerData.userInfo.UserId, {
      fontFamily: "RussoOne",
      fontSize: "18px",
      color: "#D2D2D2",
    })
    .setOrigin(0, 0.5);

  container.add(text_user_id);

  let level_bar_bg = scene.add
    .image(235, 38, "home_top_bar_player_level_bar_bg")
    .setOrigin(0, 0.5);

  container.add(level_bar_bg);

  let level_bar_fill = scene.add
    .image(235, 38, "home_top_bar_player_level_bar_fill")
    .setOrigin(0, 0.5);

  level_bar_fill.setScale(0.8, 1);

  container.add(level_bar_fill);

  let level_bg = scene.add
    .image(453, 7, "home_top_bar_player_level_bg")
    .setOrigin(0, 0.5);

  container.add(level_bg);

  let text_level = scene.add
    .text(475, 7, "Lv.00", {
      fontFamily: "RussoOne",
      fontSize: "20px",
      color: "#ffffff",
    })
    .setOrigin(0, 0.5);

  container.add(text_level);

  DefaultPlayerBar();
}

function CreatOpenInfoButton(scene, container, btnImg, posX, posY) {
  // Tạo button với RexUI

  let btnBg = scene.add.image(0, 0, btnImg);

  let button = scene.rexUI.add
    .label({
      x: posX, // Vị trí x (giữa màn hình ngang)
      y: posY, // Vị trí y (giữa màn hình dọc)
      width: btnBg.displayWidth, // Chiều rộng của nút
      height: btnBg.displayHeight, // Chiều cao của nút
      background: btnBg,
      space: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    })
    .setOrigin(0, 0.5)
    .layout()
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("OpenInfoButton clicked");

      if (
        CheckMarketOpen() ||
        CheckInventoryOpen() ||
        CheckCharacterInventoryOpen()
      )
        return;

      HideTopBarBG(scene);

      HideCurrencyBar(scene);

      //HideSkillButtons(scene);

      MovePlayerBarToInfo(scene);

      OpenPlayerInfo(scene);
    })
    .on("pointerover", function () {
      console.log("OpenInfoButton over");

      player_bar_Container.each(function (child) {
        if (child.setTint) {
          child.setTint(0x646464); // Màu tint bạn muốn áp dụng
        }
      });
    })
    .on("pointerout", function () {
      console.log("OpenInfoButton out");

      player_bar_Container.each(function (child) {
        if (child.clearTint) {
          child.clearTint(); // Xóa tint
        }
      });
    });

  container.add(button);
  container.setPos;

  return button;
}

function DefaultPlayerBar() {
  player_bar_Container.x = player_bar_defaultPosition.x;
  player_bar_Container.y = player_bar_defaultPosition.y;
}

function MovePlayerBarToInfo(scene) {
  scene.tweens.add({
    targets: player_bar_Container,
    x: player_bar_infoPosition.x,
    y: player_bar_infoPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      console.log("Open player bar complete!"); // Thông báo khi tween hoàn thành
    },
  });
}

export function MovePlayerBarToDefault(scene) {
  scene.tweens.add({
    targets: player_bar_Container,
    x: player_bar_defaultPosition.x,
    y: player_bar_defaultPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      console.log("Close player bar complete!"); // Thông báo khi tween hoàn thành
    },
  });
}
