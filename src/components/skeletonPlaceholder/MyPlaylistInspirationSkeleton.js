import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { deviceWidth, deviceHeight } from "../../styles/theme";

const MyPlaylistInspirationSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header */}
      <SkeletonPlaceholder.Item paddingHorizontal={16} marginTop={60}>
        {/* Back and Delete Icons */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          marginBottom={20}
        >
          <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
        </SkeletonPlaceholder.Item>

        {/* Title and Edit Icon */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={20}
        >
          <SkeletonPlaceholder.Item width="60%" height={30} borderRadius={4} />
          <SkeletonPlaceholder.Item width={24} height={24} borderRadius={4} />
        </SkeletonPlaceholder.Item>

        {/* Playlists Section */}
        {[...Array(6)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            flexDirection="row"
            // alignItems="center"
            marginBottom={20}
          >
            <SkeletonPlaceholder.Item
              width={80}
              height={80}
              borderRadius={8}
              marginRight={16}
            />
            <SkeletonPlaceholder.Item
              flex={1}
              justifyContent="space-between"
              marginVertical={15}
            >
              <SkeletonPlaceholder.Item
                justifyContent="space-between"
                flexDirection="row"
              >
                <SkeletonPlaceholder.Item
                  width="70%"
                  height={20}
                  borderRadius={4}
                  marginBottom={10}
                />
                <SkeletonPlaceholder.Item>
                  <SkeletonPlaceholder.Item
                    width={20}
                    height={4}
                    borderRadius={4}
                    marginTop={3}
                  />
                  <SkeletonPlaceholder.Item
                    width={20}
                    height={4}
                    borderRadius={4}
                    marginTop={2}
                  />
                </SkeletonPlaceholder.Item>
              </SkeletonPlaceholder.Item>
              <SkeletonPlaceholder.Item
                width="100%"
                height={7}
                borderRadius={4}
                alignSelf="flex-end"
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default MyPlaylistInspirationSkeleton;
