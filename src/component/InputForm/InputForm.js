import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import ReactLoading from 'react-loading';
import tinyColor from 'tinycolor2';
import Please from 'pleasejs';
import ResultScreen from '../ResultScreen';
import ColorForm from './ColorForm'
import {
    scrapeBehance,
    scrapeDribbble,
    scrapePinterest,
    scrapeDribbbleColor,
} from 'api';
import './style.scss'

const InputForm = () => {

    const [colorOption, setColorOption] = useState(1);
    const [primaryColor, setPrimaryColor] = useState('');
    const [displayColorPickerPrimary, setDisplayColorPickerPrimary] = useState(false)
    const [keyword, setKeyword] = useState('');

    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [colorResult, setColorResult] = useState([])
    const [behanceResult, setBehanceResult] = useState([])
    const [dribbbleResult, setDribbbleResult] = useState([])
    const [dribbbleColorResult, setDribbbleColorResult] = useState([])
    const [pinterestResult, setPinterestResult] = useState([])

    const handleClickPrimary = () => {
        if (displayColorPickerPrimary) {
            setDisplayColorPickerPrimary(false)
        } else {
            setDisplayColorPickerPrimary(true)
        }
    };

    const handleClose = () => {
        setDisplayColorPickerPrimary(false)
    };

    const handlePrimaryChange = color => {
        const { hex } = color
        setPrimaryColor(hex)
    };

    const generateColor = async () => {
        let primaryToHSV;
        if (primaryColor) {
            primaryToHSV = tinyColor(primaryColor).toHsv()
        } else {
            primaryToHSV = tinyColor.random().toHsv()
        }

        const colors = Please.make_scheme(
            primaryToHSV,
            {
                scheme_type: 'analogous',
                golden: true,
                format: 'hex'
            }

        );

        const complimentColors = Please.make_scheme(
            primaryToHSV,
            {
                scheme_type: 'complement',
                golden: true,
                format: 'hex'
            }

        );
        const colorToState = colors.splice(0, 4).concat(complimentColors[1])
        setColorResult(colorToState)

        return colorToState[0]
    }

    const runGenerator = async () => {
        setIsLoading(true)
        generateColor()

        const combinedKeyword = keyword.replace(' ', '%20')
        const pinterestKeyword = `${combinedKeyword}%20app`


        const colorResult = await generateColor();
        setIsLoading(false)
        setPrimaryColor('')
        setShowResult(true)

        const selectedColor = colorResult.replace('#', '')
        const dribbbleColorResult = await scrapeDribbbleColor(selectedColor)
        if (dribbbleColorResult.status === 200) {
            const { data } = dribbbleColorResult
            setDribbbleColorResult(data.data)
        }

        const dribbbleResult = await scrapeDribbble(pinterestKeyword)
        if (dribbbleResult.status === 200) {
            const { data } = dribbbleResult
            setDribbbleResult(data.data)
        }

        // const pinterestResult = await scrapePinterest(pinterestKeyword)
        // if (pinterestResult.status === 200) {
        //     const { data } = pinterestResult
        //     setPinterestResult(data.data)
        // }

        const behanceResult = await scrapeBehance(pinterestKeyword)
        if (behanceResult.status === 200) {
            const { data } = behanceResult
            setBehanceResult(data.data)
        }
    }

    const renderColorForm = () => {

        if (colorOption === 1) {
            return (
                <>
                    <h3>Primary Color:</h3>
                    <div className='color-preview-container' onClick={() => handleClickPrimary()}>
                        <h1>{primaryColor ? primaryColor.toUpperCase() : '#______'}</h1>
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
        } else {
            return null
        }
    }


    if (isLoading) {
        return (
            <div className='loader-container'>
                <ReactLoading type={'cubes'} color={'#524F5D'} />
                <h4>Scrapping data...</h4>
            </div>
        )
    }

    if (showResult) {
        return <ResultScreen
            colorResult={colorResult}
            behanceResult={behanceResult}
            dribbbleResult={dribbbleResult}
            dribbbleColorResult={dribbbleColorResult}
            // pinterestResult={pinterestResult}
            generateColor={generateColor}
        />
    } else {
        return (
            <div className='inputForm-container'>
                <h1 className="title">Generate moodboard</h1>

                <ColorForm
                    colorOption={colorOption}
                    setColorOption={setColorOption}
                    setPrimaryColor={setPrimaryColor}
                />

                <span className='horizontal-rule' />

                <div className='color-input-container'>
                    {renderColorForm()}
                </div>

                {colorOption === 3 ? null : (<span className='horizontal-rule' />)}

                <div className="keyword-container">
                    <h2>Keyword</h2>
                    <p>Enter keyword: </p>
                    <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Enter a single keyword..." required />
                </div>

                <span className='horizontal-rule' />

                <button onClick={() => runGenerator()} className='generate-btn' type='submit'>Generate</button>
            </div>
        )
    }


}

export default InputForm;