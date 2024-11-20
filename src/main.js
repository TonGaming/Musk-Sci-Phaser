import "./utils";
import { Boot } from "./scenes/Boot";
import { Home } from "./scenes/Home";
import { Gameplay } from "./scenes/Gameplay";
import { Test } from "./scenes/Test.js";
import { Preloader } from "./scenes/Preloader";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import "./plugins/spine/dist/SpinePlugin.min.js"; // Import trực tiếp để nạp plugin vào môi trường toàn cục

// Cấu hình trò chơi
const config = {
  type: Phaser.AUTO,
  width: originWidth, // Đảm bảo bạn đã định nghĩa biến này ở nơi khác
  height: originHeight, // Đảm bảo bạn đã định nghĩa biến này ở nơi khác
  parent: "game-container", // ID của phần tử HTML nơi trò chơi sẽ được nhúng
  backgroundColor: "#000000", // Màu nền của trò chơi
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Boot, Preloader, Home, Gameplay, Test],
  dom: {
    createContainer: true,
  },
  plugins: {
    scene: [
      {
        plugin: RexUIPlugin,
        key: "rexUI",
        mapping: "rexUI",
      },
      { key: "SpinePlugin", plugin: window.SpinePlugin, mapping: "spine" },
    ],
  },
};

// Khởi tạo trò chơi
export default new Phaser.Game(config);
