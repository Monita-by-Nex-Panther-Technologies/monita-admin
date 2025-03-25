// src/constants/icons.ts
import homeIcon from "@/assets/icons/lets-icons_home-fill.svg";
import transact from "@/assets/icons/transact.svg";
import statisticsIcon from "@/assets/icons/statit.svg";
import customersIcon from "@/assets/icons/usermain.svg";
import kycIcon from "@/assets/icons/kyx.svg";
import staffIcon from "@/assets/icons/userplus.svg";
import bilpayIcon from "@/assets/icons/billpay.svg";
import giftcardIcon from "@/assets/icons/gift.svg";
import virtAccIcon from "@/assets/icons/vitrual.svg";
import cashbackIcon from "@/assets/icons/cashback.svg";
import cardIcon from "@/assets/icons/Card-1.svg";
import esimIcon from "@/assets/icons/esimicon.svg";
import settingsIcon from "@/assets/icons/mdi-light_settings.svg";
import supportIcon from "@/assets/icons/mynaui_support.svg";
import logoutIcon from "@/assets/icons/logoutIcon.svg";
import exportIcon from "@/assets/icons/export.svg";
import { ExpandIcon, Menu, ShieldCloseIcon } from "lucide-react";

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
  expandIcon: ExpandIcon,
  collapseIcon: ShieldCloseIcon,
  menuIcon: Menu,
} as const;

export type IconAssets = typeof icons;
