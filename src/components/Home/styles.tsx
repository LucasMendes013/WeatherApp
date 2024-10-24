import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background}; 
`;

export const Navigation = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
`;

export const TouchableOptions = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.colors.button}; 
  border-radius: 8px;
  padding: 2px;
  margin-right: auto;
`;

export const Icon = styled.Image`
  width: 20px;
  height: 20px;
`;

export const CountryContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const FixCountry = styled.View`

`

export const Country = styled.Text`
  font-weight: bold;
  font-size: 30px;
  color: ${({ theme }) => theme.colors.title}; 
`;

export const Title = styled.Text`
  text-align: center;
`

export const Main = styled.View`
  justify-content: center;
  margin: 0px 20px;
`

export const ContainerImage = styled.View`
  align-items: center;
  justify-content: center;
`

export const Image = styled.Image`
  width: 120px;
  height: 120px;
`

export const Temperature = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
  margin: 10px;
  padding: 0px 0px 0px 5px;
`

export const TemperatureContainer = styled.View`
`

export const TitleTemperature = styled.Text`
  font-size: 95px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.title}; 
`

export const WeatherContainer = styled.View`
  margin: 0px 0px 20px 10px;
`

export const Weather = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.title}; 
`

export const Humidity = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.title}; 
`

export const FeelsContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.header}; 
  margin: 5px 0px 0px 0px;
  border-radius: 10px;
  padding: 2px 8px;
  position: relative;
  right: 5px;
`

export const FeelsLike = styled.Text`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.title}; 

`


export const Section = styled.View`
  flex-direction: row;
  margin: 0px 8px;
`

export const ArticleHeader = styled.View`
  background-color: ${({ theme }) => theme.colors.header}; 
  padding: 22px 25px;
  border-radius: 10px;
  align-items: center;

  margin: 0px 10px;
`

export const ContainerToday = styled.View `
  margin: 30px 0px 0px 0px;
  align-items: center;
  justify-content: center;
`

export const TitleToday = styled.Text`
  color: ${({ theme }) => theme.colors.title}; 
  font-weight: bold;
`

export const TodayImage = styled.Image`
  width: 55px;
  height: 55px;

`

export const TempToday = styled.Text`
  color: ${({ theme }) => theme.colors.title}; 
  font-weight: bold;
  padding: 4px 0px;
`

export const AllTemp = styled.Text`
  color: ${({ theme }) => theme.colors.gray};
  font-size: 12px;
  max-width: 100px; 
  flex-wrap: wrap; 
  text-align: center;

`

export const TodayWeather = styled.Text`
   color: ${({ theme }) => theme.colors.gray};
  font-size: 12px;
  max-width: 100px; 
  flex-wrap: wrap; 
  text-align: center;
  height: 50px;
`


export const ArticleMain = styled.View`
  background-color: ${({ theme }) => theme.colors.header}; 
  padding: 20px 10px 16px 10px;
  border-radius: 10px;
  justify-content: center;
  margin-right: 8px;
  flex: 1;
`

export const ArticleFooter = styled.View`
  background-color: ${({ theme }) => theme.colors.header}; 
  padding: 10px 5px;
  border-radius: 10px;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 3px 0px 0px;
  border: 1px solid ;
  border-color: ${({ theme }) => theme.colors.background};
  width: 100px;
`

export const ArticleEstatist = styled.View`
  background-color: ${({ theme }) => theme.colors.header}; 
  padding: 0px 10px;
  border-radius: 10px;
  justify-content: center;
  margin: 10px 15px;
`

export const TitleEstatisc = styled.Text `
  color: ${({ theme }) => theme.colors.title}; 
  font-weight: bold;
  margin: 15px 0px;
`

export const ModalContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const WrapperModal = styled.View`
  width: 80%;
  background-color: ${({theme}) => theme.colors.footer};
  padding: 20px;
  border-radius: 10px;
`

export const InputModal = styled.TextInput `
  border-bottom-width: 1px;
  margin-bottom: 20px;
  border-color: white;
  color: white;
  padding: 10px 0px;
`

export const WrapperTouchable = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const TouchableModal = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.button};
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  width: 60%; 
  align-items: center;
`

export const TouchableModal2 = styled.TouchableOpacity`
  background-color: ${({theme}) => theme.colors.button};
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  width: 25%; 
  align-items: center;
`

export const LabelModal = styled.Text`
  color: ${({theme}) => theme.colors.text};
  font-weight: bold;
`

export const ContainerLoading = styled.View`
  align-items: center;
  justify-content: center;
  align-content: center;
  flex: 1;
  height: 100%;
  margin-top: 350px;
`

export const Loading = styled.ActivityIndicator`

`