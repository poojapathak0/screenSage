import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const {width: screenWidth} = Dimensions.get('window');

const ScreenTimeChart = ({data}) => {
  // Process data for the last 7 days
  const processChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      values.push(Math.round((data[dateString] || 0) / 60)); // Convert to hours
    }

    return {
      labels: days,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6366f1',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Screen Time (Hours)</Text>
      <LineChart
        data={processChartData()}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  chart: {
    borderRadius: 12,
  },
});

export default ScreenTimeChart;
