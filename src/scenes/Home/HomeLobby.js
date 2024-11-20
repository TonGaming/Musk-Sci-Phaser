import centerData from "../../Data/CenterData.js";

import centerDataPlayer from "../../Data/CenterDataPlayer.js";

import { CreateQuest } from "./HomeQuest.js";

import { CreateGacha } from "./HomeGacha.js";

import { OpenRankContainer } from "./HomeRank.js";

import { CreateCharacterInventory } from "./HomeCharacterInventory.js";

import { CreateInviteFriends } from "./HomeInviteFriends.js";

let container_main = null;

let container_0 = null;

let container_1 = null;

let isTween = false;

export function CreateLobby(scene) {
  container_main = scene.add.container(0, 0);
  container_main.setDepth(0);

  const block_bg = scene.add
    .image(0, 0, "home_lobby_bg")
    .setOrigin(0, 0)
    .setInteractive();
  container_main.add(block_bg);

  container_0 = scene.add.container(0, 0);
  container_main.add(container_0);
  container_0.setDepth(1);

  container_1 = scene.add.container(0, 0);
  container_main.add(container_1);
  container_1.setDepth(2);

  CreateButtonBattle(scene);

  CreateButtonQuest(scene);

  CreateButtonCharacter(scene);

  CreateButtonGacha(scene);

  CreateButtonRank(scene);

  CreateButtonInvite(scene);

  player_spine = CreateLobbyCharacter(scene);

  const spine_bounds = player_spine.getBounds();

  player_spine.setPosition(540, 1920 + spine_bounds.size.y * 0.5);
  player_spine.setScale(1.4);

  CreateButtonSelectLeft(scene);

  CreateButtonSelectRight(scene);
}

function CreateButtonBattle(scene) {
  const btn_battle = scene.add
    .image(51, 1153 + 179 / 2, "home_lobby_btn_battle")
    .setOrigin(0, 0.5)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("ButtonBattle clicked");

      GetCurrentBattle(scene);
    })
    .on("pointerover", function () {
      console.log("ButtonBattle over");

      scene.tweens.add({
        targets: btn_battle,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("ButtonBattle out");

      scene.tweens.add({
        targets: btn_battle,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_1.add(btn_battle);
}

function GetCurrentBattle(scene) {
  centerData.RequestCurrentBattle(
    (result) => {
      console.log("lấy current battle thành công:", result);

      if (centerData.battle == null) {
        GetNewBattle(scene);
      } else {
        scene.scene.start("Gameplay");
      }
    },
    (error) => {
      console.log("lấy current battle thất bại:", error);
    }
  );
}

function GetNewBattle(scene) {
  centerData.RequestNewBattle(
    (result) => {
      console.log("lấy new battle thành công:", result);

      if (centerData.battle != null) {
        scene.scene.start("Gameplay");
      }
    },
    (error) => {
      console.log("lấy new battle thất bại:", error);
    }
  );
}

function CreateButtonQuest(scene) {
  const btn_quest = scene.add
    .image(51, 1334 + 179 / 2, "home_lobby_btn_quest")
    .setOrigin(0, 0.5)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("ButtonQuest clicked");

      CreateQuest(scene);
    })
    .on("pointerover", function () {
      console.log("ButtonQuest over");

      scene.tweens.add({
        targets: btn_quest,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("ButtonQuest out");

      scene.tweens.add({
        targets: btn_quest,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_1.add(btn_quest);
}

function CreateButtonCharacter(scene) {
  const btn_character = scene.add
    .image(51, 1512 + 179 / 2, "home_lobby_btn_character")
    .setOrigin(0, 0.5)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("ButtonCharacter clicked");

      CreateCharacterInventory(scene);
    })
    .on("pointerover", function () {
      console.log("ButtonCharacter over");

      scene.tweens.add({
        targets: btn_character,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("ButtonCharacter out");

      scene.tweens.add({
        targets: btn_character,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_1.add(btn_character);
}

function CreateButtonGacha(scene) {
  const btn_gacha = scene.add
    .image(1048, 1153 + 179 / 2, "home_lobby_btn_gacha")
    .setOrigin(1, 0.5)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("ButtonGacha clicked");

      CreateGacha(scene);
    })
    .on("pointerover", function () {
      console.log("ButtonGacha over");

      scene.tweens.add({
        targets: btn_gacha,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("ButtonGacha out");

      scene.tweens.add({
        targets: btn_gacha,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_1.add(btn_gacha);
}

function CreateButtonRank(scene) {
  const btn_rank = scene.add
    .image(1048, 1334 + 179 / 2, "home_lobby_btn_rank")
    .setOrigin(1, 0.5)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("ButtonRank clicked");

      OpenRankContainer(scene);
    })
    .on("pointerover", function () {
      console.log("ButtonRank over");

      scene.tweens.add({
        targets: btn_rank,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("ButtonRank out");

      scene.tweens.add({
        targets: btn_rank,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_1.add(btn_rank);
}

function CreateButtonInvite(scene) {
  const btn_invite = scene.add
    .image(1048, 1512 + 179 / 2, "home_lobby_btn_invite")
    .setOrigin(1, 0.5)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("ButtonInvite clicked");

      CreateInviteFriends(scene);
    })
    .on("pointerover", function () {
      console.log("ButtonInvite over");

      scene.tweens.add({
        targets: btn_invite,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("ButtonInvite out");

      scene.tweens.add({
        targets: btn_invite,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });
  container_1.add(btn_invite);
}

function CreateButtonSelectLeft(scene) {
  const btn = scene.add
    .image(30 + 65 / 2, 1028 + 95 / 2, "share_btn_next_left")
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
  container_1.add(btn);
}

function CreateButtonSelectRight(scene) {
  const btn = scene.add
    .image(997 + 65 / 2, 1028 + 95 / 2, "share_btn_next_right")
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
  container_1.add(btn);
}

function LeftButtonClick(scene) {
  if (isTween) return;

  isTween = true;

  currentIndex--;

  if (currentIndex < 0) {
    currentIndex = centerData.selectedPlayer.length - 1;
  }

  let newSpine = CreateLobbyCharacter(scene);
  const spine_bounds = newSpine.getBounds();

  newSpine.setPosition(540 - 1080, 1920 + spine_bounds.size.y * 0.5);
  newSpine.setScale(1.4);

  scene.tweens.add({
    targets: newSpine, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: 540, // Vị trí x đích
    y: newSpine.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
    onComplete: function () {},
  });

  scene.tweens.add({
    targets: player_spine, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: player_spine.x + 1080, // Vị trí x đích
    y: player_spine.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
    onComplete: function () {
      player_spine.destroy();
      player_spine = newSpine;

      isTween = false;
    },
  });
}

function RightButtonClick(scene) {
  if (isTween) return;

  isTween = true;

  currentIndex++;

  if (currentIndex >= centerData.selectedPlayer.length) {
    currentIndex = 0;
  }

  let newSpine = CreateLobbyCharacter(scene);
  const spine_bounds = newSpine.getBounds();

  newSpine.setPosition(540 + 1080, 1920 + spine_bounds.size.y * 0.5);
  newSpine.setScale(1.4);

  scene.tweens.add({
    targets: newSpine, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: 540, // Vị trí x đích
    y: newSpine.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
    onComplete: function () {},
  });

  scene.tweens.add({
    targets: player_spine, // Đối tượng bạn muốn tween (container, sprite, image, v.v.)
    x: player_spine.x - 1080, // Vị trí x đích
    y: player_spine.y, // Vị trí y đích
    duration: 500, // Thời gian tween (ms)
    ease: "Power2", // Kiểu easing (bạn có thể thử các kiểu khác như 'Linear', 'Bounce', 'Elastic')
    delay: 0, // Độ trễ trước khi tween bắt đầu (nếu có)
    onComplete: function () {
      player_spine.destroy();
      player_spine = newSpine;

      isTween = false;
    },
  });
}

let container_player = null;

let player_spine = null;

let currentIndex = 0;

function CreateLobbyCharacter(scene) {
  let pData = centerDataPlayer.getPlayerById(
    centerData.selectedPlayer[currentIndex]
  );

  container_player = scene.add.container(0, 0);
  container_0.add(container_player);

  let spawnedSpine = scene.add.spine(540, 1920, pData.spineUIKey);

  spawnedSpine.setAnimation(0, "idle", true);

  console.log("player_spine_ui = " + spawnedSpine);

  // Thêm spine vào container
  container_player.add(spawnedSpine);

  // // Áp dụng tint bằng cách thay đổi trực tiếp giá trị RGBA cho mỗi slot
  // player_spine.skeleton.slots.forEach((slot) => {
  //   slot.color.set(1, 0.5, 0.5, 1); // Thiết lập màu đỏ nhạt (1, 0.5, 0.5, 1)
  // });

  return spawnedSpine;
}
