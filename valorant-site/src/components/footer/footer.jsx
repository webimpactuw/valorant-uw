import React from 'react'
import './footer.css'
import logo from '../../assets/valorant_at_uw_logo.svg';

function Footer(){ 
    return (
        <footer className='footer'>
            <div><img src={logo} alt='Logo' height={55} width={55}></img></div>
            <p className='copyright'>COPYRIGHT @2025 VALORANT AT UW</p>
        </footer>
    );
}

export default Footer 