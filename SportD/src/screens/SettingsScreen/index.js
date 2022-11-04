import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors} from '../../constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={{flexGrow: 1}}>
        <View style={{backgroundColor: '#fff', flex: 1}}>
          <View>
            <TouchableOpacity
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
                borderTopColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>Privacy</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>Language</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>
        </View>
        <View style={{marginTop: 30, backgroundColor: '#fff'}}>
          <View>
            <TouchableOpacity
              style={{
                borderTopWidth: 1,
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
                borderTopColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>About this Version</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>Terms of Use</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>

          <View>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>Privacy Policy</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>Get Support</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>
        </View>

        <View style={{marginTop: 30, backgroundColor: '#fff'}}>
          <View>
            <TouchableOpacity
              style={{
                borderBottomWidth: 1,
                padding: 10,
                height: 50,
                justifyContent: 'center',
                borderBottomColor: '#f2f2f2',
              }}>
              <Text style={styles.text}>Delete Account</Text>
            </TouchableOpacity>
            <Ionicons
              style={styles.iconRight}
              name="chevron-forward"
              size={20}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: colors.primaryColor,
  },
  iconRight: {
    position: 'absolute',
    right: 10,
    top: 15,
    color: colors.primaryColor,
  },
});
