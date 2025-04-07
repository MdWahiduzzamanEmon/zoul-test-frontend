import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { perfectSize, WINDOW_WIDTH } from "../../styles/mixins";

const ProfileSkeleton = () => {
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
        <SkeletonPlaceholder.Item width={120} height={30} borderRadius={4} />
        <SkeletonPlaceholder.Item width={48} height={48} borderRadius={24} />
      </SkeletonPlaceholder.Item>

      {/* Profile Image and Name */}
      <SkeletonPlaceholder.Item flex={1} alignItems="center" marginTop={20}>
        <SkeletonPlaceholder.Item width={100} height={100} borderRadius={50} />
        <SkeletonPlaceholder.Item
          width={150}
          height={20}
          borderRadius={4}
          marginTop={20}
        />
      </SkeletonPlaceholder.Item>

      {/* Invite Friends Section */}
      <SkeletonPlaceholder.Item marginTop={120} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={200}
          height={20}
          borderRadius={4}
          marginBottom={10}
        />
        <SkeletonPlaceholder.Item
          flexDirection="row"
          justifyContent="space-between"
        >
          <SkeletonPlaceholder.Item
            width={WINDOW_WIDTH - 32}
            height={120}
            borderRadius={8}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>

      {/* Favorite Seasons Section */}
      <SkeletonPlaceholder.Item marginTop={30} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={200}
          height={20}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item
          width={WINDOW_WIDTH - 32}
          height={180}
          borderRadius={8}
        />
      </SkeletonPlaceholder.Item>

      {/* Download History Section */}
      <SkeletonPlaceholder.Item marginTop={30} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={200}
          height={20}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item
          width={WINDOW_WIDTH - 32}
          height={180}
          borderRadius={8}
        />
      </SkeletonPlaceholder.Item>

      {/* Activity History Section */}
      <SkeletonPlaceholder.Item marginTop={30} paddingHorizontal={16}>
        <SkeletonPlaceholder.Item
          width={200}
          height={20}
          borderRadius={4}
          marginBottom={20}
        />
        <SkeletonPlaceholder.Item
          width={WINDOW_WIDTH - 32}
          height={180}
          borderRadius={8}
        />
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default ProfileSkeleton;
