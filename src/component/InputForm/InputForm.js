import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import ReactLoading from 'react-loading';
import ResultScreen from '../ResultScreen';
import ColorForm from './ColorForm'
import {
    generateColorFromAPI,
    scrapeBehance,
    scrapeDribbble,
    scrapePinterest,
    scrapeDribbbleColor,
    getCoolorsPallete,
    getImagePexels
} from 'api';
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
    const [keyword, setKeyword] = useState('');

    const [isLoading, setIsLoading] = useState(false)
    const [showResult, setShowResult] = useState(false)
    const [colorResult, setColorResult] = useState([])
    const [behanceResult, setBehanceResult] = useState([])
    const [dribbbleResult, setDribbbleResult] = useState([])
    const [dribbbleColorResult, setDribbbleColorResult] = useState([])
    const [pinterestResult, setPinterestResult] = useState([])
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

    const regenerateColor = () => {
        const color = {
            model: 'default',
            input: [primaryColorRGB, 'N', 'N', 'N', complementColorRGB]
        }

        // const color1 = primaryColor !== '#______' ? (primaryColor.replace('#', '')) : (randomColor());
        // const color2 = complementColor !== '#______' ? (complementColor.replace('#', '')) : (randomColor());
        // const color = `${color1}-${randomColor()}-${randomColor()}-${randomColor()}-${color2}`

        generateColorFromAPI(color).then(colorResult => {
            if (colorResult.status === 200) {
                const { data } = colorResult
                setColorResult(data.result)
            }
        })
    }

    const runGenerator = async () => {
        setIsLoading(true)
        const color = {
            model: 'default',
            input: [primaryColorRGB, 'N', 'N', 'N', complementColorRGB]
        }

        // const color1 = primaryColor !== '#______' ? (primaryColor.replace('#', '')) : (randomColor());
        // const color2 = complementColor !== '#______' ? (complementColor.replace('#', '')) : (randomColor());
        // const color = `${color1}-${randomColor()}-${randomColor()}-${randomColor()}-${color2}`

        const combinedKeyword = keyword.replace(' ', '%')
        console.log(combinedKeyword)
        const pinterestKeyword = `${combinedKeyword} app`

        const response = await Promise.all([
            generateColorFromAPI(color),
            scrapeBehance(pinterestKeyword),
            scrapeDribbble(pinterestKeyword),
            scrapePinterest(pinterestKeyword),
            getImagePexels(keyword).catch(err => { console.log(err); return {} })
        ])


        const colorResult = response[0];
        const behanceResult = response[1];
        const dribbbleResult = response[2]
        const pinterestResult = response[3];
        const pexelsResult = response[4];


        const { data: { result } } = colorResult

        const hexColor = rgbToHex(result[0][0], result[0][1], result[0][2])

        const selectedColor = hexColor.replace('#', '')

        const dribbbleColorResult = await scrapeDribbbleColor(selectedColor)

        console.log({ dribbbleResult, dribbbleColorResult })


        if (colorResult.status === 200) {
            const { data } = colorResult
            setColorResult(data.result)
        }

        if (behanceResult.status === 200) {
            const { data } = behanceResult
            setBehanceResult(data.data)
        }

        if (dribbbleResult.status === 200) {
            const { data } = dribbbleResult
            setDribbbleResult(data.data)
        }

        if (dribbbleColorResult.status === 200) {
            const { data } = dribbbleColorResult
            setDribbbleColorResult(data.data)
        }

        if (pinterestResult.status === 200) {
            const { data } = pinterestResult
            setPinterestResult(data.data)
        }


        if (pexelsResult.status === 200) {
            const { data: { photos } } = pexelsResult;
            setPexelsResult(photos)
        }

        setIsLoading(false)
        setShowResult(true)
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

                    <h3>Secondary Color:</h3>
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
            rgbToHex={rgbToHex}
            behanceResult={behanceResult}
            dribbbleResult={dribbbleResult}
            dribbbleColorResult={dribbbleColorResult}
            pinterestResult={pinterestResult}
            pexelsResult={pexelsResult}
            regenerateColor={regenerateColor}
        />
    } else {
        return (
            <div className='inputForm-container'>
                <h1 className="title">Generate moodboard</h1>

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

                <div className="keyword-container">
                    <h2>Keyword</h2>
                    <p>Enter single keyword that represent your project: </p>
                    <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Enter a single keyword..." required />
                </div>

                <span className='horizontal-rule' />

                <button onClick={() => runGenerator()} className='generate-btn' type='submit'>Generate</button>
            </div>
        )
    }


}

export default InputForm;