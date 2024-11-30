'use client';

import MobileNav from "@/components/ui/MobileNav";
import Sidebar from "@/components/ui/Sidebar";
import { getUserInfo } from "@/lib/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [loggedInUserInfo, setLoggedInUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async() => {
      try{

        //maybe find an alternative to local storage
        const loggedInUser = sessionStorage.getItem('loggedInUsername');

        if(loggedInUser){
          const userInfo = await getUserInfo(loggedInUser);

          // console.log('User Info: ', JSON.stringify(userInfo, null, 2));

          setLoggedInUserInfo(userInfo);
        }else{
          console.log('No logged in user');
          router.push('/login');
        }
        setIsLoading(false)
      }catch(error){
        console.log('Error: ' + error);
      }
    }
    //error here
    fetchUserInfo();
  }, [router])

  useEffect(() => {
    if(!isLoading && !loggedInUserInfo){
      router.push('/login');
    }
  }, [isLoading, loggedInUserInfo, router]);

  if(isLoading){
    return <div>Loading...</div>;
  }

  if(!loggedInUserInfo){
    console.log('No user info')
    return null; 
  }

  const { username, firstName, lastName, email, selectedPlan } = loggedInUserInfo;

  // useEffect(() => {
  //   const fetchUserInfo = async () => {
  //     try {
  //       const loggedInUserData = localStorage.getItem('loggedInUser');

  //       if (loggedInUserData) {
  //         // const userInfo = await getUserInfo(loggedInUserData);

  //         // // Ensure userInfo is a plain object
  //         // const plainUserInfo = {
  //         //   username: userInfo.username,
  //         //   firstName: userInfo.firstName,
  //         //   lastName: userInfo.lastName,
  //         //   email: userInfo.email,
  //         //   selectedPlan: userInfo.selectedPlan,
  //         // };

  //         // setLoggedInUserInfo(userInfo);
  //       } else {
  //         console.log('No logged in user found');
  //         router.push('/login');
  //       }
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching user info:', error);
  //     }
  //   };

  //   fetchUserInfo();
  // }, [router]);

  // // useEffect(() => {
  // //   if (!isLoading && !loggedInUserInfo) {
  // //     router.push('/login');
  // //   }
  // // }, [isLoading, loggedInUserInfo, router]);

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (!loggedInUserInfo) {
  //   console.log('No user info');
  //   return null; 
  // }

  // const { username, firstName, lastName, email, selectedPlan } = loggedInUserInfo;

  const SidebarUser = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    selectedPlan: selectedPlan,
  };

  const MobileNavUser = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    selectedPlan: selectedPlan,
    email: email
  };



  return (
    <main className="flex h-screen h-full font-inter">
      <Sidebar user={SidebarUser} />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo-wallet-blue.svg" width={30} height={30} alt="menu icon" />
          <div>
            <MobileNav user={MobileNavUser} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
