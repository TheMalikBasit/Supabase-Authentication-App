import { useState, useEffect } from 'react';
import { supabase } from '@/lib/Supabase';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Session } from '@supabase/supabase-js';
import React from 'react';

export default function WelcomeScreen({ session }: { session: Session }){
    
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [website, setWebsite] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [UserID, setUserID] = useState('');
    
    useEffect(() => {
        if (session) getProfile();
      }, [session]);

    async function getProfile() {
        try {
          setLoading(true);
          if (!session?.user) throw new Error('No user on the session!');
    
          const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url, id, full_name`)
            .eq('id', session?.user.id)
            .single();
          
          if (error && status !== 406) {
            throw error;
          }
    
          if (data) {
            setUsername(data.username);
            setFullName(data.full_name);
            setWebsite(data.website);
            setAvatarUrl(data.avatar_url);
            setUserID(data.id);
          }
        } catch (error) {
          if (error instanceof Error) {
            Alert.alert(error.message);
          }
        } finally {
          setLoading(false);
        }
      }
  return (
    <View style={styles.DisplayContainer}>
        <View >
            <Text style={styles.UserWelcome}>Welcome {fullName}</Text>
            <Text style={styles.UserWelcome}>Your username is {username}</Text>
            <Text style={styles.UserWelcome}>Your website is {website}</Text>
        </View>

    </View>
  )
}

const styles = StyleSheet.create({
DisplayContainer:{ 
    alignItems: 'center',
    height: '100%'
},
UserWelcome: {
    fontSize: 20,
    color: "Grey",
    fontWeight: "bold",
    textAlign: 'center'
}
})