let container_main = null;

let canClickHome = false;

export function CreateGameOver(scene) {
  // Tạo một container
  container_main = scene.add.container(0, 0).setDepth(200); // Tọa độ của container

  const black_bg = scene.add
    .rectangle(0, 0, originWidth, originHeight)
    .setOrigin(0, 0)
    .setInteractive({ useHandCursor: true }) // Thiết lập tương tác và đổi thành hình bàn tay khi hover
    .on("pointerdown", function () {
      console.log("bg clicked");

      if (canClickHome) {
        scene.scene.start("Home");
      }
    });
  black_bg.isFilled = true;
  black_bg.fillColor = 0;
  black_bg.fillAlpha = 0.75;

  container_main.add(black_bg);

  const img_text = scene.add
    .image(540, 795, "gameplay_game_over_text")
    .setOrigin(0.5, 0);

  container_main.add(img_text);

  img_text.y = -2000;
  scene.tweens.add({
    targets: img_text, // Đối tượng chữ cần tween
    y: 795, // Chuyển từ -100 (phía trên màn hình) đến centerY (giữa màn hình)
    duration: 500, // Thời gian tween (ms)
    ease: "Bounce.easeOut", // Kiểu easing tạo hiệu ứng nảy
    delay: 250, // Thời gian chờ 1 giây trước khi bắt đầu tween
    onComplete: () => {},
  });

  const text_continue = scene.add
    .text(540, 1261, "Tap to continue", {
      fontFamily: "RussoOne",
      fontSize: "40px",
      color: "#BBCFE7",
      shadow: {
        offsetX: 0,
        offsetY: 0,
        color: "#268BFF",
        blur: 11.5,
        fill: true,
      },
    })
    .setOrigin(0.5, 0);

  container_main.add(text_continue);

  text_continue.alpha = 0;
  scene.tweens.add({
    targets: text_continue, // Đối tượng chữ cần tween
    alpha: 1, // Chuyển từ -100 (phía trên màn hình) đến centerY (giữa màn hình)
    duration: 500, // Thời gian tween (ms)
    ease: "linear", // Kiểu easing tạo hiệu ứng nảy
    delay: 250, // Thời gian chờ 1 giây trước khi bắt đầu tween
    onComplete: () => {},
  });

  scene.time.delayedCall(750, () => {
    canClickHome = true;
  });
}
