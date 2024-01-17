export type CloudWord = {
  text: string;
  size: number;
  action?: (w: PlacedCloudWord) => void;
  href?: string;
};

export type PlacedCloudWord = {
  x: number;
  y: number;
  rotate: number;
} & CloudWord;
