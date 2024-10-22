import React from 'react'

    const SocialListUserProfile = ({socialListUserData}: SocialListProfileUserProps) => {
        const handleMouseOver = (event: React.MouseEvent<HTMLButtonElement>) => {
          const imgElement = event.currentTarget.querySelector('img');
          if(imgElement){
              imgElement.src ='/icons/view-icon-white.svg';
          }
      };

      const handleMouseOut = (event: React.MouseEvent<HTMLButtonElement>) => {
          const imgElement = event.currentTarget.querySelector('img');
          if(imgElement){
              imgElement.src ='/icons/view-icon-black.svg';
          }
      }
    return(
    <>
    {socialListUserData.map((profile, index) => (
      <div className="socialListProfile" key={index}>
        <div className="profile-container">
          <div className="item">
            <img src={profile.img} alt="Profile Picture" className="profileImage" />
            <div className="info">
              <h3>{profile.name}</h3>
              <span>{profile.userID}</span>
            </div>
          </div>
          <div className="viewButton">
            {/* <span>{profile.level}</span> */}
            <button className='buttonView' onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                <img 
                src='/icons/view-icon-black.svg'
                alt="View Button" 
                className='buttonViewImage'/>
            </button>
          </div>
        </div>
      </div>
    ))}
    </>
    )
  }

export default SocialListUserProfile