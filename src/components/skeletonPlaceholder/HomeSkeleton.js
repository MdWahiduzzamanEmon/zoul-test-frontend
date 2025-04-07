// skeletons/HomeSkeleton.js
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WINDOW_WIDTH } from "../../styles/mixins";

const HomeSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header Section */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={16}
      >
        <SkeletonPlaceholder.Item
          width={200}
          height={55}
          borderRadius={4}
          marginTop={20}
        />
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item
            width={50}
            height={50}
            borderRadius={30}
            alignSelf="flex-end"
          />
          <SkeletonPlaceholder.Item
            width={100}
            height={25}
            borderRadius={15}
            marginTop={5}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      {/* Daily Wisdom Section */}
      <SkeletonPlaceholder.Item paddingHorizontal={16} marginTop={20}>
        <SkeletonPlaceholder.Item width="100%" height={280} borderRadius={8} />
      </SkeletonPlaceholder.Item>

      {/* Horoscope Section */}
      <SkeletonPlaceholder.Item marginTop={20} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item width="100%" height={210} borderRadius={8} />
        <SkeletonPlaceholder.Item
          width={150}
          height={30}
          borderRadius={4}
          marginTop={20}
        />
      </SkeletonPlaceholder.Item>

      {/* Categories Section */}
      <SkeletonPlaceholder.Item
        marginTop={20}
        paddingHorizontal={16}
        flexDirection="row"
        justifyContent="space-between"
      >
        <SkeletonPlaceholder.Item
          width={(WINDOW_WIDTH - 48) / 2}
          height={100}
          borderRadius={8}
        />
        <SkeletonPlaceholder.Item
          width={(WINDOW_WIDTH - 48) / 2}
          height={100}
          borderRadius={8}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default HomeSkeleton;
