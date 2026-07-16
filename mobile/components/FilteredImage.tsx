import { forwardRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Filter, FeColorMatrix, Image as SvgImage } from 'react-native-svg';
import { FilterRecipe } from '../constants/styles';
import { buildColorMatrix } from '../lib/colorMatrix';

type Props = {
  uri: string;
  filter: FilterRecipe;
  width: number;
  height: number;
};

// Renders a photo with a style's color-grading filter applied live, using
// react-native-svg's built-in feColorMatrix support (a standard, stable
// part of react-native-svg -- works in Expo Go, no custom native build
// needed). Wrapped in forwardRef so a parent can capture this exact view
// with react-native-view-shot to save/share the styled result.
const FilteredImage = forwardRef<View, Props>(({ uri, filter, width, height }, ref) => {
  const matrix = buildColorMatrix(filter);
  const filterId = 'styleFilter';
  const barHeight = filter.letterbox ? height * 0.12 : 0;

  return (
    <View ref={ref} style={{ width, height, backgroundColor: '#000' }} collapsable={false}>
      <Svg width={width} height={height}>
        <Defs>
          <Filter id={filterId}>
            <FeColorMatrix type="matrix" values={matrix.join(' ')} />
          </Filter>
        </Defs>
        <SvgImage
          href={{ uri }}
          x={0}
          y={0}
          width={width}
          height={height}
          preserveAspectRatio="xMidYMid slice"
          filter={`url(#${filterId})`}
        />
      </Svg>
      {filter.letterbox && (
        <>
          <View style={[styles.letterboxBar, { height: barHeight, top: 0 }]} />
          <View style={[styles.letterboxBar, { height: barHeight, bottom: 0 }]} />
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  letterboxBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#000000',
  },
});

export default FilteredImage;
