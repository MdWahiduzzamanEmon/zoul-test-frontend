// components/skeletons/CategoriesSkeleton.js
import React from "react";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { perfectSize } from "../../styles/mixins";
import { deviceWidth } from "../../styles/theme";

const CategoriesSkeleton = () => {
  return (
    <SkeletonPlaceholder>
      {/* Back Icon */}
      <SkeletonPlaceholder.Item
        width={perfectSize(30)}
        height={perfectSize(30)}
        borderRadius={15}
        marginTop={perfectSize(50)}
        marginLeft={perfectSize(16)}
      />

      {/* Header Section */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={perfectSize(16)}
        marginTop={perfectSize(20)}
      >
        <SkeletonPlaceholder.Item width={200} height={40} borderRadius={4} />
        <SkeletonPlaceholder.Item width={100} height={30} borderRadius={5} />
      </SkeletonPlaceholder.Item>

      {/* Explore Title
      <SkeletonPlaceholder.Item
        width={200}
        height={30}
        borderRadius={4}
        marginTop={perfectSize(20)}
        marginLeft={perfectSize(16)}
      /> */}

      {/* Suggested Activities */}
      <SkeletonPlaceholder.Item
        flexDirection="row"
        flexWrap="wrap"
        paddingHorizontal={perfectSize(16)}
        marginTop={perfectSize(20)}
        justifyContent="space-between"
      >
        {[...Array(4)].map((_, index) => (
          <SkeletonPlaceholder.Item
            key={index}
            width={deviceWidth / 2 - perfectSize(30)}
            height={150}
            borderRadius={8}
            marginBottom={perfectSize(20)}
          />
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export default CategoriesSkeleton;
