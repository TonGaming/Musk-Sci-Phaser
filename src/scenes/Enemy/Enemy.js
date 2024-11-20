import {
  ActiveHealthBar,
  IsHealthBarActive,
  UpdateHealthBar,
} from "../Gameplay/GameplayTopBar.js";

import { CreateAudioExplosion } from "../Manager/ManagerAudio.js";

export function EnemyIdToKeyImage(enemyId) {
  let imgKey = "gameplay_enemy_0";

  switch (enemyId) {
    case "Enemy1" || "Enemy2" || "Enemy3":
      {
        const randomNumber = Math.floor(Math.random() * 2);

        imgKey = "gameplay_enemy_" + randomNumber;
      }

      break;

    case "Boss":
      {
        const randomNumber = Math.floor(Math.random() * 3);

        imgKey = "gameplay_enemy_boss_" + randomNumber;
      }
      break;

    // case "Elite":
    //   {
    //     const randomNumber = Math.floor(Math.random() * 3);

    //     imgKey = "gameplay_enemy_elite_" + randomNumber;
    //   }
    //   break;
  }

  return imgKey;
}

export function EnemyIdToKeySpine(enemyId) {
  let imgKey = "";

  // switch (enemyId) {
  //   case "Enemy1" || "Enemy2" || "Enemy3":
  //     {
  //       const randomNumber = Math.floor(Math.random() * 2);

  //       imgKey = "gameplay_enemy_" + randomNumber;
  //     }

  //     break;

  //   case "Boss":
  //     {
  //       const randomNumber = Math.floor(Math.random() * 3);

  //       imgKey = "gameplay_enemy_boss_" + randomNumber;
  //     }
  //     break;

  //   case "Elite":
  //     {
  //       const randomNumber = Math.floor(Math.random() * 3);

  //       imgKey = "gameplay_enemy_elite_" + randomNumber;
  //     }
  //     break;
  // }

  if (enemyId === "Elite") {
    return "gameplay_enemy_elite_0";
  }

  return imgKey;
}

class Enemy {
  constructor(scene, x, y, id, enemyType, hp, maxHp, onHit, onDead) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.id = id;
    this.enemyType = enemyType;
    this.spriteKey = EnemyIdToKeyImage(this.id);
    this.spineKey = EnemyIdToKeySpine(this.id);
    this.maxHp = maxHp;
    this.hp = hp;
    this.isDead = false;

    this.swayTween = null;
    this.shakeTween = null;

    this.onDead = onDead;

    this.isShaking = false; // Thêm cờ để theo dõi trạng thái rung

    this.onPosition = false;

    // Tạo container cho enemy
    this.container = this.scene.add.container(x, y);
    this.container.setDepth(-3);

    if (this.spineKey === "") {
      console.log("spine_key = " + this.spriteKey);

      // Tạo sprite cho enemy
      this.sprite = this.scene.add
        .sprite(0, 0, this.spriteKey)
        .setOrigin(0.5, 1);

      this.sprite.setInteractive({ pixelPerfect: true, useHandCursor: true });

      // Xử lý sự kiện khi click vào sprite của enemy
      this.sprite.on("pointerdown", (pointer) => {
        console.log(`Clicked on Enemy ${this.id}`);
        // Gọi phương thức takeDamage hoặc các hành động khác khi click
        this.takeDamage(pointer);

        // Gọi hàm callback thành công nếu có
        if (onHit && typeof onHit === "function") {
          onHit(pointer);
        }
      });

      // Thêm sprite vào container
      this.container.add(this.sprite);
    } else {
      // Tạo spine cho enemy
      this.spine = this.scene.add.spine(0, 0, this.spineKey);
      console.log("spine_key = " + this.spineKey);

      this.spine.setInteractive({ useHandCursor: true });

      // Sự kiện khi click vào spine
      this.spine.on("pointerdown", (pointer) => {
        // this.spine.skeleton.slots.forEach((slot) => {
        //   console.log(slot.data.name); // Hiển thị tên của mỗi slot
        // });

        console.log(`Clicked on Enemy ${this.id}`);
        // Gọi phương thức takeDamage hoặc các hành động khác khi click
        this.takeDamage(pointer);

        // Gọi hàm callback thành công nếu có
        if (onHit && typeof onHit === "function") {
          onHit(pointer);
        }
      });

      // Thêm sprite vào container
      this.container.add(this.spine);
    }

    ActiveHealthBar(true);
    UpdateHealthBar(scene, this.maxHp, this.hp);

    // Bắt đầu lắc lư nhẹ
    this.startSway();

    this.dropFromSky(scene);
  }

  isHit(x, y) {}

  dropFromSky(scene) {
    this.container.y = this.y - 4000;

    scene.tweens.add({
      targets: this.container,
      y: this.y, // Vị trí kết thúc
      duration: 1000, // Thời gian tween
      ease: "Power2", // Kiểu easing
      onComplete: () => {
        console.log("Enemy dropFromSky complete!"); // Thông báo khi tween hoàn thành
      },
    });
  }

  // Phương thức giảm máu
  takeDamage(hitPosition) {
    this.createHitFX(hitPosition);

    // Rung chỉ khi nó không đang rung
    if (!this.isShaking) {
      this.shake();
    }

    if (this.sprite) {
      // Đổi màu kẻ thù sang đỏ
      this.sprite.setTint(0xff0000);

      // Khôi phục màu sắc về bình thường sau 0.125 giây
      this.scene.time.delayedCall(125, () => {
        this.sprite.clearTint();
      });
    } else if (this.spine) {
      // Áp dụng tint bằng cách thay đổi trực tiếp giá trị RGBA cho mỗi slot
      this.spine.skeleton.slots.forEach((slot) => {
        slot.color.set(1, 0.5, 0.5, 1); // Thiết lập màu đỏ nhạt (1, 0.5, 0.5, 1)
      });

      // Khôi phục màu sắc về bình thường sau 0.125 giây
      this.scene.time.delayedCall(125, () => {
        this.spine.skeleton.slots.forEach((slot) => {
          slot.color.set(1, 1, 1, 1); // Thiết lập màu đỏ nhạt (1, 0.5, 0.5, 1)
        });
      });
    }
  }

  setHealth(scene, setHp) {
    this.hp = setHp;

    if (this.hp > 0 && IsHealthBarActive() == false) {
      ActiveHealthBar(true);
    }

    UpdateHealthBar(scene, this.maxHp, this.hp);

    if (this.hp <= 0) {
      ActiveHealthBar(false);

      this.createExplosionFX();
      CreateAudioExplosion(this.scene);
      this.die();
    }
  }

  // Phương thức xử lý khi enemy chết
  die() {
    this.isDead = true;

    console.log(`Enemy ${this.id} đã chết!`);
    this.destroy();

    // Gọi hàm callback thành công nếu có
    if (this.onDead && typeof this.onDead === "function") {
      this.onDead();
    }
  }

  destroy() {
    if (this.swayTween) {
      this.swayTween.stop();
      this.swayTween = null; // Xóa tham chiếu sau khi hủy
    }

    if (this.shakeTween) {
      this.shakeTween.stop();
      this.shakeTween = null; // Xóa tham chiếu sau khi hủy
    }

    if (this.spine) {
      this.spine.removeAllListeners();

      const animName = "enemy_explode";

      this.spine.setAnimation(0, animName, false);

      // Tìm animation trong dữ liệu skeleton của spine
      const animation = this.spine.skeleton.data.findAnimation(animName);

      let animTime = 1;

      if (animation) {
        animTime = animation.duration; // Thời gian hoạt ảnh tính bằng giây
        console.log(`Thời gian của hoạt ảnh ${animName}: ${animTime} giây`);
      }

      this.scene.time.delayedCall(animTime * 1000, () => {
        this.spine.destroy();
        this.spine = null;
        this.container.destroy();
      });
    } else {
      this.container.destroy();
    }
  }

  // //old health bar
  // // Cập nhật vị trí và trạng thái của thanh máu
  // updateHealthBar() {
  //   this.healthBar.clear();
  //   const barWidth = 500; // Độ rộng của thanh máu
  //   const barHeight = 10; // Chiều cao của thanh máu
  //   const barX = -barWidth / 2; // Vị trí thanh máu trên trục X (trong container)

  //   let barY = 0;
  //   if (this.sprite) {
  //     barY = -this.sprite.height - 50; // Vị trí thanh máu trên trục Y, ở trên đầu enemy
  //   } else {
  //     barY = -this.spine.height - 50;
  //   }

  //   // Viền của thanh máu (màu đen)
  //   this.healthBar.fillStyle(0x000000);
  //   this.healthBar.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

  //   // Phần máu còn lại (màu xanh lá)
  //   const healthPercentage = this.hp / this.maxHp; // Tính phần trăm máu còn lại
  //   this.healthBar.fillStyle(0x00ff00); // Màu xanh lá cây cho máu
  //   this.healthBar.fillRect(barX, barY, barWidth * healthPercentage, barHeight);
  // }

  // Phương thức lắc lư nhẹ với độ ngẫu nhiên
  startSway() {
    const swayDistance = Phaser.Math.Between(5, 6); // Độ dịch chuyển ngẫu nhiên từ 2 đến 10 pixels
    const swayDuration = Phaser.Math.Between(500, 600); // Thời gian lắc lư ngẫu nhiên từ 200 đến 600 milliseconds

    if (this.sprite) {
      this.swayTween = this.scene.tweens.add({
        targets: this.sprite,
        x: {
          value: `+=${swayDistance}`,
          duration: swayDuration,
          yoyo: true,
          repeat: -1, // Lặp lại vô hạn
        },
        y: {
          value: `-=${swayDistance}`,
          duration: swayDuration,
          yoyo: true,
          repeat: -1, // Lặp lại vô hạn
        },
        ease: "Sine.easeInOut", // Hiệu ứng lắc lư mượt mà
      });
    } else if (this.spine) {
      this.swayTween = this.scene.tweens.add({
        targets: this.spine,
        x: {
          value: `+=${swayDistance}`,
          duration: swayDuration,
          yoyo: true,
          repeat: -1, // Lặp lại vô hạn
        },
        y: {
          value: `-=${swayDistance}`,
          duration: swayDuration,
          yoyo: true,
          repeat: -1, // Lặp lại vô hạn
        },
        ease: "Sine.easeInOut", // Hiệu ứng lắc lư mượt mà
      });
    }
  }

  shake() {
    if (this.isShaking) return; // Ngăn không cho rung nếu đang rung

    this.isShaking = true; // Đánh dấu là đang rung

    const shakeDistance = 20; // Độ dịch chuyển khi rung
    const shakeDuration = 100; // Thời gian rung (milliseconds)
    const shakeInterval = 20; // Thời gian giữa các lần rung (milliseconds)

    if (this.sprite) {
      // Sử dụng tween để rung
      this.shakeTween = this.scene.tweens.add({
        targets: this.sprite,
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
          this.sprite.x = 0; // Không cần làm gì ở đây, chỉ để khẳng định
        },
        duration: shakeDuration,
        repeat: 0,
      });
    } else if (this.spine) {
      // Sử dụng tween để rung
      this.shakeTween = this.scene.tweens.add({
        targets: this.spine,
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
          this.spine.x = 0; // Không cần làm gì ở đây, chỉ để khẳng định
        },
        duration: shakeDuration,
        repeat: 0,
      });
    }
  }

  createHitFX(hitPosition) {
    let xPos = 0;
    let yPos = 0;

    if (hitPosition) {
      xPos = hitPosition.x;
      yPos = hitPosition.y;
    } else {
      // Tạo các giá trị ngẫu nhiên trong khoảng 20px
      xPos = Phaser.Math.Between(
        this.container.x - 300,
        this.container.x + 300
      );
      yPos = Phaser.Math.Between(
        this.container.y - 100,
        this.container.y - 500
      );
    }

    this.scene.anims.create({
      key: "enemy_fx_strike_anim_animation",
      frames: this.scene.anims.generateFrameNumbers("enemy_fx_strike_anim", {
        start: 0,
        end: 11,
      }), // 0 đến 11 vì có 12 khung hình
      frameRate: 30, // Tốc độ phát animation
      repeat: 0, // Lặp lại vô hạn
    });

    const effect = this.scene.add
      .sprite(xPos, yPos, "enemy_fx_strike_anim")
      .play("enemy_fx_strike_anim_animation");
    effect.setOrigin(0.5, 0.5).setDepth(-3); // Đặt gốc giữa sprite

    // Tùy chọn: Tự động xóa sprite sau khi animation kết thúc
    effect.on("animationcomplete", () => {
      effect.destroy();
    });
  }

  createExplosionFX() {
    if (this.spine) {
      // Tạo spine cho enemy
      const fxSpine = this.scene.add.spine(
        this.container.x,
        this.container.y,
        this.spineKey + "_explode"
      );

      const animName = "explode";

      fxSpine.setAnimation(0, animName, false);

      // Tìm animation trong dữ liệu skeleton của spine
      const animation = fxSpine.skeleton.data.findAnimation(animName);

      let animTime = 1;

      if (animation) {
        animTime = animation.duration; // Thời gian hoạt ảnh tính bằng giây
        console.log(`Thời gian của hoạt ảnh ${animName}: ${animTime} giây`);
      }

      this.scene.time.delayedCall(animTime * 1000, () => {
        fxSpine.destroy();
      });
    } else {
      this.scene.anims.create({
        key: "enemy_fx_explosion_animation",
        frames: this.scene.anims.generateFrameNumbers("enemy_fx_explosion", {
          start: 0,
          end: 10,
        }), // 0 đến 11 vì có 12 khung hình
        frameRate: 30, // Tốc độ phát animation
        repeat: 0, // Lặp lại vô hạn
      });

      const effect = this.scene.add
        .sprite(
          this.container.x + 100,
          this.container.y - 500,
          "enemy_fx_explosion"
        )
        .play("enemy_fx_explosion_animation");
      effect.setOrigin(0.5, 0.5).setDepth(-3); // Đặt gốc giữa sprite

      effect.setScale(7);

      // Tùy chọn: Tự động xóa sprite sau khi animation kết thúc
      effect.on("animationcomplete", () => {
        effect.destroy();
      });
    }
  }
}

export default Enemy; // Đảm bảo sử dụng export default
