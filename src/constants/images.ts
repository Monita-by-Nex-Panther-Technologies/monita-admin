// import monitaLogo from "@/assets/images/MonitaLogo.png";
import monitaLogoSvg from "@/assets/images/Logo.png";

export const images = {
  image: {
    monitaLogo: monitaLogoSvg,
  },
} as const;
export type ImageAssets = typeof images;
