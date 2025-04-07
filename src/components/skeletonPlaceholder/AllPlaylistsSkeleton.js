// skeletons/AllPlaylistsSkeleton.js
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { WINDOW_WIDTH } from "../../styles/mixins";

const AllPlaylistsSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header Section */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={16}
        marginTop={50}
      >
        {/* Back Icon */}
        <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
        {/* Search Icon */}
        <SkeletonPlaceholder.Item width={48} height={48} borderRadius={24} />
      </SkeletonPlaceholder.Item>

      {/* Title and Dropdown Section */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={16}
        marginTop={20}
      >
        <SkeletonPlaceholder.Item width={150} height={25} borderRadius={4} />
        {/* Dropdown */}
        <SkeletonPlaceholder.Item width={100} height={35} borderRadius={8} />
      </SkeletonPlaceholder.Item>

      {/* Playlist Items */}
      <SkeletonPlaceholder.Item marginTop={20}>
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <SkeletonPlaceholder.Item
              key={index}
              flexDirection="row"
              alignItems="center"
              marginBottom={20}
              paddingHorizontal={16}
            >
              {/* Playlist Image */}
              <SkeletonPlaceholder.Item
                width={100}
                height={100}
                borderRadius={10}
              />
              <SkeletonPlaceholder.Item
                flex={1}
                marginLeft={16}
                justifyContent="center"
              >
                {/* Playlist Title */}
                <SkeletonPlaceholder.Item
                  width="80%"
                  height={20}
                  borderRadius={4}
                  marginBottom={10}
                />
                {/* Playlist Description */}
                <SkeletonPlaceholder.Item
                  width="60%"
                  height={15}
                  borderRadius={4}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default AllPlaylistsSkeleton;
