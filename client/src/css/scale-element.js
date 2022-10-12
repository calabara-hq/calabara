import { css } from 'styled-components'


const grow = 1.01
const shrink = 0.99

export const scaleElement = css`
    transition-duration: 0.3s;
    transition-property: transform;
    transform: translateZ(0);
    box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: rgba(0,0,0,0);
    transition: visibility 0.5s;
	&:hover {
        transform: scale(${grow});
	}
    &:active {
        transform: scale(${shrink})
    }
    &:active::after{
        transform: scale(${1 / (shrink * grow)})
    }

`