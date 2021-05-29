import React from 'react'
import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className='br2 shadow-2 Tilt' glareEnable='true' tiltMaxAngleX='55' tiltMaxAngleY='55' style={{ height: '150px', width: '150px' }}>
                <div className='pa3'>
                    <img style={{ paddingTop:'5px', height: '100px', width: '100px'}} src={brain} alt="brain logo"/>
                </div>
            </Tilt>
        </div>
    )
}

export default Logo
