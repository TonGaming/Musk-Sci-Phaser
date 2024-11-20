let btn_Container = null;
const openPosition = { x: originWidth, y: originHeight };
const closePosition = { x: 1332, y: originHeight };

let btn_skill_1 = null;
let btn_skill_2 = null;
let btn_skill_3 = null;
let btn_skill_4 = null;

export function CreateSkillButtons(scene) {
  btn_Container = scene.add.container(openPosition.x, openPosition.y); // Tọa độ của container

  btn_skill_1 = CreateButton(
    scene,
    btn_Container,
    "gameplay_skill_buttons_1",
    -119,
    -1020
  );
  btn_skill_2 = CreateButton(
    scene,
    btn_Container,
    "gameplay_skill_buttons_2",
    -119,
    -813
  );
  btn_skill_3 = CreateButton(
    scene,
    btn_Container,
    "gameplay_skill_buttons_3",
    -119,
    -606
  );
  btn_skill_4 = CreateButton(
    scene,
    btn_Container,
    "gameplay_skill_buttons_4",
    -119,
    -400
  );
}

export function OpenSkillButtons(scene) {
  scene.tweens.add({
    targets: btn_Container,
    x: openPosition.x,
    y: openPosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

export function HideSkillButtons(scene) {
  scene.tweens.add({
    targets: btn_Container,
    x: closePosition.x,
    y: closePosition.y, // Vị trí kết thúc
    duration: 500, // Thời gian tween
    ease: "Power2", // Kiểu easing
    onComplete: () => {},
  });
}

function CreateButton(scene, container, btnImg, posX, posY) {
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
    .layout()
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("Button clicked");
    })
    .on("pointerover", function () {
      console.log("Button over");

      button.getElement("background").setTint(0x646464);
    })
    .on("pointerout", function () {
      console.log("Button out");

      button.getElement("background").clearTint();
    });

  container.add(button);
  container.setPos;

  return button;
}
