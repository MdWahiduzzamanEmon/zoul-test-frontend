import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "../utilities/Text";
import Block from "../utilities/Block";
import CustomDropDown from "../customDropDown/CustomDropDown";
import { scaleSize } from "../../styles/mixins";
import CloseIcon from "../common/SvgIcons/CloseIcon";
import SectionFive from "../LetterSections/SectionFive";
import SectionOne from "../LetterSections/SectionOne";
import SectionTwo from "../LetterSections/SectionTwo";
import SectionSix from "../LetterSections/SectionSix";
import SectionThree from "../LetterSections/SectionThree";
import SectionSeven from "../LetterSections/SectionSeven";
import SectionEight from "../LetterSections/SectionEight";
import { SectionFour } from "../LetterSections/SectionFour";
import { handleLanguageChange } from "../../helpers/app";
import { useLocale } from "../../context/LocaleProvider";
import { useDispatch } from "react-redux";
import RNRestart from "react-native-restart";
import SectionNine from "../LetterSections/SectionNine";
import SectionTen from "../LetterSections/SectionTen";

const LetterSectionModal = ({
  isVisible,
  hideModal,
}: {
  isVisible: boolean;
  hideModal: () => void;
}) => {
  const dispatch = useDispatch();
  const { changeLocale } = useLocale();

  return (
    <Modal
      statusBarTranslucent={true}
      transparent={true}
      visible={isVisible}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        <Block flex={1}>
          <Block
            flex={false}
            style={{
              paddingTop: scaleSize(39),
              paddingHorizontal: scaleSize(21),
            }}
            row
            right
            gap={10}
            center
            // marginBottom={scaleSize(10)}
          >
            {/* <CustomDropDown
              onChange={(lg) => {
                handleLanguageChange(lg, dispatch, changeLocale);
                RNRestart.Restart();
              }}
            /> */}
            <Block flex={false} gap={3} row center right>
              <TouchableOpacity onPress={() => hideModal()}>
                <Text size={scaleSize(17)} regular color={"#DFCBCD"}>
                  Close
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => hideModal()}>
                <CloseIcon height={28} />
              </TouchableOpacity>
            </Block>
          </Block>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <Block flex={false} row middle>
              <SectionOne />
            </Block>
            <Block flex={false} row middle>
              <SectionTwo />
            </Block>
            <Block flex={1} row middle>
              <SectionThree />
            </Block>
            <Block flex={1} row middle>
              <SectionFour />
            </Block>
            <Block flex={false} row middle>
              <SectionTen />
            </Block>
            <Block flex={false} row middle>
              <SectionNine />
            </Block>
            <Block flex={false} row middle>
              <SectionFive />
            </Block>
            <Block flex={false} row middle>
              <SectionSix />
            </Block>
            <Block flex={false} row middle>
              <SectionSeven />
            </Block>
            <Block flex={false} row middle>
              <SectionEight />
            </Block>
          </ScrollView>
        </Block>
      </View>
    </Modal>
  );
};

export default LetterSectionModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgb(65,1,19)",
  },
});
