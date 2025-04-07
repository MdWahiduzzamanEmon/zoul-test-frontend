import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { deviceWidth } from "../../styles/theme";

const MySelectionSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Header */}
      <SkeletonPlaceholder.Item paddingHorizontal={16} marginTop={40}>
        <SkeletonPlaceholder.Item
          width={250}
          height={40}
          borderRadius={4}
          marginBottom={20}
        />
        {/* Playlists Section */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginBottom={10}
        >
          <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
          <SkeletonPlaceholder.Item
            width={200}
            height={32}
            borderRadius={4}
            marginLeft={10}
          />
        </SkeletonPlaceholder.Item>

        {/* List Items */}
        {[...Array(4)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            flexDirection="row"
            alignItems="center"
            marginBottom={20}
          >
            <SkeletonPlaceholder.Item
              width={55}
              height={55}
              borderRadius={8}
              marginRight={16}
            />
            <SkeletonPlaceholder.Item flex={1}>
              <SkeletonPlaceholder.Item
                width="60%"
                height={20}
                borderRadius={4}
                marginBottom={10}
              />
              <SkeletonPlaceholder.Item
                width="40%"
                height={20}
                borderRadius={4}
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
        ))}

        {/* Download Section */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          alignItems="center"
          marginTop={30}
        >
          <SkeletonPlaceholder.Item width={32} height={32} borderRadius={16} />
          <SkeletonPlaceholder.Item
            width={200}
            height={32}
            borderRadius={4}
            marginLeft={10}
          />
        </SkeletonPlaceholder.Item>

        {/* Downloaded Items */}
        <SkeletonPlaceholder.Item
          flexDirection="row"
          marginTop={20}
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width={deviceWidth * 0.44}
            height={deviceWidth * 0.3}
            borderRadius={8}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth * 0.44}
            height={deviceWidth * 0.3}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
        <SkeletonPlaceholder.Item
          flexDirection="row"
          marginTop={20}
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width={deviceWidth * 0.44}
            height={deviceWidth * 0.3}
            borderRadius={8}
          />
          <SkeletonPlaceholder.Item
            width={deviceWidth * 0.44}
            height={deviceWidth * 0.3}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default MySelectionSkeleton;
