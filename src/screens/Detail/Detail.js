import React, { PureComponent } from 'react';
import {
  Easing,
  InteractionManager,
  Animated,
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

import { SharedElement, TranslateYAndOpacity } from 'react-native-motion';

import data from '../../data/data';
import { ListItem, Row } from '../../components';
import Toolbar from './Toolbar';
import BottomBar from './BottomBar';
import PureChart from 'react-native-pure-chart';


class Detail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      opacityOfDestinationItem: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.phase === 'phase-2' && nextProps.phase === 'phase-3') {
      this.sharedElementRef.moveToSource();
    }
  }
  onMoveToDestinationDidFinish = () => {
    this.setState({ opacityOfDestinationItem: 1 });
    this.props.onSharedElementMovedToDestination();
  };
  onMoveToSourceWillStart = () => {
    this.setState({ opacityOfDestinationItem: 0 });
  };
  renderItem = ({ item, index }) => {
    const { phase, selectedItem } = this.props;

    let delay = index;
    // we need it to go from the end
    if (phase === 'phase-3') {
      delay = selectedItem.items.length - index;
    }

    return (
      <TranslateYAndOpacity isHidden={phase !== 'phase-2'} delay={56 * delay}>
        <View style={styles.itemContainer}>
          <Row style={styles.rowContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.titleText}>{item.name}</Text>
            </View>
            <Text style={styles.amountText}>{item.amount}</Text>
          </Row>
          <Text style={styles.vatText}>
            {`${item.amount} X1 (Including VAT 10%)`}
          </Text>
        </View>
      </TranslateYAndOpacity>
    );
  };
  render() {
    const {
      selectedItem,
      startPosition,
      phase,
      onBackPress,
      onSharedElementMovedToSource,
    } = this.props;
    const { opacityOfDestinationItem } = this.state;

    const { items = [] } = selectedItem || {};

    let sampleData = [
      {x: '2018-01-01', y: 30},
      {x: '2018-01-02', y: 200},
      {x: '2018-01-03', y: 170},
      {x: '2018-01-04', y: 20},
      {x: '2018-01-05', y: 10}
  ];

  let sampleDataPie = [
    {
      value: 50,
      label: 'Good',
      color: '#008dff',
    }, {
      value: 40,
      label: 'Moderate',
      color: '#E0F2F1'
    }, {
      value: 25,
      label: 'High',
      color: '#E53935'
    }

  ]
    
    if (!selectedItem) {
      return null;
    }

    return (
      <View style={styles.container}>
        <Toolbar isHidden={phase === 'phase-3'} onBackPress={onBackPress} />
        <SharedElement
          ref={node => (this.sharedElementRef = node)}
          sourceId={selectedItem.name}
          easing={Easing.in(Easing.back())}
          onMoveToDestinationDidFinish={this.onMoveToDestinationDidFinish}
          onMoveToSourceWillStart={this.onMoveToSourceWillStart}
          onMoveToSourceDidFinish={onSharedElementMovedToSource}
        >
          <View
            style={{
              opacity: opacityOfDestinationItem,
              backgroundColor: 'transparent',
            }}
          >
            <ListItem
              item={selectedItem}
              onPress={() => {}}
              animateOnDidMount={false}
              isHidden={false}
            />
          </View>
        </SharedElement>
      
          <TranslateYAndOpacity isHidden={phase !== 'phase-2'} delay={36}>
            <View style={styles.itemContainer}>
              <PureChart style={styles.itemContainer} data={sampleData} type='line' />
              <View style={styles.rowContainer}>
                <Text style={styles.vatText}>
                    Temprature
                </Text>
              </View>
            </View>
            <View style={styles.rowContainer}>
              <PureChart data={sampleDataPie} type='pie' />
                <Text style={styles.vatText}>
                  Chart Wise
                </Text>
            </View>
          </TranslateYAndOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  rowContainer: {
    alignItems: 'center',
  },
  titleText: {},
  amountText: {
    fontSize: 18,
    fontWeight: '900',
  },
  vatText: {
    fontSize: 10,
    color: 'gray',
  },
});

export default Detail;
