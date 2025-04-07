import Svg, { Path } from "react-native-svg";

export const BackIcon = ({ size = 18, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 11 18" fill="none">
    <Path
      d="M9.34183 18L0 9L9.34183 0L11 1.5975L3.31635 9L11 16.4025L9.34183 18Z"
      fill={color}
    />
  </Svg>
);
