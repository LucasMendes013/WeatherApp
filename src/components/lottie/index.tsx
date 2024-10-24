import React from "react";
import * as Styled from './styles';

export default function Lottie({height, width, autoplay, loop, animation}) {
    return (
        <>
        <Styled.LottieAnimation
            autoPlay={autoplay}
            loop={loop}
            height={height}
            width={width}
            animation={animation}
            
        />
        </> 
    );
}

