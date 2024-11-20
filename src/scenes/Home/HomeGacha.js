import centerData from "../../Data/CenterData.js";

let container_main = null;

let container_0 = null;

let selected_light = null;

let isChipSpin = true;

let container_btn_chip = null;

let container_btn_musk = null;

let active_btn_close_delay = null;

const chip_price = 10000;

const musk_price = 1;

let spinNum = 0;
let currentSpin = 0;

let arr_itemData = [
  { itemId: "BOM", amount: 0 },
  { itemId: "CHIP_20", amount: 20 },
  { itemId: "CHIP_50", amount: 50 },
  { itemId: "CHIP_75", amount: 75 },
  { itemId: "CHIP_100", amount: 100 },
  { itemId: "MUSK_2", amount: 2 },
  { itemId: "MUSK_10", amount: 10 },
  { itemId: "MUSK_20", amount: 20 },
  { itemId: "MUSK_100", amount: 100 },
  { itemId: "MUSK_200", amount: 200 },
  { itemId: "MUSK_500", amount: 500 },
  { itemId: "MUSK_1000", amount: 1000 },
  { itemId: "MUSK_2000", amount: 2000 },
  { itemId: "MUSK_20000", amount: 20000 },
  { itemId: "NFT_1", amount: 0 },
  { itemId: "NFT_2", amount: 0 },
];

function GetItemImgKeyById(itemId) {
  let imgKey = "home_gacha_item_bom";

  // Kiểm tra itemId thuộc nhóm Chip
  if (["CHIP_20", "CHIP_50", "CHIP_75", "CHIP_100"].includes(itemId)) {
    imgKey = "home_gacha_item_chip";
  }
  // Kiểm tra itemId thuộc nhóm Mchip
  else if (
    [
      "MUSK_2",
      "MUSK_10",
      "MUSK_20",
      "MUSK_100",
      "MUSK_200",
      "MUSK_500",
      "MUSK_1000",
      "MUSK_2000",
      "MUSK_20000",
    ].includes(itemId)
  ) {
    imgKey = "home_gacha_item_musk";
  }

  //console.log("selected img = " + imgKey);

  return imgKey;
}

function GetItemById(itemId) {
  for (let i = 0; i < arr_itemData.length; i++) {
    if (itemId === arr_itemData[i].itemId) {
      const newItem = {
        itemId: arr_itemData[i].itemId,
        amount: arr_itemData[i].amount,
      };

      return newItem;
    }
  }

  return null;
}

export function CreateGacha(scene) {
  container_main = scene.add.container(0, 0);
  container_main.setDepth(400);

  const block_bg = scene.add
    .image(0, 0, "home_gacha_bg")
    .setOrigin(0, 0)
    .setInteractive();
  container_main.add(block_bg);

  container_0 = scene.add.container(0, 0);
  container_main.add(container_0);

  const items = [];

  for (let i = 0; i < 21; i++) {
    const randomNumber = Math.floor(Math.random() * arr_itemData.length);

    const newItem = {
      itemId: arr_itemData[randomNumber].itemId,
      amount: arr_itemData[randomNumber].amount,
    };

    items.push(newItem);
  }

  selected_light = scene.add
    .image(540, 1542, "home_gacha_rewarded_light")
    .setAlpha(0)
    .setOrigin(0.5, 1);
  container_main.add(selected_light);

  CreateGachaList(scene, items);

  GachaListIdleMove(scene);

  CreateCurrencyBar(scene);

  CreateModeButtons(scene);

  CreateSpinButtons(scene);

  CreateSpinX10Buttons(scene);

  CreateSpinX50Buttons(scene);

  CreateSpinX100Buttons(scene);

  //create close btn
  const btn_close = scene.add
    .image(38 + 86 / 2, 137 + 86 / 2, "share_btn_close")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_close clicked");

      scene.tweens.add({
        targets: container_main, // Đối tượng container cần tween
        alpha: { from: 1, to: 0 }, // Chuyển alpha từ 0 (mờ) đến 1 (hiển thị hoàn toàn)
        duration: 500, // Thời gian tween (ms)
        ease: "Linear", // Kiểu easing, có thể thay đổi
        repeat: 0, // Không lặp lại, chỉ chạy một lần
        onComplete: () => {
          Destroy(scene); // Log ra console khi tween hoàn tất
        },
      });
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

  container_main.add(btn_close);
  container_main.btn_close = btn_close;

  scene.tweens.add({
    targets: container_main, // Đối tượng container cần tween
    alpha: { from: 0, to: 1 }, // Chuyển alpha từ 0 (mờ) đến 1 (hiển thị hoàn toàn)
    duration: 500, // Thời gian tween (ms)
    ease: "Linear", // Kiểu easing, có thể thay đổi
    repeat: 0, // Không lặp lại, chỉ chạy một lần
  });
}

function SetSpinMode(boolVal) {
  isChipSpin = boolVal;

  if (isChipSpin) {
    container_btn_chip.setSelected(true);
    container_btn_musk.setSelected(false);
  } else {
    container_btn_chip.setSelected(false);
    container_btn_musk.setSelected(true);
  }
}

function CreateModeButtons(scene) {
  //tạo nút chip spin
  container_btn_chip = scene.add.container(160, 303);
  container_main.add(container_btn_chip);

  const btn_spinChip_selected = scene.add.image(
    355 / 2,
    72 / 2,
    "home_gacha_btn_mode_selected"
  );

  container_btn_chip.add(btn_spinChip_selected);

  const btn_spinChip = scene.add
    .image(355 / 2, 72 / 2, "home_gacha_btn_mode")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      SetSpinMode(true);
    });

  container_btn_chip.add(btn_spinChip);

  container_btn_chip.setSelected = function (boolVal) {
    if (boolVal) {
      btn_spinChip.setVisible(false);
      btn_spinChip_selected.setVisible(true);
    } else {
      btn_spinChip.setVisible(true);
      btn_spinChip_selected.setVisible(false);
    }
  };

  const chip_icon = scene.add
    .image(0, 0, "home_top_currency_chip_1")
    .setOrigin(0, 0);

  container_btn_chip.add(chip_icon);

  const text_chip_price = scene.add
    .text(339, 18 + 36 / 2, chip_price.toLocaleString("en-US") + " = 1 Spin", {
      fontFamily: "RussoOne",
      fontSize: "36px",
      color: "#ffffff",
      align: "right",
    })
    .setOrigin(1, 0.5);
  container_btn_chip.add(text_chip_price);

  //tạo nút musk spin
  container_btn_musk = scene.add.container(565, 303);
  container_main.add(container_btn_musk);

  const btn_spinMusk_selected = scene.add.image(
    355 / 2,
    72 / 2,
    "home_gacha_btn_mode_selected"
  );

  container_btn_musk.add(btn_spinMusk_selected);

  const btn_spinMusk = scene.add
    .image(355 / 2, 72 / 2, "home_gacha_btn_mode")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      SetSpinMode(false);
    });

  container_btn_musk.add(btn_spinMusk);

  container_btn_musk.setSelected = function (boolVal) {
    if (boolVal) {
      btn_spinMusk.setVisible(false);
      btn_spinMusk_selected.setVisible(true);
    } else {
      btn_spinMusk.setVisible(true);
      btn_spinMusk_selected.setVisible(false);
    }
  };

  const musk_icon = scene.add
    .image(0, 0, "home_top_currency_chip_2")
    .setOrigin(0, 0);

  container_btn_musk.add(musk_icon);

  const text_musk_price = scene.add
    .text(
      339 * 0.8,
      18 + 36 / 2,
      musk_price.toLocaleString("en-US") + " = 1 Spin",
      {
        fontFamily: "RussoOne",
        fontSize: "36px",
        color: "#ffffff",
        align: "right",
      }
    )
    .setOrigin(1, 0.5);
  container_btn_musk.add(text_musk_price);

  SetSpinMode(true);
}

function CreateSpinButtons(scene) {
  const btn_spin = scene.add
    .image(348 + 384 / 2, 1702 + 105 / 2, "home_gacha_btn_spin")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("spin clicked");

      Spin(scene, 1);
    })
    .on("pointerover", function () {
      console.log("spin over");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("spin out");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_main.add(btn_spin);
}

function CreateSpinX10Buttons(scene) {
  const btn_spin = scene.add
    .image(37 + 313 / 2, 1567 + 105 / 2, "home_gacha_btn_spin_x10")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("spin clicked");

      Spin(scene, 10);
    })
    .on("pointerover", function () {
      console.log("spin over");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("spin out");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_main.add(btn_spin);
}

function CreateSpinX50Buttons(scene) {
  const btn_spin = scene.add
    .image(382 + 313 / 2, 1567 + 105 / 2, "home_gacha_btn_spin_x50")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("spin clicked");

      Spin(scene, 50);
    })
    .on("pointerover", function () {
      console.log("spin over");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("spin out");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_main.add(btn_spin);
}

function CreateSpinX100Buttons(scene) {
  const btn_spin = scene.add
    .image(729 + 313 / 2, 1567 + 105 / 2, "home_gacha_btn_spin_x100")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("spin clicked");

      Spin(scene, 100);
    })
    .on("pointerover", function () {
      console.log("spin over");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("spin out");

      scene.tweens.add({
        targets: btn_spin,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_main.add(btn_spin);
}

let reward_data = null;
function Spin(scene, spinRound) {
  if (spinNum > 0) {
    return;
  }

  if (spinNum === 0 && spinRound > 0) {
    spinNum = spinRound;

    if (isChipSpin == true && centerData.userInfo.Chip >= chip_price) {
      centerData.RequestSpin(
        spinNum,
        (result) => {
          reward_data = result.data.rewards;
          spinNum = reward_data.length;
          currentSpin = 0;

          DoSpin(scene, reward_data[currentSpin]);
        },
        (error) => {
          console.log("RequestSpin thất bại:", error);
        }
      );
    } else if (isChipSpin == false && centerData.userInfo.Musk >= musk_price) {
      centerData.RequestPremiumSpin(
        spinNum,
        (result) => {
          reward_data = result.data.rewards;
          spinNum = reward_data.length;
          currentSpin = 0;

          DoSpin(scene, reward_data[currentSpin]);
        },
        (error) => {
          console.log("RequestPremiumSpin thất bại:", error);
        }
      );
    }
  }
}

function DoSpin(scene, selectedItemId) {
  console.log("selectedItemId = " + selectedItemId);

  container_main.btn_close.setVisible(false);
  container_main.btn_close.disableInteractive();

  gachaIdleMove.remove();

  const items = [];

  for (let i = 0; i < 21; i++) {
    if (i != 19) {
      const randomNumber = Math.floor(Math.random() * arr_itemData.length);

      const newItem = {
        itemId: arr_itemData[randomNumber].itemId,
        amount: arr_itemData[randomNumber].amount,
      };

      items.push(newItem);
    } else {
      items.push(GetItemById(selectedItemId));
    }
  }

  CreateGachaList(scene, items);

  let scrollValPerItem = 1 / items.length;

  let selectedIndex = items.length - 1;

  let scrollToValue =
    scrollValPerItem * 0.625 + scrollValPerItem * selectedIndex;

  scrollToTarget(scene, scrollToValue, 3000);

  scene.time.delayedCall(3000, () => {
    let selectedCell = getCellContainer(container_gacha_list.gridTable);

    selectedCell.containerCard.setSelected();

    scene.tweens.add({
      targets: selected_light,
      scaleY: 1.1, // Giá trị scale mục tiêu cho chiều dọc
      duration: 1000, // Thời gian tween là 1 giây (1000 ms)
      ease: "Linear", // Dễ dàng chuyển động tuyến tính
    });

    scene.tweens.add({
      targets: selected_light, // Đối tượng mà bạn muốn tween
      alpha: 0.5, // Giá trị alpha đích
      duration: 1000, // Thời gian tween (ms)
      ease: "Linear", // Phương thức easing (có thể thay đổi nếu muốn hiệu ứng mượt mà hơn)
    });
  });

  if (active_btn_close_delay) {
    active_btn_close_delay.remove();
  }

  active_btn_close_delay = scene.time.delayedCall(5000, () => {
    container_main.btn_close.setVisible(true);
    container_main.btn_close.setInteractive();

    currentSpin++;

    if (currentSpin >= reward_data.length) {
      CreateRewardPopup(scene);
    } else {
      DoSpin(scene, reward_data[currentSpin]);
    }
  });
}

function Destroy(scene) {
  if (gachaIdleMove) {
    gachaIdleMove.remove();
  }

  if (currency_event_listener) {
    centerData.RemovePlayerInfoChange(currency_event_listener);
    currency_event_listener = null; // Đảm bảo sự kiện không kích hoạt nữa
  }

  if (container_main) container_main.destroy();
  if (currency_container) currency_container.destroy();
  if (curency_1_container) curency_1_container.destroy();
  if (curency_2_container) curency_2_container.destroy();

  container_main = null;
  currency_container = null;
  curency_1_container = null;
  curency_2_container = null;
}

//kết thúc tạo top bar bg

//tạo player currency
let currency_container = null;

let btn_currency_chip_1 = null;
let curency_1_container = null;

let btn_currency_chip_2 = null;
let curency_2_container = null;

let currency_event_listener = null;

function CreateCurrencyBar(scene) {
  // currency_container
  currency_container = scene.add.container(0, 0);
  currency_container.setDepth(400);

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

  let btnBg = scene.add.image(0, 0, btnImg).setOrigin(0, 0.5);

  let button = scene.rexUI.add.label({
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
  });

  container.add(button);
  container.setPos;

  return button;
}
//kết thúc tạo player currency

//Tạo quay gacha

let container_gacha_list = null;

function CreateGachaList(scene, arrItemData) {
  selected_light.setScale(1, 0);
  selected_light.setAlpha(0);

  if (container_gacha_list) {
    container_gacha_list.destroy();
  }

  container_gacha_list = scene.add.container(0, 0);
  container_0.add(container_gacha_list);

  // Tạo bảng gridTable và gán các item vào

  const posX = 540;

  const posY = 495 + 885 / 2;

  const scrollViewWidth = 1080;

  const scrollViewHeight = 885 + 200;

  const space = 70;

  // const scrollBG = scene.rexUI.add.roundRectangle(
  //   posX,
  //   posY,
  //   scrollViewWidth,
  //   scrollViewHeight,
  //   0,
  //   0x000000
  // );
  // container_gacha_list.add(scrollBG);

  const gridTable = scene.rexUI.add
    .gridTable({
      x: posX,
      y: posY,
      width: scrollViewWidth,
      height: scrollViewHeight,
      scrollMode: 1,

      table: {
        cellWidth: 420 + space,
        cellHeight: 885,
        columns: arrItemData.length,
        rows: 1,
        //reuseCellContainer: true, // Kích hoạt tái sử dụng cell container
      },

      scroller: false,
      slider: false,

      items: arrItemData, // Gán danh sách item vào gridTable

      createCellContainerCallback: (cell, cellContainer) => {
        var scene = cell.scene,
          width = cell.width,
          height = cell.height,
          item = cell.item,
          index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: 420,
            height: 885,
            orientation: 0,
          });
        } else {
          console.log(cell.index + ": reuse cell-container");
        }

        // Tạo và thêm `card_Item` vào `cellContainer`
        const card = card_Item(scene, index, item);
        cellContainer.add(card); // Thêm card vào cellContainer

        // Lưu `container_card` vào cellContainer để truy xuất sau
        cellContainer.containerCard = card;

        return cellContainer;
      },
    })
    .setDepth(0)
    .layout();

  container_gacha_list.gridTable = gridTable;
  container_gacha_list.add(gridTable);

  // const maskShape = scene.add
  //   .rectangle(
  //     posX,
  //     463 + 1457 / 2 + 36 * 3,
  //     scrollViewWidth,
  //     scrollViewHeight,
  //     0x000000
  //   )
  //   .setVisible(false);

  // const mask = new Phaser.Display.Masks.GeometryMask(scene, maskShape);
  // gridTable.setMask(mask);
}

function getCellContainer(gridTable) {
  const itemCount = gridTable.items.length;

  let activeCells = [];

  for (let i = 0; i < itemCount; i++) {
    const cellContainer = gridTable.getCellContainer(i);
    if (cellContainer) {
      activeCells.push(cellContainer);

      console.log(`CellContainer at index ${i}:`, cellContainer);
    } else {
      console.warn(`No CellContainer found at index ${i}`);
    }
  }

  if (activeCells.length > 0) {
    return activeCells[Math.floor(activeCells.length / 2)];
  }

  return null;
}

let gachaIdleMove = null;
function GachaListIdleMove(scene) {
  let startTime = scene.time.now;

  let duration = 120000;

  let tweenValue = 0;

  // Tạo sự kiện và lưu tham chiếu vào biến
  gachaIdleMove = scene.time.addEvent({
    delay: 16, // Cập nhật mỗi 16 ms (khoảng 60 FPS)
    loop: true,
    callback: () => {
      const elapsed = scene.time.now - startTime;
      tweenValue = Phaser.Math.Clamp(elapsed / duration, 0, 1);

      if (tweenValue >= 1) {
        tweenValue = 0;
        startTime = scene.time.now;
      }

      container_gacha_list.gridTable.setT(tweenValue);
    },
  });

  // // Khi muốn hủy sự kiện, chỉ cần gọi remove:
  // gachaIdleMove.remove();
}

// Cuộn đến giá trị t = 0.75 trong 3 giây với tốc độ giảm dần
function scrollToTarget(scene, targetT, duration) {
  container_gacha_list.gridTable.setT(0);

  const startT = container_gacha_list.gridTable.t;
  const distance = targetT - startT;
  const startTime = scene.time.now;

  // Hàm easing cho chuyển động chậm dần (ease out)
  function easeOutQuad(t) {
    return t * (2 - t);
  }

  const scrollEvent = scene.time.addEvent({
    delay: 16,
    callback: () => {
      const elapsedTime = scene.time.now - startTime;
      const normalizedTime = Phaser.Math.Clamp(elapsedTime / duration, 0, 1);

      // Áp dụng easing để cuộn chậm dần
      const easedProgress = easeOutQuad(normalizedTime);
      const currentT = startT + distance * easedProgress;

      container_gacha_list.gridTable.setT(currentT);

      // Dừng khi hoàn tất
      if (normalizedTime >= 1) {
        scrollEvent.remove();
      }
    },
    loop: true,
  });
}

function card_Item(scene, i, item) {
  //console.log("Item = ", item.itemId);

  const container_card = scene.add.container(0, 0);

  const container_tween = scene.add.container(
    70 + 420 / 2,
    (885 + 200) / 2 - 885 / 2
  );
  container_card.add(container_tween);

  const container_true = scene.add.container(-420 / 2, -(885 + 200) / 2 + 100);
  container_tween.add(container_true);

  // const tweenOrigin = scene.rexUI.add
  //   .roundRectangle(0, 0, 10, 10, 0, 0xff0000)
  //   .setOrigin(0.5, 0.5);

  // container_tween.add(tweenOrigin);

  // const item_bg = scene.rexUI.add
  //   .roundRectangle(0, 0, 420, 885, 0, 0xffffff)
  //   .setOrigin(0, 0);

  // container_true.add(item_bg);

  // const trueOrigin = scene.rexUI.add
  //   .roundRectangle(0, 0, 10, 10, 0, 0x007fff)
  //   .setOrigin(0.5, 0.5);

  // container_true.add(trueOrigin);

  //console.log("gacha item ", item);

  const item_icon = scene.add
    .image(420 / 2, 885 / 2, GetItemImgKeyById(item.itemId))
    .setOrigin(0.5, 0.5);
  container_true.add(item_icon);

  const item_overlay = scene.add
    .image(0, 0, "home_gacha_item_bg_overlay")
    .setOrigin(0, 0);
  container_true.add(item_overlay);

  let textAmount = "";

  if (item.amount > 0) {
    textAmount = "x" + item.amount.toLocaleString("en-US");
  }

  const text_amount = scene.add
    .text(420 / 2, 790, textAmount, {
      fontFamily: "RussoOne",
      fontSize: "50px",
      color: "#ffffff",
      align: "center",
    })
    .setOrigin(0.5);
  container_true.add(text_amount);

  container_card.setSelected = function () {
    scene.tweens.add({
      targets: container_tween,
      scaleX: 1.1, // Giá trị scale mục tiêu cho chiều ngang
      scaleY: 1.1, // Giá trị scale mục tiêu cho chiều dọc
      duration: 1000, // Thời gian tween là 1 giây (1000 ms)
      ease: "Linear", // Dễ dàng chuyển động tuyến tính
    });
  };

  return container_card;
}

let container_gacha_reward = null;

function CreateRewardPopup(scene) {
  container_gacha_reward = scene.add.container(0, 0);
  container_gacha_reward.setDepth(500);

  const lock_bg = scene.rexUI.add
    .roundRectangle(0, 0, originWidth, originHeight, 0, 0x000000, 0.75)
    .setInteractive()
    .setOrigin(0);
  container_gacha_reward.add(lock_bg);

  const items = [];

  for (let i = 0; i < reward_data.length; i++) {
    const rewardItem = GetItemById(reward_data[i]);

    const newItem = {
      itemId: rewardItem.itemId,
      amount: rewardItem.amount,
    };

    items.push(newItem);
  }

  CreateGachaRewardList(scene, items);
}

let container_gacha_reward_list = null;

function CreateGachaRewardList(scene, arrItemData) {
  const item_bg = scene.add.image(540, 960, "home_gacha_reward_list_bg");
  container_gacha_reward.add(item_bg);

  container_gacha_reward_list = scene.add.container(0, 0);
  container_gacha_reward.add(container_gacha_reward_list);

  // Tạo bảng gridTable và gán các item vào

  const posX = 540 + 872 / 8 + 24 / 2;

  const posY = 960;

  const scrollViewWidth = 872;

  const scrollViewHeight = 892;

  const spaceWidth = 24 / 2;

  const spaceHeight = 24 / 2;

  // const scrollBG = scene.add.rectangle(
  //   540,
  //   posY,
  //   scrollViewWidth,
  //   scrollViewHeight,
  //   0xffffff
  // );

  // container_gacha_reward_list.add(scrollBG);

  const gridTable = scene.rexUI.add
    .gridTable({
      x: posX,
      y: posY,
      width: scrollViewWidth,
      height: scrollViewHeight,
      scrollMode: 0,

      mouseWheelScroller: {
        focus: false,
        speed: 1,
      },

      table: {
        cellWidth: 200 + spaceWidth,
        cellHeight: 200 + spaceHeight,
        columns: 4,
        //reuseCellContainer: true, // Kích hoạt tái sử dụng cell container
      },

      items: arrItemData, // Gán danh sách item vào gridTable

      createCellContainerCallback: (cell, cellContainer) => {
        var scene = cell.scene,
          width = cell.width,
          height = cell.height,
          item = cell.item,
          index = cell.index;
        if (cellContainer === null) {
          cellContainer = scene.rexUI.add.label({
            width: 200 + spaceWidth,
            height: 200 + spaceHeight,
            orientation: 0,
          });
        } else {
          console.log(cell.index + ": reuse cell-container");
        }

        // Tạo và thêm `card_Item` vào `cellContainer`
        const card = reward_card_Item(scene, index, item);
        cellContainer.add(card); // Thêm card vào cellContainer

        // Lưu `container_card` vào cellContainer để truy xuất sau
        cellContainer.containerCard = card;

        return cellContainer;
      },
    })
    .setDepth(0)
    .layout();

  container_gacha_reward_list.gridTable = gridTable;
  container_gacha_reward_list.add(gridTable);

  const maskShape = scene.add
    .rectangle(540, 960 - 54 - 24 / 2, 872, 748, 0x000000)
    .setVisible(false);

  const mask = new Phaser.Display.Masks.GeometryMask(scene, maskShape);
  gridTable.setMask(mask);

  //create claim btn
  const btn_claim = scene.add
    .image(
      540,
      960 + (1000 / 2 - 92 / 2) - 54,
      "home_gacha_reward_list_btn_claim"
    )
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_close clicked");

      DestroyRewardPopup();
    })
    .on("pointerover", function () {
      console.log("btn_close over");

      scene.tweens.add({
        targets: btn_claim,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("btn_close out");

      scene.tweens.add({
        targets: btn_claim,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_gacha_reward.add(btn_claim);
  container_gacha_reward.btn_claim = btn_claim;
}

function reward_card_Item(scene, i, item) {
  //console.log("Item = ", item.itemId);

  const container_card = scene.add.container(0, 0);

  // const scrollBG = scene.add.rectangle(0, 0, 200, 200, 0x000000);

  // container_card.add(scrollBG);

  const item_bg = scene.add.image(0, 0, "home_gacha_reward_list_item_bg");
  container_card.add(item_bg);

  const item_icon = scene.add
    .image(0, 0, GetItemImgKeyById(item.itemId))
    .setOrigin(0.5, 0.5)
    .setScale(0.25);
  container_card.add(item_icon);

  let textAmount = "";

  if (item.amount > 0) {
    textAmount = "x" + item.amount.toLocaleString("en-US");
  }

  const text_amount = scene.add
    .text(200 / 2 - 10, 200 / 2 - 10, textAmount, {
      fontFamily: "RussoOne",
      fontSize: "24px",
      color: "#ffffff",
      align: "right",
    })
    .setOrigin(1, 1);
  container_card.add(text_amount);

  const origin = scene.add.rectangle(0, 0, 10, 10, 0x00ff00);

  container_card.add(origin);

  return container_card;
}

function DestroyRewardPopup() {
  spinNum = 0;
  currentSpin = 0;

  reward_data = null;

  container_gacha_reward.destroy();
}
