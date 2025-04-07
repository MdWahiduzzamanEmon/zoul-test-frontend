import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WINDOW_WIDTH } from "../../styles/mixins";

const ExploreSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header Section */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={16}
        marginTop={20}
      >
        <SkeletonPlaceholder.Item width={180} height={45} borderRadius={4} />
        <SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
          <SkeletonPlaceholder.Item
            width={50}
            height={50}
            borderRadius={25}
            marginRight={10}
          />
          <SkeletonPlaceholder.Item width={100} height={30} borderRadius={4} />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      {/* Browse by Goal Section */}
      <SkeletonPlaceholder.Item marginTop={20} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={150}
          height={30}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width={(WINDOW_WIDTH - 48) / 2}
            height={120}
            borderRadius={8}
          />
          <SkeletonPlaceholder.Item
            width={(WINDOW_WIDTH - 48) / 2}
            height={120}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          marginTop={20}
        >
          <SkeletonPlaceholder.Item
            width={(WINDOW_WIDTH - 48) / 2}
            height={120}
            borderRadius={8}
          />
          <SkeletonPlaceholder.Item
            width={(WINDOW_WIDTH - 48) / 2}
            height={120}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      {/* Categories Section */}
      <SkeletonPlaceholder.Item marginTop={30} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={200}
          height={30}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width={(WINDOW_WIDTH - 48) / 2}
            height={120}
            borderRadius={8}
          />
          <SkeletonPlaceholder.Item
            width={(WINDOW_WIDTH - 48) / 2}
            height={120}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      {/* Master Choice Playlists Section */}
      <SkeletonPlaceholder.Item marginTop={30} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={250}
          height={30}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item width="100%" height={180} borderRadius={8} />
      </SkeletonPlaceholder.Item>

      {/* Recently Played Section */}
      <SkeletonPlaceholder.Item marginTop={30} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={250}
          height={30}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item width="100%" height={180} borderRadius={8} />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default ExploreSkeleton;
