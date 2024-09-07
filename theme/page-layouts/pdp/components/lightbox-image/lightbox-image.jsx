/* eslint-disable no-unused-vars */

import React, { useState, useEffect, useRef } from "react";
// import Hammer from "hammerjs";
// import Modal from "./../../global/components/modal"; // Adjust import path as needed
import FyImage from "../../../../components/core/fy-image/fy-image";
import SvgWrapper from "../../../../components/core/svgWrapper/SvgWrapper";
import styles from "./lightbox-image.less";
import {
  getProductImgAspectRatio,
  isRunningOnClient,
} from "../../../../helper/utils";
import Viewer3D from "../viewer-3d/viewer-3d";

function LightboxImage({
  images,
  disableScroll = true,
  showLightBox = false,
  startAt = 0,
  nThumbs = 5,
  showThumbs = true,
  autoPlay = false,
  autoPlayTime = 3000,
  siteLoading = null,
  showCaption = false,
  lengthToLoadMore = 0,
  closeText = "Close (Esc)",
  previousText = "Previous",
  nextText = "Next",
  previousThumbText = "Previous",
  nextThumbText = "Next",
  iconColor = "",
  globalConfig = {},
  toggleResumeVideo,
  currentIndex,
  closeGallery,
}) {
  const [select, setSelect] = useState(startAt);
  const [lightBoxOn, setLightBoxOn] = useState(showLightBox);
  const [timer, setTimer] = useState(null);
  const [selectLoading, setSelectLoading] = useState(false);
  const [isMute, setIsMute] = useState(true);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const videoRef = useRef(null);

  let thumbIndex;

  function play() {
    videoRef?.current?.play();
  }

  function pause() {
    videoRef?.current?.pause();
  }
  if (
    select >= Math.floor(nThumbs / 2) &&
    select < images.length - Math.floor(nThumbs / 2)
  ) {
    thumbIndex = {
      begin: select - Math.floor(nThumbs / 2) + (1 - (nThumbs % 2)),
      end: select + Math.floor(nThumbs / 2),
    };
  } else if (select < Math.floor(nThumbs / 2)) {
    thumbIndex = {
      begin: 0,
      end: nThumbs - 1,
    };
  } else {
    thumbIndex = {
      begin: images.length - nThumbs,
      end: images.length - 1,
    };
  }

  const imagesThumb = images.map((img, index) => ({
    src: img.url.replace("resize-w:540", "original"),
    type: img.type,
    alt: img.alt,
  }));

  const toggleMute = () => {
    setIsMute(!isMute);
  };

  const restartVideo = () => {
    setShowReplayButton(false);

    if (!showReplayButton && videoRef !== null && videoRef.current) {
      videoRef.current.currentTime = 0;
      play();
    }
  };

  const onVideoEnd = () => {
    setShowReplayButton(true);
  };

  const pauseVideo = () => {
    if (!showReplayButton && videoRef !== null && videoRef.current) {
      if (videoRef.current.paused) {
        play();
      } else {
        pause();
      }
    }
  };

  const nextImage = () => {
    setShowReplayButton(false);
    setSelectLoading(true);
    setTimeout(() => {
      setSelect((select + 1) % images.length);
      setSelectLoading(false);
    }, 1);
  };

  const previousImage = () => {
    setShowReplayButton(false);
    setSelectLoading(true);
    setTimeout(() => {
      setSelect((select + images.length - 1) % images.length);
      setSelectLoading(false);
    }, 1);
  };

  const handleVideoPlayback = () => {
    const videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.pause();
    videoPlayer.currentTime = 0;
  };

  const closeLightBox = () => {
    setShowReplayButton(false);
    // this.$emit('toggleResumeVideo');
    toggleResumeVideo();
    if (isRunningOnClient()) {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        const iframeSrc = iframe.src;
        iframe.src = iframeSrc;
      }
      setLightBoxOn(false);
      if (document.getElementById("videoPlayer")) handleVideoPlayback();
    }
    closeGallery();
  };

  const addKeyEvent = (event) => {
    if (event.keyCode === 37) previousImage(); // left arrow
    if (event.keyCode === 39) nextImage(); // right arrow
    if (event.keyCode === 27) closeLightBox(); // esc
  };

  const onToggleLightBox = (value) => {
    if (isRunningOnClient()) {
      if (disableScroll) {
        document.querySelector("html").classList.toggle("no-scroll", value);
      }
      document.querySelector("body").classList.toggle("hide-overflow", value);

      // Call your onOpened event
      // this.$emit('onOpened', value);

      if (value) {
        document.addEventListener("keydown", addKeyEvent);
      } else {
        document.removeEventListener("keydown", addKeyEvent);
      }
    }
  };

  const getImageURL = (src) =>
    `http://img.youtube.com/vi/${src?.substr((src?.lastIndexOf("/") ?? "") + 1)}/0.jpg`;

  const showImage = (index) => {
    setLightBoxOn(true);
    setSelectLoading(true);
    setTimeout(() => {
      setSelect(index);
      setSelectLoading(false);
    }, 1);
  };

  useEffect(() => {
    if (showLightBox) showImage(currentIndex);
  }, [showLightBox, currentIndex]);

  return (
    <div>
      <div
        className={styles.lbContainer}
        style={{ display: lightBoxOn ? "block" : "none" }}
      >
        <div className={styles.lbContent}>
          <div className={styles.lbHeader}>
            <h4>
              Image ({select + 1}/{images.length})
            </h4>
            <button
              type="button"
              title={closeText}
              className={styles.lbButtonClose}
              aria-label="close"
              onClick={closeGallery}
            >
              <span>
                <SvgWrapper svgSrc="close" />
              </span>
            </button>
          </div>
          {/* eslint-disable jsx-a11y/no-static-element-interactions */}
          <div
            className={styles.lbFigure}
            onClick={(e) => e.stopPropagation()}
            // ref={containerRef}
          >
            <div className={styles.mediaWrapper}>
              {images[select].type === "image" && (
                <FyImage
                  src={images[select]?.url}
                  alt={images[select]?.alt}
                  customClass={`${styles.lbModalMedia} ${styles.lbModalImage}`}
                  sources={[
                    { breakpoint: { min: 481 }, width: 1100 },
                    { breakpoint: { max: 480 }, width: 1000 },
                  ]}
                  mobileAspectRatio={getProductImgAspectRatio(globalConfig)}
                  aspectRatio={getProductImgAspectRatio(globalConfig)}
                  globalConfig={globalConfig}
                  showSkeleton={false}
                />
              )}
              {images[select].type === "video" && (
                <div className={styles.videoContainer}>
                  {images[select].url.includes("youtube") ? (
                    <iframe
                      title="Youtube"
                      key={images[select]?.url}
                      src={`${images[select]?.url}?enablejsapi=1&html5=1`}
                      srcSet={images[select]?.srcset || ""}
                      className={`${styles.lbModalMedia} ${styles.youtubePlayer}`}
                      allowfullscreen
                    />
                  ) : (
                    <div className={styles.videoPlayerContainer}>
                      <div className={styles.playerWrapper}>
                        <video
                          ref={videoRef}
                          key={images[select]?.url}
                          src={images[select]?.url}
                          srcSet={images[select].srcset || ""}
                          className={styles.lbModalMedia}
                          controls={false}
                          autoPlay
                          muted={isMute}
                          onClick={pauseVideo}
                          onEnded={onVideoEnd}
                        />

                        {showReplayButton && (
                          <SvgWrapper
                            className={`${styles.playerIcon} ${styles.playerReplay}`}
                            svgSrc="replay"
                            onClick={restartVideo}
                          />
                        )}

                        <SvgWrapper
                          className={`${styles.playerIcon} ${styles.playerMute}`}
                          svgSrc={isMute ? "mute" : "unmute"}
                          onClick={toggleMute}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {images[select].type === "3d_model" && (
                <div className={`${styles.lbModalMedia} ${styles.type3dModel}`}>
                  <Viewer3D src={images[select]?.url} />
                </div>
              )}
              <SvgWrapper
                svgSrc="close-white"
                className={styles.closeIcon}
                onClick={closeLightBox}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.lbArrow} ${styles.lbLeft} ${
                    select === 0 ? styles.disableArrow : ""
                  }`}
                  title="previousText"
                  onClick={previousImage}
                  disabled={select === 0}
                  aria-label="prev"
                >
                  <div name="previous">
                    <SvgWrapper svgSrc="arrow-left-white" />
                  </div>
                </button>
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.lbArrow} ${styles.lbRight} ${
                    select === images.length - 1 ? styles.disableArrow : ""
                  }`}
                  title={nextText}
                  onClick={nextImage}
                  disabled={select === images.length - 1}
                  aria-label="Next"
                >
                  <div name="next">
                    <SvgWrapper svgSrc="arrow-right-white" />
                  </div>
                </button>
              )}

              <div
                className={styles.lbThumbnailWrapper}
                // style={`--icon-color: ${iconColor}`}
              >
                {showThumbs && (
                  <div className={styles.lbThumbnail}>
                    {images?.map((image, index) => (
                      <div
                        key={index}
                        style={{
                          display:
                            index >= thumbIndex.begin && index <= thumbIndex.end
                              ? "block"
                              : "none",
                        }}
                        onClick={() => showImage(index)}
                        className={styles.thumbnailItem}
                      >
                        {image.type === "image" && (
                          <FyImage
                            src={image?.url}
                            alt={image?.alt}
                            customClass={`${styles.lbModalThumbnail} ${
                              select === index
                                ? `${styles["lbModalThumbnail-active"]}`
                                : ""
                            }`}
                            mobileAspectRatio={getProductImgAspectRatio(
                              globalConfig
                            )}
                            aspectRatio={getProductImgAspectRatio(globalConfig)}
                            globalConfig={globalConfig}
                          />
                        )}
                        {image.type === "video" && (
                          <div className={styles.videoThumbnailContainer}>
                            {image?.url?.includes("youtube") ? (
                              <img
                                alt={image?.alt}
                                src={getImageURL(image?.url)}
                                className={`${styles.lbModalVideoThumbnail}
                          ${
                            select === index
                              ? `${styles["lbModalVideoThumbnail-active"]}`
                              : ""
                          }`}
                              />
                            ) : (
                              <video
                                src={image?.url}
                                className={`${styles.lbModalVideoThumbnail}
                          ${
                            select === index
                              ? `${styles["lbModalVideoThumbnail-active"]}`
                              : ""
                          }`}
                              />
                            )}
                            <SvgWrapper
                              svgSrc="'video-play'"
                              className={styles.videoPlayIcon}
                            />
                          </div>
                        )}
                        {image.type === "3d_model" && (
                          <div
                            className={`${styles.modelThumbnail} ${
                              select === index
                                ? styles["lbModalThumbnail-active"]
                                : ""
                            }`}
                          >
                            <SvgWrapper
                              svgSrc="3D"
                              className={styles.modelIcon}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LightboxImage;
