import React from 'react';
import {MaterialCommunityIcons, MaterialIcons, Ionicons, AntDesign, FontAwesome,FontAwesome5,Feather,Entypo,Fontisto } from '@expo/vector-icons';
import { Icon } from 'native-base';

class IconExtra extends React.Component {

  render() {
    const { name, size, family, color, ...rest } = this.props;
    
    if (name && family) { 
      if (family === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons color={color} size={size} name={name} {...rest} />;
      }
      if (family === 'MaterialIcons') {
        return <MaterialIcons color={color} size={size} name={name} {...rest} />;
      }
      if (family === 'AntDesign') {
        return <AntDesign color={color} size={size} name={name} {...rest} />;
      }
      if (family === 'Ionicons') {
        return <Ionicons color={color} size={size} name={name} {...rest} />;
      }
      if (family === 'MaterialIcons1') {
        return <MaterialIcons name={name} size={size} color={color} {...rest} />;
      }
      if (family === 'FontAwesome') {
        return <FontAwesome name={name} size={size} color={color} {...rest} />;
      }
      if (family === 'FontAwesome5') {
        return <FontAwesome5 name={name} size={size} color={color} {...rest} />;
      }
      if (family === 'Feather') {
        return <Feather name={name} size={size} color={color} {...rest} />;
      }
      if (family === 'Entypo') {
        return <Entypo name={name} size={size} color={color} {...rest} />;
      }
      if (family === 'Fontisto') {
        return <Fontisto name={name} size={size} color={color} {...rest} />;
      }
      return <Icon name={name} size={size} family={family} {...rest} />;
    }

    return null;
  }
}

export default IconExtra;
