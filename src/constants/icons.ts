// src/constants/icons.ts
import homeIcon from "@/assets/icons/lets-icons_home-fill.svg";
import transact from "@/assets/icons/transact.svg";
import statisticsIcon from "@/assets/icons/statisticsIcon.svg";
import customersIcon from "@/assets/icons/User.svg";
import kycIcon from "@/assets/icons/_medal-06.svg";
import staffIcon from "@/assets/icons/User_add.svg";
import bilpayIcon from "@/assets/icons/Paper_light.svg";
import giftcardIcon from "@/assets/icons/gift-icon.svg";
import virtAccIcon from "@/assets/icons/three-thin.svg";
import cashbackIcon from "@/assets/icons/money-light.svg";
import cardIcon from "@/assets/icons/Card.svg";
import esimIcon from "@/assets/icons/sim.svg";
import settingsIcon from "@/assets/icons/settings.svg";
import supportIcon from "@/assets/icons/support.svg";
import logoutIcon from "@/assets/icons/logoutIcon.svg";

export const icons = {
  home: homeIcon,
  transact,
  statisticsIcon,
  customersIcon,
  kycIcon,
  staffIcon,
  bilpayIcon,
  giftcardIcon,
  virtAccIcon,
  cardIcon,
  cashbackIcon,
  esimIcon,
  settingsIcon,
  supportIcon,
  logoutIcon,
} as const;

export type IconAssets = typeof icons;
