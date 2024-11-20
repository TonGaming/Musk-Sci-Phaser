import centerData from "../../Data/CenterData.js";

import centerDataPlayer from "../../Data/CenterDataPlayer.js";

import { OpenTopBarBG } from "../Home/HomeTopBarPlayer.js";
import { HideTopBarBG } from "../Home/HomeTopBarPlayer.js";

import { OpenBottomBar } from "../Home/HomeBottomBar.js";
import { CloseBottomBar } from "../Home/HomeBottomBar.js";

let container_main = null;

let container_popup = null;
let container_popup_close_position = { x: 0, y: 4000 };
let container_popup_open_position = { x: 0, y: 0 };

let container_item_list = null;

let isOpen = false;

export function CreateCharacterInventory(scene) {
  if (container_main) {
    container_main.destroy();
  }

  container_main = scene.add.container(0, 0);
  container_main.setDepth(100);

  const lock_bg = scene.add
    .image(540, 960, "home_character_bg")
    .setOrigin(0.5, 0.5)
    .setInteractive();
  container_main.add(lock_bg);

  const img_title = scene.add
    .image(488, 248, "home_character_title")
    .setOrigin(0, 0)
    .setInteractive();
  container_main.add(img_title);

  scene.tweens.add({
    targets: img_title,
    x: { from: 488 + 594, to: 488 },
    duration: 500,
    ease: "Power2",
    onComplete: () => {},
  });

  container_popup = scene.add.container(
    container_popup_open_position.x,
    container_popup_open_position.y
  );
  container_main.add(container_popup);

  CreateItemList(scene);

  //create footer bg
  const footer_bg = scene.add
    .image(originWidth / 2, originHeight, "home_character_footer_bg")
    .setOrigin(0.5, 1)
    .setDisplaySize(1080, 293);
  container_popup.add(footer_bg);
  footer_bg.setDepth(1);

  //create close btn
  const btn_close = scene.add
    .image(58 + 70 / 2, 260 + 76 / 2, "home_character_btn_close")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_close clicked");

      Close(scene);
    })
    .on("pointerover", function () {
      console.log("btn_close over");

      scene.tweens.add({
        targets: btn_close,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("btn_close out");

      scene.tweens.add({
        targets: btn_close,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_popup.add(btn_close);

  Open(scene);

  HideTopBarBG(scene);

  CloseBottomBar(scene);
}

function CreateItemList(scene) {
  // Tạo bảng gridTable và gán các item vào

  container_item_list = scene.add.container(0, 0);
  container_popup.add(container_item_list);

  let itemData = [];

  for (let i = 0; i < centerData.unlockedPlayer.length; i++) {
    let pData = centerDataPlayer.getPlayerById(
      centerData.unlockedPlayer[i].playerId
    );

    // console.log("pData = ", pData);

    if (pData !== null) {
      const newItem = {
        playerId: centerData.unlockedPlayer[i].playerId,
        level: centerData.unlockedPlayer[i].level,
        playerData: pData,
      };

      itemData.push(newItem);
    }
  }

  const posX = 540 + 1080 / 6 + 15;

  const posY = 456 + 1464 / 2;

  const scrollViewWidth = 1080;

  const scrollViewHeight = 1464;

  const spaceWidth = 10 / 2;

  const spaceHeight = 20 / 2;

  const gridTable = scene.rexUI.add
    .gridTable({
      x: posX,
      y: posY,
      width: scrollViewWidth,
      height: scrollViewHeight,
      scrollMode: 0,

      table: {
        cellWidth: 340 + spaceWidth,
        cellHeight: 470 + spaceHeight,
        columns: 3,
        //reuseCellContainer: true, // Kích hoạt tái sử dụng cell container
      },

      mouseWheelScroller: {
        focus: false,
        speed: 1,
      },

      items: itemData, // Gán danh sách item vào gridTable

      createCellContainerCallback: (cell, cellContainer) => {
        var scene = cell.scene,
          width = cell.width,
          height = cell.height,
          item = cell.item,
          index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: 340,
            height: 470,
            orientation: 0,
          });
        } else {
          console.log(cell.index + ": reuse cell-container");
        }

        cellContainer.add(card_item(scene, index, item));

        return cellContainer;
      },

      space: {
        // left: 21,
        // right: 21,
        // top: 36,
        // bottom: 0,
        // row: 0,
      },
    })
    .layout();

  gridTable.isDragging = false;

  scene.input.on("pointerup", (pointer) => {
    gridTable.isDragging = false;
  });

  container_item_list.add(gridTable);
  container_item_list.gridTable = gridTable;

  gridTable.setT(1);
  gridTable.setT(0);

  //   const gridOrigin = scene.rexUI.add.roundRectangle(
  //     gridTable.x,
  //     gridTable.y,
  //     50,
  //     50,
  //     0,
  //     0xffffff,
  //     1
  //   );
  //   container_item_list.add(gridOrigin);

  const maskShape = scene.add
    .rectangle(540, 456 + 1464 / 2, scrollViewWidth, scrollViewHeight, 0x000000)
    .setVisible(false);

  const mask = new Phaser.Display.Masks.GeometryMask(scene, maskShape);
  gridTable.setMask(mask);
}

export function GetBackgroundByRank(rankType) {
  let imgKey = "";

  switch (rankType) {
    case "c":
      imgKey = "home_character_card_c_bg";
      break;
    case "b":
      imgKey = "home_character_card_b_bg";
      break;
    case "a":
      imgKey = "home_character_card_a_bg";
      break;
    case "s":
      imgKey = "home_character_card_s_bg";
      break;
    case "ss":
      imgKey = "home_character_card_ss_bg";
      break;
    case "ssr":
      imgKey = "home_character_card_ssr_bg";
      break;
    default:
      imgKey = "home_character_card_c_bg";
  }

  return imgKey;
}

export function GetFrameByRank(rankType) {
  let imgKey = "";

  switch (rankType) {
    case "c":
      imgKey = "home_character_card_c_frame";
      break;
    case "b":
      imgKey = "home_character_card_b_frame";
      break;
    case "a":
      imgKey = "home_character_card_a_frame";
      break;
    case "s":
      imgKey = "home_character_card_s_frame";
      break;
    case "ss":
      imgKey = "home_character_card_ss_frame";
      break;
    case "ssr":
      imgKey = "home_character_card_ssr_frame";
      break;
    default:
      imgKey = "home_character_card_c_frame";
  }

  return imgKey;
}

function card_item(scene, i, item) {
  //console.log("Item = ", item);

  const container_card = scene.add.container(0, 0);

  // const item_bg = scene.rexUI.add.roundRectangle(
  //   0,
  //   0,
  //   340,
  //   470,
  //   0,
  //   0x000000,
  //   1
  // );
  // container_card.add(item_bg);

  const btn_item = scene.add
    .image(0, 0, GetBackgroundByRank(item.playerData.rank))
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function (pointer) {
      console.log("btn_item clicked");

      container_item_list.gridTable.startY = pointer.y;

      container_item_list.gridTable.isDragging = true;
    })
    .on("pointermove", function (pointer) {
      console.log("btn_item clicked");

      if (!container_item_list.gridTable.isDragging) return;

      const deltaY = pointer.y - container_item_list.gridTable.startY; // Tính độ chênh lệch so với vị trí trước đó
      container_item_list.gridTable.startY = pointer.y; // Cập nhật startY cho lần di chuyển tiếp theo

      // Tính toán giá trị T hiện tại của bảng và điều chỉnh theo deltaY
      let currentT = container_item_list.gridTable.t - deltaY / 2000; // Điều chỉnh tốc độ cuộn
      currentT = Phaser.Math.Clamp(currentT, 0, 1); // Đảm bảo T nằm trong phạm vi 0-1

      container_item_list.gridTable.setT(currentT); // Cập nhật vị trí cuộn của bảng
    })
    .on("pointerup", function (pointer) {
      console.log("btn_item clicked");

      if (container_item_list.gridTable.isDragging == false) {
        //do something if it is seleted not dragging
      }

      container_item_list.gridTable.isDragging = false; // Dừng kéo
    })
    .on("pointerover", function (pointer) {
      if (container_item_list.gridTable.isDragging == true) {
        container_item_list.gridTable.startY = pointer.y;
      }

      container_card.each(function (child) {
        if (child.setTint) {
          child.setTint(0x646464); // Màu tint bạn muốn áp dụng
        }
      });
    })
    .on("pointerout", function (pointer) {
      container_card.each(function (child) {
        if (child.clearTint) {
          child.clearTint(); // Xóa tint
        }
      });
    });
  container_card.add(btn_item);

  const avatar = scene.add.image(0, 0, item.playerData.cardImgKey);
  container_card.add(avatar);

  const frame = scene.add.image(0, 0, GetFrameByRank(item.playerData.rank));
  container_card.add(frame);

  const true_level = (item.level % 15) + 1;

  const text_level = scene.add
    .text(280 - 340 / 2, -470 / 2 + 46, true_level, {
      fontFamily: "RussoOne",
      fontSize: "64px",
      color: "#ffffff",
      align: "center",
      stroke: "#000000",
      strokeThickness: 1,
      shadow: {
        offsetX: 2,
        offsetY: 4,
        color: "#000000",
        blur: 0,
        stroke: true,
        fill: true,
      },
    })
    .setOrigin(0.5, 0.5);

  // Áp dụng gradient cho text
  const text_level_gradient = text_level.context.createLinearGradient(
    0,
    0,
    0,
    text_level.height
  );
  text_level_gradient.addColorStop(0.25, "#FFFFFF");
  text_level_gradient.addColorStop(0.75, "#FDCA00");
  text_level_gradient.addColorStop(1, "#9D6B00");

  text_level.setFill(text_level_gradient);

  container_card.add(text_level);

  const star = (item.level / 15) | 0;

  let posX = 48 / 2 - 340 / 2 + 9;
  let posY = -470 / 2 + 48 / 2 + 15;

  for (let i = 0; i < star; i++) {
    const img_star = scene.add
      .image(posX, posY, "home_character_star")
      .setOrigin(0.5, 0.5);
    container_card.add(img_star);

    posY += 48;
  }

  const text_name = scene.add
    .text(7 - 340 / 2, 470 / 2 - 15, item.playerData.name, {
      fontFamily: "RussoOne",
      fontSize: "48px",
      color: "#ffffff",
      align: "left",
      wordWrap: { width: 236, useAdvancedWrap: true },
      stroke: "#000000",
      strokeThickness: 1,
      shadow: {
        offsetX: 2,
        offsetY: 4,
        color: "#000000",
        blur: 0,
        stroke: true,
        fill: true,
      },
    })
    .setOrigin(0, 1);

  container_card.add(text_name);

  const role_icon = scene.add
    .image(340 / 2 - 6, 470 / 2 - 15, "home_character_role_0")
    .setOrigin(1, 1);
  container_card.add(role_icon);

  // const item_text_price = scene.add
  //   .text(-40 + 421 / 2, -120 + 506 / 2, "999$", {
  //     fontFamily: "RussoOne",
  //     fontSize: "24px",
  //     color: "#ffffff",
  //     align: "right",
  //   })
  //   .setOrigin(1, 1);
  // container_card.add(item_text_price);

  // const item_text_name = scene.add
  //   .text(32 - 421 / 2, -120 + 506 / 2, "Name item", {
  //     fontFamily: "RussoOne",
  //     fontSize: "36px",
  //     color: "#ffffff",
  //     align: "left",
  //   })
  //   .setOrigin(0, 1);
  // container_card.add(item_text_name);

  // const item_text_description = scene.add
  //   .text(32 - 421 / 2, -120 + 506 / 2, "Item description", {
  //     fontFamily: "RussoOne",
  //     fontSize: "16px",
  //     color: "#BFBFBF",
  //     align: "left",
  //     wordWrap: { width: 373, useAdvancedWrap: true },
  //   })
  //   .setOrigin(0, 0);
  // container_card.add(item_text_description);

  //   const rectangleRank = scene.add.image(923 / 2, 200 / 2, "home_rank_top_bg");
  //   container_card.add(rectangleRank);

  //   const avatar = scene.add
  //     .image(155, 40 / 2, "home_rank_avatar_bg")
  //     .setOrigin(0, 0);
  //   container_card.add(avatar);

  //   const score = scene.add
  //     .text(900, 104 - 32 / 2, `Score: ${item.Chip}`, {
  //       color: "#878787",
  //       fontFamily: "RussoOne",
  //       fontSize: "32px",
  //       fontStyle: "normal",
  //       // fontWeight: 400,
  //       // lineHeight: "32px",
  //     })
  //     .setOrigin(1, 0);
  //   container_card.add(score);

  // const origin = scene.rexUI.add.roundRectangle(0, 0, 10, 10, 0, 0xffffff, 1);
  // container_card.add(origin);

  return container_card;
}

export function IsOpen() {
  return isOpen;
}

export function Open(scene) {
  if (isOpen == true) return;

  isOpen = true;

  container_popup.setPosition(
    container_popup_close_position.x,
    container_popup_close_position.y
  );

  scene.tweens.add({
    targets: container_popup,
    x: container_popup_open_position.x,
    y: container_popup_open_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function Close(scene) {
  if (isOpen == false) return;

  OpenTopBarBG(scene);

  OpenBottomBar(scene);

  container_popup.setPosition(
    container_popup_open_position.x,
    container_popup_open_position.y
  );

  scene.tweens.add({
    targets: container_popup,
    x: container_popup_close_position.x,
    y: container_popup_close_position.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      isOpen = false;
      Destroy();
    },
  });
}

function Destroy(scene) {
  container_main.destroy();
}
