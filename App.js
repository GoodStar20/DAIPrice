import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import axios from 'axios';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [price, setPrice] = useState(0);
  const [percent, setPercent] = useState(0);
  const [marketCapUsd, setMarketCapUsd] = useState(0);
  const [volume24hUsd, setVolume24hUsd] = useState(0);

  const getData = async () => {
    try {
      const response = await axios.get(
        'https://api.daiprice.org/v1/tokens/DAI/symbol',
      );
      console.log(response);
      if (response.status === 200) {
        setPrice(response.data.priceUsd);
        setPercent(response.data.priceChangePercent);
        setMarketCapUsd(response.data.marketCapUsd);
        setVolume24hUsd(response.data.volume24hUsd);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPercentPrice = (price, percent) => {
    return (Number(price * percent) / 100).toFixed(4);
  };

  useEffect(() => {
    //get data every 3s
    const interval = setInterval(() => {
      getData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  return (
    <SafeAreaView style={styles.background}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.background}>
        <View style={styles.card}>
          <Text style={styles.price}>$ {price.toFixed(4)}</Text>
          <Text
            style={[
              styles.percent,
              percent > 0 ? styles.greenText : styles.redText,
            ]}>
            $ {getPercentPrice(price, percent)} ({percent}%)
          </Text>

          <Text style={styles.title}>Dai Price Today</Text>
          <Text style={styles.description}>
            The price of Dai (DAI) today is ${price.toFixed(4)} USD, which has
            increased by ${getPercentPrice(price, percent)} ({percent}%) over
            the last 24 hours. The total number of DAI coins in circulation
            stands at {marketCapUsd.toLocaleString()} and $
            {volume24hUsd.toLocaleString()} USD has been traded for the DAI/USD
            pair across exchanges over the last 24 hours. We update our Dai to
            USD price in real-time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#F6F3F3',
    flex: 1,
  },
  card: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 16,
    borderColor: '#E4F3DC',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 10,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
  },
  price: {
    fontSize: 40,
    fontWeight: '600',
    marginTop: 20,
  },
  percent: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
  description: {
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 25,
    marginTop: 10,
  },
  greenText: {
    color: 'green',
  },
  redText: {
    color: 'red',
  },
});

export default App;
