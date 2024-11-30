import React, { useState } from 'react'
import Image from 'next/image';

const FloatingButton = ({floatingButtonOptions}: floatingButtonProps) => {

    const[isOpen, setIsOpen] = useState(false);

    const toggleMenu = () =>{
        setIsOpen(!isOpen);
    };

  return (
    <div className='floating-button-menu'>
        <div className='floating-button' onClick={toggleMenu}>
            {isOpen ? 'X' : '+'}
        </div>
        {isOpen && floatingButtonOptions.map((option, index) => (
            <a key={index} href={option.route} className='floating-button-link'>
                <button className='floating-button-item'>
                    <Image src={option.icon} width={30} height={30} alt="Floating Button Item Icon" />
                <span className='floating-button-label'>{option.label}</span>
                </button>
                {/* <a href={option.route} className='floating-button-link'> */}
            </a>
        ))}
    </div>
    // <div className='fab-container'>
    //     <div className={`fab-menu ${(isOpen ? 'open' : '')}`}>
    //         <ul>
    //             {floatingButtonOptions.map((option, index) => (
    //                 <div key={index} className='fab-item'>
    //                     <a href={option.route} className='fab-link'>
    //                         {option.label && <span className='fab-label'>{option.label}</span>}
    //                     </a>
    //                 </div>
    //             ))}
    //         </ul>
    //     </div>
    // </div>

  )
}

export default FloatingButton