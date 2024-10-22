'use client'

import { group } from 'console';
import React, { use, useState } from 'react'
import SocialListUserProfile from './SocialListUserProfile';
import SocialListGroupProfile from './SocialListGroupProfile';

// Friends Array with images
const friendsArray: Friend[] = [
  {
    userID: 1,
    name: 'Alice',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    userID: 2,
    name: 'Bob',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    userID: 3,
    name: 'Charlie',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    userID: 4,
    name: 'David',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    userID: 5,
    name: 'Eve',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  }
];
// Groups Array with members having images
const groupsArray: Group[] = [
  {
    groupID: 101,
    name: 'React Devs',
    type: 'Developer',
    members: [
      {
        userID: 1,
        name: 'Alice',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 2,
        name: 'Bob',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    ],
    inviteCode: 'reactIsAwesome',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    groupID: 102,
    name: 'Node Enthusiasts',
    type: 'Developer',
    members: [
      {
        userID: 1,
        name: 'Alice',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 3,
        name: 'Charlie',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 4,
        name: 'David',
        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    ],
    inviteCode: 'nodeRocks2024',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    groupID: 103,
    name: 'Fullstack Ninjas',
    type: 'Developer',
    members: [
      {
        userID: 5,
        name: 'Eve',
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 1,
        name: 'Alice',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    ],
    inviteCode: 'fullstack4Life',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    groupID: 104,
    name: 'Tech Explorers',
    type: 'Developer',
    members: [
      {
        userID: 1,
        name: 'Alice',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 2,
        name: 'Bob',
        img: 'https://images.unsplash.com/photo-1502767089025-6572583495b9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 3,
        name: 'Charlie',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    ],
    inviteCode: 'exploreTech',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
  },
  {
    groupID: 105,
    name: 'Frontend Wizards',
    type: 'Designer',
    members: [
      {
        userID: 1,
        name: 'Alice',
        img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 4,
        name: 'David',
        img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      },
      {
        userID: 5,
        name: 'Eve',
        img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60'
      }
    ],
    inviteCode: 'frontendMagic',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60g'
  }
];

const SocialList = () => {
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [groups, setGroups] = useState(groupsArray);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [groupError, setGroupError] = useState('');

  const handleClickSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    const section = e.currentTarget.getAttribute('data-id');
    if (section) {
      setSelectedSection(section);
      setSelectedOption('');
    }
  };

  // const renderGroupOptions = () => {
  //   if (selectedSection === 'Groups') {
  //     const userID = 1;
  //     const groupsWithTargetedUser = groupsArray.filter(group => group.members.some(member => member.userID === userID));
      
  //     return (
  //       <div className='options-selection'>
  //         <h3 className='options-label'>Groups: </h3>
  //         {groupsWithTargetedUser.map(group => (
  //           <div className='option-selection' key={group.groupID}>
  //             <button className='option-item'>{group.name}</button>
  //           </div>
  //         ))}
  //       </div>
  //       );
  //   }
  //   return null;
  // };

  return (
    <div className='socialList'>
      <h1 className='socialListLabel font-semibold'>Social List</h1>

      <div className='sections'>
        <button onClick={handleClickSection} data-id='Friends' className='option-section'>Friends</button>
        <button onClick={handleClickSection} data-id='Groups' className='option-section'>Groups</button>
      </div>

      <hr className='divider' />

      {/* <div className='options'>
        {selectedSection === 'Groups' && renderGroupOptions()}
      </div> */}

      {selectedSection === 'Friends' && <SocialListUserProfile socialListUserData={friendsArray}/>}
      {selectedSection === 'Groups' && <SocialListGroupProfile socialListGroupData={groupsArray}/>}
    </div>
  );
};


export default SocialList