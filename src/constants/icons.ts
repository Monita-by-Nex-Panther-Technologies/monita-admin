// src/constants/icons.ts
import bilpayIcon from "@/assets/icons/billpay.svg";
import cardIcon from "@/assets/icons/Card-1.svg";
import cashbackIcon from "@/assets/icons/cashback.svg";
import esimIcon from "@/assets/icons/esimicon.svg";
import exportIcon from "@/assets/icons/export.svg";
import giftcardIcon from "@/assets/icons/gift.svg";
import kycIcon from "@/assets/icons/kyx.svg";
import homeIcon from "@/assets/icons/lets-icons_home-fill.svg";
import logoutIcon from "@/assets/icons/logoutIcon.svg";
import settingsIcon from "@/assets/icons/mdi-light_settings.svg";
import supportIcon from "@/assets/icons/mynaui_support.svg";
import statisticsIcon from "@/assets/icons/statit.svg";
import transact from "@/assets/icons/transact.svg";
import customersIcon from "@/assets/icons/usermain.svg";
import staffIcon from "@/assets/icons/userplus.svg";
import virtAccIcon from "@/assets/icons/vitrual.svg";

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
  exportIcon,
} as const;

export type IconAssets = typeof icons;
