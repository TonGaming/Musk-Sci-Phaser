import { openLink } from "@telegram-apps/sdk";
import { openTelegramLink } from "@telegram-apps/sdk";

import centerData from "../../Data/CenterData";

let container_main = null;

let container_popup = null;
const container_popup_openPosition = { x: 0, y: 0 };
const container_popup_closePosition = { x: 0, y: 4000 };

let container_mission = null;
let missionItems = null;

let container_task = null;

//buttons
let btn_arrow = null;
const btn_arrow_missionPosition = { x: 109 + 421 / 2, y: 456 };
const btn_arrow_taskPosition = { x: 550 + 421 / 2, y: 456 };

let btn_mission = null;
let btn_task = null;
let btn_mission_selected = null;
let btn_task_selected = null;

export function CreateQuest(scene) {
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
    .image(originWidth / 2, 402, "home_quest_popup_bg")
    .setOrigin(0.5, 0);

  container_popup.add(popup_bg);

  const popup_character_img = scene.add
    .image(428, 114, "home_quest_character")
    .setOrigin(0, 0);

  container_popup.add(popup_character_img);

  const popup_bg_front = scene.add
    .image(originWidth / 2, 542, "home_quest_popup_bg_1")
    .setOrigin(0.5, 0);

  container_popup.add(popup_bg_front);

  //Create Mission and task buttons

  btn_arrow = scene.add.image(540, 456, "home_quest_arrow").setOrigin(0.5, 1);
  container_popup.add(btn_arrow);

  btn_mission = scene.add
    .image(109 + 421 / 2, 482 + 60, "home_quest_mission_btn")
    .setOrigin(0.5, 1)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      ActivePopup(scene, true);
    });

  container_popup.add(btn_mission);

  btn_task = scene.add
    .image(550 + 421 / 2, 482 + 60, "home_quest_task_btn")
    .setOrigin(0.5, 1)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      ActivePopup(scene, false);
    });

  container_popup.add(btn_task);

  btn_mission_selected = scene.add
    .image(109 + 421 / 2, 482 + 60, "home_quest_mission_selected")
    .setOrigin(0.5, 1);
  btn_mission.setInteractive({ useHandCursor: true });

  container_popup.add(btn_mission_selected);

  btn_task_selected = scene.add
    .image(550 + 421 / 2, 482 + 60, "home_quest_task_selected")
    .setOrigin(0.5, 1);
  btn_task.setInteractive({ useHandCursor: true });

  container_popup.add(btn_task_selected);

  //create close btn
  const btn_close = scene.add
    .image(956 + 86 / 2, 240 + 86 / 2, "share_btn_close")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_close clicked");

      CloseQuest(scene);
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

  ActivePopup(scene, true);

  OpenQuest(scene);
}

function ActivePopup(scene, isMission) {
  if (isMission) {
    if (container_mission) {
      container_mission.setVisible(true);
    } else {
      centerData.RequestQuestInfo(
        (result) => {
          CreateList(scene, result.data);
        },
        (error) => {
          console.log("lấy quest thất bại:", error);
          // Thực hiện các hành động khi đăng nhập thất bại
        }
      );
    }

    if (container_task) {
      container_task.setVisible(false);
    }

    btn_arrow.setPosition(btn_arrow_taskPosition.x, btn_arrow_taskPosition.y);

    scene.tweens.add({
      targets: btn_arrow,
      x: btn_arrow_missionPosition.x,
      y: btn_arrow_missionPosition.y, // Vị trí kết thúc
      duration: 500, // Thời gian tween
      ease: "Power2", // Kiểu easing
      onComplete: () => {},
    });

    btn_mission.setAlpha(1).setScale(1, 1);
    scene.tweens.add({
      targets: btn_mission, // Đối tượng mà tween sẽ áp dụng
      alpha: 0, // Giá trị alpha kết thúc
      scaleY: 0, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });

    btn_mission_selected.setAlpha(0).setScale(1, 0);
    scene.tweens.add({
      targets: btn_mission_selected, // Đối tượng mà tween sẽ áp dụng
      alpha: 1, // Giá trị alpha kết thúc
      scaleY: 1, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });

    btn_task.setAlpha(0).setScale(1, 0);
    scene.tweens.add({
      targets: btn_task, // Đối tượng mà tween sẽ áp dụng
      alpha: 1, // Giá trị alpha kết thúc
      scaleY: 1, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });

    btn_task_selected.setAlpha(1).setScale(1, 1);
    scene.tweens.add({
      targets: btn_task_selected, // Đối tượng mà tween sẽ áp dụng
      alpha: 0, // Giá trị alpha kết thúc
      scaleY: 0, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });
  } else {
    if (container_task) {
      container_task.setVisible(true);
    } else {
    }

    if (container_mission) {
      container_mission.setVisible(false);
    }

    btn_arrow.setPosition(
      btn_arrow_missionPosition.x,
      btn_arrow_missionPosition.y
    );

    scene.tweens.add({
      targets: btn_arrow,
      x: btn_arrow_taskPosition.x,
      y: btn_arrow_taskPosition.y, // Vị trí kết thúc
      duration: 500, // Thời gian tween
      ease: "Power2", // Kiểu easing
      onComplete: () => {},
    });

    btn_mission.setAlpha(0).setScale(1, 0);
    scene.tweens.add({
      targets: btn_mission, // Đối tượng mà tween sẽ áp dụng
      alpha: 1, // Giá trị alpha kết thúc
      scaleY: 1, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });

    btn_mission_selected.setAlpha(1).setScale(1, 1);
    scene.tweens.add({
      targets: btn_mission_selected, // Đối tượng mà tween sẽ áp dụng
      alpha: 0, // Giá trị alpha kết thúc
      scaleY: 0, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });

    btn_task.setAlpha(1).setScale(1, 1);
    scene.tweens.add({
      targets: btn_task, // Đối tượng mà tween sẽ áp dụng
      alpha: 0, // Giá trị alpha kết thúc
      scaleY: 0, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });

    btn_task_selected.setAlpha(0).setScale(1, 0);
    scene.tweens.add({
      targets: btn_task_selected, // Đối tượng mà tween sẽ áp dụng
      alpha: 1, // Giá trị alpha kết thúc
      scaleY: 1, // Giá trị scaleY kết thúc
      duration: 500, // Thời gian chuyển đổi (ms)
      ease: "Power2", // Hiệu ứng easing
      onComplete: () => {},
    });
  }
}

function CreateList(scene, arr_data) {
  if (container_mission) {
    container_mission.destroy();
  }

  //Create friend list
  container_mission = scene.add.container(0, 0);
  container_popup.add(container_mission);

  if (!arr_data || arr_data.length <= 0) {
    return;
  }

  // Kích thước của ScrollView
  const scrollViewWidth = 863;
  const scrollViewHeight = 1007;

  const columns = 1;
  const rows = Math.ceil(arr_data.length / columns);

  const itemWidth = 863;
  const itemHeight = 239;
  const itemSpacing = 17;

  const posX = 108 + 863 / 2;
  const posY = 642 + 1007 / 2;

  // const background = scene.add
  //   .rectangle(posX, posY, scrollViewWidth, scrollViewHeight, 0x000000)
  //   .setAlpha(0.8);

  // container_mission.add(background);

  // Tạo một Scrollable Panel (bảng cuộn)
  const scrollablePanel = scene.rexUI.add
    .scrollablePanel({
      x: posX,
      y: posY,
      width: scrollViewWidth,
      height: scrollViewHeight,
      scrollMode: 0,
      panel: {
        child: scene.rexUI.add.gridSizer({
          width: scrollViewWidth,
          height: scrollViewHeight,
          column: columns,
          row: rows,
          columnProportions: 0,
          rowProportions: 0,
          space: {
            column: itemSpacing,
            row: itemSpacing,
          },
        }),
        mask: {
          padding: 1,
        },
      },
      mouseWheelScroller: {
        focus: false,
        speed: 0.2,
      },
      space: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    })
    .layout();

  container_mission.add(scrollablePanel);

  for (let i = 0; i < arr_data.length; i++) {
    const item = scene.add.container(0, 0);
    item.setSize(itemWidth, itemHeight);

    item.quest = arr_data[i];

    // const item_bg = scene.rexUI.add.roundRectangle(
    //   0,
    //   0,
    //   itemWidth,
    //   itemHeight,
    //   0,
    //   0xffffff
    // );
    // item_bg.setOrigin(0.5, 0.5);
    // item.add(item_bg);

    let bg = scene.add.image(0, 0, "home_quest_element_bg").setOrigin(0.5, 0.5);
    item.add(bg);

    const text_title = scene.add
      .text(41 - itemWidth / 2, 11 + 60 / 2 - itemHeight / 2 - 36 / 2, "None", {
        fontFamily: "RussoOne",
        fontSize: "24px",
        color: "#000000",
        align: "left",
        wordWrap: { width: 464, useAdvancedWrap: true },
      })
      .setOrigin(0, 0);
    item.add(text_title);

    if (item.quest.title) {
      text_title.setText(item.quest.title);
    } else {
      text_title.setText(item.quest.code.replaceAll("_", " "));
    }

    const text_content = scene.add
      .text(41 - itemWidth / 2, 61 + 60 / 2 - itemHeight / 2 - 16 / 2, "None", {
        fontFamily: "RussoOne",
        fontSize: "16px",
        color: "#425B61",
        align: "left",
      })
      .setOrigin(0, 0);
    item.add(text_content);

    //Create go btn
    const btn_go = CreateButtonGo(
      scene,
      574 - itemWidth / 2 + 266 / 2,
      -10,
      item
    );

    item.add(btn_go);
    item.btn_go = btn_go;

    //Create share btn
    const btn_claim = CreateButtonClaim(
      scene,
      574 - itemWidth / 2 + 266 / 2,
      10,
      item
    );

    item.add(btn_claim);
    item.btn_claim = btn_claim;

    const reward_0 = scene.add
      .image(-94 / 2 - 728 + itemWidth / 2, 10 + 94 / 2, "home_quest_item_bg")
      .setOrigin(0.5, 0.5);
    item.add(reward_0);

    const reward_0_chip = scene.add
      .image(
        -94 / 2 - 728 + itemWidth / 2,
        10 + 94 / 2,
        "home_top_currency_chip_1"
      )
      .setOrigin(0.5, 0.5);
    item.add(reward_0_chip);

    let reward_0_text = scene.add
      .text(-728 + itemWidth / 2, 10 + 94, "x" + item.quest.chip, {
        fontFamily: "RussoOne",
        fontSize: "24px",
        color: "#ffffff",
        align: "right",
      })
      .setOrigin(1, 1);
    item.add(reward_0_text);

    const reward_1 = scene.add
      .image(-94 / 2 - 624 + itemWidth / 2, 10 + 94 / 2, "home_quest_item_bg")
      .setOrigin(0.5, 0.5);
    item.add(reward_1);

    const reward_1_chip = scene.add
      .image(
        -94 / 2 - 624 + itemWidth / 2,
        10 + 94 / 2,
        "home_top_currency_chip_2"
      )
      .setOrigin(0.5, 0.5);
    item.add(reward_1_chip);

    let reward_1_text = scene.add
      .text(-624 + itemWidth / 2, 10 + 94, "x" + item.quest.musk, {
        fontFamily: "RussoOne",
        fontSize: "24px",
        color: "#ffffff",
        align: "right",
      })
      .setOrigin(1, 1);
    item.add(reward_1_text);

    item.setQuestInProcess = function () {
      item.btn_go.setVisible(true);
      item.btn_claim.setVisible(false);
    };

    // Thêm một function vào container
    item.setQuestClaim = function () {
      item.btn_go.setVisible(false);
      item.btn_claim.setVisible(true);
    };

    // Thêm một function vào container
    item.setQuestDone = function () {
      item.btn_go.setVisible(false);
      item.btn_claim.setVisible(false);
    };

    if (item.quest.status === 0) {
      item.setQuestInProcess();
    } else {
      item.setQuestDone();
    }

    scrollablePanel.getElement("panel").add(item, {
      align: "top-left",
      expand: false,
    });
  }

  scrollablePanel.layout();

  const maskShape = scene.add
    .rectangle(posX, posY, scrollViewWidth, scrollViewHeight, 0x000000)
    .setVisible(false);

  const mask = new Phaser.Display.Masks.GeometryMask(scene, maskShape);
  scrollablePanel.setMask(mask);

  //create footer bg
  const footer_bg = scene.add
    .image(originWidth / 2, originHeight, "home_invite_friends_footer_bg")
    .setOrigin(0.5, 1);

  container_mission.add(footer_bg);
}

function CreateButtonGo(scene, x, y, item) {
  const btn = scene.add
    .image(x, y, "home_quest_go_btn")
    .setOrigin(0.5, 1)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_go clicked");

      if (item.quest.code === "INVITE") {
        console.log("inviteUrl = ", centerData.GetInviteUrl());

        openTelegramLink(centerData.GetInviteUrl());
      } else {
        if (item.quest.payload.indexOf("t.me") !== -1) {
          openTelegramLink(item.quest.payload);
        } else {
          // Gọi hàm openLink với url và các tùy chọn (tuỳ chọn này là không bắt buộc)
          openLink(item.quest.payload, {
            try_instant_view: true, // Mở bằng Telegram Instant View nếu có
            disable_web_page_preview: true, // Tắt xem trước trang web
          });
        }
      }

      scene.time.delayedCall(5000, () => {
        if (item.quest.code != "INVITE") {
          item.setQuestClaim();
        }
      });

      // Tạo hiệu ứng phóng to 20% khi click
      scene.tweens.add({
        targets: btn,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        yoyo: true, // Tự động thu nhỏ lại sau khi phóng to
        ease: "Power2",
      });
    })
    .on("pointerover", function () {
      console.log("btn over");

      scene.tweens.add({
        targets: btn,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("btn out");

      scene.tweens.add({
        targets: btn,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  return btn;
}

function CreateButtonClaim(scene, x, y, item) {
  const btn = scene.add
    .image(x, y, "home_quest_claim_btn")
    .setOrigin(0.5, 0)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_claim clicked");

      centerData.RequestMarkQuestDone(
        item.quest.code,
        (result) => {
          centerData.RequestUserInfo();

          item.setQuestDone();
        },
        (error) => {
          console.log("RequestMarkQuestDone thất bại:", error);
        }
      );

      // Tạo hiệu ứng phóng to 20% khi click
      scene.tweens.add({
        targets: btn,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        yoyo: true, // Tự động thu nhỏ lại sau khi phóng to
        ease: "Power2",
      });
    })
    .on("pointerover", function () {
      console.log("btn_claim over");

      scene.tweens.add({
        targets: btn,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("btn_claim out");

      scene.tweens.add({
        targets: btn,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  return btn;
}

function OpenQuest(scene) {
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

function CloseQuest(scene) {
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

  container_mission = null;

  container_task = null;
}

function createResizableText(
  scene,
  x,
  y,
  initialContent,
  targetWidth,
  targetHeight,
  initialFontSize,
  color,
  align
) {
  let fontSize = initialFontSize;

  // Tạo văn bản ban đầu
  let text = scene.add.text(x, y, initialContent, {
    fontSize: `${fontSize}px`,
    color: color,
    align: align,
    wordWrap: { width: targetWidth, useAdvancedWrap: true },
  });

  // Hàm điều chỉnh kích thước văn bản dựa trên nội dung mới
  function adjustFontSize(content) {
    fontSize = initialFontSize;
    text.setText(content);
    let bounds = text.getTextBounds().global;

    // Giảm fontSize nếu văn bản vượt quá kích thước cho phép
    while (
      (bounds.width > targetWidth || bounds.height > targetHeight) &&
      fontSize > 1
    ) {
      fontSize -= 1;
      text.setFontSize(fontSize);
      bounds = text.getTextBounds().global;
    }

    // Căn giữa văn bản sau khi điều chỉnh font size
    text.setX(x + (targetWidth - bounds.width) / 2);
    text.setY(y + (targetHeight - bounds.height) / 2);
  }

  // Điều chỉnh kích thước ban đầu
  adjustFontSize(initialContent);

  // Thêm phương thức để cập nhật nội dung
  text.updateContent = function (newContent) {
    adjustFontSize(newContent);
  };

  return text;
}

function CreateTextInput(scene) {
  //Mẫu inputfield
  {
    const text = scene.add.text(400, 300, "Hello World", {
      fixedWidth: 150,
      fixedHeight: 36,
    });
    text.setOrigin(0.5, 0.5);

    text.setInteractive().on("pointerdown", () => {
      scene.rexUI.edit(text);
    });
  }

  //mẫu chỉ số
  {
    const text = scene.add.text(400, 300, "0", {
      fixedWidth: 150,
      fixedHeight: 36,
    });
    text.setOrigin(0.5, 0.5);

    // Thiết lập tương tác cho text
    text.setInteractive().on("pointerdown", () => {
      scene.rexUI.edit(text, {
        // Chỉ cho phép nhập số bằng cách sử dụng bộ lọc kiểu số
        inputType: "number",
        onTextChanged: (inputText) => {
          // Giới hạn input chỉ nhận số nguyên hoặc số thực
          const filteredText = inputText.replace(/[^0-9.]/g, "");
          inputText.setText(filteredText);
        },
      });
    });
  }

  //Mẫu gồm chữ và số
  {
    const text = scene.add.text(400, 300, "Type here...", {
      fixedWidth: 150,
      fixedHeight: 36,
    });
    text.setOrigin(0.5, 0.5);

    // Thiết lập tương tác cho text
    text.setInteractive().on("pointerdown", () => {
      scene.rexUI.edit(text, {
        // Cho phép nhập số và chữ
        inputType: "text",
        // Tùy chỉnh sự kiện khi nhập xong
        onClose: (inputText) => {
          console.log("Text input finished:", inputText.text);
          // Thực hiện hành động sau khi người dùng nhập xong, ví dụ:
          // Kiểm tra nội dung nhập vào
          if (inputText.text.trim() === "") {
            text.setText("Type here...");
          } else {
            text.setText(inputText.text);
          }
        },
      });
    });
  }
}
