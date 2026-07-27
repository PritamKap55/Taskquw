export const getThemeColors = (hue: number) => {
  const bgbodyColor = `hsl(${hue}, 100%, 95%)`;
  const bgF1Color = `hsl(${hue}, 100%, 94%)`;
  const bgF2Color = `hsl(${hue}, 100%, 75%)`;
  const bgF3Color = `hsl(${hue}, 100%, 27%)`;
  const bgColor = `hsl(${hue}, 100%, 27%)`;

  const gradientConfig = {
    colors: [bgF1Color, bgF2Color, bgF3Color] as const,
    locations: [0, 0.5, 1] as const,
  };

  return {
    bgbodyColor,
    bgF1Color,
    bgF2Color,
    bgF3Color,
    bgColor,
    gradientConfig,
  };
};