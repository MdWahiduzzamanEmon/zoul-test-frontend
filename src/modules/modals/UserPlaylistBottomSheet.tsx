import React, { useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

interface IUserPlaylistBottomSheet {
  selectedSnappoint: number;
  setSelectedSnappoint: React.Dispatch<React.SetStateAction<number>>;
  selectedAudio: string;
  selectedMode: "display" | "create";
  selectDisplayMode: () => void;
  selectCreateMode: () => void;
}

const UserPlaylistBottomSheet: React.FC<IUserPlaylistBottomSheet> = ({
  selectedSnappoint,
  setSelectedSnappoint,
  selectedAudio,
  selectedMode,
  selectDisplayMode,
  selectCreateMode,
}) => {
  const { userPlaylists } = [];
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => {
    if (selectedMode === "create") {
      return ["28%"];
    } else if (userPlaylists?.length === 0) {
      return ["18%"];
    } else if (userPlaylists?.length && userPlaylists?.length < 3) {
      return ["40%"];
    } else if (userPlaylists?.length && userPlaylists?.length === 3) {
      return ["45%"];
    } else {
      return ["52%"];
    }
  }, [selectedMode, userPlaylists?.length]);

  const handleSheetChanges = useCallback(
    (index: number) => {
      setSelectedSnappoint(index);
    },
    [setSelectedSnappoint]
  );

  return (
    <BottomSheet
      handleIndicatorStyle={styles.indicatorStyle}
      backgroundStyle={styles.bottomSheetBackground}
      index={selectedSnappoint}
      snapPoints={snapPoints}
      enablePanDownToClose
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
    >
      {/* <UserPlaylistsModalContent
        closeBottomSheet={closeBottomSheet}
        selectedMode={selectedMode}
        selectDisplayMode={selectDisplayMode}
        selectCreateMode={selectCreateMode}
        selectedAudio={selectedAudio}
      /> */}
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: "#323232",
  },
  indicatorStyle: { display: "none" },
});

export default UserPlaylistBottomSheet;
