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
      <h1 className='mb-4 text-4xl font-bold sm:mb-6 sm:text-6xl sm:leading-tight md:mb-8 md:text-8xl md:leading-tight'>
        {title}
        <span className='text-primary-dark'>.</span>
      </h1>
      {publishedAt && (
        <div className='mb-2 text-sm font-semibold text-gray-900 sm:mb-3 sm:text-base md:mb-4 md:text-lg'>
          <Time date={publishedAt} />
        </div>
      )}
      {description && (
        <div>
          <p className='text-sm text-gray-700 sm:text-base md:text-lg'>
            {description}
          </p>
        </div>
      )}
    </div>
  );
};
