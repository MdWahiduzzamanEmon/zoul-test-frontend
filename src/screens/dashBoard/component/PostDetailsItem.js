import React from 'react';
import { StyleSheet } from 'react-native';
import Block from '../../../components/utilities/Block';
import Text from '../../../components/utilities/Text';
import { colors } from '../../../styles/theme';

const PostDetailsItem = ({ item }) => {
  return (
    <Block
      flex={false}
      color={colors.dashboardItemMainViewColor}
      margin={[10, 0]}
      padding={[10]}
      radius={20}
    >
      <Block flex={false} row center>
        <Block flex={false} width={'20%'}>
          <Text>User Id : </Text>
        </Block>
        <Block flex={false} padding={[10, 10]} width={'80%'}>
          <Text>{item?.user_id}</Text>
        </Block>
      </Block>
      <Block flex={false} row center>
        <Block flex={false} width={'20%'}>
          <Text>Title : </Text>
        </Block>
        <Block flex={false} padding={[10, 10]} width={'80%'}>
          <Text>{item?.title}</Text>
        </Block>
      </Block>
      <Block flex={false} row center>
        <Block flex={false} width={'20%'}>
          <Text>body : </Text>
        </Block>
        <Block flex={false} padding={[10, 10]} width={'80%'}>
          <Text>{item?.title}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default PostDetailsItem;

const styles = StyleSheet.create({});
