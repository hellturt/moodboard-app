
import React, { useState } from 'react';
import tinyColor from 'tinycolor2';
import { CSSTransition } from 'react-transition-group';
import { ReactComponent as ReloadIcon } from 'assets/refresh.svg'
import { ReactComponent as LinkIcon } from 'assets/link.svg'


const ResultScreen = props => {
    const [isPreview, setIsPreview] = useState(false);
    const [previewItem, setPreviewItem] = useState({})

    const { colorResult, rgbToHex, behanceResult, dribbbleResult, dribbbleColorResult, pinterestResult, pexelsResult, regenerateColor } = props;

    const saturateColor = (r, g, b) => {
        const color = tinyColor(`rgb(${r},${g},${b})`)
        console.log(color.isLight())
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

    const renderColorOutput = () => {

        if (colorResult.length > 0) {

            return colorResult.map(color => {
                const hexColor = rgbToHex(color[0], color[1], color[2])
                return (
                    <div key={hexColor} style={{ backgroundColor: `#${hexColor}`, transition: 'all .25s' }}>
                        <h3 style={{ color: `${saturateColor(color[0], color[1], color[2])}` }}>#{hexColor}</h3>
                    </div>
                )
            })
        }
    }

    const renderIdeaOutput = data => {
        if (data.length > 0) {

            return data.map(image => {

                const { imgSrc, imgLink } = image

                return (

                    <div className='img-link' onClick={() => showPreview({ imgSrc, imgLink })}>
                        <img src={imgSrc} />

                        <a className='item-link' href={imgLink}>
                            <LinkIcon />
                        </a>
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
                    <div className='regenerate-btn' onClick={() => regenerateColor()}>
                        {<ReloadIcon />}
                        <p>

                            Shuffle
                            </p>
                    </div>
                    <p>color by colormind</p>
                </div>
            </div>

            <div className='image-container dribbble-color-output'>
                <div className="output-info-container">
                    dribbble-color
                </div>
                {renderIdeaOutput(dribbbleColorResult)}
            </div>

            <div className='image-container behance-output'>
                <div className="output-info-container">
                    behance
                </div>
                {renderIdeaOutput(behanceResult)}
            </div>

            <div className='image-container pinterest-output'>
                <div className="output-info-container">
                    pinterest
                </div>
                {renderIdeaOutput(pinterestResult)}
            </div>

            <div className='image-container dribbble-output'>
                <div className="output-info-container">
                    dribbble
                </div>
                {renderIdeaOutput(dribbbleResult)}
            </div>
        </div>
    )
}

export default ResultScreen;