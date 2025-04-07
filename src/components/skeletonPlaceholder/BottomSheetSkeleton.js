import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { perfectSize } from "../../styles/mixins"; // Ensure this mixin is properly imported based on your project structure

const BottomSheetSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      <SkeletonPlaceholder.Item padding={perfectSize(16)} marginTop={"30%"}>
        {/* Top Section: Back arrow and playlist options */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <SkeletonPlaceholder.Item width={32} height={32} borderRadius={4} />
          <SkeletonPlaceholder.Item flexDirection="row">
            <SkeletonPlaceholder.Item
              width={24}
              height={24}
              borderRadius={4}
              marginHorizontal={perfectSize(10)}
            />
            <SkeletonPlaceholder.Item
              width={24}
              height={24}
              borderRadius={4}
              marginHorizontal={perfectSize(10)}
            />
            <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>

        {/* Image Placeholder */}
        <SkeletonPlaceholder.Item
          alignSelf="center"
          marginTop={perfectSize(20)}
        >
          <SkeletonPlaceholder.Item
            width={perfectSize(200)}
            height={perfectSize(200)}
            borderRadius={16}
          />
        </SkeletonPlaceholder.Item>

        {/* Audio Info: Title, Subtitle, and Description */}
        <SkeletonPlaceholder.Item marginTop={perfectSize(20)}>
          <SkeletonPlaceholder.Item
            width={perfectSize(220)}
            height={perfectSize(20)}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={perfectSize(6)}
            width={perfectSize(150)}
            height={perfectSize(16)}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            marginTop={perfectSize(10)}
            width="100%"
            height={perfectSize(50)}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>

        {/* Divider Line */}
        <SkeletonPlaceholder.Item
          marginTop={perfectSize(20)}
          width="100%"
          height={1}
          borderRadius={8}
        />

        {/* Slider Placeholder */}
        <SkeletonPlaceholder.Item
          marginTop={perfectSize(20)}
          width="100%"
          height={perfectSize(20)}
          borderRadius={8}
        />

        {/* Time and Duration Placeholder */}
        <SkeletonPlaceholder.Item
          marginTop={perfectSize(10)}
          flexDirection="row"
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width={perfectSize(50)}
            height={perfectSize(16)}
            borderRadius={4}
          />
          <SkeletonPlaceholder.Item
            width={perfectSize(50)}
            height={perfectSize(16)}
            borderRadius={4}
          />
        </SkeletonPlaceholder.Item>

        {/* Audio Controls */}
        <SkeletonPlaceholder.Item
          marginTop={perfectSize(20)}
          flexDirection="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
          <SkeletonPlaceholder.Item width={50} height={50} borderRadius={25} />
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default BottomSheetSkeleton;
