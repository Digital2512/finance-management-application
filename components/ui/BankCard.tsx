import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatAmount } from '@/app/lib/utils';

const BankCard = ({ bankCardDetails, userName, showBalance = true }: BankCardProps) => {
  const formatCardNumber = (cardNumber: string) => {
    const firstPart = cardNumber.slice(0, 4);
    const secondPart = cardNumber.slice(4, 8);
    const thirdPart  = cardNumber.slice(8, 12);
    return `${firstPart} ${secondPart} ${thirdPart}`
  };

  const formatExpiryDate = (expiryDate: string) => {
    const [month, year] = expiryDate.split('/');
    return `${month} / ${year}`
  }

  const getCardProviderLogo = (type: string | undefined) => {
    if (!type) return '/icons/visa.svg';

    switch (type.toLowerCase()) {
      case 'visa':
        return '/icons/visa.svg'; // Fixed typo here
      case 'mastercard':
        return '/icons/mastercard.svg';
      default:
        return '/icons/visa.svg';
    }
  };

  return (
    <div className='flex flex-col'>
      {bankCardDetails.map((card, index) => (
        <Link key={index} href="/" className='bank-card'>
          <div className='bank-card_content'>
            <div>
              <h1 className='text-16 font-semibold text-white'>
                {card.name || userName} {/* Accessing card name here */}
              </h1>
              <p className='font-ibm-plex-serif font-black text-white'>
                {showBalance ? formatAmount(card.currentBalance) : '****'} {/* Conditional rendering for balance */}
              </p>
            </div>
            <article className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-12 font-semibold text-white">
                  {userName}
                </h1>
                <h2 className="text-12 font-semibold text-white">
                  {formatExpiryDate(card.expiryDate)}
                </h2>
              </div>
              <p className="text-14 font-semibold tracking-[1.1px] text-white">
                {formatCardNumber(card.cardNumber)} <span className="text-16">{card.mask}</span> 
              </p>
            </article>
          </div>
          <div className='bank-card_icon'>
            <div className='flex items-center'>
              <span>{card.typeOfAccount}</span>
              <Image className = 'mr-1' src='/icons/Paypass.svg' width={20} height={24} alt='pay' />
            </div>
            <Image 
              className='ml-4'
              src={getCardProviderLogo(card.typeOfCard)} 
              width={45}
              height={32}
              alt={card.typeOfCard} 
            />
          </div>
          <Image
            src='/icons/lines.png'
            width={316}
            height={190}
            alt='lines'
            className='absolute top-0 left-0'
          />
        </Link>
      ))}
    </div>
  );
};

export default BankCard;
