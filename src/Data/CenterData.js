import { retrieveLaunchParams } from "@telegram-apps/sdk";

export const BASE_SERVICE = "https://api-test.m-sci.net";

//export const BASE_SERVICE = "http://146.190.111.83:5000";

export class CenterData {
  constructor() {
    this.userInfo = null;

    this.battle = null;

    // Thêm một instance EventTarget vào class Data
    this.eventTarget = new EventTarget();

    this.selectedPlayer = ["player_0", "player_2", "player_3"];

    this.unlockedPlayer = [
      { playerId: "player_0", level: 14 },
      { playerId: "player_1", level: 25 },
      { playerId: "player_2", level: 30 },
      { playerId: "player_3", level: 41 },
      { playerId: "player_4", level: 88 },
      { playerId: "player_5", level: 90 },
    ];
  }

  getUnlockedPlayerLevelByPlayerId(playerId) {
    const player = this.unlockedPlayer.find(
      (item) => item.playerId === playerId
    );
    return player ? player.level : null; // Trả về level nếu tìm thấy, ngược lại trả về null
  }

  GetInviteUrl() {
    return `https://t.me/share/url?url=https://t.me/musksci_bot/musksci?startapp=${this.userInfo.UserId}`;
  }

  // Thêm hàm để thêm, xóa, và kích hoạt sự kiện
  onEvent(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback);
  }

  offEvent(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback);
  }

  emitEvent(eventName, detail = null) {
    this.eventTarget.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  AddPlayerInfoChange(callback) {
    this.onEvent("playerinfochange", callback);
  }

  RemovePlayerInfoChange(callback) {
    this.offEvent("playerinfochange", callback);
  }

  EmitPlayerInfoChange() {
    console.log("EmitPlayerInfoChange");

    this.emitEvent("playerinfochange", this.userInfo);
  }

  GetAccessToken() {
    return localStorage.getItem("jwtToken");
  }

  SetAccessToken(tokenStr) {
    localStorage.setItem("jwtToken", tokenStr);
  }

  //Request login
  async RequestLogin(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/login`;

    //const { initDataRaw, startParam } = retrieveLaunchParams();

    const initDataRaw =
      "query_id=AAGv1l0ZAAAAAK_WXRkGDwUM&user=%7B%22id%22%3A425580207%2C%22first_name%22%3A%22Tran%22%2C%22last_name%22%3A%22Hung%22%2C%22username%22%3A%22tdh4vn%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1729789303&hash=6f6923b891fe6f85c870a85aad8e08393c8f4c6274d3934ff69ca0508e20264f";

    const startParam = "A000000000";

    console.log("initDataRaw: ", initDataRaw);
    console.log("startParam: ", startParam);

    const bodyData = {
      query_id: initDataRaw,
      reference_id: startParam,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      console.log(
        "RequestLogin Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        // Lưu token vào localStorage
        this.SetAccessToken(result.data.accessToken);

        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(result.message);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("RequestLogin Lỗi khi gửi yêu cầu POST:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request user info
  async RequestUserInfo(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/me`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestUserInfo Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        if (result.data) {
          this.userInfo = result.data;

          this.EmitPlayerInfoChange();
        }

        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(result.message);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("RequestUserInfo Lỗi khi gửi yêu cầu Get:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request invited friend
  async RequestInviteFriend(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/me/f1-list`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestUserInfo Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error("RequestCurrentBattle Lỗi khi gửi yêu cầu Get:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request quest
  async RequestQuestInfo(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/me/quests`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestQuestInfo Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(result.message);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("RequestQuestInfo Lỗi khi gửi yêu cầu Get:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //Request mark quest done
  async RequestMarkQuestDone(questCode, onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/me/quests/mark-done`;

    const accessToken = this.GetAccessToken();

    const bodyData = {
      code: questCode,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      console.log(
        "RequestQuestInfo Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error("RequestMarkQuestDone Lỗi khi gửi yêu cầu POST:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request rank
  async RequestRank(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/rankings/users`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestRank Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(result.message);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("RequestRank Lỗi khi gửi yêu cầu Get:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request rank
  async RequestMyRank(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/rankings/me`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestMyRank Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(result.message);
        }
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("RequestMyRank Lỗi khi gửi yêu cầu Get:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //Request spin
  async RequestSpin(quantity, onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/spin`;

    const accessToken = this.GetAccessToken();

    const bodyData = {
      quantity: quantity,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      console.log(
        "RequestSpin Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result && result.data) {
        this.userInfo.Chip = result.data.user.Chip;

        this.userInfo.Musk = result.data.user.Musk;

        this.EmitPlayerInfoChange();

        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(error.message);
        }
      }
    } catch (error) {
      console.error("RequestSpin Lỗi khi gửi yêu cầu POST:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //Request premium-spin
  async RequestPremiumSpin(quantity, onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/premium-spin`;

    const accessToken = this.GetAccessToken();

    const bodyData = {
      quantity: quantity,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      console.log(
        "RequestPremiumSpin Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result && result.data) {
        this.userInfo.Chip = result.data.user.Chip;

        this.userInfo.Musk = result.data.user.Musk;

        this.EmitPlayerInfoChange();

        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      } else {
        // Gọi hàm callback thất bại nếu có
        if (onError && typeof onError === "function") {
          onError(error.message);
        }
      }
    } catch (error) {
      console.error("RequestPremiumSpin Lỗi khi gửi yêu cầu POST:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request get current battle
  async RequestCurrentBattle(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/current-scene`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Get",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestUserInfo Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        this.battle = null;
        if (result.scene) {
          this.battle = result.scene;
        }

        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error("RequestCurrentBattle Lỗi khi gửi yêu cầu Get:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }

  //request get new battle
  async RequestNewBattle(onSuccess, onError) {
    const url = `${BASE_SERVICE}/api/start-battle`;

    const accessToken = this.GetAccessToken();

    try {
      const response = await fetch(url, {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken, // Thêm Bearer Token vào tiêu đề
        },
      });

      const result = await response.json();
      console.log(
        "RequestUserInfo Response result:",
        JSON.stringify(result, null, 2)
      );

      if (result) {
        if (result.scene) {
          this.battle = result.scene;
        }

        // Gọi hàm callback thành công nếu có
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error("RequestCurrentBattle Lỗi khi gửi yêu cầu Post:", error);

      // Gọi hàm callback thất bại nếu có
      if (onError && typeof onError === "function") {
        onError(error.message);
      }
    }
  }
}

const centerData = new CenterData();
export default centerData;
