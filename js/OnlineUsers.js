import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Text, Animated, Dimensions } from 'react-native';
import randomColor from 'randomcolor';
import { connect } from 'react-redux';

const totalWidth = Dimensions.get('window').width;
const totalHeight = Dimensions.get('window').height;

const User = (props) => {

    handleCallUser = (user) => {
            props.setCallInit(user);
    }
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ elevation: 10 }}>
                <TouchableOpacity style={{ ...styles.user, ...props.bgStyle.bgColor }}
                    onPress={() => handleCallUser(props.user)}>
                    <Text style={{ color: '#fff', fontSize: 40, fontWeight: 'bold' }}>
                        {props.user.name.charAt(0).toUpperCase()}</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{props.user.name}</Text>
        </View>
    );
}

class OnlineUsers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            bounceValue: new Animated.Value(0),
        }
    }

    doAnimation = async (toValue) => {
        Animated.spring(
            this.state.bounceValue,
            {
                toValue,
                velocity: 3,
                tension: 2,
                friction: 8
            }
        ).start();
    }

    showUsers = () => {
        return this.props.onlineUsers.map(user => {
            const backGroundStyle = StyleSheet.create({
                bgColor: {
                    backgroundColor: randomColor({ luminosity: 'dark', hue: 'random' }),
                },
            })
            return (
                <User key={user.id} bgStyle={backGroundStyle} user={user} setCallInit={this.props.setCallInit} />
            )
        });
    }

    toggleShowHideUserList = () => {
        console.log('inside toggleshowhide list ');
        if(!this.props.peerConnection && this.props.onlineUsers && this.props.onlineUsers.length > 0) {
            console.log('will animate to '+0);
            this.doAnimation(0);
        }else{
            console.log('will animate to '+totalHeight/4);
            this.doAnimation(totalHeight/4);
        }
    }

    render() {
        return (
                <Animated.View style={[styles.userView, { transform: [{ translateY: this.state.bounceValue }] }]}>
                    <ScrollView horizontal={true}>
                        {this.toggleShowHideUserList()}
                        {this.showUsers()}
                    </ScrollView>
                </Animated.View>
        );
    }

}

const mapStateToProps = state => {
    return {
        peerConnection:state.peerConnection,
        onlineUsers: state.onlineUsers
    }
}

export default connect(mapStateToProps,null)(OnlineUsers);

const styles = StyleSheet.create({
    userView: {
        position: 'absolute',
        flex: 1,
        height: totalHeight / 4,
        width: totalWidth,
        bottom: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    user: {
        width: totalHeight / 6.64,
        height: totalHeight / 6.64,
        borderRadius: 100,
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    }
});