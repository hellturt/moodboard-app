
import React, { useState } from 'react';
import tinyColor from 'tinycolor2';
import ReactLoading from 'react-loading';
import { FaSyncAlt, FaExternalLinkAlt } from 'react-icons/fa'


const ResultScreen = props => {
    const [isPreview, setIsPreview] = useState(false);
    const [previewItem, setPreviewItem] = useState({})
    const [copyMsg, setCopyMsg] = useState('')

    const { colorResult, behanceResult, dribbbleResult, dribbbleColorResult, generateColor } = props;

    const saturateColor = hex => {
        const color = tinyColor(`${hex}`)
        if (color.isLight()) {
            return color.darken(25).toString();
        }

        return color.lighten(25).toString();

    }

    const showPreview = ({ imgSrc, imgLink }) => {
        setPreviewItem({ imgSrc, imgLink })
        setIsPreview(true)
    }

    const closePreview = () => {
        setIsPreview(false)
    }

    const copyCode = (e) => {
        const h3 = e.currentTarget.querySelector('h3').innerHTML

        navigator.permissions.query({ name: "clipboard-write" })
            .then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    /* write to the clipboard now */
                    return navigator.clipboard.writeText(h3)
                }
            })
            .then(() => {
                // alert("Copied " + h3 + " to clipboard.");
                setCopyMsg(h3)
                setTimeout(() => {
                    setCopyMsg('')
                }, 4000)
            })
    }

    const renderColorOutput = () => {

        if (colorResult.length > 0) {

            return colorResult.map(color => {
                const hexColor = color
                return (
                    <div className='color-panel' onClick={(e) => copyCode(e)} key={hexColor} style={{ backgroundColor: `${hexColor}`, transition: 'all .25s' }}>
                        <h3 style={{ color: `${saturateColor(hexColor)}` }}>{hexColor}</h3>
                    </div>
                )
            })
        }
    }

    const renderIdeaOutput = data => {
        if (data.length > 0) {

            return data.map((image, index) => {

                const { imgSrc, imgLink } = image

                return (

                    <div key={index} className='img-link' onClick={(e) => showPreview({ imgSrc, imgLink })}>
                        <img src={imgSrc} alt={imgSrc} />

                        {imgLink && (
                            <a className='item-link' href={imgLink} target='_blank' rel="noopener noreferrer" onClick={e => e.stopPropagation()}><FaExternalLinkAlt /></a>
                        )}
                    </div>
                )
            })
        } else {
            return (
                <div className='loader-container'>
                    <ReactLoading type={'cubes'} color={'#524F5D'} />
                    <h4>Scrapping data...</h4>
                </div>
            )
        }
    }

    const renderPreview = () => {
        return (
            <div className={`preview-container ${isPreview ? 'show' : ''}`} onClick={() => closePreview()}>
                <img src={previewItem.imgSrc} alt={previewItem.imgSrc} />
            </div>
        )
    }

    return (
        <>
            <div className={`copy-alert-container ${copyMsg.length > 0 ? 'show' : ''} `}>
                Copied to clipboard
            </div>

            {renderPreview()}

            <div className='result-container'>
                <div className='color-output'>
                    {renderColorOutput()}
                    <div className='color-options'>
                        <div className='regenerate-btn' onClick={() => generateColor()}>
                            <FaSyncAlt />
                            <p>Shuffle</p>
                        </div>
                    </div>
                </div>

                <div className='image-container dribbble-color-output'>
                    <div className="output-info-container">dribbble-color</div>
                    <div className='output-data'>
                        {renderIdeaOutput(dribbbleColorResult)}
                    </div>
                </div>

                <div className='image-container behance-output'>
                    <div className="output-info-container">behance</div>
                    <div className='output-data'>
                        {renderIdeaOutput(behanceResult)}
                    </div>
                </div>

                {/* <div className='image-container pinterest-output'>
                    <div className="output-info-container">pinterest</div>
                    <div className='output-data'>
                        {renderIdeaOutput(pinterestResult)}
                    </div>
                </div> */}

                <div className='image-container dribbble-output'>
                    <div className="output-info-container">dribbble</div>
                    <div className='output-data'>
                        {renderIdeaOutput(dribbbleResult)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResultScreen;