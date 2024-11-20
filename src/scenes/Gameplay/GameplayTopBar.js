let container_main = null;

let container_health_bar = null;

export function CreateTopBar(scene) {
  // Tạo một container
  container_main = scene.add.container(0, 0).setDepth(100); // Tọa độ của container

  let bg = scene.add.image(540, 0, "gameplay_top_bar_bg").setOrigin(0.5, 0);
  container_main.add(bg);

  const btn_home = scene.add
    .image(62, 94 - 48 / 2, "gameplay_top_bar_btn_home")
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("btn_home clicked");

      scene.scene.start("Home");
    })
    .on("pointerover", function () {
      console.log("btn_home over");

      scene.tweens.add({
        targets: btn_home,
        scaleX: 1.2, // Phóng to 20% theo chiều ngang
        scaleY: 1.2, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    })
    .on("pointerout", function () {
      console.log("btn_home out");

      scene.tweens.add({
        targets: btn_home,
        scaleX: 1, // Phóng to 20% theo chiều ngang
        scaleY: 1, // Phóng to 20% theo chiều dọc
        duration: 100, // Thời gian hiệu ứng (ms)
        ease: "Power2",
      });
    });

  container_main.add(btn_home);

  CreateHealthBar(scene);

  ActiveHealthBar(false);

  CreateTimer(scene);
}

function CreateTimer(scene) {
  const text_timer = scene.add
    .text(1042, 87, "00:00", {
      fontFamily: "RussoOne",
      fontSize: "32px",
      color: "#ffffff",
      align: "right",
    })
    .setOrigin(1, 0.5);

  container_main.add(text_timer);

  // Cập nhật thời gian thực mỗi giây trực tiếp trong this.time.addEvent
  scene.time.addEvent({
    delay: 1000, // 1000 ms = 1 giây
    callback: () => {
      // Lấy thời gian hiện tại và cập nhật nhãn
      text_timer.setText(getCurrentTime());
    },
    loop: true,
  });
}

function getCurrentTime() {
  // Lấy thời gian hiện tại
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export function CreateHealthBar(scene) {
  container_health_bar = scene.add.container(0, 0);

  container_main.add(container_health_bar);

  let health_bar_0 = scene.add
    .image(236, 85, "gameplay_top_bar_health_bar_0")
    .setOrigin(0, 0.5);
  container_health_bar.add(health_bar_0);

  let health_bar_1 = scene.add
    .image(236, 85, "gameplay_top_bar_health_bar_1")
    .setOrigin(0, 0.5);
  container_health_bar.add(health_bar_1);
  container_health_bar.health_bar_1 = health_bar_1;

  let health_bar_2 = scene.add
    .image(236, 85, "gameplay_top_bar_health_bar_2")
    .setOrigin(0, 0.5);
  container_health_bar.add(health_bar_2);
  container_health_bar.health_bar_2 = health_bar_2;

  let health_bar_3 = scene.add
    .image(236, 85, "gameplay_top_bar_health_bar_3")
    .setOrigin(0, 0.5);
  container_health_bar.add(health_bar_3);

  const maskImage = scene.add
    .image(236, 85, "gameplay_top_bar_health_bar_0")
    .setOrigin(0, 0.5);

  // Tạo Bitmap Mask từ hình ảnh
  const mask = maskImage.createBitmapMask();

  // Gắn mask cho sprite
  health_bar_0.setMask(mask);
  health_bar_1.setMask(mask);
  health_bar_2.setMask(mask);

  // Ẩn hình ảnh mask nếu không muốn hiển thị nó
  maskImage.setVisible(false);

  UpdateHealthBar(scene, 1, 1);
}

export function ActiveHealthBar(boolVal) {
  container_health_bar.setVisible(boolVal);
}

export function IsHealthBarActive() {
  return container_health_bar.visible;
}

export function UpdateHealthBar(scene, maxHealth, currentHealth) {
  let toNormalize = currentHealth / maxHealth;

  let toX =
    236 - container_health_bar.health_bar_1.displayWidth * (1 - toNormalize);

  if (container_health_bar.health_bar_1_tween) {
    container_health_bar.health_bar_1_tween.stop();

    container_health_bar.health_bar_1_tween.remove();
  }

  // console.log("toNormalize", toNormalize);

  // console.log(
  //   "container_health_bar.health_bar_1.displayWidth",
  //   container_health_bar.health_bar_1.displayWidth
  // );

  // console.log(
  //   "container_health_bar.health_bar_1.x",
  //   container_health_bar.health_bar_1.x
  // );

  // console.log("toX", toX);

  // Lưu tween vào một biến khi tạo tween
  container_health_bar.health_bar_1_tween = scene.tweens.add({
    targets: container_health_bar.health_bar_1,
    x: toX,
    duration: 1000,
    ease: "Linear",
    onComplete: () => {},
  });

  if (container_health_bar.health_bar_2_tween) {
    container_health_bar.health_bar_2_tween.stop();

    container_health_bar.health_bar_2_tween.remove();
  }

  // Lưu tween vào một biến khi tạo tween
  container_health_bar.health_bar_2_tween = scene.tweens.add({
    targets: container_health_bar.health_bar_2,
    x: toX,
    duration: 500,
    ease: "Linear",
    onComplete: () => {},
  });
}
