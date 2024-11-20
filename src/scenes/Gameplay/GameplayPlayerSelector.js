import centerData from "../../Data/CenterData.js";
import centerDataPlayer from "../../Data/CenterDataPlayer.js";

import { GetBackgroundByRank } from "../Home/HomeCharacterInventory.js";
import { GetFrameByRank } from "../Home/HomeCharacterInventory.js";

let container_main = null;

let container_selector = null;

let container_btns = null;

const left_card_pos = { x: 630 + 152 / 2, y: 1581 + 210 / 2 };
const right_card_pos = { x: 630 + 152 / 2 + 236, y: 1581 + 210 / 2 };
const mid_card_pos = { x: 760 + 191 / 2, y: 1554 + 264 / 2 };

const side_scale = 0.4668;
const mid_scale = 0.5617;

const mid_alpha = 1;
const side_alpha = 0.5;

let card_left = null;
let card_right = null;
let card_mid = null;

let isTween = false;

export function CreatePlayerSelector(scene) {
  container_main = scene.add.container(0, 0).setDepth(100);

  container_selector = scene.add.container(0, 0).setDepth(0);
  container_main.add(container_selector);

  container_btns = scene.add.container(0, 0).setDepth(1);
  container_main.add(container_btns);

  // const container_selector_bg = scene.add.rectangle(
  //   630 + 408 / 2,
  //   1554 + 264 / 2,
  //   408,
  //   264,
  //   0x000000
  // );
  //container_selector.add(container_selector_bg);

  let itemData = [];

  for (let i = 0; i < centerData.selectedPlayer.length; i++) {
    let level = centerData.getUnlockedPlayerLevelByPlayerId(
      centerData.selectedPlayer[i]
    );

    let pData = centerDataPlayer.getPlayerById(centerData.selectedPlayer[i]);

    console.log(`pData = ${i} `, pData);

    if (pData !== null) {
      const newItem = {
        playerId: centerData.selectedPlayer[i],
        level: level,
        playerData: pData,
      };

      itemData.push(newItem);
    }
  }

  console.log(`pData itemData.length - 1: `, itemData[itemData.length - 1]);
  card_left = card_item(
    scene,
    itemData[itemData.length - 1],
    left_card_pos.x,
    left_card_pos.y
  );
  container_selector.add(card_left);
  card_left.setScale(side_scale);
  card_left.setAlpha(side_alpha);

  console.log(`pData 1: `, itemData[1]);
  card_right = card_item(
    scene,
    itemData[1],
    right_card_pos.x,
    right_card_pos.y
  );
  container_selector.add(card_right);
  card_right.setScale(side_scale);
  card_right.setAlpha(side_alpha);

  console.log(`pData 0: `, itemData[0]);
  card_mid = card_item(scene, itemData[0], mid_card_pos.x, mid_card_pos.y);
  container_selector.add(card_mid);
  card_mid.setScale(mid_scale);

  CreateButtonSelectLeft(scene);

  CreateButtonSelectRight(scene);
}

function CreateButtonSelectLeft(scene) {
  const btn = scene.add
    .image(672 + 65 / 2, 1638 + 95 / 2, "share_btn_next_left")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("CreateButtonSelectLeft clicked");

      LeftButtonClick(scene);
    })
    .on("pointerover", function () {
      console.log("CreateButtonSelectLeft over");

      scene.tweens.add({
        targets: btn,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("CreateButtonSelectLeft out");

      scene.tweens.add({
        targets: btn,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_btns.add(btn);
}

function CreateButtonSelectRight(scene) {
  const btn = scene.add
    .image(974 + 65 / 2, 1638 + 95 / 2, "share_btn_next_right")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("CreateButtonSelectRight clicked");

      RightButtonClick(scene);
    })
    .on("pointerover", function () {
      console.log("CreateButtonSelectRight over");

      scene.tweens.add({
        targets: btn,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("CreateButtonSelectRight out");

      scene.tweens.add({
        targets: btn,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_btns.add(btn);
}

function LeftButtonClick(scene) {
  if (isTween) return;

  isTween = true;

  // Gọi hàm `CreatePlayer` từ `Gameplay`
  if (typeof scene.CreatePlayer === "function") {
    console.log("Select player from SetPlayer");
    scene.SetPlayer(scene, card_left.item.playerId);
  } else {
    console.error("SetPlayer function not found on scene.");
  }

  scene.tweens.add({
    targets: card_mid, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: right_card_pos.x, // Vị trí x đích
    y: right_card_pos.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
    onComplete: function () {
      let temp = card_right;

      card_right = card_mid;

      card_mid = card_left;

      card_left = temp;

      container_selector.bringToTop(card_left);
      container_selector.bringToTop(card_right);
      container_selector.bringToTop(card_mid);

      console.log("card_left: ", card_left);
      console.log("card_right: ", card_right);
      console.log("card_mid: ", card_mid);

      isTween = false;
    },
  });

  scene.tweens.add({
    targets: card_mid,
    scale: side_scale,
    duration: 500,
    ease: "Power2",
  });

  scene.tweens.add({
    targets: card_mid,
    alpha: side_alpha,
    duration: 500,
    ease: "Power2",
  });

  scene.tweens.add({
    targets: card_right,
    alpha: 0,
    duration: 250,
    ease: "Power2",
    onComplete: function () {
      card_right.setPosition(left_card_pos.x, left_card_pos.y);
    },
  });

  scene.tweens.add({
    targets: card_right,
    alpha: side_alpha,
    duration: 250,
    ease: "Power2",
    delay: 250,
  });

  scene.tweens.add({
    targets: card_left, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: mid_card_pos.x, // Vị trí x đích
    y: mid_card_pos.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
  });

  scene.tweens.add({
    targets: card_left,
    scale: mid_scale,
    duration: 500,
    ease: "Power2",
  });

  scene.tweens.add({
    targets: card_left,
    alpha: mid_alpha,
    duration: 500,
    ease: "Power2",
  });
}

function RightButtonClick(scene) {
  if (isTween) return;

  isTween = true;

  // Gọi hàm `CreatePlayer` từ `Gameplay`
  if (typeof scene.CreatePlayer === "function") {
    console.log("Select player from SetPlayer");
    scene.SetPlayer(scene, card_right.item.playerId);
  } else {
    console.error("SetPlayer function not found on scene.");
  }

  scene.tweens.add({
    targets: card_mid, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: left_card_pos.x, // Vị trí x đích
    y: left_card_pos.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
    onComplete: function () {
      let temp = card_left;

      card_left = card_mid;

      card_mid = card_right;

      card_right = temp;

      container_selector.bringToTop(card_left);
      container_selector.bringToTop(card_right);
      container_selector.bringToTop(card_mid);

      console.log("card_left: ", card_left);
      console.log("card_right: ", card_right);
      console.log("card_mid: ", card_mid);

      isTween = false;
    },
  });

  scene.tweens.add({
    targets: card_mid,
    scale: side_scale,
    duration: 500,
    ease: "Power2",
  });

  scene.tweens.add({
    targets: card_mid,
    alpha: side_alpha,
    duration: 500,
    ease: "Power2",
  });

  scene.tweens.add({
    targets: card_left,
    alpha: 0,
    duration: 250,
    ease: "Power2",
    onComplete: function () {
      card_left.setPosition(right_card_pos.x, right_card_pos.y);
    },
  });

  scene.tweens.add({
    targets: card_left,
    alpha: side_alpha,
    duration: 250,
    ease: "Power2",
    delay: 250,
  });

  scene.tweens.add({
    targets: card_right, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: mid_card_pos.x, // Vị trí x đích
    y: mid_card_pos.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
  });

  scene.tweens.add({
    targets: card_right,
    scale: mid_scale,
    duration: 500,
    ease: "Power2",
  });

  scene.tweens.add({
    targets: card_right,
    alpha: mid_alpha,
    duration: 500,
    ease: "Power2",
  });
}

function card_item(scene, item, x, y) {
  //console.log("Item = ", item);

  let container_card = scene.add.container(x, y);

  container_card.item = item;

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
    .on("pointerdown", function (pointer) {});
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
