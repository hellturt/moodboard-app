import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import ColorForm from './ColorForm'
import { generateColorFromAPI, getImagePexels } from 'api';
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
    const [pexelsResult, setPexelsResult] = useState([])

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

    const runGenerator = async () => {
        console.log({ primaryColorRGB, complementColorRGB })

        const color = {
            model: 'default',
            input: [primaryColorRGB, 'N', 'N', 'N', complementColorRGB]
        }

        const response = await Promise.all([
            generateColorFromAPI(color),
            getImagePexels('people').catch(err => { console.log(err); return {} })
        ])

        const colorResult = response[0];
        const pexelsResult = response[1];

        console.log({ pexelsResult })


        if (colorResult.status === 200) {
            const { data } = colorResult
            setColorResult(data.result)
        }

        if (pexelsResult.status === 200) {
            const { data: { photos } } = pexelsResult;
            setPexelsResult(photos)
        }
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
                    <div key={hexColor} style={{ backgroundColor: `#${hexColor}` }}>
                        <h3>#{hexColor}</h3>
                    </div>
                )
            })
        }
    }

    const renderPexelsOutput = () => {
        if (pexelsResult.length > 0) {

            return pexelsResult.map(image => {

                const { id, src: { tiny } } = image

                return (
                    <img key={id} src={tiny} />
                )
            })
        }
    }


    return (
        <div className='inputForm-container'>
            <h1>Generate moodboard</h1>

            <ColorForm
                colorOption={colorOption}
                setColorOption={setColorOption}
                setPrimaryColor={setPrimaryColor}
                setPrimaryColorRGB={setPrimaryColorRGB}
                setComplementColor={setComplementColor}
                setComplementColorRGB={setComplementColorRGB}
            />

            <span className='horizontal-rule' />

            <div className='color-input-container'>
                {renderColorForm()}
            </div>



            {colorOption === 3 ? null : (<span className='horizontal-rule' />)}

            <button onClick={() => runGenerator()} className='generate-btn' type='submit'>Generate</button>


            <div className='color-output'>
                {renderColorOutput()}
            </div>

            <div className='pexels-output'>
                {renderPexelsOutput()}
            </div>

        </div>
    )
}

export default InputForm;