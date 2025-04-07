import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WINDOW_WIDTH } from "../../styles/mixins";

const GettingOverplaylistSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header Section */}
      <SkeletonPlaceholder.Item
        flexDirection="column"
        paddingHorizontal={16}
        paddingTop={20}
      >
        {/* Top Row */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
          <SkeletonPlaceholder.Item width={100} height={30} borderRadius={4} />
        </SkeletonPlaceholder.Item>

        {/* Title */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={14}
        >
          <SkeletonPlaceholder.Item
            width={32}
            height={32}
            borderRadius={16}
            marginRight={10}
          />
          <SkeletonPlaceholder.Item width={200} height={25} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      {/* FlatList Items */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        paddingHorizontal={16}
        marginTop={20}
      >
        {[...Array(6)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            width={(WINDOW_WIDTH - 48) / 2}
            height={150}
            borderRadius={8}
            marginBottom={16}
          />
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default GettingOverplaylistSkeleton;
