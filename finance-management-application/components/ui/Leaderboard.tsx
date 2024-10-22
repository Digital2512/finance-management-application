'use client'

import React, { useState, useEffect } from 'react'
import LeaderboardProfile from './LeaderboardProfile';
import { group, profile } from 'console';

const LeaderboardFakeData: LeaderboardProfile[] = [
  {
      name: "Shawn Hanna",
      location: "India",
      scoreExp: 1550,
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2022-02-10"),
      badges: [
          { name: "Achievement Badge", userID: "Shawn Hanna", scoreExp: 500 },
          { name: "Explorer Badge", userID: "Shawn Hanna", scoreExp: 1050 }
      ],
      challenges: [],
      community: []
  },
  {
      name: "Fidel Hand",
      location: "USA",
      scoreExp: 2310,
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2021-01-01"),
      badges: [
          { name: "Achievement Badge", userID: "Fidel Hand", scoreExp: 1500 },
          { name: "Explorer Badge", userID: "Fidel Hand", scoreExp: 810 }
      ],
      challenges: [],
      community: []
  },
  {
      name: "Bessie Hickle",
      location: "China",
      scoreExp: 350,
      img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2021-08-17"),
      badges: [
          { name: "Explorer Badge", userID: "Bessie Hickle", scoreExp: 350 }
      ],
      challenges: [],
      community: []
  },
  {
      name: "Adella Wunsch",
      location: "Japan",
      scoreExp: 2100,
      img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2021-10-23"),
      badges: [],
      challenges: [],
      community: []
  },
  {
      name: "Clair O'Connell",
      location: "London",
      scoreExp: 1250,
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2022-01-22"),
      badges: [],
      challenges: [
          { name: "Time Attack", userID: "Clair O'Connell", scorePoints: 150 },
          { name: "Strategy Master", userID: "Clair O'Connell", scorePoints: 300 }
      ],
      community: [
          { name: "Time Attack Group", userID: "Elena Carter", scoreExp: 350 },
      ]
  },
  {
      name: "Kameron Prosacco",
      location: "Canada",
      scoreExp: 5250,
      img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2022-01-21"),
      badges: [],
      challenges: [
          { name: "Time Attack", userID: "Kameron Prosacco", scorePoints: 400 },
          { name: "Strategy Master", userID: "Kameron Prosacco", scorePoints: 200 }
      ],
      community: [
          { name: "Time Attack Group", userID: "Elena Carter", scoreExp: 350 },
      ]
  },
  {
      name: "Xiao Li",
      location: "China",
      scoreExp: 3200,
      img: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2022-03-15"),
      badges: [],
      challenges: [
          { name: "Strategy Master", userID: "Xiao Li", scorePoints: 500 }
      ],
      community: [
          { name: "Time Attack Group", userID: "Elena Carter", scoreExp: 350 },
          { name: "Troop Attack Group", userID: "Elena Carter", scoreExp: 400 }
      ]
  },
  {
      name: "Elena Carter",
      location: "USA",
      scoreExp: 1800,
      img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHx8&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
      dateLastUpdated: new Date("2022-02-05"),
      badges: [], 
      challenges: [
          { name: "Time Attack", userID: "Elena Carter", scorePoints: 350 },
          { name: "Strategy Master", userID: "Elena Carter", scorePoints: 400 }
      ],
      community: [
          { name: "Time Attack Group", userID: "Elena Carter", scoreExp: 350 },
          { name: "Troop Attack Group", userID: "Elena Carter", scoreExp: 400 }
      ]
  },
  
];


const Leaderboard = () => {

    const [selectedSection, setSelectedSection] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [scorePoints, setScorePoints] = useState(0);

    const handleClickSection = (e: React.MouseEvent<HTMLButtonElement>) => {
        const section = e.currentTarget.getAttribute('data-id');
        if(section){
          setSelectedSection(section);
          setSelectedOption('');
        } 
    };

    const handleClickOption = (e: React.MouseEvent<HTMLButtonElement>) => {
      const option = e.currentTarget.getAttribute('data-id-option');
      if(option) setSelectedOption(option);
  };

    const renderOptions = () => {
        if(selectedSection === 'Badges'){
            return(
                <div className='options-selection'>
                    <h2 className='options-label'>Badges: </h2>
                    <button onClick={handleClickOption} data-id-option = 'Achievement Badge' className={`option-item ${selectedOption === 'Achievement Badge' ? 'active' : ''}`}>Achievement Badge</button>
                    <button onClick={handleClickOption} data-id-option = 'Explorer Badge' className={`option-item ${selectedOption === 'Explorer Badge' ? 'active' : ''}`}>Explorer Badge</button>
                </div>
            )
        }else if(selectedSection === 'Challenges'){
            return(
                <div className='options-selection'>
                    <h2 className='options-label'>Challenges: </h2>
                    <button onClick={handleClickOption} data-id-option = 'Past' className={`option-item ${selectedOption === 'Past' ? 'active' : ''}`}>Past Challenges</button>
                    <button onClick={handleClickOption} data-id-option = 'Time Attack' className={`option-item ${selectedOption === 'Time Attack' ? 'active' : ''}`}>Time Attack</button>
                    <button onClick={handleClickOption} data-id-option = 'Strategy Master' className={`option-item ${selectedOption === 'Strategy Master' ? 'active' : ''}`}>Strategy Master</button>
                </div>
            )
        }else if(selectedSection === 'Community'){
          return(
            <div className='options-selection'>
                <h2 className='options-label'>Community: </h2>
                <button onClick={handleClickOption} data-id-option = 'Time Attack Group' className={`option-item ${selectedOption === 'Time Attack Group' ? 'active' : ''}`}>Time Attack Group</button>
                <button onClick={handleClickOption} data-id-option = 'Troop Attack Group' className={`option-item ${selectedOption === 'Troop Attack Group' ? 'active' : ''}`}>Troop Attack Group</button>
            </div>
        )
        }
        return null
    }
    
  return (
    
    <div className='leaderboard'>
        <h1 className='leaderboardLabel font-semibold'>Leaderboard</h1>

        <div className='sections'>
            <button onClick={handleClickSection} data-id='Friends' className={`option-section ${selectedSection === 'Friends' ? 'active' : ''}`}>Friends</button>
            <button onClick={handleClickSection} data-id='Badges' className={`option-section ${selectedSection === 'Badges' ? 'active' : ''}`}>Badges</button>
            <button onClick={handleClickSection} data-id='Challenges' className={`option-section ${selectedSection === 'Challenges' ? 'active' : ''}`}>Challenges</button>
            <button onClick={handleClickSection} data-id='Community' className={`option-section ${selectedSection === 'Community' ? 'active' : ''}`}>Community</button> 
            <button onClick={handleClickSection} data-id='Worldwide' className={`option-section ${selectedSection === 'Worldwide' ? 'active' : ''}`}>Worldwide</button>
        </div>

        <hr className='divider' />

        <div className='options'>
            {renderOptions()}
        </div>

        <LeaderboardProfile leaderboardData={LeaderboardFakeData} selectedSection = {selectedSection} selectedOption={selectedOption}/>
        {/* <LeaderboardProfile></LeaderboardProfile> */}
    </div>
  )
}


export default Leaderboard