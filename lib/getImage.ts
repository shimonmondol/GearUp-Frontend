// lib/getImage.ts

interface IGear {
  id: string;
  images?: string[];
  [key: string]: any;
}

const FALLBACK_IMAGES = [
  "https://i.ibb.co.com/gFb2sD0d/Camera.jpg",
  "https://i.ibb.co.com/JRKtVyFc/Apple.jpg",
  "https://i.ibb.co.com/TMGT6xv1/Dummble.png",
];

export const getGearImage = (item: IGear): string => {
  if (item.images && item.images.length > 0 && item.images[0]) {
    return item.images[0];
  }

  let hash = 0;
  for (let i = 0; i < item.id.length; i++) {
    hash = item.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % FALLBACK_IMAGES.length;

  return FALLBACK_IMAGES[index];
};
