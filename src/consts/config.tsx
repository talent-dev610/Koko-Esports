import Logo from "../../assets/images/logo.png";
import Avatar1 from "../../assets/images/avatar01.png";
import Avatar2 from "../../assets/images/avatar02.png";
import Avatar3 from "../../assets/images/avatar03.png";
import Avatar4 from "../../assets/images/avatar04.png";
import Avatar5 from "../../assets/images/avatar05.png";

export const BASE_API_URL = `https://kokonuts-server-gateway-jx-staging.kokonats.club/`;

export const Avatars = {
  "0": {
    image: Logo,
    start: "rgba(222, 222, 223, 0.8)",
    end: "rgba(210, 210, 212, 1)",
  },
  "1": {
    image: Avatar1,
    start: "rgba(203, 244, 210, 0.8)",
    end: "rgba(185, 239, 194, 1)",
  },
  "2": {
    image: Avatar2,
    start: "rgba(226, 218, 253, 0.8)",
    end: "rgba(214, 203, 252, 1)",
  },
  "3": {
    image: Avatar3,
    start: "rgba(255, 199, 195, 0.8)",
    end: "rgba(255, 193, 208, 1)",
  },
  "4": {
    image: Avatar4,
    start: "rgba(222, 222, 223, 0.8)",
    end: "rgba(210, 210, 212, 1)",
  },
  "5": {
    image: Avatar5,
    start: "rgba(227, 215, 210, 0.8)",
    end: "rgba(205, 185, 176, 1)",
  },
} as {
  [id: string]: {
    image: any
    start: string
    end: string
  }
};

export const ConfirmDialogType = {
  check: 0,
  close: 1,
  info: 2,
  attention: 3,
  question: 4,
  lamp: 5
};

export const SUPPORT_LINK = "https://game.kokonats.club/support";
export const SPONSOR_LINK = "https://www.cloud7.link";
export const GAME_LINK = "https://game.kokonats.club";
export const PRICACY = "https://game.kokonats.club/privacy";
export const TERMS = "https://game.kokonats.club/terms";
export const SHARE_USER = "kokonats_jp";


