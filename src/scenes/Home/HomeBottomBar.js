import centerData from "../../Data/CenterData.js";

import { CreateMarket } from "../Home/HomeMarket.js";
import { Close as CloseMarket } from "../Home/HomeMarket.js";
import { IsOpen as CheckMarketOpen } from "../Home/HomeMarket.js";

import { CreateInventory } from "../Home/HomeInventory.js";
import { Close as CloseInventory } from "../Home/HomeInventory.js";
import { IsOpen as CheckInventoryOpen } from "../Home/HomeInventory.js";

let container_main = null;
let container_main_default_position = { x: 0, y: 0 };
let container_main_hide_position = { x: 0, y: 1000 };

let btn_market = null;
let btn_market_default_position = { x: 63 + 385 / 2, y: 1755 };
let btn_market_open_position = { x: 63 + 385 / 2, y: 1710 };

let btn_inventory = null;
let btn_inventory_default_position = { x: 635 + 385 / 2, y: 1755 };
let btn_inventory_open_position = { x: 635 + 385 / 2, y: 1710 };

export function CreateBottomBar(scene) {
  container_main = scene.add.container(0, 0);
  container_main.setDepth(200);

  btn_market = scene.add
    .image(
      btn_market_default_position.x,
      btn_market_default_position.y,
      "home_bottom_bar_btn_market"
    )
    .setOrigin(0.5, 0)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_market clicked");

      if (CheckMarketOpen() == false) {
        OpenBtnMarket(scene);

        CloseInventory(scene);

        CreateMarket(scene);
      }
    })
    .on("pointerover", function () {
      console.log("btn_market over");

      btn_market.setTint(0x646464);
    })
    .on("pointerout", function () {
      console.log("btn_market out");

      btn_market.clearTint(); // Xóa tint
    });

  container_main.add(btn_market);

  btn_inventory = scene.add
    .image(
      btn_inventory_default_position.x,
      btn_inventory_default_position.y,
      "home_bottom_bar_btn_inventory"
    )
    .setOrigin(0.5, 0)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_market clicked");

      if (CheckInventoryOpen() == false) {
        OpenBtnInventory(scene);

        CloseMarket(scene);

        CreateInventory(scene);
      }
    })
    .on("pointerover", function () {
      console.log("btn_market over");

      btn_inventory.setTint(0x646464);
    })
    .on("pointerout", function () {
      console.log("btn_market out");

      btn_inventory.clearTint(); // Xóa tint
    });

  container_main.add(btn_inventory);

  const block_bg = scene.add
    .image(0, 1920, "home_bottom_bar_bg")
    .setOrigin(0, 1);
  container_main.add(block_bg);
}

export function OpenBtnMarket(scene) {
  btn_market.setPosition(
    btn_market_default_position.x,
    btn_market_default_position.y
  );

  scene.tweens.add({
    targets: btn_market,
    x: btn_market_open_position.x,
    y: btn_market_open_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function CloseBtnMarket(scene) {
  btn_market.setPosition(
    btn_market_open_position.x,
    btn_market_open_position.y
  );

  scene.tweens.add({
    targets: btn_market,
    x: btn_market_default_position.x,
    y: btn_market_default_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function OpenBtnInventory(scene) {
  btn_inventory.setPosition(
    btn_inventory_default_position.x,
    btn_inventory_default_position.y
  );

  scene.tweens.add({
    targets: btn_inventory,
    x: btn_inventory_open_position.x,
    y: btn_inventory_open_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function CloseBtnInventory(scene) {
  btn_inventory.setPosition(
    btn_inventory_open_position.x,
    btn_inventory_open_position.y
  );

  scene.tweens.add({
    targets: btn_inventory,
    x: btn_inventory_default_position.x,
    y: btn_inventory_default_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function OpenBottomBar(scene) {
  container_main.setPosition(
    container_main_hide_position.x,
    container_main_hide_position.y
  );

  scene.tweens.add({
    targets: container_main,
    x: container_main_default_position.x,
    y: container_main_default_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function CloseBottomBar(scene) {
  container_main.setPosition(
    container_main_default_position.x,
    container_main_default_position.y
  );

  scene.tweens.add({
    targets: container_main,
    x: container_main_hide_position.x,
    y: container_main_hide_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}
