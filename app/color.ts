export const getThemeColors = (hue: number) => {
  const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
  const bgF1Color = `hsl(${hue}, 100%, 94%)`;
  const bgF2Color = `hsl(${hue}, 100%, 75%)`;
  const bgF3Color = `hsl(${hue}, 100%, 27%)`;
  const bgF4Color = `hsl(${hue}, 100%, 90%)`;
  const bgColor = `hsl(${hue}, 100%, 27%)`;
  const bglabelColor = `hsl(${hue}, 50%, 26%)`;
  const oppositeColor = `hsl(${(hue + 180) % 360}, 100%, 20%)`;
  const oppositeColor1 = `hsl(${(hue + 180) % 360}, 100%, 30%)`;
  const oppositeColor2 = `hsl(${(hue + 180) % 360}, 100%, 30%)`;
  const oppositeColor3 = `hsl(${(hue - 77)}, 100%, 50%)`;
  const oppositeColor4 = `hsl(${(hue + 270) % 360}, 100%, 40%)`;

  const gradientConfig = {
    colors: [bgF1Color, bgF2Color, bgF3Color] as const,
    locations: [0, 0.5, 1] as const,
  };

  const gradientLeafbtn: {
    colors: readonly [string, string];
    locations: readonly [number, number];
    start: { x: number; y: number };
    end: { x: number; y: number };
  } = {
    colors: [oppositeColor3, bgColor],
    locations: [0, 1],

    // Top → Bottom
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  };

  return {
    bgbodyColor,
    bgF1Color,
    bgF2Color,
    bgF3Color,
    bgF4Color,
    bgColor,
    gradientConfig,
    bglabelColor,
    oppositeColor,
    oppositeColor1,
    oppositeColor2,
    oppositeColor3,
    oppositeColor4,
    gradientLeafbtn,
  };
};

