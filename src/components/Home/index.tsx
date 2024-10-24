import React, { useState, useEffect } from "react";
import { FlatList, Alert, Text, Dimensions, View, Modal, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, PermissionsAndroid, Platform } from "react-native";
import * as Styled from './styles';
import axios from 'axios';
import Local from '@react-native-community/geolocation';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from 'styled-components';
import Lottie from "../lottie";
import { format } from 'date-fns';

const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Permissão de Localização',
                    message: 'Este aplicativo precisa acessar sua localização.',
                    buttonNeutral: 'Perguntar depois',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    } else {
        // Para iOS, você pode usar o pacote react-native-permissions
        const { results } = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        return results[0] === RESULTS.GRANTED;
    }
};

export default function Home({ setTheme }) {
    const [location, setLocation] = useState(null);
    const [currentTemp, setCurrentTemp] = useState(null);
    const [minTempToday, setMinTempToday] = useState(null);
    const [maxTempToday, setMaxTempToday] = useState(null);
    const [municipio, setMunicipio] = useState('localização...');
    const [lat, setLat] = useState(0);
    const [lon, setLon] = useState(0);
    const [weatherCondition, setWeatherCondition] = useState('Carregando...');
    const [forecastData, setForecastData] = useState([]);
    const [humidity, setHumidity] = useState(null);
    const [lastHours, setLastHours] = useState([])
    const [apparentTemperature, setApparentTemperature] = useState(null);
    const theme = useTheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const searchLocal = () => {
        Local.getCurrentPosition(
            (posicionamento) => {
                setLat(posicionamento.coords.latitude);
                setLon(posicionamento.coords.longitude);
                reverseGeocode(posicionamento.coords.latitude, posicionamento.coords.longitude);
            },
            (error) => {
                Alert.alert('Erro', error.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
        );
    };

    useEffect(() => {
        const checkPermissions = async () => {
            const granted = await requestLocationPermission();
            if (granted) {
                searchLocal();
            } else {
                Alert.alert('Permissão de Localização Negada', 'Não foi possível acessar a localização.');
            }
        };
    
        checkPermissions();
    }, []);

    const chartConfig = {
        backgroundGradientFrom: theme.colors.background,
        backgroundGradientTo: theme.colors.footer,
        color: (opacity = 1) => theme.colors.text,
        labelColor: (opacity = 1) => theme.colors.text,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
    };

    const reverseGeocode = async (latitude, longitude) => {
        const apiKey = 'AIzaSyCcrnWjIiMOVt_0JTMbTeRp0RM4X-yuRoA';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        try {
            const response = await axios.get(url);
            const addressComponents = response.data.results[0].address_components;
            const city = addressComponents.find(component => component.types.includes('administrative_area_level_2'));
            if (city) {
                setMunicipio(city.long_name);
            } else {
                setMunicipio("Município não encontrado");
            }
        } catch (error) {
            Alert.alert("Erro ao obter o município", error.message);
        }
    };

    const getWeatherCondition = (temperature, precipitation) => {
        if (precipitation > 0) {
            return "Chovendo";
        } else if (temperature >= 25) {
            return "Ensolarado";
        } else if (temperature < 20) {
            return "Nublado";
        } else {
            return "Parcialmente Nublado";
        }
    };


    const getPosts = async () => {
        try {
            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,rain&daily=temperature_2m_max,temperature_2m_min`
            );
            console.log('responsedata', response.data)
            const currentTemperature = response.data.current_weather.temperature;
            const currentPrecipitation = response.data.current_weather.precipitation;
            const currentHumidity = response.data.hourly.relative_humidity_2m[0];
            const minTemperatureToday = response.data.daily.temperature_2m_min[0];
            const maxTemperatureToday = response.data.daily.temperature_2m_max[0];
            const condition = getWeatherCondition(currentTemperature, currentPrecipitation);
            const feelslike = response.data.hourly.apparent_temperature[0]

            const hourlyTemperatures = response.data.hourly.apparent_temperature;
            const specificHoursTemperatures = [
                `${hourlyTemperatures[0]}C`,
                hourlyTemperatures[6],
                hourlyTemperatures[12],
                hourlyTemperatures[18],
                hourlyTemperatures[23]
            ];
            setLastHours(specificHoursTemperatures);

            setWeatherCondition(condition);
            setCurrentTemp(Math.floor(currentTemperature));
            setMinTempToday(Math.floor(minTemperatureToday));
            setMaxTempToday(Math.floor(maxTemperatureToday));
            setHumidity(currentHumidity)
            setApparentTemperature(feelslike)

            const forecast = response.data.daily.temperature_2m_max.map((maxTemp, index) => ({
                id: index.toString(),
                maxTemp: Math.floor(maxTemp),
                minTemp: Math.floor(response.data.daily.temperature_2m_min[index]),
                weather: getWeatherCondition(maxTemp, 0),
                imageUrl: 'https://cdn.weatherapi.com/weather/64x64/day/116.png'
            }));

            setForecastData(forecast);
            setLoading(false);
        } catch (error) {
            console.error('Erro ao listar locais:', error);
            setLoading(false);
        }
    };

    const getLastHoursLabels = () => {
        const currentDate = new Date();
        const hoursLabels = [];
        for (let i = 0; i <= 24; i += 6) {
            const date = new Date(currentDate);
            date.setHours(currentDate.getHours() - i);
            const hourLabel = `${date.getHours().toString().padStart(2, '0')}:00`;
            hoursLabels.unshift(hourLabel);
        }
        return hoursLabels;
    };

    const labels = getLastHoursLabels();
    const lastHoursWithC = lastHours.map(temp => `${temp}C`);

    const data = {
        labels: labels,
        datasets: [
            {
                data: lastHours.map(temp => parseFloat(temp)),
                strokeWidth: 2,
            }
        ]
    };


    useEffect(() => {
        if (weatherCondition === 'Nublado') {
            setTheme('medium');
        } else if (weatherCondition === 'Chovendo') {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }, [weatherCondition]);

    useEffect(() => {
        searchLocal();
    }, []);

    useEffect(() => {
        if (lat && lon) {
            getPosts();
        }
    }, [lat, lon]);



    const getGeocode = async (cityName) => {
        const apiKey = 'AIzaSyCcrnWjIiMOVt_0JTMbTeRp0RM4X-yuRoA';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cityName)}&key=${apiKey}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.status === 'OK') {
                const location = data.results[0].geometry.location;
                const latitude = location.lat;
                const longitude = location.lng;

                console.log(`Latitude2: ${latitude}, Longitude2: ${longitude}`);
                return { latitude, longitude };
            } else {
                throw new Error('Não foi possível localizar esse endereço: ' + data.status);
            }
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const { latitude, longitude } = await getGeocode(searchQuery);

            if (latitude && longitude) {
                setLat(latitude);
                setLon(longitude);
                setMunicipio(searchQuery); // Define o nome do município com base na pesquisa
                setModalVisible(false); // Fecha o modal após a pesquisa
            } else {
                Alert.alert('Erro', 'Local não encontrado');
            }
        } catch (error) {
            console.error('Erro ao buscar a localização:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao buscar a localização.');
        }
    };

    const getNext7Days = () => {
        const today = new Date();
        const days = [];

        for (let i = 1; i <= 7; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i);
            days.push(format(nextDay, 'dd/MM'));
        }

        return days;
    };

    const [next7Days, setNext7Days] = useState([]);

    useEffect(() => {
        setNext7Days(getNext7Days());
    }, []);

    const marginTop = Platform.OS === 'android' ? 30 : 0;

    return (
        <Styled.Container showsVerticalScrollIndicator={false} style={{ marginTop }}>
          {
    !loading ? (
        <>
            <Styled.Navigation>
                <Styled.TouchableOptions onPress={() => setModalVisible(true)}>
                    <Styled.Icon source={require('../../assets/options.png')} />
                </Styled.TouchableOptions>
                <Styled.CountryContainer>
                    <Styled.Country>
                        <Styled.Title>{municipio}</Styled.Title>
                    </Styled.Country>
                </Styled.CountryContainer>
            </Styled.Navigation>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <Styled.ModalContainer>
                        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                            <Styled.WrapperModal>
                                <Styled.InputModal
                                    placeholder="Insira o nome da cidade"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    placeholderTextColor={'white'}
                                    style={{ borderBottomWidth: 1, marginBottom: 20 }}
                                />
                                <Styled.WrapperTouchable>
                                    <Styled.TouchableModal onPress={handleSearch}>
                                        <Styled.LabelModal>Consultar</Styled.LabelModal>
                                    </Styled.TouchableModal>
                                    <Styled.TouchableModal2 onPress={() => setModalVisible(false)}>
                                        <Styled.LabelModal>Voltar</Styled.LabelModal>
                                    </Styled.TouchableModal2>
                                </Styled.WrapperTouchable>
                            </Styled.WrapperModal>
                        </TouchableWithoutFeedback>
                    </Styled.ModalContainer>
                </TouchableWithoutFeedback>
            </Modal>

            <Styled.Main>
                <Styled.ContainerImage>
                    {weatherCondition === 'Ensolarado' ? (
                        <Lottie height={'200px'} width={'200px'} autoplay={true} loop={true} animation={'ensolarado'} />
                    ) : weatherCondition === 'Chovendo' ? (
                        <Lottie height={'200px'} width={'200px'} autoplay={true} loop={true} animation={'chuva'} />
                    ) : weatherCondition === 'Nublado' ? (
                        <Lottie height={'200px'} width={'200px'} autoplay={true} loop={true} animation={'nublado'} />
                    ) : weatherCondition === 'Parcialmente Nublado' ? (
                        <Lottie height={'200px'} width={'200px'} autoplay={true} loop={true} animation={'parcialmenteNublado'} />
                    ) : (
                        <Lottie height={'200px'} width={'200px'} autoplay={true} loop={true} animation={'claro'} />
                    )}
                </Styled.ContainerImage>

                <Styled.Temperature>
                    <Styled.TemperatureContainer>
                        <Styled.TitleTemperature>{currentTemp ? `${currentTemp}°` : '...'}</Styled.TitleTemperature>
                    </Styled.TemperatureContainer>
                    <Styled.WeatherContainer>
                        <Styled.Weather>{weatherCondition}</Styled.Weather>
                        <Styled.Humidity>Humidade - {humidity}%</Styled.Humidity>
                        <Styled.FeelsContainer>
                            <Styled.FeelsLike>Sensação Térmica - {apparentTemperature}°</Styled.FeelsLike>
                        </Styled.FeelsContainer>
                    </Styled.WeatherContainer>
                </Styled.Temperature>
            </Styled.Main>

            <Styled.Section>
                <Styled.ArticleHeader>
                    <Styled.TitleToday>HOJE</Styled.TitleToday>
                    <Styled.ContainerToday>
                        {weatherCondition === 'Ensolarado' ? (
                            <Styled.TodayImage source={require('../../assets/ensolarado.png')} />
                        ) : weatherCondition === 'Chovendo' ? (
                            <Styled.TodayImage source={require('../../assets/chuvaFraca.png')} />
                        ) : weatherCondition === 'Nublado' ? (
                            <Styled.TodayImage source={require('../../assets/nevoa.png')} />
                        ) : weatherCondition === 'Parcialmente Nublado' ? (
                            <Styled.TodayImage source={require('../../assets/parcialmenteNublado.png')} />
                        ) : (
                            <Styled.TodayImage source={require('../../assets/claro.png')} />
                        )}
                        <Styled.TempToday>
                            {minTempToday !== null && maxTempToday !== null ? `${minTempToday}° / ${maxTempToday}°` : 'Carregando...'}
                        </Styled.TempToday>
                        <Styled.TodayWeather>{weatherCondition}</Styled.TodayWeather>
                    </Styled.ContainerToday>
                </Styled.ArticleHeader>

                <Styled.ArticleMain>
                    <Styled.TitleToday style={{ marginLeft: 10 }}>PRÓXIMOS 7 DIAS</Styled.TitleToday>
                    <FlatList
                        data={forecastData}
                        renderItem={({ item, index }) => (
                            <Styled.ArticleFooter>
                                <Styled.TempToday>{next7Days[index]}</Styled.TempToday>
                                {item.weather === 'Ensolarado' ? (
                                    <Styled.TodayImage source={require('../../assets/ensolarado.png')} />
                                ) : item.weather === 'Chovendo' ? (
                                    <Styled.TodayImage source={require('../../assets/chuvaFraca.png')} />
                                ) : item.weather === 'Nublado' ? (
                                    <Styled.TodayImage source={require('../../assets/nevoa.png')} />
                                ) : item.weather === 'Parcialmente Nublado' ? (
                                    <Styled.TodayImage source={require('../../assets/parcialmenteNublado.png')} />
                                ) : (
                                    <Styled.TodayImage source={require('../../assets/claro.png')} />
                                )}
                                <Styled.TempToday>{`${item.minTemp}° / ${item.maxTemp}°`}</Styled.TempToday>
                                <Styled.AllTemp>{item.weather}</Styled.AllTemp>
                            </Styled.ArticleFooter>
                        )}
                        keyExtractor={item => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20, flexGrow: 0 }}
                    />
                </Styled.ArticleMain>
            </Styled.Section>

            <Styled.ArticleEstatist>
                <Styled.TitleEstatisc>TEMPERATURA DAS ÚLTIMAS 24 HORAS</Styled.TitleEstatisc>
                <View>
                    <LineChart
                        data={data}
                        width={330}
                        height={200}
                        style={{ borderRadius: 10, marginBottom: 20 }}
                        chartConfig={chartConfig}
                        bezier
                    />
                </View>
            </Styled.ArticleEstatist>
        </>
    ) : (
        <Styled.ContainerLoading>
            <Styled.Loading color="#000"/>
        </Styled.ContainerLoading>
    )
}

          
        </Styled.Container>
    );
}
