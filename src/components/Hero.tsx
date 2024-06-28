import React from "react";
import { Time } from "./Time";

type Props = {
  title: string;
  description?: string;
  publishedAt?: string;
};

export const Hero: React.FC<Props> = ({ title, publishedAt, description }) => {
  return (
    <div className='mb-6 sm:mb-10 md:mb-14'>
      <h1 className='text-4xl sm:text-6xl md:text-8xl sm:leading-tight md:leading-tight font-bold mb-4 sm:mb-6 md:mb-8'>
        {title}
        <span className='text-primary-dark'>.</span>
      </h1>
      {publishedAt && (
        <div className='font-semibold text-sm sm:text-base md:text-lg text-gray-900 mb-2 sm:mb-3 md:mb-4'>
          <Time date={publishedAt} />
        </div>
      )}
      {description && (
        <div>
          <p className='text-sm sm:text-base md:text-lg text-gray-700'>
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
