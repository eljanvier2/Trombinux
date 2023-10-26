import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { theme } from '../../components/Colors';



const NewsWidget = (props) => {
    const [articles, setArticles] = useState([]);
    const { theme } = props;

    const [currentTitle, setCurrentTitle] = useState("");

    useEffect(() => {
        const fetchArticles = async () => {
            const response = await axios.get(
                `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`
            );
            setArticles(response.data.articles);
            setCurrentTitle(response.data.articles[0].title);
        };
        fetchArticles();
    }, []);

    return (
        <View style={[styles.container, {backgroundColor: theme.fourthColor}]}>
            <Text style={[styles.title, {color: theme.primaryColor}]}>
                Breaking News
            </Text>
            {articles.length > 0 && (
                <View key={currentTitle}>
                    <Text style={[styles.title, {color: theme.primaryColor}]}>
                        {currentTitle}
                    </Text>
                    <Text style={[styles.fact, {color: theme.primaryColor}]}>
                        {articles[0].description}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        marginBottom: "3%",
        padding: 15,
        width: "90%",
        minWidth: "90%",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: "HammersmithOne-Regular",
    },
    fact: {
        fontSize: 18,
        fontStyle: 'italic',
        color: 'white',
        textAlign: 'left',
        maxWidth: "100%",
    },
});

export default NewsWidget;