export type Route = {
  id: string;
  title: string;
  layout: string;
  image: string;
  type: string;
};

export type POI = {
  id: string;
  title: string;
  image: string;
  layout: string;
  gmaps: string;
  coords: [number, number];
  info: string;
  arDesc: string;
  ar: {
    type: string;
    content: string;
    location: string;
    video?: any[];
    audio?: { filename: string };
    nft?: any[];
  };
  content?: string;
};
