import React from 'react';

const LeaderboardProfile = ({ leaderboardData, selectedSection, selectedOption }: LeaderboardProfileProps) => {
  const renderProfileBasedOption = () => {
    let filteredProfiles = leaderboardData;

    // Handle filtering and sorting based on the selected section (Badges, Challenges, or Community)
    if (selectedOption) {
      // If the selected option is for Badges
      if (selectedSection === "Badges") {
        filteredProfiles = leaderboardData.filter((profile) => 
          profile.badges && profile.badges.some((badge) => badge.name === selectedOption)
        );

        // Sort the filtered profiles based on badge score
        filteredProfiles.sort((a, b) => {
          const badgeA = a.badges.find((badge) => badge.name === selectedOption);
          const badgeB = b.badges.find((badge) => badge.name === selectedOption);
          
          return (badgeB?.scoreExp || 0) - (badgeA?.scoreExp || 0); // Sort by experience in descending order
        });
      }

      // If the selected option is for Challenges
      if (selectedSection === "Challenges") {
        filteredProfiles = leaderboardData.filter((profile) => 
          profile.challenges && profile.challenges.some((challenge) => challenge.name === selectedOption)
        );

        // Sort the filtered profiles based on challenge score
        filteredProfiles.sort((a, b) => {
          const challengeA = a.challenges.find((challenge) => challenge.name === selectedOption);
          const challengeB = b.challenges.find((challenge) => challenge.name === selectedOption);
          
          return (challengeB?.scorePoints || 0) - (challengeA?.scorePoints || 0); // Sort by points in descending order
        });
      }

      // If the selected option is for Community
      if (selectedSection === "Community") {
        filteredProfiles = leaderboardData.filter((profile) => 
          profile.community && profile.community.some((comm) => comm.name === selectedOption)
        );

        // Sort the filtered profiles by scoreExp in descending order
        filteredProfiles.sort((a, b) => b.scoreExp - a.scoreExp);
      }
    } else if (selectedSection) {
      // Sort profiles by scoreExp in descending order when no selectedOption
      filteredProfiles.sort((a, b) => b.scoreExp - a.scoreExp);
    }

    return filteredProfiles.map((profile, index) => {
      // Display based on whether the selectedOption is for Badges, Challenges, or Community
      if (selectedSection === "Badges" && profile.badges) {
        const badge = profile.badges.find((badge) => badge.name === selectedOption);
        if (badge) {
          return (
            <div className="leaderboardProfile" key={index}>
              <div className="profile-container">
                <div className="item">
                  <img className="image" src={profile.img} alt="Profile Picture" />
                  <div className="info">
                    <h3>{profile.name}</h3>
                    <span>{profile.location}</span>
                  </div>
                </div>
                <div className="score">
                  <span>{badge.scoreExp} Exp</span>
                </div>
              </div>
            </div>
          );
        }
      }

      if (selectedSection === "Challenges" && profile.challenges) {
        const challenge = profile.challenges.find((challenge) => challenge.name === selectedOption);
        if (challenge) {
          return (
            <div className="leaderboardProfile" key={index}>
              <div className="profile-container">
                <div className="item">
                  <img className="image" src={profile.img} alt="Profile Picture" />
                  <div className="info">
                    <h3>{profile.name}</h3>
                    <span>{profile.location}</span>
                  </div>
                </div>
                <div className="score">
                  <span>{challenge.scorePoints} Points</span>
                </div>
              </div>
            </div>
          );
        }
      }

      // For the Community section, display the profile if the community matches
      if (selectedSection === "Community" && profile.community) {
        const communityEntry = profile.community.find((comm) => comm.name === selectedOption);
        if (communityEntry) {
          return (
            <div className="leaderboardProfile" key={index}>
              <div className="profile-container">
                <div className="item">
                  <img className="image" src={profile.img} alt="Profile Picture" />
                  <div className="info">
                    <h3>{profile.name}</h3>
                    <span>{profile.location}</span>
                  </div>
                </div>
                <div className="score">
                  <span>{profile.scoreExp} Exp</span>
                </div>
              </div>
            </div>
          );
        }
      }

      // Fallback to show all profiles if no filter is applied
      return (
        <div className="leaderboardProfile" key={index}>
          <div className="profile-container">
            <div className="item">
              <img className="image" src={profile.img} alt="Profile Picture" />
              <div className="info">
                <h3>{profile.name}</h3>
                <span>{profile.location}</span>
              </div>
            </div>
            <div className="score">
              <span>{profile.scoreExp} Exp</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div id="profile">
      {renderProfileBasedOption()}
    </div>
  );
};

export default LeaderboardProfile;
