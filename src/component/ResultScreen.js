
import React, { useState, useEffect } from 'react';
import tinyColor from 'tinycolor2';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as ReloadIcon } from 'assets/refresh.svg'
import { ReactComponent as LinkIcon } from 'assets/link.svg'


const ResultScreen = props => {
    const [isPreview, setIsPreview] = useState(false);
    const [previewItem, setPreviewItem] = useState({})

    const { colorResult, behanceResult, dribbbleResult, dribbbleColorResult, pinterestResult, generateColor } = props;

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
        console.log(h3)

        navigator.permissions.query({ name: "clipboard-write" })
            .then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    /* write to the clipboard now */
                    return navigator.clipboard.writeText(h3)
                }
            })
            .then(() => {
                alert("Copied " + h3 + " to clipboard.");
            })
    }

    const renderColorOutput = () => {

        if (colorResult.length > 0) {

            return colorResult.map(color => {
                const hexColor = color
                return (
                    <div onClick={(e) => copyCode(e)} key={hexColor} style={{ backgroundColor: `${hexColor}`, transition: 'all .25s' }}>
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
                        <img src={imgSrc} />

                        {imgLink && (
                            <a className='item-link' href={imgLink} target='_blank' onClick={e => e.stopPropagation()}><LinkIcon /></a>
                        )}
                    </div>
                )
            })
        }
    }

    const renderPreview = () => {
        return (
            <div className='preview-container' onClick={() => closePreview()}>
                <img src={previewItem.imgSrc} />
            </div>
        )
    }

    return (

        <div className='result-container'>

            {isPreview && renderPreview()}


            <div className='color-output'>
                {renderColorOutput()}
                <div className='color-options'>
                    <div className='regenerate-btn' onClick={() => generateColor()}>
                        {<ReloadIcon />}
                        <p>Shuffle</p>
                    </div>
                </div>
            </div>

            <div className='image-container dribbble-color-output'>
                <div className="output-info-container">
                    dribbble-color
                </div>
                <div className='output-data'>
                    {renderIdeaOutput(dribbbleColorResult)}
                </div>
            </div>

            <div className='image-container behance-output'>
                <div className="output-info-container">
                    behance
                </div>
                <div className='output-data'>
                    {renderIdeaOutput(behanceResult)}
                </div>
            </div>

            <div className='image-container pinterest-output'>
                <div className="output-info-container">
                    pinterest
                </div>
                <div className='output-data'>
                    {renderIdeaOutput(pinterestResult)}
                </div>
            </div>

            <div className='image-container dribbble-output'>
                <div className="output-info-container">
                    dribbble
                </div>
                <div className='output-data'>
                    {renderIdeaOutput(dribbbleResult)}
                </div>
            </div>
        </div>
    )
}

export default ResultScreen;