import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PaginationDotsProps {
  totalDots: number;
  activeIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({ totalDots, activeIndex }) => {
  return (
    <View style={styles.paginationDotsContainer}>
      {[...Array(totalDots)].map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === activeIndex ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // Position dots at the bottom relative to their parent container
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 10, // Add some padding for better spacing
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#007bff', // Active dot color
  },
  inactiveDot: {
    backgroundColor: '#ccc', // Inactive dot color
  },
});

export default PaginationDots;
