import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import { generateColorFromAPI } from 'api';
import rgbToHex from 'helper/rgbToHex'
import './style.scss'

const InputForm = () => {

    const [colorOption, setColorOption] = useState(1);
    const [primaryColor, setPrimaryColor] = useState('#______');
    const [primaryColorRGB, setPrimaryColorRGB] = useState('N');
    const [complementColor, setComplementColor] = useState('#______');
    const [complementColorRGB, setComplementColorRGB] = useState('N');
    const [displayColorPickerPrimary, setDisplayColorPickerPrimary] = useState(false)
    const [displayColorPickerComplementary, setDisplayColorPickerComplementary] = useState(false)

    const [colorResult, setColorResult] = useState([])

    const handleClickPrimary = () => {
        if (displayColorPickerPrimary) {
            setDisplayColorPickerPrimary(false)
        } else {
            setDisplayColorPickerPrimary(true)
        }
    };

    const handleClickComplement = () => {
        if (displayColorPickerPrimary) {
            setDisplayColorPickerComplementary(false)
        } else {
            setDisplayColorPickerComplementary(true)
        }
    };

    const handleClose = () => {
        setDisplayColorPickerPrimary(false)
        setDisplayColorPickerComplementary(false)
    };

    const handlePrimaryChange = color => {
        const { hex, rgb } = color
        setPrimaryColor(hex)
        setPrimaryColorRGB([rgb.r, rgb.g, rgb.b])
    };

    const handleComplementChange = color => {
        const { hex, rgb } = color
        setComplementColor(hex)
        setComplementColorRGB([rgb.r, rgb.g, rgb.b])
    };

    const runGenerator = () => {
        console.log({ primaryColorRGB, complementColorRGB })
        generateColorFromAPI({
            model: 'default',
            input: [primaryColorRGB, 'N', 'N', 'N', complementColorRGB]
        }).then(res => {
            console.log({ res })
            const { status, data } = res

            if (status === 200) {
                setColorResult(data.result)
            }
        })
    }

    const renderColorForm = () => {

        if (colorOption === 1) {
            return (
                <>
                    <h3>Primary Color:</h3>
                    <div className='color-preview-container' onClick={() => handleClickPrimary()}>
                        <h1>{primaryColor.toUpperCase()}</h1>
                        <div className='color-preview' style={{ backgroundColor: primaryColor }}></div>
                    </div>

                    {displayColorPickerPrimary && (
                        <div className='popover'>
                            <div className='cover' onClick={() => handleClose()} />
                            <ChromePicker
                                disableAlpha={true}
                                color={primaryColor}
                                onChange={(color) => handlePrimaryChange(color)}
                            />
                        </div>

                    )}

                </>
            )
        } else if (colorOption === 2) {
            return (
                <>
                    <h3>Primary Color:</h3>
                    <div className='color-preview-container' onClick={() => handleClickPrimary()}>
                        <h1>{primaryColor.toUpperCase()}</h1>
                        <div className='color-preview' style={{ backgroundColor: primaryColor }}></div>
                    </div>

                    {displayColorPickerPrimary && (
                        <div className='popover'>
                            <div className='cover' onClick={() => handleClose()} />
                            <ChromePicker
                                disableAlpha={true}
                                color={primaryColor}
                                onChange={(color) => handlePrimaryChange(color)}
                            />
                        </div>

                    )}

                    <h3>Complementary Color:</h3>
                    <div className='color-preview-container' onClick={() => handleClickComplement()}>
                        <h1>{complementColor.toUpperCase()}</h1>
                        <div className='color-preview' style={{ backgroundColor: complementColor }}></div>
                    </div>

                    {displayColorPickerComplementary && (
                        <div className='popover'>
                            <div className='cover' onClick={() => handleClose()} />
                            <ChromePicker
                                disableAlpha={true}
                                color={complementColor}
                                onChange={(color) => handleComplementChange(color)}
                            />
                        </div>

                    )}

                </>
            )
        } else {
            return null
        }
    }

    const renderColorOutput = () => {

        if (colorResult.length > 0) {

            return colorResult.map(color => {
                const hexColor = rgbToHex(color[0], color[1], color[2])
                return (
                    <div style={{ backgroundColor: `#${hexColor}` }}>
                        <h3>#{hexColor}</h3>
                    </div>
                )
            })
        }
    }


    return (
        <div className='inputForm-container'>
            <h1>Generate moodboard</h1>

            <div className='color-type-container'>
                <h2>Color</h2>
                <div className='selection-radio'>
                    <div key='1' className={`single-radio ${colorOption === 1 ? ('is-selected') : ('')}`} onClick={() => { setColorOption(1) }}>
                        <div className='selected-indicator'></div>
                        <p>Generate with primary color</p>
                    </div>
                    <div key='2' className={`single-radio ${colorOption === 2 ? ('is-selected') : ('')}`} onClick={() => { setColorOption(2) }}>
                        <div className='selected-indicator'></div>
                        <p>Generate with primary &amp; complementary color</p>
                    </div>
                    <div
                        key='3'
                        className={`single-radio ${colorOption === 3 ? ('is-selected') : ('')}`}
                        onClick={() => {
                            setColorOption(3);
                            setPrimaryColor('#______');
                            setPrimaryColorRGB('N');
                            setComplementColor('#______')
                            setComplementColorRGB('N');
                        }}
                    >
                        <div className='selected-indicator'></div>
                        <p>No color... generate one for me please ~</p>
                    </div>
                </div>
            </div>

            <span className='horizontal-rule' />

            <div className='color-input-container'>
                {renderColorForm()}
            </div>



            {colorOption === 3 ? null : (<span className='horizontal-rule' />)}

            <button onClick={() => runGenerator()} className='generate-btn' type='submit'>Generate</button>


            <div className='color-output'>
                {renderColorOutput()}
            </div>

        </div>
    )
}

export default InputForm;