import styled from 'styled-components/native';
import LottieView from 'lottie-react-native';
import ensolarado from '../../assets/animation/ensolarado.json';
import chuva from '../../assets/animation/chuva.json';
import nublado from '../../assets/animation/nevoa.json';
import parcialmenteNublado from '../../assets/animation/parcialmenteNublado.json';
import claro from '../../assets/animation/claro.json';

const getAnimation = (animation) => {
  if (animation === 'ensolarado') return ensolarado;
  if (animation === 'chuva') return chuva;
  if (animation === 'nublado') return nublado;
  if (animation === 'parcialmenteNublado') return parcialmenteNublado;
  if (animation === 'claro') return claro
  return ensolarado;
};

export const LottieAnimation = styled(LottieView).attrs((props) => ({
  source: getAnimation(props.animation),
}))`
  width: ${(props) => props.width || '180px'};
  height: ${(props) => props.height || '180px'};
`;
