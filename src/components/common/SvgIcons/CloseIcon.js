import { Svg, Path } from "react-native-svg";

const CloseIcon = ({ width, height, style }) => {
  return (
    <Svg
      width={`${width || 21}`}
      height={`${height || 21}`}
      style={style || {}}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/Svg"
    >
      <Path
        d="M16.625 5.60875L15.3913 4.375L10.5 9.26625L5.60875 4.375L4.375 5.60875L9.26625 10.5L4.375 15.3913L5.60875 16.625L10.5 11.7337L15.3913 16.625L16.625 15.3913L11.7337 10.5L16.625 5.60875Z"
        fill="white"
      />
    </Svg>
  );
};

export default CloseIcon;
