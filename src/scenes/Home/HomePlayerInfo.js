import { OpenTopBarBG } from "../Home/HomeTopBarPlayer.js";
import { OpenCurrencyBar } from "../Home/HomeTopBarPlayer.js";
import { MovePlayerBarToDefault } from "../Home/HomeTopBarPlayer.js";

import { OpenBottomBar } from "../Home/HomeBottomBar.js";
import { CloseBottomBar } from "../Home/HomeBottomBar.js";

import { IsOpen as CheckMarketOpen } from "../Home/HomeMarket.js";
import { IsOpen as CheckInventoryOpen } from "../Home/HomeInventory.js";

let player_info_Container = null;

let black_bg = null;

let btn_close;

let player_info_bg = null;
const player_info_bg_openPosition = { x: 0, y: -2 };
const player_info_bg_closePosition = { x: 1100, y: -2 };

let content_container = null;
const player_info_content_openPosition = { x: -499, y: -130 };
const player_info_content_closePosition = { x: -1260, y: -130 };

export function CreatePlayerInfo(scene) {
  // player_info
  player_info_Container = scene.add.container(540, 960);
  player_info_Container.setDepth(100);

  black_bg = scene.add.rectangle(0, 0, originWidth, originHeight);
  black_bg.isFilled = true;
  black_bg.fillColor = 0;
  black_bg.fillAlpha = 0.75;

  player_info_Container.add(black_bg);

  // home_player_info_bg
  player_info_bg = scene.add.image(
    player_info_bg_openPosition.x,
    player_info_bg_openPosition.y,
    "home_player_info_bg_2"
  );
  player_info_Container.add(player_info_bg);

  // content_container
  content_container = scene.add.container(
    player_info_content_openPosition.x,
    player_info_content_openPosition.y
  );
  player_info_Container.add(content_container);

  // content_bg
  const content_bg = scene.add.image(0, 0, "home_player_info_bg_1");
  content_bg.setOrigin(0, 0.5);
  content_container.add(content_bg);

  // text_self_intro
  const text_self_intro = scene.add.text(180, -246, "", {});
  text_self_intro.setOrigin(0, 0.5);
  text_self_intro.text = "No self-introduction";
  text_self_intro.setStyle({
    color: "#787777",
    fontFamily: "RussoOne",
    fontSize: "32px",
    fontStyle: "bold",
  });
  content_container.add(text_self_intro);

  // text_point
  const text_point = scene.add.text(27, -107, "", {});
  text_point.setOrigin(0, 0.5);
  text_point.text = "Point: 000000";
  text_point.setStyle({ fontFamily: "RussoOne", fontSize: "32px" });
  content_container.add(text_point);

  // text_rank
  const text_rank = scene.add.text(27, -41, "", {});
  text_rank.setOrigin(0, 0.5);
  text_rank.text = "Rank: 0/0";
  text_rank.setStyle({ fontFamily: "RussoOne", fontSize: "32px" });
  content_container.add(text_rank);

  // text_more_info
  const text_more_info = scene.add.text(27, 80, "", {});
  text_more_info.text = "More info";
  text_more_info.setStyle({
    fixedWidth: 660,
    fixedHeight: 180,
    fontFamily: "RussoOne",
    fontSize: "24px",
  });
  content_container.add(text_more_info);

  btn_close = CreateCloseInfoButton(
    scene,
    player_info_Container,
    "share_btn_close",
    459,
    -657
  );

  DefaultPlayerInfo();
}

function CreateCloseInfoButton(scene, container, btnImg, posX, posY) {
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
    .setOrigin(0.5, 0.5)
    .layout()
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("CloseInfoButton clicked");

      ClosePlayerInfo(scene);
    })
    .on("pointerover", function () {
      console.log("CloseInfoButton over");
    })
    .on("pointerout", function () {
      console.log("CloseInfoButton out");
    });

  container.add(button);
  container.setPos;

  return button;
}

function DefaultPlayerInfo() {
  player_info_Container.setVisible(false);

  btn_close.setVisible(false);

  player_info_bg.x = player_info_bg_closePosition.x;
  player_info_bg.y = player_info_bg_closePosition.y;

  content_container.x = player_info_content_closePosition.x;
  content_container.y = player_info_content_closePosition.y;
}

export function OpenPlayerInfo(scene) {
  CloseBottomBar(scene);

  player_info_Container.setVisible(true);
  scene.tweens.add({
    targets: player_info_bg,
    x: player_info_bg_openPosition.x,
    y: player_info_bg_openPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });

  scene.tweens.add({
    targets: content_container,
    x: player_info_content_openPosition.x,
    y: player_info_content_openPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      console.log("OpenPlayerInfo complete!"); // Thông báo khi tween hoàn thành

      btn_close.setVisible(true);
    },
  });
}

export function ClosePlayerInfo(scene) {
  OpenBottomBar(scene);

  OpenTopBarBG(scene);

  OpenCurrencyBar(scene);

  MovePlayerBarToDefault(scene);

  btn_close.setVisible(false);

  scene.tweens.add({
    targets: player_info_bg,
    x: player_info_bg_closePosition.x,
    y: player_info_bg_closePosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });

  scene.tweens.add({
    targets: content_container,
    x: player_info_content_closePosition.x,
    y: player_info_content_closePosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      console.log("OpenPlayerInfo complete!"); // Thông báo khi tween hoàn thành

      player_info_Container.setVisible(false);
    },
  });
}
