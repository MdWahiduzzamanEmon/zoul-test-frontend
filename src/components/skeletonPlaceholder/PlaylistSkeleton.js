// skeletons/PlaylistSkeleton.js
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WINDOW_WIDTH } from "../../styles/mixins";
import { perfectSize } from "../../styles/mixins";

const PlaylistSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header Section */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={perfectSize(16)}
      >
        <SkeletonPlaceholder.Item
          width={50}
          height={50}
          borderRadius={30}
          marginTop={20}
        />
        <SkeletonPlaceholder.Item
          width={150}
          height={30}
          borderRadius={4}
          marginTop={20}
        />
        <SkeletonPlaceholder.Item
          width={50}
          height={50}
          borderRadius={30}
          alignSelf="flex-end"
        />
      </SkeletonPlaceholder.Item>

      {/* Playlist Image Section */}
      <SkeletonPlaceholder.Item
        paddingHorizontal={perfectSize(16)}
        marginTop={20}
      >
        <SkeletonPlaceholder.Item width="100%" height={200} borderRadius={8} />
      </SkeletonPlaceholder.Item>

      {/* Playlist Title Section */}
      <SkeletonPlaceholder.Item
        paddingHorizontal={perfectSize(16)}
        marginTop={20}
      >
        <SkeletonPlaceholder.Item width={200} height={30} borderRadius={4} />
      </SkeletonPlaceholder.Item>

      {/* Audio List Section */}
      <SkeletonPlaceholder.Item
        marginTop={20}
        paddingHorizontal={perfectSize(16)}
        flexDirection="row"
        justifyContent="space-between"
        flexWrap="wrap"
      >
        <SkeletonPlaceholder.Item
          width={(WINDOW_WIDTH - 48) / 2}
          height={100}
          borderRadius={8}
          marginBottom={perfectSize(10)}
        />
        <SkeletonPlaceholder.Item
          width={(WINDOW_WIDTH - 48) / 2}
          height={100}
          borderRadius={8}
          marginBottom={perfectSize(10)}
        />
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

export default PlaylistSkeleton;
