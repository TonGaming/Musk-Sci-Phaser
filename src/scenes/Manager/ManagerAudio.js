let audio_background = null;

export function CreateAudioBackground(scene) {
  // Nếu nhạc nền chưa được phát
  if (!scene.sound.get("audio_background")) {
    audio_background = scene.sound.add("audio_background", {
      loop: true, // Lặp lại nhạc
      volume: 0.5, // Đặt âm lượng
      stopOnDestroy: false, // Không dừng nhạc khi chuyển cảnh
    });
    audio_background.play(); // Phát nhạc
  }
}

export function CreateAudioShoot(scene) {
  // Chơi âm thanh tiếng súng
  const shootSound = scene.sound.add("audio_gun_shot");
  shootSound.play();

  // Thực hiện hành động phá hủy sau khi âm thanh phát xong
  shootSound.on("complete", () => {
    console.log("Âm thanh tiếng súng đã phát xong.");
  });
}

export function CreateAudioExplosion(scene) {
  const sound = scene.sound.add("audio_enemy_sfx_explosion");
  sound.play();

  sound.on("complete", () => {});
}

let playerVoice = null;
export function CreateAudioPlayerVoice(scene) {
  if (playerVoice == null) {
    playerVoice = scene.sound.add("player_0_voice");
    playerVoice.play();

    playerVoice.on("complete", () => {});
  } else {
    playerVoice.stop();
    playerVoice.play();
  }
}
