import React, { useState } from 'react';
import Select from 'react-select';

import styles from './ImageDisplay.module.css';

const options = [
  { value: '1', label: 'ERO With Verification Overlay' },
  { value: '2', label: 'Verification Only' }
];

const ImageDisplay = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  return(
    <div className={styles.ImageDisplayContainer}>
      <div className={styles.ProductSelectContainer}>
        <Select
          defaultValue={selectedOption}
          onChange={setSelectedOption}
          options={options}
          placeholder={'Select Product'}
        />
      </div>
      <div>
        <button>Day 1</button>
        <button>Day 2</button>
        <button>Day 3</button>
      </div>
      <div>
        <img src={'https://via.placeholder.com/600x400.png'}/>
      </div>
    </div>
  )
}

export default ImageDisplay;