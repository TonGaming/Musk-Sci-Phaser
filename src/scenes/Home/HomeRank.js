import centerData from "../../Data/CenterData";

let container_main = null;

let container_popup = null;
const container_popup_openPosition = { x: 0, y: 0 };
const container_popup_closePosition = { x: 0, y: 4000 };

let container_rank_0;
let container_rank_list = null;

let container_rank_1;
let container_my_rank = null;

export function OpenRankContainer(scene) {
  container_main = scene.add.container(0, 0);
  container_main.setDepth(300);

  const lock_bg = scene.rexUI.add.roundRectangle(
    originWidth / 2,
    originHeight / 2,
    originWidth,
    originHeight,
    0,
    0x000000,
    0.75
  );

  // Thiết lập tương tác
  lock_bg.setInteractive({ useHandCursor: true }); // Thêm { useHandCursor: true } để thay đổi con trỏ thành bàn tay khi di chuột vào

  // Bắt sự kiện click hoặc chạm vào
  lock_bg.on("pointerdown", function (pointer) {
    console.log("CreateInviteFriends Lock background clicked!");
  });

  container_main.add(lock_bg);

  container_popup = scene.add.container(0, 0);
  container_main.add(container_popup);

  const popup_bg = scene.add
    .image(originWidth / 2, 402, "home_rank_bg")
    .setOrigin(0.5, 0);

  container_popup.add(popup_bg);

  container_rank_0 = scene.add.container(0, 0);
  container_popup.add(container_rank_0);

  //create footer bg
  const footer_bg = scene.add
    .image(originWidth / 2, originHeight, "home_rank_footer_bg")
    .setOrigin(0.5, 1);
  container_popup.add(footer_bg);
  footer_bg.setDepth(1);

  centerData.RequestRank(
    (result) => {
      console.log("RequestInviteFriend thành công:", result);

      CreateRankList(scene, result.data);
    },
    (error) => {
      console.log("RequestInviteFriend thất bại:", error);
    }
  );

  container_rank_1 = scene.add.container(0, 0);
  container_popup.add(container_rank_1);

  centerData.RequestMyRank(
    (result) => {
      console.log("RequestInviteFriend thành công:", result);

      CreateMyRank(scene, result);
    },
    (error) => {
      console.log("RequestInviteFriend thất bại:", error);
    }
  );

  //create close btn
  const btn_close = scene.add
    .image(956 + 86 / 2, 240 + 86 / 2, "share_btn_close")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_close clicked");

      CloseRank(scene);
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

  OpenRank(scene);
}

function OpenRank(scene) {
  container_popup.setPosition(
    container_popup_closePosition.x,
    container_popup_closePosition.y
  );

  scene.tweens.add({
    targets: container_popup,
    x: container_popup_openPosition.x,
    y: container_popup_openPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      console.log("OpenInviteFriend complete!"); // Thông báo khi tween hoàn thành
    },
  });
}

function CloseRank(scene) {
  scene.tweens.add({
    targets: container_popup,
    x: container_popup_closePosition.x,
    y: container_popup_closePosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {
      console.log("CloseInviteFriend complete!"); // Thông báo khi tween hoàn thành

      Destroy();
    },
  });
}

function Destroy() {
  container_main.destroy();

  container_main = null;

  container_rank_list = null;

  container_my_rank = null;
}

function CreateRankList(scene, rankData) {
  container_rank_list = scene.add.container(0, 0);
  container_rank_0.add(container_rank_list);
  container_rank_list.setDepth(0);

  // Tạo bảng gridTable và gán các item vào

  const posX = 540;

  const posY = 463 + 1457 / 2 + 36;

  const scrollViewWidth = 923;

  const scrollViewHeight = 1457;

  const gridTable = scene.rexUI.add
    .gridTable({
      x: posX,
      y: posY,
      width: scrollViewWidth,
      height: scrollViewHeight,
      scrollMode: 0,

      table: {
        cellWidth: 923,
        cellHeight: 200 + 36,
        columns: 1,
        //reuseCellContainer: true, // Kích hoạt tái sử dụng cell container
      },

      mouseWheelScroller: {
        focus: false,
        speed: 1,
      },

      items: rankData, // Gán danh sách item vào gridTable

      createCellContainerCallback: (cell, cellContainer) => {
        var scene = cell.scene,
          width = cell.width,
          height = cell.height,
          item = cell.item,
          index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: 923,
            height: 200,
            orientation: 0,
          });
        } else {
          console.log(cell.index + ": reuse cell-container");
        }

        cellContainer.add(card_Rank(scene, index, item));

        return cellContainer;
      },

      space: {
        // left: 50,
        // right: 0,
        // top: 36,
        // bottom: 0,
        row: 0,
      },
    })
    .setDepth(0)
    .layout();

  container_rank_list.add(gridTable);

  gridTable.setT(1);
  gridTable.setT(0);

  const maskShape = scene.add
    .rectangle(
      posX,
      463 + 1457 / 2 + 36 * 3,
      scrollViewWidth,
      scrollViewHeight,
      0x000000
    )
    .setVisible(false);

  const mask = new Phaser.Display.Masks.GeometryMask(scene, maskShape);
  gridTable.setMask(mask);
}

function CreateMyRank(scene, myRankData) {
  //Create my rank

  container_my_rank = scene.add.container(0, 0);
  container_rank_1.add(container_my_rank);

  const my_rank_bg = scene.add
    .image(originWidth / 2, 1532, "home_rank_my_rank_bg")
    .setOrigin(0.5, 0);

  container_my_rank.add(my_rank_bg);

  const top = scene.add
    .text(184, 1595, `${myRankData.rank}.`, {
      color: "#7DE8FF",
      fontFamily: "RussoOne",
      fontSize: "48px",
      fontStyle: "normal",
    })
    .setOrigin(1, 0);
  container_my_rank.add(top);

  const userName = scene.add
    .text(380, 1551, centerData.userInfo.Username, {
      color: "#686868",
      fontFamily: "RussoOne",
      fontSize: "48px",
      fontStyle: "normal",
    })
    .setOrigin(0, 0);
  container_my_rank.add(userName);

  const userId = scene.add
    .text(380, 1602, `ID: ${centerData.userInfo.UserId}`, {
      color: "#878787",
      fontFamily: "RussoOne",
      fontSize: "24px",
      fontStyle: "normal",
    })
    .setOrigin(0, 0);
  container_my_rank.add(userId);

  const score = scene.add
    .text(380, 1654, `Score: ${centerData.userInfo.Chip}`, {
      color: "#7DE8FF",
      fontFamily: "RussoOne",
      fontSize: "32px",
      fontStyle: "normal",
    })
    .setOrigin(0, 0);
  container_my_rank.add(score);
}

function card_Rank(scene, i, item) {
  console.log("Item = ", item);

  const container_card = scene.add.container(0, 0);

  const rectangleRank = scene.add.image(923 / 2, 200 / 2, "home_rank_top_bg");
  container_card.add(rectangleRank);

  let groupRank;
  if (i == 0) {
    groupRank = scene.add.image(-10, -25, "home_rank_top1").setOrigin(0);
  } else if (i == 1) {
    groupRank = scene.add.image(-10, -25, "home_rank_top2").setOrigin(0);
  } else if (i == 2) {
    groupRank = scene.add.image(-10, -25, "home_rank_top3").setOrigin(0);
  }

  if (groupRank) {
    container_card.add(groupRank);
  }

  const avatar = scene.add
    .image(155, 40 / 2, "home_rank_avatar_bg")
    .setOrigin(0, 0);
  container_card.add(avatar);

  const top = scene.add
    .text(82, 136, `${i + 1}.`, {
      color: "#686868",
      fontFamily: "RussoOne",
      fontSize: "48px",
      fontStyle: "normal",
      // fontWeight: 400,
      // lineHeight: "64px",
    })
    .setOrigin(0, 0);
  container_card.add(top);

  const userName = scene.add
    .text(335, 74 - 48 / 2, item.Username, {
      color: "#686868",
      fontFamily: "RussoOne",
      fontSize: "48px",
      fontStyle: "normal",
      // fontWeight: 400,
      // lineHeight: "64px",
    })
    .setOrigin(0, 0);
  container_card.add(userName);

  const userId = scene.add
    .text(335, 114 - 24 / 2, `ID: ${item.UserId}`, {
      color: "#878787",
      fontFamily: "RussoOne",
      fontSize: "24px",
      fontStyle: "normal",
      // fontWeight: 400,
      // lineHeight: "32px",
    })
    .setOrigin(0, 0);
  container_card.add(userId);

  const score = scene.add
    .text(900, 104 - 32 / 2, `Score: ${item.Chip}`, {
      color: "#878787",
      fontFamily: "RussoOne",
      fontSize: "32px",
      fontStyle: "normal",
      // fontWeight: 400,
      // lineHeight: "32px",
    })
    .setOrigin(1, 0);
  container_card.add(score);

  return container_card;
}
