import centerDataPlayer from "../../Data/CenterDataPlayer.js";

import { CreateAudioPlayerVoice } from "../Manager/ManagerAudio.js";
import { CreateAudioShoot } from "../Manager/ManagerAudio.js";

class Player {
  constructor(scene, x, y, playerId) {
    this.scene = scene;
    this.playerId = playerId;

    this.pData = centerDataPlayer.getPlayerById(this.playerId);

    console.log(" create player this.pData: ", this.pData);

    this.shakeTween = null;

    this.isShaking = false; // Thêm cờ để theo dõi trạng thái rung

    this.isCanAttack = true;

    // Tạo container cho player
    this.container = this.scene.add.container(x, y);
    this.container.setDepth(-1);

    this.container_delay_bar = null;

    // this.player_spine = this.scene.add.spine(x, y, spineKeyData, spineKeyAtlas);

    this.player_spine = this.scene.add.spine(0, 0, this.pData.spineGameplayKey);

    console.log("this.player_spine = " + this.player_spine);

    // Thêm spine vào container
    this.container.add(this.player_spine);

    // const text_name = scene.add
    //   .text(0, 0, playerId, {
    //     fontFamily: "RussoOne",
    //     fontSize: "64px",
    //     color: "#ffffff",
    //     align: "left",
    //   })
    //   .setOrigin(0, 1);

    // this.container.add(text_name);

    this.CreateDelayBar(scene);

    this.Default();
  }

  Default() {
    this.player_spine.setAnimation(0, "idle", true);

    // Biến để theo dõi thời gian chờ khi bắn
    this.shootToIdleDelay = 500; // Thời gian chờ để chuyển về trạng thái idle
    this.shootTimer = null; // Biến timer
  }

  setActive(isActive) {
    this.container.setVisible(isActive);

    this.ActiveDelayBar(isActive);
  }

  CreateDelayBar(scene) {
    this.container_delay_bar = scene.add.container(0, 0);

    let delay_bar_0 = scene.add
      .image(10, 1818, "gameplay_top_bar_health_bar_0")
      .setOrigin(0, 0.5);
    this.container_delay_bar.add(delay_bar_0);

    let delay_bar_1 = scene.add
      .image(10, 1818, "gameplay_top_bar_health_bar_1")
      .setOrigin(0, 0.5);
    this.container_delay_bar.add(delay_bar_1);
    this.container_delay_bar.delay_bar_1 = delay_bar_1;

    let delay_bar_3 = scene.add
      .image(10, 1818, "gameplay_top_bar_health_bar_3")
      .setOrigin(0, 0.5);
    this.container_delay_bar.add(delay_bar_3);

    const maskImage = scene.add
      .image(10, 1818, "gameplay_top_bar_health_bar_0")
      .setOrigin(0, 0.5);

    // Tạo Bitmap Mask từ hình ảnh
    const mask = maskImage.createBitmapMask();

    // Gắn mask cho sprite
    delay_bar_0.setMask(mask);
    delay_bar_1.setMask(mask);

    // Ẩn hình ảnh mask nếu không muốn hiển thị nó
    maskImage.setVisible(false);

    this.UpdateDelayBar(scene, 1, 1, 1, null);
  }

  ActiveDelayBar(boolVal) {
    this.container_delay_bar.setVisible(boolVal);
  }

  UpdateDelayBar(scene, maxVal, curVal, delayTime, onTweenComplete) {
    console.log("scene", scene);

    console.log("UpdateDelayBar");

    let toNormalize = curVal / maxVal;

    let toX =
      10 -
      this.container_delay_bar.delay_bar_1.displayWidth * (1 - toNormalize);

    if (this.container_delay_bar.delay_bar_1_tween) {
      this.container_delay_bar.delay_bar_1_tween.stop();

      this.container_delay_bar.delay_bar_1_tween.remove();
    }

    console.log("toNormalize", toNormalize);

    console.log(
      "this.container_delay_bar.delay_bar_1.displayWidth",
      this.container_delay_bar.delay_bar_1.displayWidth
    );

    console.log(
      "this.container_delay_bar.delay_bar_1.x",
      this.container_delay_bar.delay_bar_1.x
    );

    console.log("toX", toX);

    // Lưu tween vào một biến khi tạo tween
    this.container_delay_bar.delay_bar_1_tween = scene.tweens.add({
      targets: this.container_delay_bar.delay_bar_1,
      x: toX,
      duration: delayTime * 1000,
      ease: "Linear",
      onComplete: () => {
        if (onTweenComplete && typeof onTweenComplete === "function") {
          onTweenComplete();
        }

        console.log("delay_bar_1_tween done");
      },
    });
  }

  takeShoot() {
    if (this.isCanAttack == false) {
      return;
    }

    this.isCanAttack = false;

    console.log("this.isCanAttack: ", this.isCanAttack);

    CreateAudioShoot(this.scene);

    // Rung chỉ khi nó không đang rung
    if (!this.isShaking) {
      this.shake();
    }

    // Nếu đã có timer đang chạy, hủy nó
    if (this.shootTimer) {
      this.scene.time.removeEvent(this.shootTimer); // Hủy bỏ timer cũ
      this.shootTimer = null; // Đặt lại giá trị của timer về null
    }

    this.UpdateDelayBar(this.scene, 1, 0, 0.125);

    this.player_spine.setAnimation(0, "shoot", false);

    // Tạo timer để chuyển về trạng thái idle
    this.shootTimer = this.scene.time.delayedCall(this.shootToIdleDelay, () => {
      this.player_spine.setAnimation(0, "idle", true);
      this.shootTimer = null; // Đặt lại timer sau khi hoàn thành

      CreateAudioPlayerVoice(this.scene);
    });

    this.scene.time.delayedCall(125, () => {
      let tweenDelay = this.pData.attackDelay - 0.125;
      if (this.pData.attackDelay <= 0) {
        tweenDelay = 0.125;
      }

      this.UpdateDelayBar(this.scene, 1, 1, tweenDelay);
    });

    this.scene.time.delayedCall(this.pData.attackDelay * 1000, () => {
      this.isCanAttack = true;

      console.log("this.isCanAttack: ", this.isCanAttack);
    });
  }

  shake() {
    if (this.isShaking) return; // Ngăn không cho rung nếu đang rung

    this.isShaking = true; // Đánh dấu là đang rung

    const shakeDistance = 5; // Độ dịch chuyển khi rung
    const shakeDuration = 100; // Thời gian rung (milliseconds)
    const shakeInterval = 20; // Thời gian giữa các lần rung (milliseconds)

    // Sử dụng tween để rung
    this.shakeTween = this.scene.tweens.add({
      targets: this.player_spine, // Sử dụng spriteShoot
      x: {
        value: `+=${shakeDistance}`,
        duration: shakeInterval,
        yoyo: true,
        repeat: 2,
      },
      y: {
        value: `-=${shakeDistance}`,
        duration: shakeInterval,
        yoyo: true,
        repeat: 2,
      },
      onComplete: () => {
        this.isShaking = false; // Đánh dấu là không còn rung

        // Đảm bảo kẻ thù trở về vị trí ban đầu sau khi rung
        this.player_spine.x = 0; // Không cần làm gì ở đây, chỉ để khẳng định
      },
      duration: shakeDuration,
      repeat: 0,
    });
  }

  destroy() {
    if (this.shakeTween) {
      this.shakeTween.stop();
      this.shakeTween = null; // Xóa tham chiếu sau khi hủy
    }

    if (this.spine) {
      this.spine.removeAllListeners();
    }

    this.container.destroy();
  }
}

export default Player; // Đảm bảo sử dụng export default
