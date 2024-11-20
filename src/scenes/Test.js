import { Scene } from "phaser";

export class Test extends Scene {
  constructor() {
    super("Test");
  }

  create() {
    this.cameras.main.setBackgroundColor(0xff0000);

    this.add.image(512, 384, "background").setAlpha(0.5);

    this.add
      .text(512, 384, "Game Over", {
        fontFamily: "Arial Black",
        fontSize: 64,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    // Danh sách các item với loại item
    const items = Array.from({ length: 20 }, (_, i) => ({
      key: `item${i + 1}`,
      type: `Item ${i + 1}`,
    }));
    this.winningItem = Phaser.Math.RND.pick(items);

    // Tạo bảng gacha theo chiều ngang với rexUI
    const gachaTable = this.rexUI.add
      .gridTable({
        x: 540,
        y: 960,
        width: 800,
        height: 200,
        scrollMode: 1, // Cuộn ngang
        background: this.add.rectangle(0, 0, 1080, 1920, 0x000000, 0),
        table: {
          cellWidth: 180,
          cellHeight: 180,
          columns: 20,
          rows: 1,
          mask: { padding: 2 },
        },
        items: items,
        space: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          table: 10,
          header: 10,
          footer: 10,
        },
        createCellContainerCallback: (cell, cellContainer) => {
          const item = cell.item;
          const container = this.add.container(0, 0);

          const background = this.rexUI.add
            .roundRectangle(0, 0, 180, 180, 20, 0xffffff)
            .setStrokeStyle(2, 0x000000);

          const text = this.add
            .text(0, 0, item.type, {
              fontSize: "20px",
              color: "#000",
              align: "center",
            })
            .setOrigin(0.5);

          container.add([background, text]);
          return container;
        },
      })
      .layout();

    // Thêm đường kẻ ở giữa màn hình để đánh dấu vị trí dừng
    this.add.line(540, 960, 0, -100, 0, 100, 0xff0000).setLineWidth(4, 4);

    // Bắt đầu quay khi nhấn vào màn hình
    this.input.on("pointerdown", () => {
      this.startCaseOpening(gachaTable, items);
    });
  }
}
