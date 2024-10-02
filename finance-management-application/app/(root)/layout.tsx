import MobileNav from "@/components/ui/MobileNav";
import Sidebar from "@/components/ui/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedInUser = {firstName: 'User', lastName: 'Tester'}
  return (
    <main className="flex h-screen h-full font-inter">
            <Sidebar user = {loggedInUser}/>
            <div className="flex size-full flex-col">
              <div className="root-layout">
                <Image src="/icons/logo-wallet-blue.svg" width={30} height={30} alt="menu icon"/>
                <div>
                  <MobileNav user = {loggedInUser}/>
                </div>
              </div>
              {children}
            </div>
    </main>
  );
}
