class Map {
  constructor(scene, id) {
    this.scene = scene;
    this.id = id;

    // Tạo container cho map
    this.container = this.scene.add.container(540, 960);
    this.container.setDepth(-4);

    // Tạo sprite cho map
    this.map_bg = this.scene.add.sprite(0, 0, "map_0_bg");

    // Thêm sprite vào container
    this.container.add(this.map_bg);

    //tạo obstacles
    this.container_obstacles = this.scene.add.container(0, 0);
    this.container_obstacles.setDepth(-2);

    // Tạo sprite cho map
    const obstacle_0_wall = this.scene.add
      .sprite(538, 1143, "map_0_obstacle_0_wall")
      .setOrigin(1, 0);

    // Thêm sprite vào container
    this.container_obstacles.add(obstacle_0_wall);
  }
}

export default Map; // Đảm bảo sử dụng export default
