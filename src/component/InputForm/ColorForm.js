import React from 'react';

const ColorForm = props => {
    const {
        colorOption,
        setColorOption,
        setPrimaryColor,
    } = props;

    return (
        <div className='color-type-container'>
            <h2>Color</h2>
            <div className='selection-radio'>
                <div key='1' className={`single-radio ${colorOption === 1 ? ('is-selected') : ('')}`} onClick={() => { setColorOption(1) }}>
                    <div className='selected-indicator'></div>
                    <p>Generate with primary color</p>
                </div>
                {/* <div key='2' className={`single-radio ${colorOption === 2 ? ('is-selected') : ('')}`} onClick={() => { setColorOption(2) }}>
                    <div className='selected-indicator'></div>
                    <p>Generate with primary &amp; secondary color</p>
                </div> */}
                <div
                    key='3'
                    className={`single-radio ${colorOption === 3 ? ('is-selected') : ('')}`}
                    onClick={() => {
                        setColorOption(3);
                        setPrimaryColor('');
                    }}
                >
                    <div className='selected-indicator'></div>
                    <p>No color... generate one for me please ~</p>
                </div>
            </div>
        </div>
    )
}

export default ColorForm;